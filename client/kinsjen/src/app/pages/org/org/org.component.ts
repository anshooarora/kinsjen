import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, finalize, forkJoin, takeUntil } from 'rxjs';
import { ApexAxisChartSeries, 
  ApexTitleSubtitle, 
  ApexDataLabels, 
  ApexChart, 
  ApexPlotOptions, 
  ChartComponent,
  ApexXAxis,
  ApexStroke,
  ApexGrid } from "ng-apexcharts";
import { Breadcrumb } from '../../../model/breadcrumb.model';
import { BreadcrumbService } from '../../../services/breadcrumb.service';
import { JenkinsInstance } from '../../../model/jenkins-instance.model';
import { Credential } from '../../../model/credential.model';
import { PipelineService } from '../../../services/pipeline.service';
import { Org } from '../../../model/org.model';
import { Pipeline } from '../../../model/pipeline.model';
import { Page } from '../../../model/page.model';
import { ActiveView } from './active-view.model';
import { JenkinsJobsService } from '../../../services/jenkins-jobs.service';
import { JenkinsJob } from '../../../model/jenkins-job.model';
import { OrgService } from '../../../services/org.service';
import { JenkinsBuild } from '../../../model/jenkins-build.model';
import { Location } from '@angular/common';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  grid: ApexGrid;
  stroke: ApexStroke;
};

@Component({
  selector: 'app-org',
  templateUrl: './org.component.html',
  styleUrl: './org.component.scss'
})
export class OrgComponent implements OnInit {
  
  Math = Math;

  private destroy$: Subject<any> = new Subject<any>();
  private readonly componentTitle: string = 'Orgs';
  private readonly breadcrumbs: Breadcrumb[] = [
    {
      name: 'orgs',
      url: 'orgs'
    },
    {
      name: '',
      url: ''
    }
  ];
  private readonly dataPoints: number = 20;

  /* state */
  loading: boolean = false;
  error: string | undefined;

  /* org */
  orgs: Page<Org>;
  org: Org;

  /* pipelines */
  pipelinePage: Page<Pipeline>;

  /* jenkins jobs */
  jenkinsJobs: JenkinsJob[] = [];

  /* jenkins */
  newJenkinsInstance: JenkinsInstance = {
    id: 0,
    name: '',
    url: '',
    type: 'Jenkins'
  };
  credential: Credential = new Credential();
  automationServers: JenkinsInstance[] = [];

  /* subview listing,metrics */
  activeView: ActiveView = ActiveView.Listing;

  /* heatmap */
  @ViewChild("heatmap") chart: ChartComponent;
  public heatmapOptions: Partial<ChartOptions> | any;

  /* line chart */
  @ViewChild("line") lineChart: ChartComponent;
  public lineChartOptions: Partial<ChartOptions> | any;
  lineChartData: any = [];


  constructor(private route: ActivatedRoute, 
    private router: Router,
    private location: Location,
    private breadcrumbService: BreadcrumbService, 
    private orgService: OrgService,
    private pipelineService: PipelineService,
    private jenkinsJobsService: JenkinsJobsService) { }

