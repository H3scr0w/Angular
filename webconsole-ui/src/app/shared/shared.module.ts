import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { RouterModule } from '@angular/router';
import { HeaderMenuComponent } from '../core/header-menu/header-menu.component';
import { HeaderComponent } from '../core/header/header.component';
import { DeleteDialogComponent } from '../deployment/deployment-dialog/delete/delete-dialog.component';
import { TableDialogComponent } from '../deployment/deployment-dialog/deployment-table/table-dialog.component';
import { EditDialogComponent } from '../deployment/deployment-dialog/edit/edit-dialog.component';
import { DeploymentTableComponent } from '../deployment/deployment-table/deployment-table.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { StgoCommonModule } from '@delivery/stgo-common';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { AclsBlockComponent } from '../admin/tools/incapsula/incapsula-acls/acls-block/acls-block.component';
import { AclsWhitelistComponent } from '../admin/tools/incapsula/incapsula-acls/acls-whitelist/acls-whitelist.component';
import { IncapsulaAclsComponent } from '../admin/tools/incapsula/incapsula-acls/incapsula-acls.component';
import { CacheModeComponent } from '../admin/tools/incapsula/incapsula-cache/cache-mode/cache-mode.component';
import { CacheRulesComponent } from '../admin/tools/incapsula/incapsula-cache/cache-rules/cache-rules.component';
import { CacheSettingsComponent } from '../admin/tools/incapsula/incapsula-cache/cache-settings/cache-settings.component';
import { IncapsulaCacheComponent } from '../admin/tools/incapsula/incapsula-cache/incapsula-cache.component';
import { IncapsulaDnsComponent } from '../admin/tools/incapsula/incapsula-dns/incapsula-dns.component';
import { IncapsulaEventsComponent } from '../admin/tools/incapsula/incapsula-monitoring/incapsula-events/incapsula-events.component';
/* tslint:disable-next-line */
import { IncapsulaIncidentsComponent } from '../admin/tools/incapsula/incapsula-monitoring/incapsula-incidents/incapsula-incidents.component';
import { IncapsulaMonitoringComponent } from '../admin/tools/incapsula/incapsula-monitoring/incapsula-monitoring.component';
/* tslint:disable-next-line */
import { EditIncapsulaSiteConfDialogComponent } from '../admin/tools/incapsula/incapsula-site-conf/edit-incapsula-site-conf-dialog/edit-incapsula-site-conf-dialog.component';
import { IncapsulaSiteConfComponent } from '../admin/tools/incapsula/incapsula-site-conf/incapsula-site-conf.component';
/* tslint:disable-next-line */
import { EditIncapsulaCustomCertDialogComponent } from '../admin/tools/incapsula/incapsula-ssl/edit-incapsula-custom-cert-dialog/edit-incapsula-custom-cert-dialog.component';
import { IncapsulaSslComponent } from '../admin/tools/incapsula/incapsula-ssl/incapsula-ssl.component';
import { IncapsulaThreatsComponent } from '../admin/tools/incapsula/incapsula-threats/incapsula-threats.component';
import { ThreatsBackdoorComponent } from '../admin/tools/incapsula/incapsula-threats/threats-backdoor/threats-backdoor.component';
import { ThreatsBlockComponent } from '../admin/tools/incapsula/incapsula-threats/threats-block/threats-block.component';
import { ThreatsBotComponent } from '../admin/tools/incapsula/incapsula-threats/threats-bot/threats-bot.component';
import { ThreatsDdosComponent } from '../admin/tools/incapsula/incapsula-threats/threats-ddos/threats-ddos.component';
import { WebsiteDomainComponent } from '../admin/wsip/hosting/website-domain/website-domain.component';
import { WebsiteEnvironmentComponent } from '../admin/wsip/hosting/website-environment/website-environment.component';
import { FooterComponent } from '../core/footer/footer.component';

/**
 * The shared module
 */
@NgModule({
  imports: [
    CommonModule,
    MatTabsModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatToolbarModule,
    MatTableModule,
    MatExpansionModule,
    MatRadioModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSortModule,
    MatCheckboxModule,
    MatGridListModule,
    MatDividerModule,
    MatTreeModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    StgoCommonModule
  ],
  declarations: [
    DeploymentTableComponent,
    TableDialogComponent,
    DeleteDialogComponent,
    EditDialogComponent,
    FooterComponent,
    HeaderComponent,
    HeaderMenuComponent,
    IncapsulaSiteConfComponent,
    IncapsulaDnsComponent,
    IncapsulaSslComponent,
    EditIncapsulaCustomCertDialogComponent,
    IncapsulaCacheComponent,
    CacheModeComponent,
    CacheSettingsComponent,
    CacheRulesComponent,
    IncapsulaAclsComponent,
    IncapsulaThreatsComponent,
    AclsBlockComponent,
    AclsWhitelistComponent,
    ThreatsBotComponent,
    ThreatsBackdoorComponent,
    ThreatsDdosComponent,
    ThreatsBlockComponent,
    IncapsulaMonitoringComponent,
    IncapsulaEventsComponent,
    IncapsulaIncidentsComponent,
    EditIncapsulaSiteConfDialogComponent,
    EditIncapsulaCustomCertDialogComponent,
    WebsiteEnvironmentComponent,
    WebsiteDomainComponent,
    ConfirmationDialogComponent
  ],
  exports: [
    MatTabsModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatToolbarModule,
    MatExpansionModule,
    MatRadioModule,
    MatSelectModule,
    MatTableModule,
    MatButtonToggleModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSortModule,
    MatCheckboxModule,
    MatGridListModule,
    MatDividerModule,
    MatTreeModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    FormsModule,
    DeploymentTableComponent,
    FooterComponent,
    HeaderComponent,
    HeaderMenuComponent,
    IncapsulaSiteConfComponent,
    EditIncapsulaSiteConfDialogComponent,
    IncapsulaDnsComponent,
    IncapsulaSslComponent,
    EditIncapsulaCustomCertDialogComponent,
    IncapsulaCacheComponent,
    CacheModeComponent,
    CacheSettingsComponent,
    CacheRulesComponent,
    IncapsulaAclsComponent,
    IncapsulaThreatsComponent,
    AclsBlockComponent,
    AclsWhitelistComponent,
    ThreatsBotComponent,
    ThreatsBackdoorComponent,
    ThreatsDdosComponent,
    ThreatsBlockComponent,
    IncapsulaMonitoringComponent,
    IncapsulaEventsComponent,
    IncapsulaIncidentsComponent,
    EditIncapsulaSiteConfDialogComponent,
    EditIncapsulaCustomCertDialogComponent,
    WebsiteEnvironmentComponent,
    WebsiteDomainComponent,
    RouterModule
  ]
})
export class SharedModule {}
