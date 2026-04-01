// Angular import
import { Component, effect, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// project import
import { IOlympicData } from '../agGridType';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ThemeService } from 'src/app/theme/shared/service/customs-theme.service';
import { createAgGridTheme } from '../agGridTableStyle';

// third party
import { AgGridAngular } from 'ag-grid-angular';
import { ClientSideRowModelModule, ColDef, ModuleRegistry, PaginationModule } from 'ag-grid-community';

ModuleRegistry.registerModules([PaginationModule, ClientSideRowModelModule]);

@Component({
  selector: 'app-row-pagination',
  imports: [SharedModule, AgGridAngular],
  templateUrl: './row-pagination.html',
  styleUrl: './row-pagination.scss'
})
export class RowPagination {
  // private props
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
    {
      field: 'athlete',
      minWidth: 170
    },
    { field: 'age' },
    { field: 'country' },
    { field: 'date' },
    { field: 'total' }
  ];

  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100
  };

  onGridReady() {
    this.http.get<IOlympicData[]>('https://www.ag-grid.com/example-assets/olympic-winners.json').subscribe((data) => (this.rowData = data));
  }
}