  ngOnInit(): void {
    this.findOrgs();
    this.setBreadcrumb();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  setBreadcrumb(): void {
    const org = this.route.snapshot.paramMap.get('org') || '';
    this.breadcrumbs[1].name = org;
    this.breadcrumbService.setTitle(this.componentTitle);
    this.breadcrumbService.setBreadcrumb(this.breadcrumbs);

    if (this.route.snapshot.fragment == 'metrics') {
      this.changeView(ActiveView.Metrics);
    }
  }

  findOrgs(): void {
    this.orgService.findAll()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response: Page<Org>) => {
        this.orgs = response;
        const name = this.route.snapshot.paramMap.get('org') || '';
        const org = response.content.find(x => x.name == name);
        if (org && org.id > 0) {
          this.findPipelines(org);
        }
      },
      error: (err) => {
        this.error = JSON.stringify(err);
      }
    })
  }

  findPipelines(org: Org): void {    
    this.pipelineService.findAll(org.id)
    .pipe(takeUntil(this.destroy$), finalize(() => { 
      this.loading = false;
    }))
    .subscribe({
      next: (response: Page<Pipeline>) => {
        console.log(response);
        this.pipelinePage = response;
        this.setChartOptions();
        this.createCharts();
      },
      error: (err) => {
        this.error = JSON.stringify(err);
      }
    });
  }

  setChartOptions(): void {
    this.heatmapOptions = {
      tooltip: {
        custom: function(opts: any): any {
          const desc = opts.ctx.w.config.series[opts.seriesIndex].data[opts.dataPointIndex].description;
          const value = opts.series[opts.seriesIndex][opts.dataPointIndex];
          let label = 'NODATA';
          if (value == 0) label = 'SUCCESS';
          if (value == 1) label = 'FAILURE';
          if (value == 2) label = 'UNSTABLE';
          if (value == 8) label = 'BUILDING';
          return '<span class="fs-8">' + desc + ': ' + label + '</span>';
        }
      },
      xaxis: {
        labels: {
          show: false
        },
        axisTicks: {
          show: false
        },
        tooltip: {
          enabled: false
        }
      },
      series: [],
      chart: {
        height: 50 + (this.pipelinePage.totalElements * 40),
        background: "transparent",
        type: "heatmap",
        toolbar: {
          show: true
        }
      },
      plotOptions: {
        heatmap: {
          distributed: true,
          shadeIntensity: 0.5,
          colorScale: {
            ranges: [
              {
                from: 0,
                to: 0,
                name: "success",
                color: "#00A100"
              },
              {
                from: 2,
                to: 2,
                name: "unstable",
                color: "#FFB200"
              },
              {
                from: 1,
                to: 1,
                name: "failure",
                color: "#FF0000"
              },
              {
                from: 8,
                to: 8,
                name: "building",
                color: "#1B84FF"
              },
              {
                from: 9,
                to: 9,
                name: "not run",
                color: "#CCCCCC"
              }
            ]
          }
        }
      },
      dataLabels: {
        enabled: false
      },
      title: {
        text: ""
      }
    };

    this.lineChartOptions = {
      series: [
        {
          name: "",
          data: []
        }
      ],
      chart: {
        height: 250,
        type: "line",
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },
      title: {
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5
        }
      },
      xaxis: {
        categories: [ ]
      }
    };
  }

  createCharts(): void {
    const jobs = this.pipelinePage.content.map(x => this.jenkinsJobsService.findJob(x.id, 1));
    forkJoin(jobs).subscribe(jobs => {
      for (let i = 0; i < this.pipelinePage.totalElements; i++) {
        jobs[i].pipeline = this.pipelinePage.content[i];
      }
      
      this.jenkinsJobs = jobs;
      this.createResultChart();
      this.createPerfChart();
    });
  }

  createResultChart(): void {
    const series: any[] = [];

    for (let job of this.jenkinsJobs) {
      series.push({
        name: job.displayName,
        data: []
      });
      const builds = job.builds;
      for (let i = 0; i < (builds.length > this.dataPoints ? this.dataPoints : builds.length); i++) {
        series.at(-1).data.push({
          x: builds[i].fullDisplayName,
          y: this.getJenkinsResultIdx(builds[i]),
          description: builds[i].fullDisplayName
        });
      }
      for (let i = builds.length; i < this.dataPoints; i++) {
        series.at(-1).data.push({ x: '', y: 9 });
      }
      this.heatmapOptions.series = series;
    }
  }

  private getJenkinsResultIdx(build: JenkinsBuild): number {
    if (build.building) return 8;
    const result = build.result;
    if (result == 'SUCCESS') return 0;
    if (result == 'FAILURE') return 1;
    if (result == 'UNSTABLE') return 2;
    return 9;
  }

  createPerfChart(): void {
    for (let job of this.jenkinsJobs) {
      const builds = job.builds.slice(0, this.dataPoints).reverse();
      this.lineChartData.push({
        title: {
          text: job.name
        },
        series: [{
          name: 'time (s)',
          data: builds.flatMap(x => Math.trunc(x.duration/1000))
        }],
        xaxis: {
          tickAmount: 10,
          categories: builds.map(x => x.number)
        }
      });
    }
  }

  getBuildStatus(job: JenkinsJob): string {
    const build = job.builds[0];
    if (build.building) {
      return 'BUILDING';
    }
    return build.result;
  }

  changeView(view: ActiveView) {
    this.activeView = view;
    const fragment = view == ActiveView.Metrics ? 'metrics' : 'listing';
    const urlTree = this.router.createUrlTree([], { fragment: fragment });
    this.location.go(urlTree.toString());
  }
}
