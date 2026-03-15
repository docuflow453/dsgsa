// angular import
import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ThemeService } from 'src/app/theme/shared/service/customs-theme.service';
import { ChartDB } from 'src/fake-data/chartData';

// third party
import { NgApexchartsModule, ApexOptions } from 'ng-apexcharts';

@Component({
  selector: 'app-apex-chart',
  imports: [CommonModule, SharedModule, NgApexchartsModule],
  templateUrl: './apex-chart.component.html',
  styleUrls: ['./apex-chart.component.scss']
})
export class ApexChartComponent {
  private themeService = inject(ThemeService);

  // private props
  barChart!: ApexOptions;
  barStackedChart!: ApexOptions;
  barHorizontalChart!: ApexOptions;
  barHStackChart!: ApexOptions;
  pieChart!: ApexOptions;
  donutChart!: ApexOptions;
  radialChart!: ApexOptions;
  customsAngleChart!: ApexOptions;
  lineChart!: ApexOptions;
  realTimeChart!: ApexOptions;
  areaChart!: ApexOptions;
  dateTimeChart!: ApexOptions;
  mixedChart!: ApexOptions;
  lineAreaChart!: ApexOptions;
  candlestickChart!: ApexOptions;
  bubbleChart!: ApexOptions;
  bubble3DChart!: ApexOptions;
  scatterChart!: ApexOptions;
  scatterDateTimeChart!: ApexOptions;
  heatmapChart!: ApexOptions;
  heatmapRoundedChart!: ApexOptions;
  // eslint-disable-next-line
  chartDB: any;

  preset = ['#0050B3', '#1890FF', '#52C41A'];
  customs_color = ['#0050B3', '#1890FF', '#52C41A', '#FF4D4F'];
  pie_color = ['#0050B3', '#1890FF', '#52C41A', '#FF4D4F', '#FAAD14'];
  line_colors = ['#0050B3'];
  area_colors = ['#0050B3', '#1890FF'];

  // constructor
  constructor() {
    this.chartDB = ChartDB;
    const {
      barChart,
      bubbleChart,
      bubble3DChart,
      scatterChart,
      scatterDateTimeChart,
      heatmapChart,
      heatmapRoundedChart,
      lineAreaChart,
      candlestickChart,
      barStackedChart,
      barHorizontalChart,
      barHStackChart,
      pieChart,
      donutChart,
      radialChart,
      customsAngleChart,
      lineChart,
      realTimeChart,
      areaChart,
      dateTimeChart,
      mixedChart
    } = this.chartDB;

    // eslint-disable-next-line
    ((this.barChart = barChart),
      (this.barStackedChart = barStackedChart),
      (this.barHorizontalChart = barHorizontalChart),
      (this.barHStackChart = barHStackChart),
      (this.pieChart = pieChart),
      (this.donutChart = donutChart),
      (this.radialChart = radialChart),
      (this.customsAngleChart = customsAngleChart),
      (this.lineChart = lineChart),
      (this.realTimeChart = realTimeChart),
      (this.areaChart = areaChart),
      (this.dateTimeChart = dateTimeChart),
      (this.mixedChart = mixedChart),
      (this.lineAreaChart = lineAreaChart),
      (this.candlestickChart = candlestickChart),
      (this.bubbleChart = bubbleChart),
      (this.bubble3DChart = bubble3DChart),
      (this.scatterChart = scatterChart),
      (this.scatterDateTimeChart = scatterDateTimeChart),
      (this.heatmapChart = heatmapChart),
      (this.heatmapRoundedChart = heatmapRoundedChart));

    effect(() => {
      this.isDarkTheme(this.themeService.isDarkMode());
      this.updateThemeColor(this.themeService.customsTheme());
      this.rerenderChartOnContainerResize(this.themeService.isContainerMode());
    });
  }

  // private methods
  private isDarkTheme(isDark: boolean) {
    const tooltipTheme = isDark === true ? 'dark' : 'light';
    const tooltip = { theme: tooltipTheme };

    this.barChart = { ...this.barChart, tooltip };
    this.barStackedChart = { ...this.barStackedChart, tooltip };
    this.barHorizontalChart = { ...this.barHorizontalChart, tooltip };
    this.barHStackChart = { ...this.barHStackChart, tooltip };
    this.lineChart = { ...this.lineChart, tooltip };
    this.realTimeChart = { ...this.realTimeChart, tooltip };
    this.areaChart = { ...this.areaChart, tooltip };
    this.dateTimeChart = { ...this.dateTimeChart, tooltip };
    this.mixedChart = { ...this.mixedChart, tooltip };
    this.lineAreaChart = { ...this.lineAreaChart, tooltip };
    this.candlestickChart = { ...this.candlestickChart, tooltip };
    this.bubbleChart = { ...this.bubbleChart, tooltip };
    this.bubble3DChart = { ...this.bubble3DChart, tooltip };
    this.scatterChart = { ...this.scatterChart, tooltip };
    this.scatterDateTimeChart = { ...this.scatterDateTimeChart, tooltip };
    this.heatmapChart = { ...this.heatmapChart, tooltip };
    this.heatmapRoundedChart = { ...this.heatmapRoundedChart, tooltip };
  }

