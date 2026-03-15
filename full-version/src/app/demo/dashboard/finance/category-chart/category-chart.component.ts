// angular import
import { Component, effect, inject } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ThemeService } from 'src/app/theme/shared/service/customs-theme.service';

// third party
import { NgApexchartsModule, ApexOptions } from 'ng-apexcharts';

// icons
import { IconService } from '@ant-design/icons-angular';
import { MoreOutline } from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-category-chart',
  imports: [SharedModule, NgApexchartsModule],
  templateUrl: './category-chart.component.html',
  styleUrl: './category-chart.component.scss'
})
export class CategoryChartComponent {
  private iconService = inject(IconService);
  private themeService = inject(ThemeService);

  // public props
  chartOptions!: ApexOptions;

  // constructor
  constructor() {
    this.iconService.addIcon(...[MoreOutline]);

    this.chartOptions = {
      chart: {
        height: 300,
        type: 'donut'
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        show: true,
        position: 'bottom'
      },
      plotOptions: {
        pie: {
          donut: {
            size: '65%'
          }
        }
      },
      labels: ['Saving', 'Spend', 'Income'],
      series: [25, 50, 25],
      colors: ['#141414', '#1677ff', '#52c41a']
    };
    effect(() => {
      this.rerenderChartOnContainerResize(this.themeService.isContainerMode());
    });
  }

  // private methods
  private rerenderChartOnContainerResize(isContainer: boolean) {
    const chart = { ...this.chartOptions.chart };
    chart!.redrawOnParentResize = !isContainer;
    this.chartOptions = { ...this.chartOptions, chart } as ApexOptions;
  }
}
