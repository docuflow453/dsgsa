// angular import
import { Component, OnInit, effect, inject } from '@angular/core';

// icons
import { IconService } from '@ant-design/icons-angular';
import { ArrowDownOutline, ArrowUpOutline, MoreOutline } from '@ant-design/icons-angular/icons';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ThemeService } from 'src/app/theme/shared/service/customs-theme.service';

// apexChart
import { NgApexchartsModule, ApexOptions } from 'ng-apexcharts';

@Component({
  selector: 'app-invites-goal-chart',
  imports: [SharedModule, NgApexchartsModule],
  templateUrl: './invites-goal-chart.component.html',
  styleUrl: './invites-goal-chart.component.scss'
})
export class InvitesGoalChartComponent implements OnInit {
  private iconService = inject(IconService);
  private themeService = inject(ThemeService);

  // public props
  chartOptions!: Partial<ApexOptions>;

  // constructor
  constructor() {
    this.iconService.addIcon(...[MoreOutline, ArrowUpOutline, ArrowDownOutline]);
    effect(() => {
      this.updateThemeColor(this.themeService.customsTheme());
    });
  }

  // life cycle
  ngOnInit(): void {
    this.chartOptions = {
      series: [76],
      chart: {
        type: 'radialBar',
        height: '345px',
        offsetY: -20,
        sparkline: {
          enabled: true
        }
      },
      colors: ['#1677ff'],
      plotOptions: {
        radialBar: {
          startAngle: -95,
          endAngle: 95,
          hollow: {
            margin: 15,
            size: '50%'
          },
          track: {
            background: '#eaeaea',
            strokeWidth: '97%',
            margin: 20
          },
          dataLabels: {
            name: {
              show: false
            },
            value: {
              offsetY: 0,
              fontSize: '20px'
            }
          }
        }
      },
      grid: {
        padding: {
          top: 10
        }
      },
      stroke: {
        lineCap: 'round'
      }
    };
  }

  // private methods
  private updateThemeColor(theme: string) {
    switch (theme) {
      case 'preset-1':
      default:
        this.chartOptions.colors = ['#1677ff'];
        break;
      case 'preset-2':
        this.chartOptions.colors = ['#3366FF'];
        break;
      case 'preset-3':
        this.chartOptions.colors = ['#7265E6'];
        break;
      case 'preset-4':
        this.chartOptions.colors = ['#068e44'];
        break;
      case 'preset-5':
        this.chartOptions.colors = ['#3c64d0'];
        break;
      case 'preset-6':
        this.chartOptions.colors = ['#f27013'];
        break;
      case 'preset-7':
        this.chartOptions.colors = ['#2aa1af'];
        break;
      case 'preset-8':
        this.chartOptions.colors = ['#00a854'];
        break;
      case 'preset-9':
        this.chartOptions.colors = ['#009688'];
        break;
    }
  }
}
