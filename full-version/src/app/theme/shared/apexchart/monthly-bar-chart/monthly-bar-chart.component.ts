// angular import
import { Component, OnInit, effect, inject } from '@angular/core';

// project import
import { SharedModule } from '../../shared.module';
import { ThemeService } from '../../service/customs-theme.service';

// third party
import { NgApexchartsModule, ApexOptions } from 'ng-apexcharts';

@Component({
  selector: 'app-monthly-bar-chart',
  imports: [SharedModule, NgApexchartsModule],
  templateUrl: './monthly-bar-chart.component.html',
  styleUrl: './monthly-bar-chart.component.scss'
})
export class MonthlyBarChartComponent implements OnInit {
  private themeService = inject(ThemeService);

  // public props
  chartOptions!: ApexOptions;

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
    document.querySelector('.chart-income.week')?.classList.add('active');
    this.chartOptions = {
      chart: {
        height: 450,
        type: 'area',
        toolbar: {
          show: false
        },
        background: 'transparent'
      },
      dataLabels: {
        enabled: false
      },
      colors: ['#1677ff', '#0050b3'],
      series: [
        {
          name: 'Page Views',
          data: [0, 86, 28, 115, 48, 210, 136]
        },
        {
          name: 'Sessions',
          data: [0, 43, 14, 56, 24, 105, 68]
        }
      ],
      stroke: {
        curve: 'smooth',
        width: 2
      },
      xaxis: {
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        labels: {
          style: {
            colors: [
              '#8c8c8c',
              '#8c8c8c',
              '#8c8c8c',
              '#8c8c8c',
              '#8c8c8c',
              '#8c8c8c',
              '#8c8c8c',
              '#8c8c8c',
              '#8c8c8c',
              '#8c8c8c',
              '#8c8c8c',
              '#8c8c8c'
            ]
          }
        },
        axisBorder: {
          show: true,
          color: '#f0f0f0'
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: ['#8c8c8c']
          }
        }
      },
      grid: {
        strokeDashArray: 0,
        borderColor: '#f5f5f5'
      },
      theme: {
        mode: 'light'
      }
    };
  }

  private updateThemeColor(theme: string) {
    switch (theme) {
      case 'preset-1':
      default:
        this.chartOptions.colors = ['#1677ff', '#0050b3'];
        break;
      case 'preset-2':
        this.chartOptions.colors = ['#3366FF', '#1939B7'];
        break;
      case 'preset-3':
        this.chartOptions.colors = ['#7265E6', '#5F53DF'];
        break;
      case 'preset-4':
        this.chartOptions.colors = ['#068e44', '#004222'];
        break;
      case 'preset-5':
        this.chartOptions.colors = ['#3c64d0', '#192f85'];
        break;
      case 'preset-6':
        this.chartOptions.colors = ['#f27013', '#a63a00'];
        break;
      case 'preset-7':
        this.chartOptions.colors = ['#2aa1af', '#0e5563'];
        break;
      case 'preset-8':
        this.chartOptions.colors = ['#00a854', '#005c34'];
        break;
      case 'preset-9':
        this.chartOptions.colors = ['#009688', '#004a47'];
        break;
    }
  }

  private rerenderChartOnContainerResize(isContainer: boolean) {
    const chart = { ...this.chartOptions.chart };
    chart.redrawOnParentResize = !isContainer;
    this.chartOptions = { ...this.chartOptions, chart } as ApexOptions;
  }

  private isDarkTheme(isDark: boolean) {
    const theme = { ...this.chartOptions.theme };
    const grid = { ...this.chartOptions.grid };
    theme.mode = isDark === true ? 'dark' : 'light';
    grid.borderColor = isDark === true ? '#fafafa0d' : '#f5f5f5';
    this.chartOptions = { ...this.chartOptions, theme, grid };
  }

  // public method
  toggleActive(value: string) {
    this.chartOptions.series = [
      {
        name: 'Page Views',
        data: value === 'month' ? [76, 85, 101, 98, 87, 105, 91, 114, 94, 86, 115, 35] : [31, 40, 28, 51, 42, 109, 100]
      },
      {
        name: 'Sessions',
        data: value === 'month' ? [110, 60, 150, 35, 60, 36, 26, 45, 65, 52, 53, 41] : [11, 32, 45, 32, 34, 52, 41]
      }
    ];
    const xaxis = { ...this.chartOptions.xaxis };
    xaxis.categories =
      value === 'month'
        ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    xaxis.tickAmount = value === 'month' ? 11 : 7;
    this.chartOptions = { ...this.chartOptions, xaxis };
    if (value === 'month') {
      document.querySelector('.chart-income.month')?.classList.add('active');
      document.querySelector('.chart-income.week')?.classList.remove('active');
    } else {
      document.querySelector('.chart-income.week')?.classList.add('active');
      document.querySelector('.chart-income.month')?.classList.remove('active');
    }
  }
}
