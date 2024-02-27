import React, { FC, ReactNode } from 'react';
import DataTable, { TRow } from '@commercetools-uikit/data-table';
import { Pagination } from '../pagination';
import { TColumn } from '@commercetools-uikit/data-table/dist/declarations/src/data-table';

type Props<T extends TRow = TRow> = {
  columns: Array<TColumn>;
  rows: Array<T>;
  onRowClick?(row: TRow, rowIndex: number, columnKey: string): void;
  rowCount: number;
  total: number;
  offset: number;
  itemRenderer(item: T, column: TColumn<T>, isRowCollapsed: boolean): ReactNode;
  next(...args: unknown[]): unknown;
  previous(...args: unknown[]): unknown;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  onSortChange(...args: unknown[]): unknown;
};

function PaginatedTable<T extends TRow = TRow>({
  columns,
  rows,
  rowCount,
  sortBy,
  sortDirection,
  onSortChange,
  total,
  offset,
  itemRenderer,
  onRowClick,
  next,
  previous,
}: Props<T>) {
  return (
    <>
      <DataTable<T>
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
}
PaginatedTable.displayName = 'PaginatedTable';

export default PaginatedTable;
