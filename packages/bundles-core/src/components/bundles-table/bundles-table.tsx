import React, { useState, useEffect, FC, ReactNode } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import omit from 'lodash/omit';
import values from 'lodash/values';
import { stringify } from 'qs';
import {
  useApplicationContext,
  useMcQuery,
} from '@commercetools-frontend/application-shell-connectors';
import Card from '@commercetools-uikit/card';
import FlatButton from '@commercetools-uikit/flat-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { PlusBoldIcon } from '@commercetools-uikit/icons';
import { SORT_OPTIONS } from '../constants';
import { useBundleContext } from '../../context';
import { COLUMN_KEYS } from './column-definitions';
import { DEFAULT_VARIABLES, PAGE_SIZE } from './constants';
import BundleProductsSearch from './bundle-search.rest.graphql';
import messages from './messages';
import { TColumn } from '@commercetools-uikit/data-table/dist/declarations/src/data-table';
import DataTable, { TRow } from '@commercetools-uikit/data-table';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { TProduct, TQuery } from '../../types/generated/ctp';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import { PageNotFound } from '@commercetools-frontend/application-components';
import { Loading, Error } from '../states';
import { SearchInput } from '../search-input';
import { Pagination } from '@commercetools-uikit/pagination';

type Props = {
  title: {
    id: string;
    description?: string;
    defaultMessage: string;
  };
  subtitle: {
    id: string;
    description?: string;
    defaultMessage: string;
  };
  columnDefinitions: Array<TColumn>;
  renderItem(
    item: TRow,
    column: TColumn<{ key: string } & TRow>,
    isRowCollapsed?: boolean
  ): ReactNode;
  filterInputs?(...args: unknown[]): unknown;
};

const BundlesTable: FC<Props> = ({
  title,
  subtitle,
  columnDefinitions,
  renderItem,
  filterInputs,
}) => {
  const intl = useIntl();
  const match = useRouteMatch();
  const history = useHistory();
  const { dataLocale } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale ?? '',
  }));
  const { where } = useBundleContext();
  const [query, setQuery] = useState<string>('');
  const [sort, setSort] = useState<COLUMN_KEYS>(COLUMN_KEYS.MODIFIED);
  const [direction, setDirection] = useState<SORT_OPTIONS>(SORT_OPTIONS.DESC);
  const [filters, setFilters] = useState<any>({ where });

  const QUERY_VARIABLES = {
    ...DEFAULT_VARIABLES,
    filter: [where],
  };

  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(PAGE_SIZE);

  const [queryString, setQueryString] = useState<string>('');
  const [variables, setVariables] = useState(QUERY_VARIABLES);

  const { data, error, loading } = useMcQuery<TQuery, { queryString: string }>(
    BundleProductsSearch,
    {
      variables: { queryString },
      context: {
        target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
      },
    }
  );

  useEffect(() => {
    setQueryString(stringify(variables, { arrayFormat: 'repeat' }));
  }, [variables]);

  function handleRowClick(id) {
    history.push(`${match.url}/${id}/general`);
  }

  function getProducts(key, value) {
    setVariables({ ...variables, ...{ [key]: value } });
  }

  function handleSortChange(column, sortDirection) {
    setSort(column);
    setDirection(sortDirection);
    getProducts(
      'sort',
      `${column}${
        column === COLUMN_KEYS.NAME ? `.${dataLocale}` : ''
      } ${sortDirection}`
    );
  }

  const onPageChange = (newPage: number) => {
    setPage(newPage);
    const offset = (newPage - 1) * perPage;
    getProducts('offset', offset);
  };

  const onPerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    const offset = (page - 1) * newPerPage;
    getProducts('offset', offset);
    getProducts('limit', newPerPage);
  };

  function search(searchTerm: string) {
    if (searchTerm) {
      getProducts(`text.${dataLocale}`, searchTerm);
    } else {
      setVariables({ ...QUERY_VARIABLES, filter: values(filters) });
    }
  }

  function filter(value, type, getFilterValue) {
    if (value) {
      const newFilters = { ...filters, [type]: getFilterValue() };
      setFilters(newFilters);
      getProducts('filter', values(newFilters));
    } else {
      const newFilters = omit(filters, type);
      setFilters(newFilters);
      setVariables({
        ...QUERY_VARIABLES,
        filter: values(newFilters),
        ...(!!query && { [`text.${dataLocale}`]: query }),
      });
    }
  }

  const hasFilters = () => Object.keys(filters).length > 1;

  if (loading) {
    return <Loading />;
  }
  if (error) {
    return (
      <Error
        title={intl.formatMessage(messages.errorLoadingTitle)}
        message={error.message}
      />
    );
  }
  if (!data || !data.products) {
    return <PageNotFound />;
  }

  const { products } = data;
  const { results, count, total } = products;

  return (
    <Spacings.Inset scale="m">
      <Spacings.Stack scale="m">
        <Spacings.Inline
          scale="m"
          alignItems="center"
          justifyContent="space-between"
        >
          <Spacings.Inline alignItems="baseline" scale="m">
            <Text.Headline as="h2" intlMessage={title} />
            <Text.Body tone="secondary">
              <FormattedMessage {...subtitle} values={{ total }} />
            </Text.Body>
          </Spacings.Inline>
          <SecondaryButton
            iconLeft={<PlusBoldIcon />}
            as="a"
            href={`${match.url}/new`}
            label={intl.formatMessage(messages.linkToCreateBundleTitle)}
          />
        </Spacings.Inline>
        <Card theme="dark" type="flat">
          <Spacings.Stack scale="m">
            <SearchInput
              placeholder={intl.formatMessage(messages.searchPlaceholder)}
              value={query}
              onChange={setQuery}
              onSubmit={search}
            />
            {filterInputs && (
              <Card theme="light" type="flat">
                <Spacings.Inline scale="m" alignItems="center">
                  <Text.Body intlMessage={messages.filter} />
                  {filterInputs(filter)}
                </Spacings.Inline>
              </Card>
            )}
          </Spacings.Stack>
        </Card>
        {count > 0 ? (
          <>
            <DataTable<TProduct>
              columns={columnDefinitions}
              rows={results}
              itemRenderer={(row, column) =>
                renderItem(row, (column as any).key)
              }
              onRowClick={(event, rowIndex) =>
                handleRowClick(results[rowIndex].id)
              }
              sortedBy={sort}
              sortDirection={direction}
              onSortChange={handleSortChange}
            />
            <Pagination
              page={page}
              onPageChange={onPageChange}
              perPage={perPage}
              onPerPageChange={onPerPageChange}
              totalItems={total}
            />
          </>
        ) : (
          <Spacings.Inline scale="xs" alignItems={'center'}>
            <Text.Body
              intlMessage={
                query || hasFilters()
                  ? messages.errorNoSearchResultsTitle
                  : messages.errorNoResultsTitle
              }
              data-testid="no-results-error"
            />
            {!query && !hasFilters() && (
              <FlatButton
                as="a"
                href={`${match.url}/new`}
                label={`${intl.formatMessage(
                  messages.linkToCreateBundleTitle
                )}.`}
                isDisabled={false}
              />
            )}
          </Spacings.Inline>
        )}
      </Spacings.Stack>
    </Spacings.Inset>
  );
};

BundlesTable.displayName = 'BundlesTable';

export default BundlesTable;
