import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import TableContainer from '@mui/material/TableContainer';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Table from '@mui/material/Table';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import useSWR from 'swr';
import {DataTableHeader} from './datatable-header.component';
import {DataTableToolbar} from './datatable-toolbar.component';
import {
  DataTableMessages,
  DataTableProps,
  DataTableRefHandle,
  FetchDataOptions,
  RowProps,
  TableView
} from "./datatable.types";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {useDebounceEffect} from "../hooks/useDebounceEffect";
import {deepmerge} from "deepmerge-ts";


const defaultFetchDataOptions: Partial<FetchDataOptions> = {
  page: 1,
  sort: {
    field: 'created_at',
    dir: 'desc',
  },
};

const defaultRowsPerPageOptions = [10, 25, 50];

const defaultMessages: DataTableMessages = {
  row: {
    expandLess: 'Expand less',
    expandMore: 'Expand more',
    select: 'Select'
  },
  rowsPerPage: 'Per page',
  displayRowsPerPage: ({from, to, count, page}) => `${from}-${to} of ${count}`,
  noDataAvailable: 'No data available',
  toolbar: {
    sort: {
      sortAsc: 'A-Z',
      sortDesc: 'Z-A',
      menuHeader: 'Sort by'
    },
    search: {
      cancel: 'Cancel',
      placeholder: 'Type to search...'
    },
    views: {
      defaultViewLabel: 'All'
    },
  },
}

export const DataTable: React.ForwardRefExoticComponent<
  React.PropsWithoutRef<DataTableProps<any>> &
  React.RefAttributes<DataTableRefHandle>
