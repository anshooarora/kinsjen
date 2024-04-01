import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OrgListingComponent } from './pages/org/org-listing/org-listing.component';
import { TextSearchFilterPipe } from './pipes/text-search-filter.pipe';
import { OrgComponent } from './pages/org/org/org.component';
import { StartComponent } from './pages/start/start.component';
import { NewPipelineComponent } from './pages/pipeline/new-pipeline/new-pipeline.component';
import { NewJobComponent } from './pages/job/new-job/new-job.component';
import { ManageCredentialsComponent } from './pages/credentials/manage-credentials/manage-credentials.component';
import { ManageJobsComponent } from './pages/job/manage-jobs/manage-jobs.component';
import { ManageJenkinsComponent } from './pages/jenkins/manage-jenkins/manage-jenkins.component';
import { PipelineComponent } from './pages/pipeline/pipeline/pipeline.component';


@NgModule({
  declarations: [
    AppComponent,
    OrgComponent,
    OrgListingComponent,
    TextSearchFilterPipe,
    StartComponent,
    NewPipelineComponent,
    NewJobComponent,
    ManageCredentialsComponent,
    ManageJobsComponent,
    ManageJenkinsComponent,
    PipelineComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgApexchartsModule
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
