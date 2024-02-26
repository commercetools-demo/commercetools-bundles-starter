import React, { FC, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { FieldArray } from 'formik';
import kebabCase from 'lodash/kebabCase';
import mapValues from 'lodash/mapValues';
import Card from '@commercetools-uikit/card';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import TextField from '@commercetools-uikit/text-field';
import CollapsiblePanel from '@commercetools-uikit/collapsible-panel';
import LocalizedTextInput from '@commercetools-uikit/localized-text-input';
import LocalizedTextField from '@commercetools-uikit/localized-text-field';
import PrimaryButton from '@commercetools-uikit/primary-button';
import Constraints from '@commercetools-uikit/constraints';
import messages from './messages';
import styles from './form.mod.css';

type Props = {
  dataLocale: string;
  fields?: React.ReactNode[];
  component?: {
    name: string;
    field(...args: unknown[]): unknown;
  };
  initialValidation: {
    slugDefined?: boolean;
  };
  values: {
    name: Record<string, string>;
    description: Record<string, string>;
    key: string;
    sku: string;
    slug: Record<string, string>;
  };
  errors: {
    name?: {
      missing?: boolean;
    };
    slug?: {
      missing?: boolean;
    };
  };
  touched?: {
    name?: Record<string, boolean>;
    description?: Record<string, boolean>;
    key?: boolean;
    sku?: boolean;
    slug?: Record<string, boolean>;
  };
  dirty: boolean;
  isValid: boolean;
  isSubmitting: boolean;
  handleChange(...args: unknown[]): unknown;
  handleBlur(...args: unknown[]): unknown;
  handleSubmit(...args: unknown[]): unknown;
  setFieldValue(...args: unknown[]): unknown;
};

const Form: FC<Props> = ({
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
    if (
      !initialValidation.slugDefined &&
      !LocalizedTextInput.isTouched(touched?.slug)
    ) {
      const slug = mapValues(values.name, (value) =>
        kebabCase(value).toLowerCase()
      );
      setFieldValue('slug', slug);
    }
  }, [values.name]);

  return (
    <Spacings.Stack scale="s">
      <CollapsiblePanel
        header={
          <Text.Subheadline
            as="h4"
            intlMessage={messages.generalInformationTitle}
            isBold={true}
          />
        }
        className={styles.panel}
      >
        <Constraints.Horizontal>
          {/*constraint="l">*/}
          <Card type="flat" className={styles['field-card']}>
            <LocalizedTextField
              name="name"
              value={values.name}
              title={<FormattedMessage {...messages.bundleNameTitle} />}
              selectedLanguage={dataLocale}
              isRequired={true}
              errors={errors.name}
              touched={LocalizedTextInput.isTouched(touched?.name)}
              onBlur={handleBlur}
              onChange={handleChange}
            />
          </Card>
          <Card type="flat" className={styles['field-card']}>
            <LocalizedTextField
              name="description"
              value={values.description}
              title={<FormattedMessage {...messages.bundleDescriptionTitle} />}
              selectedLanguage={dataLocale}
              touched={LocalizedTextInput.isTouched(touched?.description)}
              onBlur={handleBlur}
              onChange={handleChange}
            />
          </Card>
          <Card type="flat" className={styles['field-card']}>
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
          <Card type="flat" className={styles['field-card']}>
            <TextField
              name="sku"
              value={values.sku}
              title={<FormattedMessage {...messages.bundleSkuTitle} />}
              touched={touched?.sku}
              onBlur={handleBlur}
              onChange={handleChange}
            />
          </Card>
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
        className={styles.panel}
      >
        <Constraints.Horizontal>
          {/*constraint="l">*/}
          {fields &&
            fields.map((field, index) => (
              <Card key={index} type="flat" className={styles['field-card']}>
                {field}
              </Card>
            ))}
          {component && (
            <Card type="flat" className={styles['field-card']}>
              <FieldArray
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
        className={styles.panel}
      >
        <Constraints.Horizontal>
          {/*constraint="l">*/}
          <Card type="flat" className={styles['field-card']}>
            <LocalizedTextField
              name="slug"
              value={values.slug}
              title={<FormattedMessage {...messages.bundleSlugTitle} />}
              hint={<FormattedMessage {...messages.bundleSlugDescription} />}
              selectedLanguage={dataLocale}
              isRequired={true}
              errors={errors.slug}
              touched={LocalizedTextInput.isTouched(touched?.slug)}
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
          onClick={handleSubmit}
        />
      </Constraints.Horizontal>
    </Spacings.Stack>
  );
};
Form.displayName = 'Form';

export default Form;
