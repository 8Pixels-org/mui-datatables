import * as React from 'react';


export interface FetchDataResponse {
  /**
   * Total number of rows in the db
   */
  total: number;
  /**
   * The rows for the table.
   */
  rows: Record<any, any>
}

export interface SortField {
  field: string;
  label: string;
  hidden?: boolean;
}

export interface SortOption {
  field: string;
  dir: 'asc' | 'desc';
}

export interface FilterOption {
  id: string;
  label: string;
  value: string | null | number | any[];

  [rest: string]: any
}

export interface FetchDataOptions {
  sort: SortOption;
  filters: FilterOption[];
  rows_per_page: number;
  page: number;
  search?: string;
}

export interface TableColumn {
  field?: string;
  label: string | React.ReactNode;
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
  disablePadding?: boolean;
  hidden?: boolean;
  /**
   * Render a custom component for the row
   * @param rowIndex
   * @param row
   * @param value
   */
  customBodyRender?: (
    rowIndex: number,
    row: Record<any, any>,
    value: any,
  ) => React.ReactNode;
}

export interface TableView {
  label: string;
  filters?: FilterOption[];
  hidden?: boolean;
}

export type CustomSubHeaderComponent = (fetchDataOptions: FetchDataOptions, activeView?: TableView) => React.ReactNode

export interface DataTableProps<T> {
  onClickRow?: (row: T) => void;
  dataUrl: string;
  columns: TableColumn[];
  onFetchData: (options: FetchDataOptions) => Promise<FetchDataResponse>;
  fetchDataOptions?: Partial<FetchDataOptions>;
  rowsPerPageOptions?: number[];
  sortFields?: SortField[];
  views?: TableView[];
  disableSearch?: boolean;
  dense?: boolean;
  /**
   * If the row is expandable
   */
  expandable?: boolean;
  /**
   * The component to render when the row is expanded
   * @param rowIndex
   * @param row
   */
  ExpandComponent?: (
    rowIndex: number,
    row: Record<any, any>,
  ) => React.ReactNode;

  /**
   * The component to render when no data is available
   * @param fetchDataOptions The options for fetching data
   * @param message The default message
   */
  NoDataComponent?: (fetchDataOptions: FetchDataOptions, message: string) => React.ReactNode;
  /**
   * Messages can be overwritten
   */
  messages?: Partial<DataTableMessages>;
  /**
   * Render a custom component below the header
   * @param view
   */
  customSubHeaderComponent?: CustomSubHeaderComponent;
}

/**
 * Ref handle for the datatable
 */
export interface DataTableRefHandle {
  /**
   * Refresh the data.
   */
  refresh: () => void;
}


export interface RowProps {
  rowKey: number;
  row: Record<any, any>;
  columns: TableColumn[];
  onClickRow?: (row: Record<any, any>) => void;
  dense?: boolean;
  ExpandComponent?: (
    rowIndex: number,
    row: Record<any, any>,
  ) => React.ReactNode;
  expandable?: boolean;
  messages: DataTableMessages
}

export interface DataTableToolbarProps {
  sortFields?: SortField[];
  views?: TableView[];
  currentView?: TableView;
  onChangeView: (view?: TableView) => void;
  sortField: string;
  sortDir: "asc" | "desc";
  onSortChange: (field: string, dir: "asc" | "desc") => void;
  search?: string;
  onSearchChange: (search?: string) => void;
  isLoading: boolean;
  disableSearch?: boolean;
  messages: DataTableMessages
  customSubHeaderComponent?: () => React.ReactNode;
}

export interface DataTableHeaderProps {
  sortDir?: 'asc' | 'desc';
  sortField?: string;
  columns: TableColumn[];
  onSort: (field: string, dir: 'asc' | 'desc') => void;
  sortFields: SortField[];
  isExpandable: boolean;
}

export interface DataTableMessages {
  toolbar: Partial<{
    search: Partial<{
      placeholder: string;
      cancel: string;
    }>;
    views: Partial<{
      defaultViewLabel: string;
    }>,
    sort: Partial<{
      menuHeader: string;
      sortAsc: string;
      sortDesc: string;
    }>
  }>;
  noDataAvailable: string;
  rowsPerPage: string;
  displayRowsPerPage: ({from, to, count, page}: { from: number, to: number, count: number, page: number }) => string;
  row: Partial<{
    expandMore: string;
    expandLess: string;
    select: string;
  }>
}
