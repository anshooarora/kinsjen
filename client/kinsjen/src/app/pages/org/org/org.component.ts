import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, finalize, takeUntil } from 'rxjs';
import { ApexAxisChartSeries, ApexTitleSubtitle, ApexDataLabels, ApexChart, ApexPlotOptions, ChartComponent } from "ng-apexcharts";
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

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
  plotOptions: ApexPlotOptions;
};

@Component({
  selector: 'app-org',
  templateUrl: './org.component.html',
  styleUrl: './org.component.scss'
})
export class OrgComponent implements OnInit {
  
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
  org: Org;

  /* pipelines */
  pipelinePage: Page<Pipeline>;

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
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions> | any;


  constructor(private route: ActivatedRoute, 
    private breadcrumbService: BreadcrumbService, 
    private jenkinsInstanceService: JenkinsInstanceService,
    private pipelineService: PipelineService,
    private jenkinsJobsService: JenkinsJobsService) { }

  ngOnInit(): void {
    this.setBreadcrumb();
    this.findPipelines();

    this.chartOptions = {
      tooltip: {
        custom: function(opts: any): any {
          const desc = opts.ctx.w.config.series[opts.seriesIndex].data[opts.dataPointIndex].description;
          const value = opts.series[opts.seriesIndex][opts.dataPointIndex];
          let label = 'NODATA';
          if (value == 0) label = 'SUCCESS';
          if (value == 1) label = 'FAILURE';
          if (value == 2) label = 'UNSTABLE';
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
        height: 4 * 60,
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
                name: "SUCCESS",
                color: "#00A100"
              },
              {
                from: 9,
                to: 9,
                name: "NODATA",
                color: "#CCCCCC"
              },
              {
                from: 2,
                to: 2,
                name: "UNSTABLE",
                color: "#FFB200"
              },
              {
                from: 1,
                to: 1,
                name: "FAILURE",
                color: "#FF0000"
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
  }
  
  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  setBreadcrumb(): void {
    let org = this.route.snapshot.paramMap.get('org') || "";
    this.breadcrumbs[1].name = org;

    this.breadcrumbService.setTitle(this.componentTitle);
    this.breadcrumbService.setBreadcrumb(this.breadcrumbs);
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

  saveAutomationServer(): void {
    //this.newJenkinsInstance.authTokens = [];
    if (this.credential.name && this.credential.apiToken) {
      //this.newJenkinsInstance.authTokens.push(this.credential);
    }
    this.jenkinsInstanceService.save(this.newJenkinsInstance)
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

  findPipelines(): void {
    this.org = new Org(); 
    this.org.id = 1;
    
    this.pipelineService.findAll(this.org.id)
    .pipe(takeUntil(this.destroy$), finalize(() => { 
      this.loading = false;
    }))
    .subscribe({
      next: (response: Page<Pipeline>) => {
        console.log(response);
        this.pipelinePage = response;
        this.createChart();
      },
      error: (err) => {
        this.error = JSON.stringify(err);
      }
    });
  }

  createChart(): void {
    const series: any[] = [];
    this.chartOptions.chart.height = this.pipelinePage.totalElements * 70;
    for (let pipeline of this.pipelinePage.content) {
      this.jenkinsJobsService.findJob(pipeline.id)
        .pipe(takeUntil(this.destroy$), finalize(() => { 
          this.loading = false;
        }))
        .subscribe({
          next: (response: JenkinsJob) => {
            console.log('jenkinsjob')
            const seriesData: any = {
              name: response.displayName,
              data: []
            };
            series.push(seriesData);
            const items = response.builds.length;
            for (let i = 0; i < (items >= 20 ? 20 : items); i++) {
              const data: any = {
                x: response.builds[i].fullDisplayName,
                y: this.getJenkinsResultIdx(response.builds[i].result),
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
            this.chartOptions.series = series;
            console.log(series);
          },
          error: (err) => {
            this.error = JSON.stringify(err);
          }
        });
    }
  }

  private getJenkinsResultIdx(result: string): number {
    if (result == 'SUCCESS') return 0;
    if (result == 'FAILURE') return 1;
    if (result == 'UNSTABLE') return 2;
    return 9;
  }

  private getJenkinsResult(result: number): string {
    if (result == 0) return 'SUCCESS';
    if (result == 1) return 'FAILURE';
    if (result == 2) return 'UNSTABLE';
    return 'NODATA';
  }

}
