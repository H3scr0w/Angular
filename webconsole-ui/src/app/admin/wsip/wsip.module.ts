import { SharedModule } from './../../shared/shared.module';
import { DocrootEnvServerComponent } from './docrootenv/server/docrootenv-server.component';
import { AddSiteDialogComponent } from './docrootenv/site/add-site/add-site-dialog.component';
import { SiteComponent } from './docrootenv/site/site.component';
import { EditEnvironmentDialogComponent } from './environment/edit-environment/edit-environment-dialog.component';
import { EnvironmentComponent } from './environment/environment.component';
import { EditServerDialogComponent } from './server/edit-server/edit-server-dialog.component';
import { ServerComponent } from './server/server.component';
import { WebsiteComponent } from './website/website.component';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CertificateComponent } from './certificate/certificate.component';
import { EditCertificateDialogComponent } from './certificate/edit-certificate-dialog/edit-certificate-dialog.component';
import { CmsComponent } from './cms/cms.component';
import { EditCmsDialogComponent } from './cms/edit-cms/edit-cms-dialog.component';
import { DocrootComponent } from './docroot/docroot.component';
import { EditDocrootDialogComponent } from './docroot/edit-docroot/edit-docroot-dialog.component';
import { DocrootcoreComponent } from './docrootcore/docrootcore.component';
import { EditDocrootcoreDialogComponent } from './docrootcore/edit-docrootcore/edit-docrootcore-dialog.component';
import { AddDocrootenvDialogComponent } from './docrootenv/add-docrootenv/add-docrootenv-dialog.component';
/* tslint:disable-next-line */
import { DialogDocrootenvDomainComponent } from './docrootenv/docrootenv-domain/dialog-docrootenv-domain/dialog-docrootenv-domain.component';
import { DocrootenvDomainComponent } from './docrootenv/docrootenv-domain/docrootenv-domain.component';
/* tslint:disable-next-line */
import { DialogDocrootenvLoadbalancerComponent } from './docrootenv/docrootenv-loadbalancer/dialog-docrootenv-loadbalancer/dialog-docrootenv-loadbalancer.component';
/* tslint:disable-next-line */
import { DocrootenvLoadbalancerComponent } from './docrootenv/docrootenv-loadbalancer/docrootenv-loadbalancer.component';
import { DocrootenvComponent } from './docrootenv/docrootenv.component';
import { EditDocrootenvDialogComponent } from './docrootenv/edit-docrootenv/edit-docrootenv-dialog.component';
import { AddServerDialogComponent } from './docrootenv/server/add-server/add-server-dialog.component';
import { DomainComponent } from './domain/domain.component';
import { EditDomainDialogComponent } from './domain/edit-domain-dialog/edit-domain-dialog.component';
/* tslint:disable-next-line */
import { EditHostingProviderDialogComponent } from './hosting-provider/edit-hosting-provider-dialog/edit-hosting-provider-dialog.component';
import { HostingProviderComponent } from './hosting-provider/hosting-provider.component';
import { DeployWebsiteDialogComponent } from './hosting/deploy-website-dialog/deploy-website-dialog.component';
import { TransferDomainDialogComponent } from './hosting/transfer-domain-dialog/transfer-domain-dialog.component';
/* tslint:disable-next-line */
import { EditLoadbalancerDialogComponent } from './loadbalancer/edit-loadbalancer-dialog/edit-loadbalancer-dialog.component';
import { LoadbalancerComponent } from './loadbalancer/loadbalancer.component';
import { EditRegistarDialogComponent } from './registar/edit-registar-dialog/edit-registar-dialog.component';
import { RegistarComponent } from './registar/registar.component';
import { AddWebsiteComponent } from './website/dialog/add-website/add-website.component';
import { EditWebsiteComponent } from './website/dialog/edit-website/edit-website.component';
import { WsipRoutingModule } from './wsip-routing.module';
import { WsipComponent } from './wsip.component';

@NgModule({
  declarations: [
    WsipComponent,
    CmsComponent,
    EditCmsDialogComponent,
    DocrootComponent,
    EditDocrootDialogComponent,
    DocrootcoreComponent,
    EditDocrootcoreDialogComponent,
    WebsiteComponent,
    AddWebsiteComponent,
    EditWebsiteComponent,
    DocrootenvComponent,
    AddDocrootenvDialogComponent,
    ServerComponent,
    AddServerDialogComponent,
    SiteComponent,
    AddSiteDialogComponent,
    EnvironmentComponent,
    EditEnvironmentDialogComponent,
    DocrootEnvServerComponent,
    EditServerDialogComponent,
    DomainComponent,
    RegistarComponent,
    EditRegistarDialogComponent,
    EditDomainDialogComponent,
    HostingProviderComponent,
    EditHostingProviderDialogComponent,
    LoadbalancerComponent,
    EditLoadbalancerDialogComponent,
    DocrootenvLoadbalancerComponent,
    DocrootenvDomainComponent,
    DialogDocrootenvLoadbalancerComponent,
    DialogDocrootenvDomainComponent,
    CertificateComponent,
    EditCertificateDialogComponent,
    EditDocrootenvDialogComponent,
    DeployWebsiteDialogComponent,
    TransferDomainDialogComponent
  ],
  imports: [CommonModule, WsipRoutingModule, SharedModule]
})
export class WsipModule {}
