// angular project
import { Component, OnInit, effect, inject } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ThemeService } from 'src/app/theme/shared/service/customs-theme.service';

// third party
import { NgApexchartsModule, ApexOptions } from 'ng-apexcharts';

@Component({
  selector: 'app-student-states-chart',
  imports: [SharedModule, NgApexchartsModule],
  templateUrl: './student-states-chart.component.html',
  styleUrl: './student-states-chart.component.scss'
})
export class StudentStatesChartComponent implements OnInit {
  private themeService = inject(ThemeService);

  // public props
  chartOptions!: Partial<ApexOptions>;

  // constructor
  constructor() {
    effect(() => {
      this.updateThemeColor(this.themeService.customsTheme());
    });
  }

  // life cycle
  ngOnInit() {
    this.chartOptions = {
      chart: {
        height: 275,
        type: 'donut'
      },
      dataLabels: {
        enabled: false
      },
      plotOptions: {
        pie: {
          donut: {
            size: '65%'
          }
        }
      },
      labels: ['Total Signups', 'Active Student'],
      series: [76.7, 30],
      legend: {
        show: true,
        position: 'bottom'
      },
      fill: {
        opacity: [1, 0.5]
      },
      colors: ['#1677ff', '#1677ff']
    };
  }

  // private methods
  private updateThemeColor(theme: string) {
    switch (theme) {
      case 'preset-1':
      default:
        this.chartOptions.colors = ['#1677ff', '#1677ff'];
        break;
      case 'preset-2':
        this.chartOptions.colors = ['#3366FF', '#3366FF'];
        break;
      case 'preset-3':
        this.chartOptions.colors = ['#7265E6', '#7265E6'];
        break;
      case 'preset-4':
        this.chartOptions.colors = ['#068e44', '#068e44'];
        break;
      case 'preset-5':
        this.chartOptions.colors = ['#3c64d0', '#3c64d0'];
        break;
      case 'preset-6':
        this.chartOptions.colors = ['#f27013', '#f27013'];
        break;
      case 'preset-7':
        this.chartOptions.colors = ['#2aa1af', '#2aa1af'];
        break;
      case 'preset-8':
        this.chartOptions.colors = ['#00a854', '#00a854'];
        break;
      case 'preset-9':
        this.chartOptions.colors = ['#009688', '#009688'];
        break;
    }
  }
}
