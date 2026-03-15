// Angular import
import { Component, effect, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { IOlympicData } from '../agGridType';
import { ThemeService } from 'src/app/theme/shared/service/customs-theme.service';
import { createAgGridTheme } from '../agGridTableStyle';

// third party
import { AgGridAngular } from 'ag-grid-angular';
import {
  ClientSideRowModelModule,
  ColDef,
  DateFilterModule,
  IDateFilterParams,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule
} from 'ag-grid-community';

ModuleRegistry.registerModules([ClientSideRowModelModule, TextFilterModule, NumberFilterModule, DateFilterModule]);

@Component({
  selector: 'app-column-filter',
  imports: [SharedModule, AgGridAngular],
  templateUrl: './column-filter.html',
  styleUrl: './column-filter.scss'
})
export class ColumnFilter {
  // props
  private themeService = inject(ThemeService);
  private http = inject(HttpClient);
  direction!: boolean;
  showGrid: boolean = true;

  // table theme apply
  theme = createAgGridTheme(this.themeService.isDarkMode());

  // constructor
  constructor() {
    // React to signal changes
    effect(() => {
      const isDark = this.themeService.isDarkMode();
      const dir = this.themeService.isRTLMode();

      this.themeDirection(dir);
      this.theme = createAgGridTheme(isDark);
    });
  }

  public themeDirection(direction: boolean) {
    this.direction = direction === true;
    // Force grid to re-render
    this.showGrid = false;
    setTimeout(() => {
      this.showGrid = true;
    });
  }

  // table data
  rowData!: IOlympicData[];

  // public methods
  columnDefs: ColDef[] = [
    { field: 'athlete' },
    { field: 'age', filter: 'agNumberColumnFilter', maxWidth: 100 },
    {
      field: 'date',
      filter: 'agDateColumnFilter',
      filterParams: filterParams
    },
    { field: 'country', filter: 'agSetColumnFilter' },
    { field: 'sport', filter: 'agMultiColumnFilter' },
    { field: 'gold', filter: 'agNumberColumnFilter' },
    { field: 'silver', filter: 'agNumberColumnFilter' },
    { field: 'bronze', filter: 'agNumberColumnFilter' },
    { field: 'total', filter: false }
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 150,
    filter: 'agTextColumnFilter',
    suppressHeaderMenuButton: true,
    suppressHeaderContextMenu: true
  };

  onGridReady() {
    this.http.get<IOlympicData[]>('https://www.ag-grid.com/example-assets/olympic-winners.json').subscribe((data) => (this.rowData = data));
  }
}

// data filter
const filterParams: IDateFilterParams = {
  comparator: (filterLocalDateAtMidnight: Date, cellValue: string) => {
    const dateAsString = cellValue;
    if (dateAsString == null) return -1;
    const dateParts = dateAsString.split('/');
    const cellDate = new Date(Number(dateParts[2]), Number(dateParts[1]) - 1, Number(dateParts[0]));
    if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
      return 0;
    }
    if (cellDate < filterLocalDateAtMidnight) {
      return -1;
    }
    if (cellDate > filterLocalDateAtMidnight) {
      return 1;
    }
    return 0;
  }
};
