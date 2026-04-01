// angular import
import { Component, effect, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ThemeService } from 'src/app/theme/shared/service/customs-theme.service';
import { createAgGridTheme } from '../agGridTableStyle';
import { IOlympicData } from '../agGridType';

// third party
import { AgGridAngular } from 'ag-grid-angular';
import { ClientSideRowModelModule, ColDef, ColumnApiModule, GridApi, GridReadyEvent, ModuleRegistry } from 'ag-grid-community';

ModuleRegistry.registerModules([ColumnApiModule, ClientSideRowModelModule]);

@Component({
  selector: 'app-column-moving-table',
  imports: [AgGridAngular, SharedModule],
  templateUrl: './column-moving-table.html',
  styleUrl: './column-moving-table.scss'
})
export class ColumnMovingTable {
  // private props
  private gridApi!: GridApi<IOlympicData>;
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

  // table data
  rowData!: IOlympicData[];

  // public methods
  themeDirection(direction: boolean) {
    this.direction = direction === true;
    // Force grid to re-render
    this.showGrid = false;
    setTimeout(() => {
      this.showGrid = true;
    });
  }

  columnDefs: ColDef[] = [
    { field: 'athlete' },
    { field: 'age' },
    { field: 'country' },
    { field: 'year' },
    { field: 'date' },
    { field: 'sport' },
    { field: 'gold' },
    { field: 'silver' },
    { field: 'bronze' },
    { field: 'total' }
  ];
  defaultColDef: ColDef = {
    width: 150
  };

  onMedalsFirst() {
    this.gridApi.moveColumns(['gold', 'silver', 'bronze', 'total'], 0);
  }

  onMedalsLast() {
    this.gridApi.moveColumns(['gold', 'silver', 'bronze', 'total'], 6);
  }

  onCountryFirst() {
    this.gridApi.moveColumns(['country'], 0);
  }

  onSwapFirstTwo() {
    this.gridApi.moveColumnByIndex(0, 1);
  }

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.gridApi = params.api;

    this.http.get<IOlympicData[]>('https://www.ag-grid.com/example-assets/olympic-winners.json').subscribe((data) => (this.rowData = data));
  }
}
