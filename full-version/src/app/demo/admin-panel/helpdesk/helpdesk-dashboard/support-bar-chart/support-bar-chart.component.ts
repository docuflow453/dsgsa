// angular import
import { Component, OnInit, effect, input, inject } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ThemeService } from 'src/app/theme/shared/service/customs-theme.service';

// third party
import { NgApexchartsModule, ApexOptions } from 'ng-apexcharts';

@Component({
  selector: 'app-support-bar-chart',
  imports: [SharedModule, NgApexchartsModule],
  templateUrl: './support-bar-chart.component.html',
  styleUrl: './support-bar-chart.component.scss'
})
export class SupportBarChartComponent implements OnInit {
  private themeService = inject(ThemeService);

  // public props
  chartOptions!: Partial<ApexOptions>;
  themeRTL!: boolean;

  readonly value = input.required<number>();
  readonly typeRequest = input.required<string>();
  readonly inputColor = input.required<string>();
  readonly backgroundColor = input.required<string>();
  readonly openValue = input.required<number>();
  readonly runningValue = input.required<number>();
  readonly solvedValue = input.required<number>();
  readonly chartColor = input.required<string[]>();

  // constructor
  constructor() {
    effect(() => {
      this.isDarkTheme(this.themeService.isDarkMode());
      this.isRtlTheme(this.themeService.isRTLMode());
    });
  }

  // life cycle hook
  ngOnInit() {
    this.chartOptions = {
      chart: {
        type: 'area',
        height: 100,
        sparkline: {
          enabled: true
        }
      },
      dataLabels: {
        enabled: false
      },
      colors: this.chartColor(),
      stroke: {
        curve: 'smooth',
        width: 2
      },
      series: [
        {
          name: 'series1',
          data: [0, 20, 10, 45, 30, 55, 20, 30, 0]
        }
      ],
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

  // private method
  private isDarkTheme(isDark: boolean) {
    const tooltipTheme = isDark === true ? 'dark' : 'light';
    const tooltip = { theme: tooltipTheme };
    this.chartOptions = { ...this.chartOptions, tooltip };
  }

  private isRtlTheme(isRtl: boolean) {
    this.themeRTL = isRtl;
  }
}
