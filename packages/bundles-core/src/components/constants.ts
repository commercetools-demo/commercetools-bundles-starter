export const SORT_OPTIONS = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export type SORT_OPTIONS = (typeof SORT_OPTIONS)[keyof typeof SORT_OPTIONS];
