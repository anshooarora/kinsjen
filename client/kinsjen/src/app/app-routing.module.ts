import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrgListingComponent } from './pages/org/org-listing/org-listing.component';
import { OrgComponent } from './pages/org/org/org.component';
import { StartComponent } from './pages/start/start.component';
import { NewPipelineComponent } from './pages/pipeline/new-pipeline/new-pipeline.component';
import { PipelineComponent } from './pages/pipeline/pipeline/pipeline.component';

const routes: Routes = [
  { path: '', component: OrgListingComponent },
  { path: 'start', component: StartComponent },
  { path: 'orgs', component: OrgListingComponent },
  { path: 'orgs/:org', component: OrgComponent },
  { path: 'orgs/:org/pipelines/:pipeline', component: PipelineComponent },
  { path: 'new', component: NewPipelineComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
