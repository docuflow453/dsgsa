// angular project
import { Component, OnInit, effect, input, inject } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ThemeService } from 'src/app/theme/shared/service/customs-theme.service';

// third party
import { NgApexchartsModule, ApexOptions } from 'ng-apexcharts';

@Component({
  selector: 'app-total-revenue-line-chart',
  imports: [SharedModule, NgApexchartsModule],
  templateUrl: './total-revenue-line-chart.component.html',
  styleUrl: './total-revenue-line-chart.component.scss'
})
export class TotalRevenueLineChartComponent implements OnInit {
  private themeService = inject(ThemeService);

  // public props
  chartOptions!: Partial<ApexOptions>;
  readonly values = input.required<[]>();
  readonly color = input.required<string[]>();

  // constructor
  constructor() {
    effect(() => {
      this.isDarkTheme(this.themeService.isDarkMode());
    });
  }

  // life cycle
  ngOnInit() {
    this.chartOptions = {
      chart: {
        type: 'line',
        height: 60,
        sparkline: {
          enabled: true
        }
      },
      dataLabels: {
        enabled: false
      },
      colors: this.color(),
      stroke: {
        curve: 'straight',
        lineCap: 'round',
        width: 3
      },
      series: [
        {
          name: 'series1',
          data: this.values()
        }
      ],
      yaxis: {
        min: 0,
        max: 30
      },
      tooltip: {
        theme: 'light',
        fixed: {
          enabled: false
        },
        x: {
          show: false
        },
        marker: {
          show: false
        }
      }
    };
  }

  // private methods
  private isDarkTheme(isDark: boolean) {
    const tooltip = { ...this.chartOptions.tooltip };
    tooltip.theme = isDark === true ? 'dark' : 'light';
    this.chartOptions = { ...this.chartOptions, tooltip };
  }
}
