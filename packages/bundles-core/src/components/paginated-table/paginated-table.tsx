import React, { FC, ReactNode } from 'react';
import DataTable, { TRow } from '@commercetools-uikit/data-table';
import { Pagination } from '@commercetools-uikit/pagination';
import { TColumn } from '@commercetools-uikit/data-table/dist/declarations/src/data-table';

type Props<T extends TRow = TRow> = {
  columns: Array<TColumn>;
  rows: Array<T>;
  onRowClick?(row: TRow, rowIndex: number, columnKey: string): void;
  total: number;
  itemRenderer(item: T, column: TColumn<T>, isRowCollapsed: boolean): ReactNode;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  onSortChange(...args: unknown[]): unknown;
  page: number;
  onPageChange: (newPage: number) => void;
  perPage: number;
  onPerPageChange: (newPerPage: number) => void;
};

function PaginatedTable<T extends TRow = TRow>({
  columns,
  rows,
  sortBy,
  sortDirection,
  onSortChange,
  total,
  itemRenderer,
  onRowClick,
  page,
  perPage,
  onPerPageChange,
  onPageChange,
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
      <Pagination
        page={page}
        onPageChange={onPageChange}
        perPage={perPage}
        onPerPageChange={onPerPageChange}
        totalItems={total}
      />
    </>
  );
}
PaginatedTable.displayName = 'PaginatedTable';

export default PaginatedTable;
