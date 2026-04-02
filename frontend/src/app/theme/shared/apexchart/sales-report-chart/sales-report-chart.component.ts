// angular import
import { Component, effect, inject } from '@angular/core';

// project import
import { SharedModule } from '../../shared.module';
import { ThemeService } from '../../service/customs-theme.service';

// third party
import { NgApexchartsModule, ApexOptions } from 'ng-apexcharts';

@Component({
  selector: 'app-sales-report-chart',
  imports: [SharedModule, NgApexchartsModule],
  templateUrl: './sales-report-chart.component.html',
  styleUrl: './sales-report-chart.component.scss'
})
export class SalesReportChartComponent {
  private themeService = inject(ThemeService);

  // public props
  chartOptions!: ApexOptions;

  // constructor
  constructor() {
    this.chartOptions = {
      chart: {
        type: 'bar',
        height: 430,
        toolbar: {
          show: false
        },
        background: 'transparent'
      },
      plotOptions: {
        bar: {
          columnWidth: '30%',
          borderRadius: 4
        }
      },
      stroke: {
        show: true,
        width: 8,
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
        itemMargin: {
          horizontal: 15,
          vertical: 5
        }
      },
      series: [
        {
          name: 'Net Profit',
          data: [180, 90, 135, 114, 120, 145]
        },
        {
          name: 'Revenue',
          data: [120, 45, 78, 150, 168, 99]
        }
      ],
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        labels: {
          style: {
            colors: ['#8C8C8C', '#8C8C8C', '#8C8C8C', '#8C8C8C', '#8C8C8C', '#8C8C8C']
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: ['#8C8C8C']
          }
        }
      },
      tooltip: {
        theme: 'light'
      },
      colors: ['#faad14', '#1677ff'],
      grid: {
        borderColor: '#f5f5f5'
      }
    };
    effect(() => {
      this.updateThemeColor(this.themeService.customsTheme());
      this.rerenderChartOnContainerResize(this.themeService.isContainerMode());
      this.isDarkTheme(this.themeService.isDarkMode());
    });
  }

  // private method
  private updateThemeColor(theme: string) {
    switch (theme) {
      case 'preset-1':
      default:
        this.chartOptions.colors = ['#faad14', '#1677ff'];
        break;
      case 'preset-2':
        this.chartOptions.colors = ['#faad14', '#3366FF'];
        break;
      case 'preset-3':
        this.chartOptions.colors = ['#faad14', '#7265E6'];
        break;
      case 'preset-4':
        this.chartOptions.colors = ['#faad14', '#068e44'];
        break;
      case 'preset-5':
        this.chartOptions.colors = ['#faad14', '#3c64d0'];
        break;
      case 'preset-6':
        this.chartOptions.colors = ['#faad14', '#f27013'];
        break;
      case 'preset-7':
        this.chartOptions.colors = ['#faad14', '#2aa1af'];
        break;
      case 'preset-8':
        this.chartOptions.colors = ['#faad14', '#00a854'];
        break;
      case 'preset-9':
        this.chartOptions.colors = ['#faad14', '#009688'];
        break;
    }
  }

  private isDarkTheme(isDark: boolean) {
    const tooltip = { ...this.chartOptions.tooltip };
    const grid = { ...this.chartOptions.grid };
    tooltip.theme = isDark === true ? 'dark' : 'light';
    grid.borderColor = isDark === true ? '#fafafa0d' : '#f5f5f5';
    this.chartOptions = { ...this.chartOptions, tooltip, grid };
  }

  private rerenderChartOnContainerResize(isContainer: boolean) {
    const chart = { ...this.chartOptions.chart };
    chart.redrawOnParentResize = !isContainer;
    this.chartOptions = { ...this.chartOptions, chart } as ApexOptions;
  }
}
