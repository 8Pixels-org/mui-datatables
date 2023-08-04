import React from 'react';
import Typography from '@mui/material/Typography';
import TableSortLabel from '@mui/material/TableSortLabel';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import {DataTableHeaderProps} from "./datatable.types";

export function DataTableHeader(props: DataTableHeaderProps) {
  const {isExpandable, columns, sortDir, sortField, sortFields, onSort} =
    props;

  return (
    <TableHead sx={{bgcolor: 'background.default'}}>
      <TableRow>
        {isExpandable && (
          <TableCell
            sx={{color: 'inherit'}}
          >
            <></>
          </TableCell>
        )}
        {columns
          .filter((c) => !c.hidden)
          .map((column, key) => {
            const canSort =
              sortFields.findIndex((s) => s.field === column.field) > -1;
            return (
              <TableCell
                key={key}
                sx={{color: 'inherit'}}
                align={column.align || 'left'}
                padding={column.disablePadding ? 'none' : 'normal'}
                size={column.disablePadding ? 'small' : 'medium'}
                sortDirection={sortField === column.field ? sortDir : 'desc'}
              >
                {!canSort ? (
                  <Typography fontWeight="bold" variant="caption">
                    {column.label}
                  </Typography>
                ) : (
                  <TableSortLabel
                    sx={{
                      color: sortField === column.field ? 'primary' : 'inherit',
                    }}
                    active={sortField === column.field}
                    direction={sortField === column.field ? sortDir : 'desc'}
                    onClick={() =>
                      onSort(column.field, sortDir === 'asc' ? 'desc' : 'asc')
                    }
                  >
                    <Typography fontWeight="bold" variant="caption">
                      {column.label}
                    </Typography>
                  </TableSortLabel>
                )}
              </TableCell>
            );
          })}
      </TableRow>
    </TableHead>
  );
}
