import { Component } from '@angular/core';
import { Observable, Subject, finalize, forkJoin, takeUntil } from 'rxjs';
import { Breadcrumb } from '../../../model/breadcrumb.model';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from '../../../services/breadcrumb.service';
import { JenkinsJobsService } from '../../../services/jenkins-jobs.service';
import { JenkinsJob } from '../../../model/jenkins-job.model';
import { PipelineService } from '../../../services/pipeline.service';
import { Pipeline } from '../../../model/pipeline.model';
import { JenkinsConsoleLogsService } from '../../../services/jenkins-console-logs.service';
import { JenkinsTestReportService } from '../../../services/jenkins-test-report.service';
import { TestReport } from '../../../model/test-report.model';
import { JenkinsBuild } from '../../../model/jenkins-build.model';
import { ActiveView } from './active-view.model';
import { ChildReport } from '../../../model/child-report.model';
import { ErrorService } from '../../../services/error.service';

@Component({
  selector: 'app-pipeline',
  templateUrl: './pipeline.component.html',
  styleUrl: './pipeline.component.scss'
})
export class PipelineComponent {

  ActiveView = ActiveView;

  private destroy$: Subject<any> = new Subject<any>();
  private readonly componentTitle: string = 'Orgs';
  private readonly breadcrumbs: Breadcrumb[] = [
    {
      name: 'orgs',
      url: 'orgs'
    },
    {
      name: '',
      url: '/orgs/'
    },
    {
      name: '?',
      url: ''
    }
  ];

  /* state */
  loading: boolean = false;
  error: string | undefined;
  
  /* view */
  activeView: ActiveView = ActiveView.TestReport;

  /* pipeline */
  pipeline: Pipeline;
  pipelineId: number;

  /* job */
  jenkinsJob: JenkinsJob;
  currentBuild: JenkinsBuild;
  prevBuildNumber: number = -1;
  currentBuildNumber: number = -1;

  /* console logs */
  consoleText: string;

  /* testReport */
  testReport: TestReport | any;

  constructor(private route: ActivatedRoute, 
    private breadcrumbService: BreadcrumbService, 
    private pipelineService: PipelineService,
    private jenkinsJobsService: JenkinsJobsService,
    private jenkinsConsoleLogsService: JenkinsConsoleLogsService,
    private jenkinsTestReportService: JenkinsTestReportService,
    private errorService: ErrorService) { }

  ngOnInit(): void {
    this.setBreadcrumb();
    this.findPipeline();
    this.findJob();
  }

  setBreadcrumb(): void {
    let org = this.route.snapshot.paramMap.get('org') || "";
    this.breadcrumbs[1].name = org;
    this.breadcrumbs[1].url = this.breadcrumbs[1].url + org;

    const pipelineId = this.route.snapshot.paramMap.get('pipeline')!;
    this.pipelineId = +pipelineId;

    this.breadcrumbService.setTitle(this.componentTitle);
    this.breadcrumbService.setBreadcrumb(this.breadcrumbs);
  }

  findPipeline(): void {
    this.pipelineService.find(this.pipelineId)
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
        this.error = this.errorService.getError(err);
      }
    });
  }

  findJob(): void {
    this.jenkinsJobsService.findJob(this.pipelineId, 1)
    .pipe(takeUntil(this.destroy$), finalize(() => { 
      this.loading = false;
    }))
    .subscribe({
      next: (response: JenkinsJob) => {
        console.log(response);
        this.jenkinsJob = response;
        if (response.builds.length) {
          this.currentBuildNumber = response.builds[0].number;
          this.findTestReport(this.currentBuildNumber);
        }
      },
      error: (err) => {
        this.error = this.errorService.getError(err);
      }
    });
  }

  findBuildDetails(buildNumber: number): void {
    this.loading = true;
    this.currentBuildNumber = buildNumber;
    this.currentBuild = this.jenkinsJob.builds.find(x => x.number == buildNumber)!;
    this.consoleText = '';
    this.testReport = new TestReport();
    this.activeView = ActiveView.TestReport;
    forkJoin([this.findTestReport(buildNumber)]).subscribe(_ => {
      this.loading = false;
    })
  }

  findTestReport(buildNumber: number): Observable<TestReport> {
    this.loading = true;
    const ob = this.jenkinsTestReportService.find(this.pipelineId, buildNumber)
      .pipe(takeUntil(this.destroy$), finalize(() => { 
        this.loading = false;
      }));
    ob.subscribe({
      next: (response: TestReport) => {
        console.log(response)
        this.testReport = response;
      },
      error: (err) => {
        console.log(err)
        this.testReport = null;
        this.activateView(ActiveView.Logs);
      }
    });
    return ob;
  }

  findConsoleText(buildNumber: number): Observable<string> {
    this.loading = true;
    const ob = this.jenkinsConsoleLogsService.find(this.pipelineId, buildNumber)
      .pipe(takeUntil(this.destroy$), finalize(() => { 
        this.loading = false;
      }));
    ob.subscribe({
      next: (response: string) => {
        this.consoleText = response;
      },
      error: (err) => {
        this.error = this.errorService.getError(err);
      }
    });
    return ob;
  }

  activateView(activeView: ActiveView): void {
    this.activeView = activeView;
    
    if (activeView == ActiveView.Logs) {
      if (this.prevBuildNumber != this.currentBuildNumber) {
        this.findConsoleText(this.currentBuildNumber);
        this.prevBuildNumber = this.currentBuildNumber;
      }
    }
  }

  getBuildIdx(): number {
    return this.jenkinsJob.builds.findIndex(x => x.number == this.currentBuildNumber);
  }

  getDuration(childReports: ChildReport[]): number {
    const duration = childReports.map(x => x.result.duration)
      .reduce((sum, current) => sum + current);
    return Math.trunc(duration);
  }
}
