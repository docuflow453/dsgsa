// Angular import
import { Component, effect, inject } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ThemeService } from 'src/app/theme/shared/service/customs-theme.service';
import { createAgGridTheme } from '../agGridTableStyle';

// third party
import { AgGridAngular } from 'ag-grid-angular';
import {
  CellStyleModule,
  ClientSideRowModelModule,
  ColDef,
  GridReadyEvent,
  HighlightChangesModule,
  ModuleRegistry,
  RowApiModule
} from 'ag-grid-community';

ModuleRegistry.registerModules([RowApiModule, CellStyleModule, ClientSideRowModelModule, HighlightChangesModule]);

@Component({
  selector: 'app-highlighting-change',
  imports: [SharedModule, AgGridAngular],
  templateUrl: './highlighting-change.html',
  styleUrl: './highlighting-change.scss'
})
export class HighlightingChange {
  // private props
  private themeService = inject(ThemeService);
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
    { field: 'a', enableCellChangeFlash: true },
    { field: 'b', enableCellChangeFlash: true },
    { field: 'c', cellRenderer: 'agAnimateShowChangeCellRenderer' },
    { field: 'd', cellRenderer: 'agAnimateShowChangeCellRenderer' },
    { field: 'e', cellRenderer: 'agAnimateSlideCellRenderer' },
    { field: 'f', cellRenderer: 'agAnimateSlideCellRenderer' }
  ];
  defaultColDef: ColDef = {
    flex: 1,
    cellClass: 'align-right',
    valueFormatter: (params) => {
      return formatNumber(params.value);
    }
  };

  // eslint-disable-next-line
  rowData: any[] | null = createRowData();

  onGridReady(params: GridReadyEvent) {
    const updateValues = () => {
      const rowCount = params.api!.getDisplayedRowCount();
      // pick 2 cells at random to update
      for (let i = 0; i < 2; i++) {
        const row = Math.floor(Math.random() * rowCount);
        const rowNode = params.api!.getDisplayedRowAtIndex(row)!;
        const col = ['a', 'b', 'c', 'd', 'e', 'f'][Math.floor(Math.random() * 6)];
        rowNode.setDataValue(col, Math.floor(Math.random() * 10000));
      }
    };
    setInterval(updateValues, 250);
  }
}

function formatNumber(number: number) {
  return Math.floor(number).toLocaleString();
}
function createRowData() {
  const rowData = [];
  for (let i = 0; i < 20; i++) {
    rowData.push({
      a: Math.floor(((i + 323) * 145045) % 10000),
      b: Math.floor(((i + 323) * 543020) % 10000),
      c: Math.floor(((i + 323) * 305920) % 10000),
      d: Math.floor(((i + 323) * 204950) % 10000),
      e: Math.floor(((i + 323) * 103059) % 10000),
      f: Math.floor(((i + 323) * 468276) % 10000)
    });
  }
  return rowData;
}
