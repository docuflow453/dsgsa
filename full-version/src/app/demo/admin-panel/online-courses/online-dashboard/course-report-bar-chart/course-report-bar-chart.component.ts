// angular project
import { Component, effect, OnInit, inject } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ThemeService } from 'src/app/theme/shared/service/customs-theme.service';

// third party
import { NgApexchartsModule, ApexOptions } from 'ng-apexcharts';

@Component({
  selector: 'app-course-report-bar-chart',
  imports: [SharedModule, NgApexchartsModule],
  templateUrl: './course-report-bar-chart.component.html',
  styleUrl: './course-report-bar-chart.component.scss'
})
export class CourseReportBarChartComponent implements OnInit {
  private themeService = inject(ThemeService);

  // public props
  chartOptions!: Partial<ApexOptions>;
  themeColors = ['#1677ff', '#faad14'];

  // constructor
  constructor() {
    effect(() => {
      this.updateThemeColor(this.themeService.customsTheme());
      this.isDarkTheme(this.themeService.isDarkMode());
    });
  }

  // life cycle hook
  ngOnInit(): void {
    this.chartOptions = {
      chart: {
        type: 'bar',
        height: '190px',
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          columnWidth: '50%',
          borderRadius: 3
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
          offsetX: 2,
          offsetY: 2
        },
        itemMargin: {
          horizontal: 15,
          vertical: 5
        }
      },
      colors: this.themeColors,
      series: [
        {
          name: 'Net Profit',
          data: [180, 90, 135, 114, 120, 145, 180, 90, 135, 114, 120, 145]
        },
        {
          name: 'Revenue',
          data: [120, 45, 78, 150, 168, 99, 120, 45, 78, 150, 168, 99]
        }
      ],
      grid: {
        borderColor: '#00000010'
      },
      yaxis: {
        show: false
      }
    };
  }

  // private methods
  private updateThemeColor(theme: string) {
    switch (theme) {
      case 'preset-1':
      default:
        this.themeColors = ['#1677ff', '#faad14'];
        break;
      case 'preset-2':
        this.themeColors = ['#3366FF', '#faad14'];
        break;
      case 'preset-3':
        this.themeColors = ['#7265E6', '#faad14'];
        break;
      case 'preset-4':
        this.themeColors = ['#068e44', '#faad14'];
        break;
      case 'preset-5':
        this.themeColors = ['#3c64d0', '#faad14'];
        break;
      case 'preset-6':
        this.themeColors = ['#f27013', '#faad14'];
        break;
      case 'preset-7':
        this.themeColors = ['#2aa1af', '#faad14'];
        break;
      case 'preset-8':
        this.themeColors = ['#00a854', '#faad14'];
        break;
      case 'preset-9':
        this.themeColors = ['#009688', '#faad14'];
        break;
    }
    this.chartOptions = { ...this.chartOptions, colors: this.themeColors };
  }

  private isDarkTheme(isDark: boolean) {
    const tooltip = { ...this.chartOptions.tooltip };
    tooltip.theme = isDark === true ? 'dark' : 'light';
    this.chartOptions = { ...this.chartOptions, tooltip };
  }
}
