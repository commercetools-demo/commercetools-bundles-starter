import { Redirect } from 'react-router';
import { useIntl } from 'react-intl';
import { Formik } from 'formik';
import { object, string, array, lazy, number } from 'yup';
import { isEqual, pickBy } from 'lodash';
import omitEmpty from 'omit-empty';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import LocalizedTextInput from '@commercetools-uikit/localized-text-input';
import StaticForm from './static-form';
import messages from './messages';
import { transformLocalizedStringToLocalizedField } from '@commercetools-frontend/l10n';
import { FC } from 'react';
import { Bundle, BundleErrors } from '@commercetools-us-ps/bundles-core';
import {
  convertToProductValue,
  convertToSearchProductValue,
  parseProductValue,
} from '../product-field';
import { TImage } from '../../types/generated/ctp';

export interface Product {
  label: string;
  value: string;
}

export interface ProductEntry {
  product?: Product;
  quantity: string;
}
export interface StaticBundle extends Bundle {
  products: Array<ProductEntry>;
  productSearch?: Array<ProductEntry>;
  images?: Array<TImage>;
}

export type StaticBundleErrors = {} & BundleErrors;

type Props = {
  bundle: StaticBundle;
  onSubmit: (values: StaticBundle) => void;
  data: any;
  loading?: boolean;
  redirect?: string;
};

const BundleForm: FC<Props> = ({
  bundle,
  onSubmit,
  data,
  loading,
  redirect,
}) => {
  const intl = useIntl();
  const { dataLocale, languages } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale ?? '',
    languages: context.project?.languages ?? [],
  }));

  const initialBundleValues = () => {
    const products = parseProductValue(bundle.products, dataLocale, languages);
    return {
      id: bundle.id,
      version: bundle.version,
      name: LocalizedTextInput.createLocalizedString(languages, bundle.name),
      description: LocalizedTextInput.createLocalizedString(
        languages,
        bundle.description
      ),
      key: bundle.key || '',
      sku: bundle.sku || '',
      products,
      productSearch: products,
      slug: LocalizedTextInput.createLocalizedString(languages, bundle.slug),
    };
  };

  const initialEmptyValues = () => ({
    name: LocalizedTextInput.createLocalizedString(languages),
    description: LocalizedTextInput.createLocalizedString(languages),
    key: '',
    sku: '',
    products: [
      {
        product: null,
        quantity: '',
      },
    ],
    productSearch: null,
    slug: LocalizedTextInput.createLocalizedString(languages),
  });

  const initialValues = bundle ? initialBundleValues() : initialEmptyValues();
  const initialValidation = {
    slugDefined: !!(bundle && bundle.slug),
  };

  const assetSchema = object({
    key: string(),
    products: array(
      object({
        product: object({
          value: string(),
          label: string(),
        })
          .nullable()
          .required(intl.formatMessage(messages.missingRequiredField)),
        quantity: lazy((value) =>
          typeof value === 'number'
            ? number()
                .min(1, intl.formatMessage(messages.quantityError))
                .required(intl.formatMessage(messages.missingRequiredField))
            : string().required(
                intl.formatMessage(messages.missingRequiredField)
              )
        ),
      })
    ).compact(),
  });

  const submitValues = (values: StaticBundle) => {
    const submit = omitEmpty({
      name: transformLocalizedStringToLocalizedField(
        LocalizedTextInput.omitEmptyTranslations(values.name)
      ),
      description: transformLocalizedStringToLocalizedField(
        LocalizedTextInput.omitEmptyTranslations(values.description)
      ),
      key: values.key,
      sku: values.sku,
      products: JSON.stringify(convertToProductValue(values.products)),
      productSearch: JSON.stringify(
        convertToSearchProductValue(values.products)
      ),
      slug: transformLocalizedStringToLocalizedField(
        LocalizedTextInput.omitEmptyTranslations(values.slug)
      ),
    });

    return {
      id: values.id,
      version: values.version,
      ...pickBy(
        submit,
        (_value, key) => !isEqual(initialValues[key], values[key])
      ),
    };
  };

  const validate = (values: StaticBundle) => {
    const errors: StaticBundleErrors = {
      name: {},
      slug: {},
      key: {},
      description: {},
    };

    if (LocalizedTextInput.isEmpty(values.name)) {
      errors.name.missing = true;
    }

    if (LocalizedTextInput.isEmpty(values.slug)) {
      errors.slug.missing = true;
    }

    if (values.key && values.key.length > 0) {
      const keyValue = values.key.trim();
      const keyLength = keyValue.length;
      if (
        keyLength < 2 ||
        keyLength > 256 ||
        !/^[a-zA-Z0-9-_]+$/.test(keyValue)
      )
        errors.key.invalidInput = true;
    } else {
      errors.key.missing = true;
    }

    return omitEmpty(errors);
  };

  const handleSubmit = async (values: StaticBundle) => {
    onSubmit(submitValues(values));
  };

  if (!loading && data && redirect) {
    return <Redirect to={redirect} />;
  }

  return (
    <Formik<StaticBundle>
      enableReinitialize
      initialValues={initialValues}
      validationSchema={assetSchema}
      validate={validate}
      onSubmit={handleSubmit}
    >
      {(props) => (
        <StaticForm initialValidation={initialValidation} {...props} />
      )}
    </Formik>
  );
};
BundleForm.displayName = 'BundleForm';

export default BundleForm;
