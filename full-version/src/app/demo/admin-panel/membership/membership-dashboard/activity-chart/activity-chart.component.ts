// angular import
import { Component, OnInit, effect, inject } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ThemeService } from 'src/app/theme/shared/service/customs-theme.service';

// apexChart
import { NgApexchartsModule, ApexOptions } from 'ng-apexcharts';

@Component({
  selector: 'app-activity-chart',
  imports: [SharedModule, NgApexchartsModule],
  templateUrl: './activity-chart.component.html',
  styleUrl: './activity-chart.component.scss'
})
export class ActivityChartComponent implements OnInit {
  private themeService = inject(ThemeService);

  // public props
  chartOptions!: Partial<ApexOptions>;
  selectType: string = 'today';

  // constructor
  constructor() {
    effect(() => {
      this.isDarkTheme(this.themeService.isDarkMode());
    });
  }

  // life cycle hook
  ngOnInit(): void {
    this.chartOptions = {
      chart: {
        type: 'line',
        height: 150,
        toolbar: {
          show: false
        }
      },
      colors: ['#52c41a', '#CAEDB9'],
      dataLabels: {
        enabled: false
      },
      legend: {
        show: true,
        position: 'top'
      },
      markers: {
        size: 1,
        colors: ['#fff', '#fff'],
        strokeColors: ['#52c41a', '#CAEDB9'],
        strokeWidth: 1,
        shape: 'circle',
        hover: {
          size: 4
        }
      },
      stroke: {
        width: 3,
        curve: 'smooth'
      },
      grid: {
        show: false
      },
      series: [
        {
          name: 'Active',
          data: [20, 90, 65, 85, 20, 80, 30, 60, 90, 65, 85, 20]
        },
        {
          name: 'Inactive',
          data: [70, 30, 40, 15, 60, 40, 95, 45, 30, 40, 15, 60]
        }
      ],
      xaxis: {
        labels: {
          hideOverlappingLabels: true
        },
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      tooltip: {
        theme: 'light'
      }
    };
  }

  // private methods
  private isDarkTheme(isDark: boolean) {
    const tooltipTheme = isDark === true ? 'dark' : 'light';
    const tooltip = { theme: tooltipTheme };
    this.chartOptions = { ...this.chartOptions, tooltip };
  }

  // public methods
  onOptionSelected() {
    this.updateChartOptions();
  }

  updateChartOptions() {
    switch (this.selectType) {
      case 'today':
        this.chartOptions.series = [
          {
            name: 'Active',
            data: [20, 90, 65, 85, 20, 80, 30, 60, 90, 65, 85, 20]
          },
          {
            name: 'Inactive',
            data: [70, 30, 40, 15, 60, 40, 95, 45, 30, 40, 15, 60]
          }
        ];
        break;
      case 'month':
        this.chartOptions.series = [
          {
            name: 'Active',
            data: [70, 30, 40, 15, 60, 40, 95, 45, 30, 40, 15, 60]
          },
          {
            name: 'Inactive',
            data: [20, 90, 65, 85, 20, 80, 30, 60, 90, 65, 85, 20]
          }
        ];
        break;
      case 'week':
        this.chartOptions.series = [
          {
            name: 'Active',
            data: [20, 90, 15, 60, 40, 80, 30, 60, 90, 65, 85, 20]
          },
          {
            name: 'Inactive',
            data: [70, 20, 90, 65, 60, 40, 95, 45, 30, 40, 15, 60]
          }
        ];
        break;
    }
  }
}
