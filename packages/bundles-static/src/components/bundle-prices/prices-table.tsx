import { useMcQuery } from '@commercetools-frontend/application-shell';
import { identity, pickBy } from 'lodash';
import { FormattedDate, FormattedMessage, FormattedNumber } from 'react-intl';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import {
  GRAPHQL_TARGETS,
  NO_VALUE_FALLBACK,
} from '@commercetools-frontend/constants';
import Text from '@commercetools-uikit/text';
import DataTable from '@commercetools-uikit/data-table';
import { SORT_OPTIONS } from '@commercetools-us-ps/bundles-core';
import { getSkus } from '../../util';
import GetProductPrices from './get-product-prices.graphql';
import { COLUMN_KEYS, columnDefinitions } from './column-definitions';
import { DEFAULT_VARIABLES } from './constants';
import messages from './messages';
import styles from './prices-table.mod.css';
import Spacings from '@commercetools-uikit/spacings';
import {
  TProduct,
  TQuery,
  TQuery_ProductsArgs,
} from '../../types/generated/ctp';
import { PageNotFound } from '@commercetools-frontend/application-components';
import { FC } from 'react';
import { ProductEntry } from '../bundle-form/bundle-form';
import { DATE_FORMAT_OPTIONS } from '../bundles-table/constants';

interface DateFieldProps {
  date?: string;
  message: object;
}
export const DateField: FC<DateFieldProps> = ({ date, message }) => (
  <Spacings.Inline>
    <div className={styles['date-field']}>
      <Text.Body intlMessage={message} />
    </div>
    <Text.Body data-testid="date-field-value">
      {date ? (
        <FormattedDate value={new Date(date)} {...DATE_FORMAT_OPTIONS} />
      ) : (
        NO_VALUE_FALLBACK
      )}
    </Text.Body>
  </Spacings.Inline>
);
DateField.displayName = 'DateField';

interface PricesTableProps {
  variants?: Array<ProductEntry>;
  currency: string;
  country?: string;
  customerGroup?: string;
  channel?: string;
  date?: string;
  getMcPriceUrl(...args: unknown[]): string;
}

const PricesTable: FC<PricesTableProps> = ({
  variants,
  currency,
  country,
  customerGroup,
  channel,
  date,
  getMcPriceUrl,
}) => {
  const skus = getSkus(variants);
  const { dataLocale } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale ?? '',
  }));

  const variables = {
    ...DEFAULT_VARIABLES,
    sort: [`${COLUMN_KEYS.NAME}.${dataLocale} ${SORT_OPTIONS.ASC}`],
    locale: dataLocale,
    skus,
    currency,
    ...pickBy(
      {
        country,
        date,
        channel: channel ? JSON.parse(channel).id : null,
        customerGroup: customerGroup ? JSON.parse(customerGroup).id : null,
      },
      identity
    ),
  };

  const { data, loading, error } = useMcQuery<
    TQuery,
    { customerGroup?: string; channel?: string } & TQuery_ProductsArgs
  >(GetProductPrices, {
    variables,
    fetchPolicy: 'no-cache',
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
  });

  function renderItem(row, columnKey) {
    const { name, allVariants } = row.masterData.current;
    const { price } = allVariants[0];
    const value = price ? price.value : null;

    switch (columnKey) {
      case COLUMN_KEYS.NAME:
        return name;
      case COLUMN_KEYS.CURRENCY:
        return value ? value.currencyCode : NO_VALUE_FALLBACK;
      case COLUMN_KEYS.PRICE:
        return value ? (
          <FormattedNumber
            value={price.value.centAmount / 100}
            style={'currency'}
            currency={price.value.currencyCode}
          />
        ) : (
          NO_VALUE_FALLBACK
        );
      case COLUMN_KEYS.COUNTRY:
        if (!price) {
          return NO_VALUE_FALLBACK;
        }
        return price.country ? (
          price.country
        ) : (
          <FormattedMessage {...messages.anyValue} />
        );
      case COLUMN_KEYS.CUSTOMER_GROUP:
        if (!price) {
          return NO_VALUE_FALLBACK;
        }
        return price.customerGroup ? (
          JSON.parse(customerGroup || '').name
        ) : (
          <FormattedMessage {...messages.anyValue} />
        );
      case COLUMN_KEYS.CHANNEL:
        return price && price.channel
          ? JSON.parse(channel || '').name
          : NO_VALUE_FALLBACK;
      case COLUMN_KEYS.VALID_DATES:
        return price && (price.validFrom || price.validUntil) ? (
          <Spacings.Stack>
            <DateField date={price.validFrom} message={messages.validFrom} />
            <DateField date={price.validUntil} message={messages.validTo} />
          </Spacings.Stack>
        ) : (
          NO_VALUE_FALLBACK
        );
      default:
        return NO_VALUE_FALLBACK;
    }
  }

  function handleRowClick(item) {
    window.open(
      getMcPriceUrl(item.id, item.masterData.current.allVariants[0].id)
    );
  }

  if (loading) return null;
  if (error)
    return (
      <Text.Body
        data-testid="error-message"
        intlMessage={messages.errorLoading}
      />
    );
  if (!data) {
    return <PageNotFound />;
  }

  const { results } = data.products;

  return (
    <DataTable<TProduct>
      columns={columnDefinitions}
      rows={results}
      itemRenderer={(row, column) => renderItem(row, column['key'])}
      onRowClick={(_event, rowIndex) => handleRowClick(results[rowIndex])}
    />
  );
};
PricesTable.displayName = 'BundlesTable';

export default PricesTable;
