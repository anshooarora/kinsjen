import { Component, OnInit } from '@angular/core';
import { JenkinsJobsService } from '../../../services/jenkins-jobs.service';
import { Subject, finalize, takeUntil } from 'rxjs';
import { JenkinsJob } from '../../../model/jenkins-job.model';
import { JenkinsParams } from '../../../model/jenkins-params.model';
import { ActivatedRoute } from '@angular/router';
import { OrgService } from '../../../services/org.service';
import { Page } from '../../../model/page.model';
import { Org } from '../../../model/org.model';

@Component({
  selector: 'app-new-job',
  templateUrl: './new-job.component.html',
  styleUrl: './new-job.component.scss'
})
export class NewJobComponent implements OnInit {

  private _unsubscribe: Subject<any> = new Subject<any>();

  loading: boolean = false;
  condenseContent: boolean = false;
  error: string | undefined;

  /* org */
  orgs: Page<Org>;

  /* jenkins */
  jenkinsParams: JenkinsParams = new JenkinsParams();
  jenkinsJobs: JenkinsJob[] | undefined;

  constructor(private route: ActivatedRoute, 
    private orgService: OrgService,
    private jenkinsJobsService: JenkinsJobsService) { }
  
  ngOnInit(): void {
    this.findOrgs();
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
        this.orgs = response;
        console.log(response)
      },
      error: (err) => {
        this.error = JSON.stringify(err);
      }
    })
  }

  discoverPipelines(): void {
    this.loading = true;
    this.jenkinsJobs = this.error = undefined;

    this.jenkinsParams.host = "http://localhost/";
    if (!this.jenkinsParams.host) {
      return;
    }
    this.jenkinsJobsService.findJobs()
      .pipe(takeUntil(this._unsubscribe), finalize(() => { 
        this.loading = false;
      }))
      .subscribe({
        next: (response: JenkinsJob[]) => {
          this.jenkinsJobs = response;
          this.condenseContent = true;
          console.log(response)
        },
        error: (err) => {
          this.error = JSON.stringify(err);
        }
      });
  }

  save(): void {
    let jobs = this.jenkinsJobs?.filter(x => x.checked);
    if (!jobs?.length) {
      return;
    }

    let org = this.route.snapshot.paramMap.get('org') || "";
    jobs.forEach(x => x.org = org);
    console.log(jobs);
    /*
    this.jenkinsJobsService.savePipelines(this.jenkinsParams.host!, jobs!)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe();*/
  }

}
