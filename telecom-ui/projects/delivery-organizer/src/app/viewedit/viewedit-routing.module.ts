import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectBulkModificationComponent } from './project/project-bulk-modification/project-bulk-modification.component';

const routes: Routes = [{ path: '', redirectTo: 'viewedit', pathMatch: 'full' },

{
  path: 'project-bulk-modification',
  component: ProjectBulkModificationComponent,
  pathMatch: 'full',
  data: { title: 'View/Edit' }
}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VieweditRoutingModule {}
