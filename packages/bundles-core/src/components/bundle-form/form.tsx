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

export type LocalizedString = { [name: string]: string };

export type Bundle = {
  id?: string;
  version?: number;
  name: LocalizedString;
  description: LocalizedString;
  key?: string;
  sku?: string;
  slug: LocalizedString;
};

export type BundleErrors = {
  key: { missing?: boolean; invalidInput?: boolean; keyHint?: boolean };
  name: { missing?: boolean };
  description: { missing?: boolean };
  slug: { missing?: boolean };
};

type Props = {
  formik: ReturnType<typeof useFormik<Bundle>>;
  fields?: React.ReactNode[];
  component?: {
    name: string;
    field(
      push: (obj: any) => void,
      remove: (obj: any) => void
    ): React.JSX.Element;
  };
  initialValidation: {
    slugDefined?: boolean;
  };
  setFieldValue(...args: unknown[]): unknown;
};

const Form: FC<Props> = ({
  formik,
  initialValidation,
  fields,
  component,
  setFieldValue,
}) => {
  const intl = useIntl();
  const { dataLocale } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale ?? '',
  }));

  useEffect(() => {
    if (!initialValidation.slugDefined && !formik.touched.slug) {
      const slug = mapValues(formik.values.name, (value) =>
        kebabCase(value).toLowerCase()
      );
      setFieldValue('slug', slug);
    }
  }, [formik.values.name]);

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
                value={formik.values.name}
                title={intl.formatMessage(messages.bundleNameTitle)}
                description={intl.formatMessage(messages.bundleNameDescription)}
                selectedLanguage={dataLocale}
                isRequired={true}
                errors={
                  LocalizedTextField.toFieldErrors<Bundle>(formik.errors).name
                }
                touched={!!formik.touched.name}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
              <LocalizedTextField
                name="description"
                value={formik.values.description}
                title={intl.formatMessage(messages.bundleDescriptionTitle)}
                selectedLanguage={dataLocale}
                errors={
                  LocalizedTextField.toFieldErrors<Bundle>(formik.errors)
                    .description
                }
                touched={!!formik.touched.description}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
              <TextField
                name="key"
                value={formik.values.key || ''}
                title={intl.formatMessage(messages.bundleKeyTitle)}
                hint={intl.formatMessage(messages.bundleKeyDescription)}
                errors={TextField.toFieldErrors<Bundle>(formik.errors).key}
                touched={formik.touched?.key}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
              <TextField
                name="sku"
                value={formik.values.sku || ''}
                title={intl.formatMessage(messages.bundleSkuTitle)}
                errors={TextField.toFieldErrors<Bundle>(formik.errors).sku}
                touched={formik.touched?.sku}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
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
              value={formik.values.slug}
              title={intl.formatMessage(messages.bundleSlugTitle)}
              hint={intl.formatMessage(messages.bundleSlugDescription)}
              selectedLanguage={dataLocale}
              isRequired={true}
              errors={
                LocalizedTextField.toFieldErrors<Bundle>(formik.errors).slug
              }
              touched={!!formik.touched.slug}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />
          </Constraints.Horizontal>
        </CollapsiblePanel>
        <SaveToolbar
          onSave={formik.handleSubmit}
          onCancel={formik.resetForm}
          isVisible={formik.dirty && formik.isValid}
        />
      </Spacings.Stack>
    </FormikProvider>
  );
};
Form.displayName = 'Form';

export default Form;
