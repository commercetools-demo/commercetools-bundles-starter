import React, { FC } from 'react';
import { FormattedNumber, useIntl } from 'react-intl';
import { useQuery } from '@apollo/client';
import Spacings from '@commercetools-uikit/spacings';
import AsyncSelectInput from '@commercetools-uikit/async-select-input';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import ProductSearch from './product-search.rest.graphql';
import messages from './messages';
import { formatLocalizedString } from '@commercetools-frontend/l10n';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import { OptionProps } from 'react-select';

const ItemCache = (initialItems?) => ({
  items: { ...initialItems },
  set(id, item) {
    this.items[id] = item;
  },
});

const cache = ItemCache();

const ProductSearchOption: FC<
  OptionProps<{
    value: string;
  }>
> = (props) => {
  const intl = useIntl();
  const { dataLocale, languages } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale ?? '',
    languages: context.project?.languages ?? [],
  }));
  const variant = JSON.parse(props.data?.value || '');
  const { id, sku, price } = variant;

  return (
    <AsyncSelectInput.Option {...props}>
      <Spacings.Inline justifyContent="space-between">
        <strong>
          {formatLocalizedString(variant, {
            key: 'name',
            locale: dataLocale,
            fallbackOrder: languages,
            fallback: NO_VALUE_FALLBACK,
          })}
        </strong>
        {price && (
          <FormattedNumber
            value={price.value.centAmount / 100}
            style="currency"
            currency={price.value.currencyCode}
          />
        )}
      </Spacings.Inline>

      {id && <div>{`${intl.formatMessage(messages.id)}: ${id}`}</div>}
      {sku && <div>{`${intl.formatMessage(messages.sku)}: ${sku}`}</div>}
    </AsyncSelectInput.Option>
  );
};
ProductSearchOption.displayName = 'ProductSearchOption';

interface ProductSearchInputProps {
  name: string;
  value?: {
    label: string;
    value: string;
  };
  filter?: string;
  cacheItems?: boolean;
  horizontalConstraint?:
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 'scale'
    | 'auto';
  placeholder?: string;
  touched?: boolean;
  errors?: object;
  hasError?: boolean;
  onBlur?(...args: unknown[]): unknown;
  onChange(...args: unknown[]): unknown;
  renderError?(...args: unknown[]): unknown;
}

const ProductSearchInput: FC<ProductSearchInputProps> = ({
  name,
  value,
  filter = '',
  cacheItems = true,
  horizontalConstraint,
  placeholder,
  touched,
  errors,
  hasError,
  onBlur,
  onChange,
  renderError,
}) => {
  const { dataLocale, languages } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale ?? '',
    languages: context.project?.languages ?? [],
  }));
  const { refetch } = useQuery(ProductSearch, {
    fetchPolicy: 'no-cache',
    skip: true,
    variables: {
      locale: dataLocale,
      text: '',
      filter,
    },
  });

  const mapOptions = (items) =>
    items.map((item) => ({
      value: JSON.stringify(item),
      label: formatLocalizedString(item, {
        key: 'name',
        locale: dataLocale,
        fallbackOrder: languages,
        fallback: NO_VALUE_FALLBACK,
      }),
    }));

  const getMatchingVariants = (result, product) => {
    const base = {
      productId: product.id,
      name: product.name,
    };

    const addMatchingVariant = (variant) => {
      const { id, sku, price, isMatchingVariant } = variant;
      if (isMatchingVariant) {
        const item = {
          ...base,
          id,
          sku,
          price,
        };
        result.push(item);
        cache.set(id, item);
      }
    };

    addMatchingVariant(product.masterVariant);

    product.variants.forEach((variant) => {
      addMatchingVariant(variant);
    });

    return result;
  };

  const loadOptions = (text: string) =>
    refetch({ text }).then((response) =>
      mapOptions(response.data.products.results.reduce(getMatchingVariants, []))
    );

  return (
    <AsyncSelectInput
      name={name}
      value={value}
      horizontalConstraint={horizontalConstraint}
      placeholder={placeholder}
      isClearable
      isSearchable
      defaultOptions={cacheItems ? mapOptions(Object.values(cache.items)) : []}
      cacheOptions={cacheItems ? 20 : 0}
      loadOptions={loadOptions}
      components={{
        // @ts-ignore
        Option: ProductSearchOption,
      }}
      hasError={hasError}
      touched={touched}
      errors={errors}
      onBlur={onBlur}
      onChange={onChange}
      renderError={renderError}
    />
  );
};
ProductSearchInput.displayName = 'ProductSearchInput';

export default ProductSearchInput;
