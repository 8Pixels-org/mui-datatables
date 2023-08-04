import React from 'react';

interface FetchDataResponse {
    /**
     * Total number of rows in the db
     */
    total: number;
    /**
     * The rows for the table.
     */
    rows: Record<any, any>;
}
interface SortField {
    field: string;
    label: string;
}
interface SortOption {
    field: string;
    dir: 'asc' | 'desc';
}
interface FilterOption {
    id: string;
    label: string;
    value: string | null | number | any[];
    [rest: string]: any;
}
interface FetchDataOptions {
    sort: SortOption;
    filters: FilterOption[];
    rows_per_page: number;
    page: number;
    search?: string;
}
interface TableColumn {
    field: string;
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
    customBodyRender?: (rowIndex: number, row: Record<any, any>, value: any) => React.ReactNode;
}
interface TableView {
    label: string;
    filters?: FilterOption[];
}
interface DataTableProps<T> {
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
     * @constructor
     */
    ExpandComponent?: (rowIndex: number, row: Record<any, any>) => React.ReactNode;
    /**
     * Messages can be overwritten
     */
    messages?: Partial<DataTableMessages>;
}
/**
 * Ref handle for the datatable
 */
interface DataTableRefHandle {
    /**
     * Refresh the data.
     */
    refresh: () => void;
}
interface DataTableMessages {
    toolbar: {
        search: {
            placeholder: string;
            cancel: string;
        };
        views: {
            defaultViewLabel: string;
        };
        sort: {
            menuHeader: string;
            sortAsc: string;
            sortDesc: string;
        };
    };
    noDataAvailable: string;
    rowsPerPage: string;
    displayRowsPerPage: ({ from, to, count, page }: {
        from: number;
        to: number;
        count: number;
        page: number;
    }) => string;
    row: {
        expandMore: string;
        expandLess: string;
        select: string;
    };
}

declare const DataTable: React.ForwardRefExoticComponent<React.PropsWithoutRef<DataTableProps<any>> & React.RefAttributes<DataTableRefHandle>>;

export { DataTable };
