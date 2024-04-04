import { Component, OnInit } from '@angular/core';
import { JenkinsJobsService } from '../../../services/jenkins-jobs.service';
import { Subject, finalize, takeUntil } from 'rxjs';
import { JenkinsJob } from '../../../model/jenkins-job.model';
import { JenkinsParams } from '../../../model/jenkins-params.model';
import { ActivatedRoute } from '@angular/router';
import { OrgService } from '../../../services/org.service';
import { Page } from '../../../model/page.model';
import { Org } from '../../../model/org.model';
import { JenkinsInstanceService } from '../../../services/jenkins-instance.service';
import { JenkinsInstance } from '../../../model/jenkins-instance.model';
import { Credential } from '../../../model/credential.model';
import { CredentialService } from '../../../services/credential.service';
import { PipelineService } from '../../../services/pipeline.service';
import { Pipeline } from '../../../model/pipeline.model';

@Component({
  selector: 'app-new-pipeline',
  templateUrl: './new-pipeline.component.html',
  styleUrl: './new-pipeline.component.scss'
})
export class NewPipelineComponent implements OnInit {

  private _unsubscribe: Subject<any> = new Subject<any>();

  loading: boolean = false;
  condenseContent: boolean = false;
  error: string | undefined;

  /* org */
  orgs: Page<Org> = new Page<Org>();
  orgSelection: Org = new Org();

  /* jenkins instances */
  jenkinsInstance: Page<JenkinsInstance> = new Page<JenkinsInstance>();
  hostSelection: JenkinsInstance = new JenkinsInstance();

  /* jenkins */
  jenkinsParams: JenkinsParams = new JenkinsParams();
  jenkinsJobs: JenkinsJob[];

  /* credentials */
  credentials: Page<Credential> = new Page<Credential>();
  credentialSelection: Credential = new Credential();

  /* pipeline */
  pipelinePage: Page<Pipeline>;
  pipelineURLs: string[];

  constructor(private route: ActivatedRoute, 
    private orgService: OrgService,
    private jenkinsInstanceService: JenkinsInstanceService,
    private credentialService: CredentialService,
    private pipelineService: PipelineService,
    private jenkinsJobsService: JenkinsJobsService) { }
  
  ngOnInit(): void {
    this.findOrgs();
    this.findJenkinsInstance();
  }

  ngOnDestroy(): void {
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }

  findOrgs(): void {
    this.orgService.findAll()
    .pipe(takeUntil(this._unsubscribe))
    .subscribe({
      next: (response: Page<Org>) => {
        console.log(response)
        this.orgs = response;
        this.orgSelection = response.totalElements == 1 ? response.content[0] : this.orgSelection;
      },
      error: (err) => {
        this.error = JSON.stringify(err);
      }
    })
  }

  findPipelines(org: Org): void {
    console.log(org)
    this.pipelineService.findAll(org.id)
      .pipe(takeUntil(this._unsubscribe), finalize(() => { 
        this.loading = false;
      }))
      .subscribe({
        next: (response: Page<Pipeline>) => {
          console.log(response);
          this.pipelinePage = response;
          this.pipelineURLs = this.pipelinePage.content.map(x => x.url.replace(/\/$/, ''));
          console.log(this.pipelineURLs);
        },
        error: (err) => {
          this.error = JSON.stringify(err);
        }
      });
  }

  findJenkinsInstance(): void {
    this.jenkinsInstanceService.findAll(0, -1)
      .pipe(takeUntil(this._unsubscribe), finalize(() => { 
        this.loading = false;
      }))
      .subscribe({
        next: (response: Page<JenkinsInstance>) => {
          console.log(response)
          this.jenkinsInstance = response;
          this.hostSelection = response.totalElements == 1 ? response.content[0] : this.hostSelection;
        },
        error: (err) => {
          this.error = JSON.stringify(err);
        }
      });
  }

  jenkinsInstanceChanged($event: any): void {
    const selection = $event.target.value;
    this.hostSelection = this.jenkinsInstance.content.find(x => x.name == selection)!;
    const jenkinsInstanceId = this.hostSelection.id;
    this.findCredentials(jenkinsInstanceId);
  }

  findCredentials(jenkinsInstanceId: number): void {
    this.credentialService.find(0, jenkinsInstanceId)
      .pipe(takeUntil(this._unsubscribe), finalize(() => { 
        this.loading = false;
      }))
      .subscribe({
        next: (response: Page<Credential>) => {
          console.log(response)
          this.credentials = response;
          this.credentialSelection = response.totalElements == 1 ? response.content[0] : this.credentialSelection;
        },
        error: (err) => {
          this.error = JSON.stringify(err);
        }
      });
  }

  discoverPipelines(): void {
    this.loading = true;
    this.error = undefined;
    this.jenkinsJobs = [];

    this.jenkinsJobsService.findJobs(this.hostSelection.id, this.credentialSelection.id, 0, true)
      .pipe(takeUntil(this._unsubscribe), finalize(() => { 
        this.loading = false;
      }))
      .subscribe({
        next: (response: JenkinsJob[]) => {
          const jobs = response.filter(x => !this.pipelineURLs.includes(x.url.replace(/\/$/, '')));
          this.jenkinsJobs = jobs;
          this.condenseContent = true;
          console.log(response)
        },
        error: (err) => {
          this.error = JSON.stringify(err);
        }
      });
  }

  discoverPipelinesBtnEnabled(): boolean {
    return this.orgSelection.id > 0 && this.hostSelection.name != '';
  }

  saveBtnEnabled(): boolean {
    console.log(this.orgSelection)
    return this.jenkinsJobs.length > 0 &&
      this.jenkinsJobs.some(x => x.checked) &&
      this.orgSelection.id > 0;
  }

  save(): void {
    let jobs = this.jenkinsJobs?.filter(x => x.checked);
    if (!jobs?.length) {
      return;
    }

    console.log(jobs);

    for (let job of jobs) {
      const pipeline: Pipeline = {
        id: 0,
        jenkinsInstanceId: this.hostSelection.id,
        credentialId: this.credentialSelection.id,
        orgId: this.orgSelection.id,
        name: job.name,
        url: job.url,
        _class: job._class
      };
      this.pipelineService.save(pipeline)
      .pipe(takeUntil(this._unsubscribe), finalize(() => { 
        this.loading = false;
      }))
      .subscribe({
        next: (response: Pipeline) => {
          console.log(response)
          job.saved = true;
        },
        error: (err) => {
          console.log(err)
          this.error = JSON.stringify(err);
        }
      });
    }
  }

}
