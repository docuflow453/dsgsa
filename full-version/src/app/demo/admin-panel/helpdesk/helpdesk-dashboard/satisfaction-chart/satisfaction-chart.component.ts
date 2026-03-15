// angular import
import { Component, OnInit, effect, inject } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ThemeService } from 'src/app/theme/shared/service/customs-theme.service';

// third party
import { NgApexchartsModule, ApexOptions } from 'ng-apexcharts';

@Component({
  selector: 'app-satisfaction-chart',
  imports: [SharedModule, NgApexchartsModule],
  templateUrl: './satisfaction-chart.component.html',
  styleUrl: './satisfaction-chart.component.scss'
})
export class SatisfactionChartComponent implements OnInit {
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
        height: 260,
        type: 'pie'
      },
      series: [66, 50, 40, 30],
      labels: ['Very Poor', 'Satisfied', 'Very Satisfied', 'Poor'],
      legend: {
        show: true,
        offsetY: 50
      },
      theme: {
        monochrome: {
          enabled: true,
          color: '#f27013'
        }
      },
      responsive: [
        {
          breakpoint: 768,
          options: {
            chart: {
              height: 320
            },
            legend: {
              position: 'bottom',
              offsetY: 0
            }
          }
        }
      ]
    };
  }

  private updateThemeColor(theme: string) {
    const monochrome = { ...this.chartOptions.theme?.monochrome };
    switch (theme) {
      case 'preset-1':
      default:
        monochrome.color = '#1677ff';
        break;
      case 'preset-2':
        monochrome.color = '#3366FF';
        break;
      case 'preset-3':
        monochrome.color = '#7265E6';
        break;
      case 'preset-4':
        monochrome.color = '#068e44';
        break;
      case 'preset-5':
        monochrome.color = '#3c64d0';
        break;
      case 'preset-6':
        monochrome.color = '#f27013';
        break;
      case 'preset-7':
        monochrome.color = '#2aa1af';
        break;
      case 'preset-8':
        monochrome.color = '#00a854';
        break;
      case 'preset-9':
        monochrome.color = '#009688';
        break;
    }
    this.chartOptions.theme = { monochrome };
  }
}
