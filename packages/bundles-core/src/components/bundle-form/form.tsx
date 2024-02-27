import React, { FC, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  FieldArray,
  FormikProvider,
  useFormik,
  useFormikContext,
} from 'formik';
import kebabCase from 'lodash/kebabCase';
import mapValues from 'lodash/mapValues';
import Card from '@commercetools-uikit/card';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import TextField from '@commercetools-uikit/text-field';
import CollapsiblePanel from '@commercetools-uikit/collapsible-panel';
import LocalizedTextField from '@commercetools-uikit/localized-text-field';
import PrimaryButton from '@commercetools-uikit/primary-button';
import Constraints from '@commercetools-uikit/constraints';
import messages from './messages';

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
  dataLocale: string;
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
  dataLocale,
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
            <Text.Subheadline
              as="h4"
              intlMessage={messages.generalInformationTitle}
              isBold={true}
            />
          }
        >
          <Constraints.Horizontal>
            <Spacings.Stack scale={'m'} alignItems={'stretch'}>
              {/*constraint="l">*/}
              <Card type="raised" theme="light" insetScale={'m'}>
                <LocalizedTextField
                  name="name"
                  value={values.name}
                  title={<FormattedMessage {...messages.bundleNameTitle} />}
                  selectedLanguage={dataLocale}
                  isRequired={true}
                  errors={errors.name}
                  touched={!!touched.name}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </Card>
              <Card type="raised" theme="light" insetScale={'m'}>
                <LocalizedTextField
                  name="description"
                  value={values.description}
                  title={
                    <FormattedMessage {...messages.bundleDescriptionTitle} />
                  }
                  selectedLanguage={dataLocale}
                  // touched={LocalizedTextInput.isTouched(touched?.description)}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </Card>
              <Card type="raised" theme="light" insetScale={'m'}>
                <TextField
                  name="key"
                  value={values.key}
                  title={<FormattedMessage {...messages.bundleKeyTitle} />}
                  hint={<FormattedMessage {...messages.bundleKeyDescription} />}
                  touched={touched?.key}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </Card>
              <Card type="raised" theme="light" insetScale={'m'}>
                <TextField
                  name="sku"
                  value={values.sku}
                  title={<FormattedMessage {...messages.bundleSkuTitle} />}
                  touched={touched?.sku}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </Card>
            </Spacings.Stack>
          </Constraints.Horizontal>
        </CollapsiblePanel>
        <CollapsiblePanel
          header={
            <Text.Subheadline
              as="h4"
              intlMessage={messages.bundleInformationTitle}
              isBold={true}
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
            <Text.Subheadline
              as="h4"
              intlMessage={messages.externalSearchTitle}
              isBold={true}
            />
          }
        >
          <Constraints.Horizontal>
            {/*constraint="l">*/}
            <Card type="raised" theme="light" insetScale={'m'}>
              <LocalizedTextField
                name="slug"
                value={values.slug}
                title={<FormattedMessage {...messages.bundleSlugTitle} />}
                hint={<FormattedMessage {...messages.bundleSlugDescription} />}
                selectedLanguage={dataLocale}
                isRequired={true}
                errors={errors.slug}
                // touched={LocalizedTextInput.isTouched(touched.slug)}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </Card>
          </Constraints.Horizontal>
        </CollapsiblePanel>
        <Constraints.Horizontal>
          {/*constraint="scale">*/}
          <PrimaryButton
            label={intl.formatMessage(messages.submitButton)}
            isDisabled={!dirty || !isValid || isSubmitting}
            onClick={() => handleSubmit()}
          />
        </Constraints.Horizontal>
      </Spacings.Stack>
    </FormikProvider>
  );
};
Form.displayName = 'Form';

export default Form;
