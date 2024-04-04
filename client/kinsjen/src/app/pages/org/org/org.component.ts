import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, finalize, takeUntil } from 'rxjs';
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
import { JenkinsInstanceService } from '../../../services/jenkins-instance.service';
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
    private breadcrumbService: BreadcrumbService, 
    private orgService: OrgService,
    private jenkinsInstanceService: JenkinsInstanceService,
    private pipelineService: PipelineService,
    private jenkinsJobsService: JenkinsJobsService) { }

  ngOnInit(): void {
    this.findOrgs();
    this.setBreadcrumb();

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
        background: "transparent",
        type: "heatmap",
        toolbar: {
          show: false
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
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      xaxis: { 
        categories: [ ]
      }
    };
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  setBreadcrumb(): void {
    let org = this.route.snapshot.paramMap.get('org') || '';
    this.breadcrumbs[1].name = org;

    this.breadcrumbService.setTitle(this.componentTitle);
    this.breadcrumbService.setBreadcrumb(this.breadcrumbs);
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

  findAutomationServers(): void {
    this.jenkinsInstanceService.findAll(0)
      .pipe(takeUntil(this.destroy$), finalize(() => { 
        this.loading = false;
      }))
      .subscribe({
        next: (response: any) => {
          
        },
        error: (err) => {
          this.error = JSON.stringify(err);
        }
      });
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
        this.createHeatmap();
      },
      error: (err) => {
        this.error = JSON.stringify(err);
      }
    });
  }

  createHeatmap(): void {
    const series: any[] = [];
    console.log(this.pipelinePage.totalElements)
    this.heatmapOptions.chart.height = 50 + this.pipelinePage.totalElements * 40;
    for (let pipeline of this.pipelinePage.content) {
      this.jenkinsJobsService.findJob(pipeline.id, 1)
        .pipe(takeUntil(this.destroy$), finalize(() => { 
          this.createPerfLine();
          this.loading = false;
        }))
        .subscribe({
          next: (response: JenkinsJob) => {
            response.pipeline = pipeline;
            this.jenkinsJobs.push(response);
            console.log(response)
            const seriesData: any = {
              name: response.displayName,
              data: []
            };
            series.push(seriesData);
            const items = response.builds.length;
            for (let i = 0; i < (items >= 20 ? 20 : items); i++) {
              const data: any = {
                x: response.builds[i].fullDisplayName,
                y: this.getJenkinsResultIdx(response.builds[i]),
                description: response.builds[i].fullDisplayName
              }
              seriesData.data.push(data);
            }
            for (let i = items; i < 20; i++) {
              const data: any = {
                x: '',
                y: 9
              }
              seriesData.data.push(data);
            }
            this.heatmapOptions.series = series;
          },
          error: (err) => {
            this.error = JSON.stringify(err);
          }
        });
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

  createPerfLine(): void {
    this.lineChartData = [];
    for (let job of this.jenkinsJobs) {
      this.lineChartData.push({
        title: {
          text: job.name
        },
        series: [{
          name: 'time (s)',
          data: job.builds.flatMap(x => Math.trunc(x.duration/1000))
        }],
        xaxis: {
          categories: job.builds.map(x => x.number)
        }
      });
      console.log(this.lineChartData)
    }
  }

  getBuildStatus(job: JenkinsJob): string {
    const build = job.builds[0];
    if (build.building) {
      return 'BUILDING';
    }
    return build.result;
  }
}
