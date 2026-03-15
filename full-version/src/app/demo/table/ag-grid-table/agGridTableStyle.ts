import { themeAlpine } from 'ag-grid-community';

export function createAgGridTheme(isDarkMode: boolean) {
  return themeAlpine.withParams({
    accentColor: 'var(--bs-gray-200)',
    backgroundColor: 'var(--pc-sidebar-background)',
    borderColor: 'var(--bs-border-color)',
    browserColorScheme: isDarkMode ? 'dark' : 'light',
    wrapperBorder: false,
    chromeBackgroundColor: {
      ref: 'foregroundColor',
      mix: 0.07,
      onto: 'backgroundColor'
    },
    fontFamily: {
      googleFont: 'Public Sans, sans-serif'
    },
    headerFontFamily: {
      googleFont: 'Public Sans, sans-serif'
    },
    foregroundColor: 'var(--bs-table-color)',
    rowHoverColor: 'var(--bs-table-color)',
    iconButtonHoverColor: 'var(--bs-table-color)',
    headerBackgroundColor: 'var(--pc-table-header-background)',
    menuBackgroundColor: 'var(--pc-table-header-background)',
    headerRowBorder: true,
    rowBorder: true,
    headerFontSize: 12,
    headerTextColor: 'var(--bs-table-color)',
    spacing: '8.3px'
  });
}
