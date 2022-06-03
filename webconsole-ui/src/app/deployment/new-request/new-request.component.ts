import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin, of, throwError, Observable, SubscriptionLike as ISubscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, finalize, map, startWith, switchMap } from 'rxjs/operators';
import { Deployment } from 'src/app/shared/models/deployment.model';
import { Command } from '../../shared/models/command.model';
import { Docroot } from '../../shared/models/docroot.model';
import { DocrootCore } from '../../shared/models/docrootcore.model';
import { Environment } from '../../shared/models/environment.model';
import { Page } from '../../shared/models/page.model';
import { Project } from '../../shared/models/project.model';
import { Request } from '../../shared/models/request.model';
import { Website } from '../../shared/models/website.model';
import { DocrootService } from '../../shared/services/docroot.service';
import { DrupalDocrootCoreService } from '../../shared/services/drupaldocrootcore.service';
import { HelperService } from '../../shared/services/helper.service';
import { RepositoryService } from '../../shared/services/repository.service';
import { RequestService } from '../../shared/services/request.service';
import { WebsiteService } from '../../shared/services/website.service';

export class ProjectData {
  code = '';
  versions: string[] = [];
  docroots: Docroot[] = [];
}

@Component({
  selector: 'stgo-new-request',
  templateUrl: './new-request.component.html',
  styleUrls: ['./new-request.component.css']
})
export class NewRequestComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('projectInput') projectInput: ElementRef;

  ELEMENT_DATA: Command[] = [];
  datasource: MatTableDataSource<Command> = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns: string[] = ['command', 'param', 'order', 'actions'];
  docroots: Docroot[] = [];
  docrootsCores: DocrootCore[] = [];
  envs: Environment[] = [];
  sites: Website[] = [];
  versions: string[] = [];
  docroot: Docroot;
  formGroup: FormGroup;
  projects$: Observable<Project[]>;
  saving = false;

  separatorKeysCodes = [ENTER, COMMA];

  selectedProjects: Project[] = [];
  projectVersions: ProjectData[] = [];
  projectDocroots: ProjectData[] = [];

  private websiteSubscription: ISubscription;
  private drupalDocrootCoreSubscription: ISubscription;
  private repositorySubscription: ISubscription;
  private docrootEnvSubscription: ISubscription;
  private requestSubscription: ISubscription;

  constructor(
    private websiteService: WebsiteService,
    private drupalDocrootCoreService: DrupalDocrootCoreService,
    private repositoryService: RepositoryService,
    private docrootService: DocrootService,
    private requestService: RequestService,
    private helperService: HelperService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      requestType: new FormControl('website', [Validators.required]),
      project: new FormControl(null),
      deliverableVersion: new FormControl(null, [Validators.required]),
      docrootCode: new FormControl(null, [Validators.required]),
      environmentCode: new FormControl(null, [Validators.required]),
      cmdParam: new FormControl()
    });
  }

  ngAfterViewInit(): void {
    this.initialize();
  }

  ngOnDestroy(): void {
    if (this.websiteSubscription) {
      this.websiteSubscription.unsubscribe();
    }
    if (this.drupalDocrootCoreSubscription) {
      this.drupalDocrootCoreSubscription.unsubscribe();
    }
    if (this.repositorySubscription) {
      this.repositorySubscription.unsubscribe();
    }
    if (this.docrootEnvSubscription) {
      this.docrootEnvSubscription.unsubscribe();
    }
    if (this.requestSubscription) {
      this.requestSubscription.unsubscribe();
    }
  }

  initialize(): void {
    this.initData();
    const projectType = this.formGroup.get('requestType')!.value;
    this.formGroup.reset();
    this.formGroup.get('requestType')!.setValue(projectType);
    this.projects$ = this.formGroup.controls.project.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((query: string) => {
        switch (projectType) {
          case 'website':
            return this.websiteService.getWebsitesByName(query, true).pipe(
              map((websites: Page<Website>) => {
                return websites.content.map((website: Website) => {
                  const project: Project = new Project();
                  project.code = website.code;
                  project.name = website.websiteName ? website.websiteName : website.name;
                  return project;
                });
              })
            );
          case 'docroot':
            return this.drupalDocrootCoreService.getDrupalDocrootCoresByName(query).pipe(
              map((drupals: Page<DocrootCore>) => {
                return drupals.content.map((drupal: DocrootCore) => {
                  const project: Project = new Project();
                  project.code = drupal.code;
                  project.name = drupal.name;
                  return project;
                });
              })
            );
          default:
            return of([]);
        }
      })
    );
  }

  callRepository(project: Project): void {
    this.repositorySubscription = this.repositoryService.getRepository(project.code)
      .pipe(catchError((error) => {
        this.remove(project);
        return throwError(error);
      }))
      .subscribe((data) => {
        if (data && Array.isArray(JSON.parse(data.result))) {
          const versions: string[] = JSON.parse(data.result).map((v) =>
            v.replace('.tgz', '').replace('.zip', '').replace('.sql', '')
          );
          const projectVersion = new ProjectData();
          projectVersion.code = project.code;
          projectVersion.versions = versions;
          this.projectVersions.push(projectVersion);
          this.filterCommonVersions();
        }
      });
  }

  callDocrootCore(project: Project): void {
    this.callRepository(project);

    this.drupalDocrootCoreSubscription = this.drupalDocrootCoreService
      .getDrupalDocrootCoreDetail(project.code)
      .pipe(catchError((error) => {
        this.remove(project);
        return throwError(error);
      }))
      .subscribe((docroots) => {
        this.addProjectDocroots(project.code, docroots);
        this.filterCommonDocroots();
      });
  }

  callSite(project: Project): void {
    this.callRepository(project);

    this.websiteSubscription = this.websiteService.getWebsiteDocroots(project.code)
      .pipe(catchError((error) => {
        this.remove(project);
        return throwError(error);
      }))
      .subscribe((docroots) => {
        this.addProjectDocroots(project.code, docroots);
        this.filterCommonDocroots();
      });
  }

  callDocroot(): void {
    this.docrootEnvSubscription = this.docrootService
      .getAllEnvironments(this.formGroup.get('docrootCode')!.value)
      .subscribe((page: Page<Environment>) => {
        this.envs = page.content;
      });
  }

  addCmd(): void {
    this.ELEMENT_DATA.push(
      new Command('drush', this.ELEMENT_DATA.length + 1, this.formGroup.get('cmdParam')!.value));
    this.datasource = new MatTableDataSource(this.ELEMENT_DATA);
  }

  deleteCmd(command: Command): void {
    this.ELEMENT_DATA = this.ELEMENT_DATA.filter((c) => c.order !== command.order);
    this.datasource = new MatTableDataSource(this.ELEMENT_DATA);
  }

  moveUp(cmd: Command): void {
    this.datasource = this.helperService.moveUp(cmd, this.datasource);
  }

  moveDown(cmd: Command): void {
    this.datasource = this.helperService.moveDown(cmd, this.datasource);
  }

  onSubmit(): void {

    const sources: Observable<Deployment>[] = [];
    for (const project of this.selectedProjects) {
      const request: Request = new Request();
      request.commands = this.datasource.data;
      request.deploymentTypeId =
        this.formGroup.get('requestType')!.value === 'website' ? 'D_WEBSITE' : 'D_DOCROOTCORE';
      request.deliverableCode = project.code;
      request.deliverableVersion = this.formGroup.get('deliverableVersion')!.value;
      request.docrootCode = this.formGroup.get('docrootCode')!.value;
      request.environmentCode = this.formGroup.get('environmentCode')!.value;
      sources.push(
        this.requestService.validate(request)
          .pipe(catchError((error) => {
            this.snackBar.open('Request failed for project: ' + project.code, 'OK', {
              duration: 10000,
              panelClass: 'error',
              verticalPosition: 'bottom',
              horizontalPosition: 'end'
            });
            return of(null!);
          }
          ))
      );
    }

    this.saving = true;
    forkJoin(sources).pipe(finalize(() => (this.saving = false)))
      .subscribe(() => {
        const snackBarRef = this.snackBar.open('Request(s) successfully done', 'OK', {
          duration: 10000,
          panelClass: 'success',
          verticalPosition: 'bottom',
          horizontalPosition: 'end'
        });
        snackBarRef.afterDismissed().subscribe(() => {
          this.initialize();
          const temp: Command[] = [];
          this.datasource = new MatTableDataSource(temp);
        });
      });
  }

  disableButton(): boolean {
    return (
      this.selectedProjects.length === 0 ||
      this.formGroup.invalid
    );
  }

  display(value: string): boolean {
    return this.formGroup.get('requestType')!.value === value;
  }

  selectProject(event: MatAutocompleteSelectedEvent): void {
    if (!event) {
      return;
    }
    const project: Project = event.option.value;

    if (
      this.selectedProjects &&
      !this.selectedProjects.find(
        (proj) =>
          proj.code === project.code
      )) {
      this.selectedProjects.push(event.option.value);
      switch (this.formGroup.get('requestType')!.value) {
        case 'website':
          this.callSite(project);
          break;
        case 'docroot':
          this.callDocrootCore(project);
          break;
      }
    }

    this.projectInput.nativeElement.value = '';
    this.formGroup.get('project')!.setValue(null);
    this.formGroup.get('deliverableVersion')!.setValue(null);
    this.formGroup.get('docrootCode')!.setValue(null);
    this.formGroup.get('environmentCode')!.setValue(null);
  }

  displayFn = (project: Project) => {
    if (project) {
      return project.name;
    }
    return '';
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.formGroup.get('project')!.setValue(null);
  }

  remove(project: Project): void {

    this.selectedProjects = this.selectedProjects.filter(selectedProject => selectedProject.code !== project.code);
    this.projectVersions = this.projectVersions.filter(projectVersion => projectVersion.code !== project.code);
    this.projectDocroots = this.projectDocroots.filter(projectDocroot => projectDocroot.code !== project.code);
    this.filterCommonVersions();
    this.filterCommonDocroots();
  }

  private filterCommonVersions(): void {
    if (this.projectVersions.length > 0) {
      // compare always from first selected project
      const firstProjectVersions = this.projectVersions[0].versions;

      for (const pv of this.projectVersions) {
        const commonVersions = pv.versions.filter(version => firstProjectVersions.includes(version));

        // if any selected project has no common versions with first one
        if (!commonVersions) {

          // then none version can be deployed in common
          this.versions = [];
          break;
        }
        else {
          // otherwise continue to add common versions
          this.versions = [...commonVersions];
        }
      }
    }
    else {
      this.versions = [];
    }
  }

  private filterCommonDocroots(): void {
    if (this.projectDocroots.length > 0) {
      // compare always from first selected project
      const firstProjectDocroots = this.projectDocroots[0].docroots;

      for (const pv of this.projectDocroots) {
        const commonDocroots = pv.docroots.filter(docroot =>
          firstProjectDocroots.find(fpv => fpv.code === docroot.code));

        // if any selected project has no common versions with first one
        if (!commonDocroots) {

          // then none version can be deployed in common
          this.docroots = [];
          break;
        }
        else {
          // otherwise continue to add common versions
          this.docroots = [...commonDocroots];
        }
      }

    }
    else {
      this.docroots = [];
    }
  }

  private addProjectDocroots(projectCode: string, docroots: Docroot[]): void {
    const projectDocroot = new ProjectData();
    projectDocroot.code = projectCode;
    projectDocroot.docroots = docroots;
    this.projectDocroots.push(projectDocroot);
  }

  private initData(): void {
    this.selectedProjects = [];
    this.projectVersions = [];
    this.projectDocroots = [];
    this.versions = [];
    this.docroots = [];
    this.envs = [];
  }
}
