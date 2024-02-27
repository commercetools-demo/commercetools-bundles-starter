import React, { useState } from 'react';
import { FormattedDate, FormattedNumber, useIntl } from 'react-intl';
import { find, minBy } from 'lodash';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import {
  localize,
  BundlesTable,
  COLUMN_KEYS,
  CategorySearchInput,
  ProductSearchInput,
  StatusBadge,
  getCode,
} from '@commercetools-us-ps/bundles-core';
import { DATE_FORMAT_OPTIONS, PRODUCTS_ATTRIBUTE } from './constants';
import columnDefinitions from './column-definitions';
import messages from './messages';
import { useFormikContext } from 'formik';

const StaticBundlesTable = () => {
  const intl = useIntl();
  const { dataLocale, languages } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale ?? '',
    currencies: context.project?.languages ?? [],
  }));
  const [category, setCategory] = useState(null);
  const [product, setProduct] = useState(null);

  function filterByCategory(event, setFilter) {
    const targetValue = event.target.value;
    setCategory(targetValue);
    const getCategoryFilter = () => `categories.id:"${targetValue.value}"`;
    setFilter(targetValue, 'category', getCategoryFilter);
  }

  function filterByProduct(event, setFilter) {
    const targetValue = event.target.value;
    setProduct(targetValue);
    const getProductFilter = () => {
      const { productId, id } = JSON.parse(targetValue.value);
      return `variants.attributes.productSearch:"${productId}/${id}"`;
    };
    setFilter(targetValue, 'product', getProductFilter);
  }

  function renderItem(row, columnKey) {
    const bundle = row;
    const masterVariant = bundle.masterVariant;

    switch (columnKey) {
      case COLUMN_KEYS.NAME:
        return localize({
          obj: bundle,
          key: 'name',
          language: dataLocale,
          fallbackOrder: languages,
        });
      case COLUMN_KEYS.PRODUCTS: {
        const products = find(masterVariant.attributes, {
          name: PRODUCTS_ATTRIBUTE,
        });
        return products ? products.value.length : NO_VALUE_FALLBACK;
      }
      case COLUMN_KEYS.STATUS: {
        const { published, hasStagedChanges } = bundle;
        const code = getCode(published, hasStagedChanges);
        return <StatusBadge code={code} />;
      }
      case COLUMN_KEYS.PRICE: {
        const price = minBy(masterVariant.prices, 'value.centAmount');
        return price ? (
          <FormattedNumber
            value={price.value.centAmount / 100}
            style="currency"
            currency={price.value.currencyCode}
          />
        ) : (
          NO_VALUE_FALLBACK
        );
      }
      case COLUMN_KEYS.MODIFIED:
        return (
          <FormattedDate
            value={bundle.lastModifiedAt}
            {...DATE_FORMAT_OPTIONS}
          />
        );
      default:
        return NO_VALUE_FALLBACK;
    }
  }

  return (
    <BundlesTable
      columnDefinitions={columnDefinitions}
      renderItem={renderItem}
      title={messages.title}
      subtitle={messages.titleResults}
      filterInputs={(filter) => (
        <>
          <CategorySearchInput
            name="category"
            placeholder={intl.formatMessage(messages.categoryFilterPlaceholder)}
            horizontalConstraint="scale"
            value={category}
            onChange={(event) => filterByCategory(event, filter)}
          />
          <ProductSearchInput
            name="product"
            placeholder={intl.formatMessage(messages.productFilterPlaceholder)}
            horizontalConstraint="scale"
            value={product}
            onChange={(event) => filterByProduct(event, filter)}
          />
        </>
      )}
    />
  );
};

StaticBundlesTable.displayName = 'StaticBundlesTable';

export default StaticBundlesTable;
