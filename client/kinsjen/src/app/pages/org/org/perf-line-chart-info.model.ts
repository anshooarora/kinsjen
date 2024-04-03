import { ApexAxisChartSeries, ApexTitleSubtitle, XAxisAnnotations } from "ng-apexcharts";

export interface PerfLineChartInfo {
    series: ApexAxisChartSeries | any;
    xaxis: XAxisAnnotations | any;
    title: ApexTitleSubtitle | any;
}
