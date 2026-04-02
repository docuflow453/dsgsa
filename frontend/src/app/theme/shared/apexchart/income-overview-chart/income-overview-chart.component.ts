// angular import
import { Component, OnInit, effect, inject } from '@angular/core';

// project import
import { SharedModule } from '../../shared.module';
import { ThemeService } from '../../service/customs-theme.service';

// third party
import { NgApexchartsModule, ApexOptions } from 'ng-apexcharts';

@Component({
  selector: 'app-income-overview-chart',
  imports: [SharedModule, NgApexchartsModule],
  templateUrl: './income-overview-chart.component.html',
  styleUrl: './income-overview-chart.component.scss'
})
export class IncomeOverviewChartComponent implements OnInit {
  private themeService = inject(ThemeService);

  // public props
  chartOptions!: ApexOptions;

  // constructor
  constructor() {
    effect(() => {
      this.updateThemeColor(this.themeService.customsTheme());
      this.rerenderChartOnContainerResize(this.themeService.isContainerMode());
      this.isDarkTheme(this.themeService.isDarkMode());
    });
  }

  // life cycle hook
  ngOnInit() {
    this.chartOptions = {
      chart: {
        type: 'bar',
        height: 365,
        toolbar: {
          show: false
        },
        background: 'transparent'
      },
      plotOptions: {
        bar: {
          columnWidth: '45%',
          borderRadius: 4
        }
      },
      dataLabels: {
        enabled: false
      },
      series: [
        {
          data: [80, 95, 70, 42, 65, 55, 78]
        }
      ],
      stroke: {
        curve: 'smooth',
        width: 2
      },
      xaxis: {
        categories: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        labels: {
          style: {
            colors: ['#8c8c8c', '#8c8c8c', '#8c8c8c', '#8c8c8c', '#8c8c8c', '#8c8c8c', '#8c8c8c']
          }
        }
      },
      yaxis: {
        show: false
      },
      colors: ['#5cdbd3'],
      grid: {
        show: false
      },
      tooltip: {
        theme: 'light'
      }
    };
  }

  // private method
  private updateThemeColor(theme: string) {
    switch (theme) {
      case 'preset-1':
      default:
        this.chartOptions.colors = ['#5cdbd3'];
        break;
      case 'preset-2':
        this.chartOptions.colors = ['#7EB9FF'];
        break;
      case 'preset-3':
        this.chartOptions.colors = ['#26B0BA'];
        break;
      case 'preset-4':
        this.chartOptions.colors = ['#26B0BA'];
        break;
      case 'preset-5':
        this.chartOptions.colors = ['#26B0BA'];
        break;
      case 'preset-6':
        this.chartOptions.colors = ['#26B0BA'];
        break;
      case 'preset-7':
        this.chartOptions.colors = ['#26B0BA'];
        break;
      case 'preset-8':
        this.chartOptions.colors = ['#26B0BA'];
        break;
      case 'preset-9':
        this.chartOptions.colors = ['#26B0BA'];
        break;
    }
  }

  private rerenderChartOnContainerResize(isContainer: boolean) {
    const chart = { ...this.chartOptions.chart };
    chart.redrawOnParentResize = !isContainer;
    this.chartOptions = { ...this.chartOptions, chart } as ApexOptions;
  }

  private isDarkTheme(isDark: boolean) {
    const tooltip = { ...this.chartOptions.tooltip };
    tooltip.theme = isDark === true ? 'dark' : 'light';
    this.chartOptions = { ...this.chartOptions, tooltip };
  }
}
