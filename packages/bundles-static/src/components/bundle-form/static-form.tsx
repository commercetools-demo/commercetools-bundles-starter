import { FC, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { BundleForm } from '@commercetools-us-ps/bundles-core';
import { ProductField } from '../product-field';
import messages from './messages';
import { useFormik, useFormikContext } from 'formik';
import { StaticBundle } from './bundle-form';

const PRODUCTS = 'products';

type Formik = ReturnType<typeof useFormik<StaticBundle>>;

type Props = {
  initialValidation: {
    slugDefined?: boolean;
  };
  values: Formik['values'];
  errors: Formik['errors'];
  touched?: Formik['touched'];
  isValid: Formik['isValid'];
  isSubmitting: Formik['isSubmitting'];
  handleChange: Formik['handleChange'];
  handleBlur: Formik['handleBlur'];
  handleSubmit: Formik['handleSubmit'];
  setFieldValue(...args: unknown[]): unknown;
};

const StaticForm: FC<Props> = (props) => {
  const formik = useFormikContext<StaticBundle>();
  useEffect(() => {
    props.setFieldValue('productSearch', formik.values.products);
  }, [formik.values.products]);

  return (
    <BundleForm
      {...props}
      formik={formik}
      component={{
        name: PRODUCTS,
        field: (push, remove) => (
          <ProductField
            name={PRODUCTS}
            value={formik.values.products}
            title={<FormattedMessage {...messages.bundleProductsTitle} />}
            hint={<FormattedMessage {...messages.bundleProductsDescription} />}
            isRequired={true}
            touched={formik.touched.products}
            errors={formik.errors.products}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            push={push}
            remove={remove}
          />
        ),
      }}
    />
  );
};
StaticForm.displayName = 'Form';

export default StaticForm;