  private updateThemeColor(theme: string) {
    switch (theme) {
      case 'preset-1':
      default:
        this.preset = ['#0050B3', '#1890FF', '#52C41A'];
        this.customs_color = ['#0050B3', '#1890FF', '#52C41A', '#FF4D4F'];
        this.pie_color = ['#0050B3', '#1890FF', '#52C41A', '#FF4D4F', '#FAAD14'];
        this.line_colors = ['#0050B3'];
        this.area_colors = ['#0050B3', '#1890FF'];
        break;
      case 'preset-2':
        this.preset = ['#1939B7', '#3366FF', '#58D62A'];
        this.customs_color = ['#1939B7', '#3366FF', '#58D62A', '#FF4528'];
        this.pie_color = ['#1939B7', '#3366FF', '#58D62A', '#FF4528', '#FFB814'];
        this.line_colors = ['#1939B7'];
        this.area_colors = ['#1939B7', '#3366FF'];
        break;
      case 'preset-3':
        this.preset = ['#5F53DF', '#7265E6', '#00A854'];
        this.customs_color = ['#5F53DF', '#7265E6', '#00A854', '#F04134'];
        this.pie_color = ['#5F53DF', '#7265E6', '#00A854', '#F04134', '#FFBF00'];
        this.line_colors = ['#5F53DF'];
        this.area_colors = ['#5F53DF', '#7265E6'];
        break;
      case 'preset-4':
        this.preset = ['#004222', '#068e44', '#00A854'];
        this.customs_color = ['#004222', '#068e44', '#00A854', '#F04134'];
        this.pie_color = ['#004222', '#068e44', '#00A854', '#F04134', '#FFBF00'];
        this.line_colors = ['#004222'];
        this.area_colors = ['#004222', '#068e44'];
        break;
      case 'preset-5':
        this.preset = ['#192f85', '#3c64d0', '#00A854'];
        this.customs_color = ['#192f85', '#3c64d0', '#00A854', '#F04134'];
        this.pie_color = ['#192f85', '#3c64d0', '#00A854', '#F04134', '#FFBF00'];
        this.line_colors = ['#192f85'];
        this.area_colors = ['#192f85', '#3c64d0'];
        break;
      case 'preset-6':
        this.preset = ['#a63a00', '#f27013', '#00A854'];
        this.customs_color = ['#a63a00', '#f27013', '#00A854', '#F04134'];
        this.pie_color = ['#a63a00', '#f27013', '#00A854', '#F04134', '#FFBF00'];
        this.line_colors = ['#a63a00'];
        this.area_colors = ['#a63a00', '#f27013'];
        break;
      case 'preset-7':
        this.preset = ['#0e5563', '#2aa1af', '#00A854'];
        this.customs_color = ['#0e5563', '#2aa1af', '#00A854', '#F04134'];
        this.pie_color = ['#0e5563', '#2aa1af', '#00A854', '#F04134', '#FFBF00'];
        this.line_colors = ['#0e5563'];
        this.area_colors = ['#0e5563', '#2aa1af'];
        break;
      case 'preset-8':
        this.preset = ['#005c34', '#00a854', '#00A854'];
        this.customs_color = ['#005c34', '#00a854', '#00A854', '#F04134'];
        this.pie_color = ['#005c34', '#00a854', '#00A854', '#F04134', '#FFBF00'];
        this.line_colors = ['#005c34'];
        this.area_colors = ['#005c34', '#00a854'];
        break;
      case 'preset-9':
        this.preset = ['#009688', '#004a47', '#00A854'];
        this.customs_color = ['#009688', '#004a47', '#00A854', '#F04134'];
        this.pie_color = ['#009688', '#004a47', '#00A854', '#F04134', '#FFBF00'];
        this.line_colors = ['#009688'];
        this.area_colors = ['#009688', '#004a47'];
        break;
    }
  }

  private rerenderChartOnContainerResize(isBox: boolean) {
    const charts = [
      this.barChart,
      this.bubbleChart,
      this.bubble3DChart,
      this.scatterChart,
      this.scatterDateTimeChart,
      this.heatmapChart,
      this.heatmapRoundedChart,
      this.lineAreaChart,
      this.candlestickChart,
      this.barStackedChart,
      this.barHorizontalChart,
      this.barHStackChart,
      this.pieChart,
      this.donutChart,
      this.radialChart,
      this.customsAngleChart,
      this.lineChart,
      this.realTimeChart,
      this.areaChart,
      this.dateTimeChart,
      this.mixedChart
    ];
    charts.forEach((chart, index) => {
      const chartClone = { ...chart.chart };
      chartClone.redrawOnWindowResize = !isBox;
      charts[index] = { ...chart, chart: chartClone } as ApexOptions;
    });

    [
      this.barChart,
      this.bubbleChart,
      this.bubble3DChart,
      this.scatterChart,
      this.scatterDateTimeChart,
      this.heatmapChart,
      this.heatmapRoundedChart,
      this.lineAreaChart,
      this.candlestickChart,
      this.barStackedChart,
      this.barHorizontalChart,
      this.barHStackChart,
      this.pieChart,
      this.donutChart,
      this.radialChart,
      this.customsAngleChart,
      this.lineChart,
      this.realTimeChart,
      this.areaChart,
      this.dateTimeChart,
      this.mixedChart
    ] = charts;
  }
}
