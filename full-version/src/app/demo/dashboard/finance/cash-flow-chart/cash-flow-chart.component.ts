// angular import
import { Component, OnInit, effect, inject } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ThemeService } from 'src/app/theme/shared/service/customs-theme.service';

// third party
import { NgApexchartsModule, ApexOptions } from 'ng-apexcharts';

@Component({
  selector: 'app-cash-flow-chart',
  imports: [SharedModule, NgApexchartsModule],
  templateUrl: './cash-flow-chart.component.html',
  styleUrl: './cash-flow-chart.component.scss'
})
export class CashFlowChartComponent implements OnInit {
  private themeService = inject(ThemeService);

  // public props
  chartOptions!: ApexOptions;
  selectType = 'month';

  // constructor
  constructor() {
    effect(() => {
      this.updateThemeColor(this.themeService.customsTheme());
      this.isDarkTheme(this.themeService.isDarkMode());
      this.rerenderChartOnContainerResize(this.themeService.isContainerMode());
    });
  }

  // life cycle hook
  ngOnInit() {
    this.chartOptions = {
      chart: {
        type: 'bar',
        height: 225,
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          columnWidth: '70%',
          borderRadius: 2
        }
      },
      stroke: {
        show: true,
        width: 3,
        colors: ['transparent']
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        show: true,
        fontFamily: `'Public Sans', sans-serif`,
        offsetX: 10,
        offsetY: 10,
        labels: {
          useSeriesColors: false
        },
        markers: {
          // shape: 'circle',
          offsetX: 2,
          offsetY: 2
        },
        itemMargin: {
          horizontal: 15,
          vertical: 5
        }
      },
      colors: ['#1677ff', '#1677ff66'],
      series: [
        {
          name: 'Income',
          data: [180, 90, 135, 114, 120, 145, 180, 90]
        },
        {
          name: 'Expends',
          data: [120, 45, 78, 150, 168, 99, 120, 45]
        }
      ],
      grid: {
        show: true,
        borderColor: '#f0f0f0'
      },
      yaxis: {
        show: true
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']
      },
      tooltip: {
        theme: 'light',
        y: {
          formatter: function (val) {
            return '$ ' + val;
          }
        }
      }
    };
  }

  // private methods
  private isDarkTheme(isDark: boolean) {
    const tooltip = { ...this.chartOptions.tooltip };
    const grid = { ...this.chartOptions.grid };
    tooltip.theme = isDark ? 'dark' : 'light';
    grid.borderColor = isDark === true ? '#fafafa0d' : '#f5f5f5';
    this.chartOptions = { ...this.chartOptions, tooltip, grid };
  }

  private updateThemeColor(theme: string) {
    switch (theme) {
      case 'preset-1':
      default:
        this.chartOptions.colors = ['#1677ff', '#1677ff66'];
        break;
      case 'preset-2':
        this.chartOptions.colors = ['#3366FF', '#3366FF66'];
        break;
      case 'preset-3':
        this.chartOptions.colors = ['#7265E6', '#7265E666'];
        break;
      case 'preset-4':
        this.chartOptions.colors = ['#068e44', '#068e4466'];
        break;
      case 'preset-5':
        this.chartOptions.colors = ['#3c64d0', '#3c64d066'];
        break;
      case 'preset-6':
        this.chartOptions.colors = ['#f27013', '#f2701366'];
        break;
      case 'preset-7':
        this.chartOptions.colors = ['#2aa1af', '#2aa1af66'];
        break;
      case 'preset-8':
        this.chartOptions.colors = ['#00a854', '#00a85466'];
        break;
      case 'preset-9':
        this.chartOptions.colors = ['#009688', '#00968866'];
        break;
    }
  }

  private rerenderChartOnContainerResize(isContainer: boolean) {
    const chart = { ...this.chartOptions.chart };
    chart!.redrawOnParentResize = !isContainer;
    this.chartOptions = { ...this.chartOptions, chart } as ApexOptions;
  }

  // public methods
  onOptionSelected() {
    switch (this.selectType) {
      case 'today':
        this.chartOptions.series = [
          {
            name: 'Income',
            data: [90, 135, 114, 120, 145, 180, 180, 90, 145, 180, 90, 135]
          },
          {
            name: 'Expends',
            data: [150, 168, 99, 120, 45, 78, 150, 168, 78, 150, 168, 99]
          }
        ];
        break;
      case 'week':
        this.chartOptions.series = [
          {
            name: 'Income',
            data: [145, 180, 90, 114, 120, 145, 114, 120, 145, 114, 120, 145]
          },
          {
            name: 'Expends',
            data: [150, 168, 99, 150, 120, 45, 78, 45, 78, 150, 168, 99]
          }
        ];
        break;
      case 'month':
        this.chartOptions.series = [
          {
            name: 'Income',
            data: [180, 90, 135, 114, 120, 145, 180, 90, 135, 114, 120, 145]
          },
          {
            name: 'Expends',
            data: [120, 45, 78, 150, 168, 99, 120, 45, 78, 150, 168, 99]
          }
        ];
        break;
    }
  }
}
