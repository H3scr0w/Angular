import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of, Subscription, Observable } from 'rxjs';
import { debounceTime, finalize, map, switchMap, startWith } from 'rxjs/operators';
import { AccessRight } from '../../../../../shared/models/access-right.model';
import { DialogData } from '../../../../../shared/models/dialog-data.model';
import { DocrootCore } from '../../../../../shared/models/docrootcore.model';
import { Page } from '../../../../../shared/models/page.model';
import { Project } from '../../../../../shared/models/project.model';
import { Website } from '../../../../../shared/models/website.model';
import { AccessRightService } from '../../../../../shared/services/access-right.service';
import { DrupalDocrootCoreService } from '../../../../../shared/services/drupaldocrootcore.service';
import { WebsiteService } from '../../../../../shared/services/website.service';

@Component({
  selector: 'stgo-add-right',
  templateUrl: './add-right.component.html',
  styleUrls: ['./add-right.component.scss']
})
export class AddRightComponent implements OnInit, OnDestroy {
  saving = false;
  rightForm: FormGroup;
  newRight: AccessRight = new AccessRight();

  projectTypes = [
    { type: 'w', name: 'Website' },
    { type: 'ddc', name: 'Drupal Docroot Core' }
  ];
  roleLabels: string[] = [
    'Admin',
    'LocalIT',
    'External',
    'Owner',
    'Business',
    'WASO',
    'Application_Contact',
    'Technical_Contact'
  ];
  projects$: Observable<Project[]>;
  hasProjectSelected = false;
  project: Project;

  private sub$: Subscription = new Subscription();

  constructor(
    public dialogRef: MatDialogRef<AddRightComponent>,
    private accessRightService: AccessRightService,
    private websiteService: WebsiteService,
    private drupalDocrootCoreService: DrupalDocrootCoreService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit(): void {
    this.roleLabels = this.roleLabels.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    this.rightForm = new FormGroup({
      projectType: new FormControl({ type: 'w', name: 'Website' }, [Validators.required]),
      project: new FormControl('', [Validators.required]),
      roleLabel: new FormControl('', [Validators.required])
    });

    this.getProjects();

  }

  ngOnDestroy(): void {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.saving = true;

    this.newRight.userMail = this.data.user.email;
    this.newRight.projectCode = this.project.code;
    this.newRight.projectName = this.project.name;
    this.newRight.projectType = this.rightForm.get('projectType')!.value;
    this.newRight.roleLabel = this.rightForm.get('roleLabel')!.value;

    this.sub$.add(this.accessRightService
      .createOrUpdateAccessRight(0, this.newRight)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe(() => {
        this.dialogRef.close(true);
      }));
  }

  selectProject(action: boolean, projectSelected?: Project): void {
    if (projectSelected) {
      this.project = projectSelected;
    }
    this.hasProjectSelected = action;
  }

  displayFn(project?: Project): string {
    if (project) {
      return project.name;
    }
    return '';
  }

  // tslint:disable-next-line:no-any
  onProjectTypeSelected(projectType: any): void {
    if (projectType) {
      this.rightForm.controls.project.patchValue("");
      this.rightForm.updateValueAndValidity();
    }
  }

  private getProjects(): void {
    this.projects$ = this.rightForm.controls.project.valueChanges.pipe(
      startWith(""),
      debounceTime(400),
      switchMap((query: string) => {
        const projectType = this.rightForm.get('projectType')!.value;
        switch (projectType) {
          case 'w':
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
          case 'ddc':
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
}
