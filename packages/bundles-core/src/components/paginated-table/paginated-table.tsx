import React, { FC, ReactNode } from 'react';
import DataTable, { TRow } from '@commercetools-uikit/data-table';
import { Pagination } from '../pagination';
import { TColumn } from '@commercetools-uikit/data-table/dist/declarations/src/data-table';

type Props = {
  columns: Array<TColumn>;
  rows: Array<TRow>;
  registerMeasurementCache?(...args: unknown[]): unknown;
  onRowClick?(row: TRow, rowIndex: number, columnKey: string): void;
  defaultHeight?: number;
  rowCount: number;
  total: number;
  offset: number;
  itemRenderer(item: TRow, column: TColumn, isRowCollapsed: boolean): ReactNode;
  next(...args: unknown[]): unknown;
  previous(...args: unknown[]): unknown;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  onSortChange(...args: unknown[]): unknown;
};

const PaginatedTable: FC<Props> = ({
  columns,
  rows,
  rowCount,
  sortBy,
  sortDirection,
  onSortChange,
  total,
  offset,
  itemRenderer,
  registerMeasurementCache,
  onRowClick,
  defaultHeight,
  next,
  previous,
}) => (
  <>
    <DataTable
      columns={columns}
      rows={rows}
      itemRenderer={itemRenderer}
      onRowClick={onRowClick}
      sortedBy={sortBy}
      sortDirection={sortDirection}
      onSortChange={onSortChange}
    />
    {rowCount !== total && (
      <Pagination
        next={next}
        previous={previous}
        offset={offset}
        rowCount={rowCount}
        total={total}
      />
    )}
  </>
);
PaginatedTable.displayName = 'PaginatedTable';

export default PaginatedTable;
