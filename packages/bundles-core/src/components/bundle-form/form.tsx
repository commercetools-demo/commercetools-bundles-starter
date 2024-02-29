import React, { FC, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { FieldArray, FormikProvider, useFormik } from 'formik';
import kebabCase from 'lodash/kebabCase';
import mapValues from 'lodash/mapValues';
import Card from '@commercetools-uikit/card';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import TextField from '@commercetools-uikit/text-field';
import CollapsiblePanel from '@commercetools-uikit/collapsible-panel';
import LocalizedTextField from '@commercetools-uikit/localized-text-field';
import Constraints from '@commercetools-uikit/constraints';
import messages from './messages';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import SaveToolbar from '../save-toolbar/save-toolbar';

type TFormValues = {
  name: Record<string, string>;
  description: Record<string, string>;
  key: string;
  sku: string;
  slug: Record<string, string>;
};
type TErrors = {
  name?: {
    missing?: boolean;
  };
  slug?: {
    missing?: boolean;
  };
};
type Formik = ReturnType<typeof useFormik<TFormValues>>;

type Props = {
  formik: ReturnType<typeof useFormik<TFormValues>>;
  fields?: React.ReactNode[];
  component?: {
    name: string;
    field(
      push: (obj: any) => void,
      remove: (obj: any) => void
    ): React.Component;
  };
  initialValidation: {
    slugDefined?: boolean;
  };
  values: Formik['values'];
  errors: TErrors;
  touched: Formik['touched'];
  dirty: Formik['dirty'];
  isValid: Formik['isValid'];
  isSubmitting: Formik['isSubmitting'];
  handleChange: Formik['handleChange'];
  handleBlur: Formik['handleBlur'];
  handleSubmit: Formik['handleSubmit'];
  setFieldValue(...args: unknown[]): unknown;
};

const Form: FC<Props> = ({
  formik,
  initialValidation,
  fields,
  component,
  values,
  errors,
  touched,
  dirty,
  isValid,
  isSubmitting,
  handleBlur,
  handleChange,
  handleSubmit,
  setFieldValue,
}) => {
  const intl = useIntl();
  const { dataLocale } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale ?? '',
  }));

  useEffect(() => {
    if (!initialValidation.slugDefined && !touched.slug) {
      const slug = mapValues(values.name, (value) =>
        kebabCase(value).toLowerCase()
      );
      setFieldValue('slug', slug);
    }
  }, [values.name]);

  return (
    <FormikProvider value={formik}>
      <Spacings.Stack scale="s" alignItems={'stretch'}>
        <CollapsiblePanel
          header={
            <Text.Headline
              as={'h2'}
              intlMessage={messages.generalInformationTitle}
            />
          }
        >
          <Constraints.Horizontal>
            <Spacings.Stack scale={'m'} alignItems={'stretch'}>
              <LocalizedTextField
                name="name"
                value={values.name}
                title={intl.formatMessage(messages.bundleNameTitle)}
                description={intl.formatMessage(messages.bundleNameDescription)}
                selectedLanguage={dataLocale}
                isRequired={true}
                errors={errors.name}
                touched={!!touched.name}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              <LocalizedTextField
                name="description"
                value={values.description}
                title={intl.formatMessage(messages.bundleDescriptionTitle)}
                selectedLanguage={dataLocale}
                // touched={LocalizedTextInput.isTouched(touched?.description)}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              <TextField
                name="key"
                value={values.key}
                title={intl.formatMessage(messages.bundleKeyTitle)}
                hint={intl.formatMessage(messages.bundleKeyDescription)}
                touched={touched?.key}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              <TextField
                name="sku"
                value={values.sku}
                title={intl.formatMessage(messages.bundleSkuTitle)}
                touched={touched?.sku}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </Spacings.Stack>
          </Constraints.Horizontal>
        </CollapsiblePanel>
        <CollapsiblePanel
          header={
            <Text.Headline
              as={'h2'}
              intlMessage={messages.bundleInformationTitle}
            />
          }
        >
          <Constraints.Horizontal>
            {fields &&
              fields.map((field, index) => (
                <Card key={index} type="raised" theme="light" insetScale={'m'}>
                  {field}
                </Card>
              ))}
            {component && (
              <Card type="raised" theme="light" insetScale={'m'}>
                <FieldArray
                  validateOnChange={false}
                  name={component.name}
                  render={({ push, remove }) => component.field(push, remove)}
                />
              </Card>
            )}
          </Constraints.Horizontal>
        </CollapsiblePanel>
        <CollapsiblePanel
          header={
            <Text.Headline
              as={'h2'}
              intlMessage={messages.externalSearchTitle}
            />
          }
        >
          <Constraints.Horizontal>
            <LocalizedTextField
              name="slug"
              value={values.slug}
              title={intl.formatMessage(messages.bundleSlugTitle)}
              hint={intl.formatMessage(messages.bundleSlugDescription)}
              selectedLanguage={dataLocale}
              isRequired={true}
              errors={errors.slug}
              // touched={LocalizedTextInput.isTouched(touched.slug)}
              onBlur={handleBlur}
              onChange={handleChange}
            />
          </Constraints.Horizontal>
        </CollapsiblePanel>
        <SaveToolbar
          onSave={handleSubmit}
          onCancel={formik.resetForm}
          isVisible={dirty && isValid}
        />
      </Spacings.Stack>
    </FormikProvider>
  );
};
Form.displayName = 'Form';

export default Form;