> =
  React.forwardRef((props: DataTableProps<any>, ref) => {
    const {
      onClickRow,
      dataUrl,
      columns,
      onFetchData,
      fetchDataOptions = defaultFetchDataOptions,
      rowsPerPageOptions = defaultRowsPerPageOptions,
      views = [],
      sortFields = [],
      disableSearch,
      dense,
      expandable,
      ExpandComponent,
      messages: customMessages,
      customSubHeaderComponent
    } = props;
    const messages: DataTableMessages = typeof customMessages != 'undefined' ? deepmerge(defaultMessages, customMessages) as DataTableMessages : defaultMessages;
    const [currentView, setCurrentView] = React.useState<TableView | undefined>();
    const [search, setSearch] = React.useState<string | undefined>(
      fetchDataOptions?.search || undefined,
    );
    const [page, setPage] = React.useState(fetchDataOptions?.page || 1);
    const [rowsPerPage, setRowsPerPage] = React.useState(
      fetchDataOptions?.rows_per_page || rowsPerPageOptions[0],
    );

    const [sort, setSort] = React.useState<{ dir: 'asc' | 'desc'; field: string }>({
      dir: fetchDataOptions?.sort?.dir || 'desc',
      field: fetchDataOptions?.sort?.field || 'created_at',
    });
    const [totalRows, setTotalRows] = React.useState<number>(0);

    // const key = useMemo(() => {
    //   return `${dataUrl}?page=${page}&rows_per_page=${rowsPerPage}&sort_field=${
    //     sort.field
    //   }&sort_dir=${sort.dir}&view=${currentView?.label || "all"}`;
    // }, [page, rowsPerPage, sort, currentView]);
    const key = dataUrl;

    const filters = currentView?.filters || [];

    const {data, error, isLoading, isValidating, mutate} = useSWR(key, () =>
      onFetchData({
        sort: {
          field: sort.field,
          dir: sort.dir,
        },
        rows_per_page: rowsPerPage,
        page: page,
        filters: currentView?.filters || [],
        search: search,
      }).then((res) => {
        setTotalRows(res.total);
        return res.rows;
      }),
    );

    const onSort = (field: string, dir: 'desc' | 'asc') => {
      setSort({field, dir});
    };

    const onChangePage = (event: unknown, newPage: number) => {
      setPage(newPage + 1);
    };

    const onChangeRowsPerPage = (event: { target: { value: any } }) => {
      setPage(1);
      setRowsPerPage(event.target.value);
    };

    const onSearchChange = (search?: string) => {
      setPage(1);
      setSearch(search);
    };

    useDebounceEffect(
      () => {
        mutate();
      },
      [sort, rowsPerPage, page, search, currentView],
      500,
    );

    React.useImperativeHandle(ref, () => ({
      refresh: () => mutate(),
    }));

    const isExpandable = (expandable && !!ExpandComponent) || false;
    const colCount = isExpandable ? columns.length + 1 : columns.length;
    return (
      <>
        <TableContainer>
          <DataTableToolbar
            messages={messages}
            isLoading={isLoading}
            onChangeView={setCurrentView}
            currentView={currentView}
            views={views}
            sortFields={sortFields}
            sortField={sort.field}
            sortDir={sort.dir}
            onSortChange={onSort}
            onSearchChange={onSearchChange}
            search={search}
            disableSearch={disableSearch}
            customSubHeaderComponent={customSubHeaderComponent ? () => customSubHeaderComponent({
              page,
              sort,
              filters,
              search,
              rows_per_page: rowsPerPage
            }, currentView) : () => <></>}
          />
          <Table aria-labelledby="table title" aria-label="data table">
            <DataTableHeader
              isExpandable={isExpandable}
              sortField={sort.field}
              sortDir={sort.dir}
              columns={columns}
              onSort={onSort}
              sortFields={sortFields}
            />
            <TableBody>
              {!data || isLoading ? (
                <TableRow>
                  <TableCell
                    size={dense ? 'small' : 'medium'}
                    align="center"
                    colSpan={colCount}
                    sx={{p: 10}}
                  >
                    <CircularProgress/>
                  </TableCell>
                </TableRow>
              ) : data.length <= 0 && totalRows <= 0 ? (
                <TableRow>
                  <TableCell
                    size={dense ? 'small' : 'medium'}
                    colSpan={colCount}
                    align="center"
                  >
                    {messages.noDataAvailable}
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {!!data &&
                    Array.isArray(data) &&
                    data.map((row, key) => (
                      <Row
                        messages={messages}
                        dense={dense}
                        key={key}
                        row={row}
                        rowKey={key}
                        columns={columns}
                        onClickRow={onClickRow}
                        expandable={isExpandable}
                        ExpandComponent={ExpandComponent}
                      />
                    ))}
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          labelRowsPerPage={messages.rowsPerPage}
          labelDisplayedRows={(data) => messages.displayRowsPerPage(data)}
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={totalRows}
          rowsPerPage={rowsPerPage}
          page={page - 1}
          onPageChange={onChangePage}
          onRowsPerPageChange={onChangeRowsPerPage}
        />
      </>
    );
  });


function Row(props: RowProps) {
  const {
    row,
    columns,
    rowKey,
    onClickRow,
    dense,
    expandable,
    ExpandComponent: expandComponent,
    messages
  } = props;

  const [expanded, setExpanded] = React.useState(false);

  const clickable = expandable || !!onClickRow;
  const clickRow = () => {
    if (expandable) {
      setExpanded(!expanded);
    } else if (!!onClickRow) {
      onClickRow(row);
    }
  };

  return (
    <>
      <Tooltip
        title={
          expandable
            ? expanded
              ? messages.row.expandLess
              : messages.row.expandMore
            : !!onClickRow
              ? messages.row.select
              : ''
        }
      >
        <TableRow
          sx={{cursor: clickable ? 'pointer' : 'initial'}}
          onClick={clickRow}
          hover
          tabIndex={-1}
        >
          {expandable && (
            <TableCell size={'small'} padding="checkbox">
              {expanded ? (
                <Tooltip title={messages.row.expandLess}>
                  <IconButton onClick={(e: { stopPropagation: () => void; }) => {
                    e.stopPropagation();
                    setExpanded(!expanded);
                  }}>
                    <ExpandLessIcon/>
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip title={messages.row.expandMore}>
                  <IconButton onClick={(e: { stopPropagation: () => void; }) => {
                    e.stopPropagation();
                    setExpanded(!expanded);
                  }}>
                    <ExpandMoreIcon/>
                  </IconButton>
                </Tooltip>
              )}
            </TableCell>
          )}
          {columns
            .filter((c) => !c.hidden)
            .map((column, columnKey) => {
              if (column?.customBodyRender) {
                return (
                  <TableCell
                    key={columnKey}
                    size={dense ? 'small' : 'medium'}
                    align={column?.align || 'left'}
                  >
                    {column?.customBodyRender(rowKey, row, column.field ? row[column.field] : undefined)}
                  </TableCell>
                );
              } else {
                return (
                  <TableCell
                    key={columnKey}
                    size={dense ? 'small' : 'medium'}
                    align={column?.align || 'left'}
                  >
                    {column.field ? row[column.field] : ''}
                  </TableCell>
                );
              }
            })}
        </TableRow>
      </Tooltip>
      {expanded && !!expandComponent && (
        <TableRow tabIndex={-1}>
          <TableCell colSpan={columns.length + 1}>
            {expandComponent(rowKey, row)}
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
