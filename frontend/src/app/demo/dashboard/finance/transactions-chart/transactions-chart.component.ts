// Angular import
import { Component, OnInit, effect, input, inject } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ThemeService } from 'src/app/theme/shared/service/customs-theme.service';

// icons
import { IconService } from '@ant-design/icons-angular';
import { MoreOutline, PlusOutline } from '@ant-design/icons-angular/icons';

// third party
import { NgApexchartsModule, ApexOptions } from 'ng-apexcharts';

@Component({
  selector: 'app-transactions-chart',
  imports: [SharedModule, NgApexchartsModule],
  templateUrl: './transactions-chart.component.html',
  styleUrl: './transactions-chart.component.scss'
})
export class TransactionsChartComponent implements OnInit {
  private iconService = inject(IconService);
  private themeService = inject(ThemeService);

  // public props
  chartOptions!: ApexOptions;

  readonly seriesData = input.required<[]>();
  readonly colors = input.required<string[]>();

  // constructor
  constructor() {
    this.iconService.addIcon(...[MoreOutline, PlusOutline]);
    effect(() => {
      this.isDarkTheme(this.themeService.isDarkMode());
      this.rerenderChartOnContainerResize(this.themeService.isContainerMode());
    });
  }

  // life cycle hook
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
      colors: this.colors(),
      stroke: {
        curve: 'straight',
        lineCap: 'round',
        width: 3
      },
      series: [
        {
          name: 'series1',
          data: this.seriesData()
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
    tooltip.theme = isDark ? 'dark' : 'light';
    this.chartOptions = { ...this.chartOptions, tooltip };
  }

  private rerenderChartOnContainerResize(isContainer: boolean) {
    const chart = { ...this.chartOptions.chart };
    chart!.redrawOnParentResize = !isContainer;
    this.chartOptions = { ...this.chartOptions, chart } as ApexOptions;
  }
}
