// Angular import
import { Component, effect, inject } from '@angular/core';

// third party
import {
  AllCommunityModule,
  ModuleRegistry,
  ClientSideRowModelModule,
  ColDef,
  GridApi,
  GridReadyEvent,
  NumberEditorModule,
  PinnedRowModule,
  RowPinnedType,
  TextEditorModule,
  ValidationModule
} from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';

// project import
import { getData, Person } from '../../../../../fake-data/tableData';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { createAgGridTheme } from '../agGridTableStyle';
import { ThemeService } from 'src/app/theme/shared/service/customs-theme.service';

ModuleRegistry.registerModules([
  AllCommunityModule,
  NumberEditorModule,
  TextEditorModule,
  PinnedRowModule,
  ClientSideRowModelModule,
  ValidationModule
]);

@Component({
  selector: 'app-basic-table',
  imports: [SharedModule, AgGridAngular],
  templateUrl: './basic-table.html',
  styleUrl: './basic-table.scss'
})
export class BasicTable {
  // props
  private themeService = inject(ThemeService);
  private gridApi!: GridApi;
  direction!: boolean;
  showGrid: boolean = true;

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
  rowData: Person[] | null = getData();

  colDefs: ColDef[] = [{ field: 'make' }, { field: 'model' }, { field: 'price' }, { field: 'electric' }];

  columnDefs: ColDef[] = [
    { field: 'firstName' },
    { field: 'lastName' },
    { field: 'gender' },
    { field: 'age' },
    { field: 'mood' },
    { field: 'country' },
    { field: 'address', minWidth: 550 }
  ];

  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 110,
    editable: true
  };

  onBtStopEditing() {
    this.gridApi.stopEditing();
  }

  onBtStartEditing(key?: string, pinned?: RowPinnedType) {
    this.gridApi.setFocusedCell(0, 'lastName', pinned);
    this.gridApi.startEditingCell({
      rowIndex: 0,
      colKey: 'lastName',
      // set to 'top', 'bottom' or undefined
      rowPinned: pinned,
      key: key
    });
  }

  onBtNextCell() {
    this.gridApi.tabToNextCell();
  }

  onBtPreviousCell() {
    this.gridApi.tabToPreviousCell();
  }

  onBtWhich() {
    const cellDefs = this.gridApi.getEditingCells();
    if (cellDefs.length > 0) {
      const cellDef = cellDefs[0];
      const colId = cellDef.colId ? cellDef.colId.toString() : 'undefined';
      console.log('editing cell is: row = ' + cellDef.rowIndex + ', col = ' + colId + ', floating = ' + cellDef.rowPinned);
    } else {
      console.log('no cells are editing');
    }
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}
