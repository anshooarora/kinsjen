import { Component } from '@angular/core';
import { Subject, finalize, takeUntil } from 'rxjs';
import { Breadcrumb } from '../../../model/breadcrumb.model';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from '../../../services/breadcrumb.service';
import { JenkinsJobsService } from '../../../services/jenkins-jobs.service';
import { JenkinsJob } from '../../../model/jenkins-job.model';
import { PipelineService } from '../../../services/pipeline.service';
import { Pipeline } from '../../../model/pipeline.model';

@Component({
  selector: 'app-pipeline',
  templateUrl: './pipeline.component.html',
  styleUrl: './pipeline.component.scss'
})
export class PipelineComponent {

  private destroy$: Subject<any> = new Subject<any>();
  private readonly componentTitle: string = 'Orgs';
  private readonly breadcrumbs: Breadcrumb[] = [
    {
      name: 'orgs',
      url: 'orgs'
    },
    {
      name: 'pipelines',
      url: 'orgs'
    },
    {
      name: '?',
      url: ''
    }
  ];

  /* state */
  loading: boolean = false;
  error: string | undefined;
  
  /* pipeline */
  pipeline: Pipeline;

  /* job */
  jenkinsJob: JenkinsJob;
  currentBuildNumber: number = -1;

  constructor(private route: ActivatedRoute, 
    private breadcrumbService: BreadcrumbService, 
    private pipelineService: PipelineService,
    private jenkinsJobsService: JenkinsJobsService) { }

  ngOnInit(): void {
    this.setBreadcrumb();
    this.findPipeline();
    this.findJob();
  }

  setBreadcrumb(): void {
    let org = this.route.snapshot.paramMap.get('org') || "";
    this.breadcrumbs[1].name = org;

    this.breadcrumbService.setTitle(this.componentTitle);
    this.breadcrumbService.setBreadcrumb(this.breadcrumbs);
  }

  findPipeline(): void {
    this.pipelineService.find(1)
    .pipe(takeUntil(this.destroy$), finalize(() => { 
      this.loading = false;
    }))
    .subscribe({
      next: (response: Pipeline) => {
        console.log(response);
        this.pipeline = response;
        this.breadcrumbs.at(-1)!.name = response.name;
      },
      error: (err) => {
        this.error = JSON.stringify(err);
      }
    });
  }

  findJob(): void {    
    this.jenkinsJobsService.findJob(1)
    .pipe(takeUntil(this.destroy$), finalize(() => { 
      this.loading = false;
    }))
    .subscribe({
      next: (response: JenkinsJob) => {
        console.log(response);
        this.jenkinsJob = response;
        if (response.builds.length) {
          this.currentBuildNumber = response.builds[0].number;
        }
      },
      error: (err) => {
        this.error = JSON.stringify(err);
      }
    });
  }

}
