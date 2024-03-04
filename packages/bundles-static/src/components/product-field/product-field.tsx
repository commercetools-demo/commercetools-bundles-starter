import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import { compact, get, isNil, some, uniq } from 'lodash';
import { ErrorMessage } from '@commercetools-uikit/messages';
import { CloseBoldIcon, PlusBoldIcon } from '@commercetools-uikit/icons';
import FieldLabel from '@commercetools-uikit/field-label';
import IconButton from '@commercetools-uikit/icon-button';
import NumberInput from '@commercetools-uikit/number-input';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import Spacings from '@commercetools-uikit/spacings';

import {
  getAttribute,
  LocalizedString,
  ProductSearchInput,
} from '@commercetools-us-ps/bundles-core';
import {
  PRODUCT,
  PRODUCT_NAME,
  PRODUCT_REF,
  QUANTITY,
  SKU,
  VARIANT_ID,
} from './constants';
import messages from './messages';
import styles from './product-field.mod.css';
import { formatLocalizedString } from '@commercetools-frontend/l10n';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import { ProductEntry } from '../bundle-form/bundle-form';

const hasError = (touched, errors, index, field) =>
  !!get(touched, `[${index}].${field}`) && !!get(errors, `[${index}].${field}`);

/*
 * Retrieve the unique (`uniq`), non-null (`compact`) errors for the inputs of each
 * value in the field based on the currently touched inputs.
 *
 * Example: The field contains two product inputs without values. The product inputs
 * are required. If both have been touched, only one "required" error message
 * will be shown.
 */
const getErrors = (touched, errors) =>
  touched &&
  errors &&
  touched.reduce((errs, item, index) => {
    const getError = (field) =>
      item && item[field] ? get(errors, `[${index}].${field}`) : null;

    return uniq([...errs, ...compact([getError(PRODUCT), getError(QUANTITY)])]);
  }, []);

interface ProductFieldProps {
  name?: string;
  value?: Array<ProductEntry>;
  title?: string | React.ReactNode;
  hint?: string | React.ReactNode;
  touched?: {
    product?:
      | boolean
      | {
          label?: boolean;
          value?: boolean;
        };
    quantity?: boolean;
  }[];
  errors?: unknown[];
  isRequired?: boolean;
  onChange(...args: unknown[]): unknown;
  onFocus?(...args: unknown[]): unknown;
  onBlur?(...args: unknown[]): unknown;
  push(...args: unknown[]): unknown;
  remove(...args: unknown[]): unknown;
}

const ProductField: FC<ProductFieldProps> = ({
  name,
  hint,
  title,
  value,
  isRequired,
  touched,
  errors,
  onChange,
  onFocus,
  onBlur,
  push,
  remove,
}) => {
  const intl = useIntl();
  const fieldErrors = getErrors(touched, errors);

  return (
    <Spacings.Stack scale="s">
      <Spacings.Inline alignItems="center" justifyContent="space-between">
        <FieldLabel
          title={title}
          hint={hint}
          hasRequiredIndicator={isRequired}
        />
        <SecondaryButton
          data-testid={`add-product`}
          iconLeft={<PlusBoldIcon />}
          label={intl.formatMessage(messages.addProductLabel)}
          onClick={() => push({ product: null, quantity: '' })}
        />
      </Spacings.Inline>
      <Spacings.Stack scale="s">
        {value?.map(({ product, quantity }, index) => (
          <Spacings.Inline key={index} alignItems="center">
            <div className={styles['product-search']}>
              <ProductSearchInput
                name={`${name}.${index}.${PRODUCT}`}
                value={product}
                placeholder={intl.formatMessage(messages.productPlaceholder)}
                hasError={hasError(touched, errors, index, PRODUCT)}
                onChange={onChange}
                onBlur={onBlur}
              />
            </div>
            <div className={styles['product-quantity']}>
              <NumberInput
                name={`${name}.${index}.${QUANTITY}`}
                value={quantity || 0}
                placeholder={intl.formatMessage(messages.quantityPlaceholder)}
                hasError={hasError(touched, errors, index, QUANTITY)}
                min={1}
                onChange={onChange}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>
            <IconButton
              data-testid={`remove-product.${index}`}
              icon={<CloseBoldIcon />}
              label={intl.formatMessage(messages.addProductLabel)}
              isDisabled={value.length === 1}
              onClick={() => remove(index)}
            />
          </Spacings.Inline>
        ))}
        {fieldErrors && (
          <>
            {fieldErrors.map((error, index) => (
              <ErrorMessage key={index}>{error}</ErrorMessage>
            ))}
          </>
        )}
      </Spacings.Stack>
    </Spacings.Stack>
  );
};

const isEmpty = (formValue) =>
  !formValue ||
  some(
    formValue,
    (value) =>
      isNil(value.product) ||
      isNil(value.quantity) ||
      value.product.value.trim() === '' ||
      value.quantity.toString().trim() === ''
  );

export const parseProductValue = (products, locale, languages) => {
  if (!products) {
    return [];
  }
  return products.map((item) => {
    const sku = getAttribute(item, SKU);
    const value = {
      id: getAttribute(item, VARIANT_ID),
      name: getAttribute(item, PRODUCT_NAME),
      ...(sku && { sku }),
      productId: getAttribute(item, PRODUCT_REF).id,
    };

    return {
      product: {
        label: formatLocalizedString(value, {
          key: 'name',
          locale: locale,
          fallbackOrder: languages,
          fallback: NO_VALUE_FALLBACK,
        }),
        value: JSON.stringify(value),
      },
      quantity: getAttribute(item, QUANTITY),
    };
  });
};
export const parseSearchProductValue = (products) =>
  products.map((item) => {
    return `${getAttribute(item, PRODUCT_REF).id}/${getAttribute(
      item,
      VARIANT_ID
    )}`;
  });

export const convertToProductValue = (products) =>
  products.map((item) => {
    const { product, quantity } = item;
    const { id, name, sku, productId } = JSON.parse(product.value);
    return [
      { name: VARIANT_ID, value: id },
      { name: SKU, value: sku },
      { name: QUANTITY, value: quantity },
      { name: PRODUCT_REF, value: { typeId: PRODUCT, id: productId } },
      { name: PRODUCT_NAME, value: name },
    ].filter((prop) => !(prop.name === SKU && !sku));
  });
export const convertToSearchProductValue = (products) =>
  products.map((item) => {
    const { product } = item;
    const { id, productId } = JSON.parse(product.value);
    return `${productId}/${id}`;
  });

ProductField.displayName = 'ProductField';

export default ProductField;
