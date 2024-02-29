import React from 'react';
import { useIntl } from 'react-intl';
import { DOMAINS, GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import { ATTRIBUTES, BUNDLE_PRODUCT_TYPE, ROOT_PATH } from '../../constants';
import { BundleForm } from '../bundle-form';
import CreateBundle from './create-bundle.graphql';
import messages from './messages';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import {
  useApplicationContext,
  useMcMutation,
} from '@commercetools-frontend/application-shell-connectors';
import { InfoDetailPage } from '@commercetools-frontend/application-components';

const CreateBundleForm = () => {
  const intl = useIntl();
  const { projectKey } = useApplicationContext((context) => ({
    projectKey: context.project.key ?? '',
  }));
  const mainRoute = `/${projectKey}/${ROOT_PATH}`;
  const showNotification = useShowNotification();
  const [createBundle, { data, loading }] = useMcMutation(CreateBundle, {
    onCompleted: () =>
      showNotification({
        kind: 'success',
        domain: DOMAINS.SIDE,
        text: intl.formatMessage(messages.createSuccess),
      }),
    onError: () =>
      showNotification({
        kind: 'error',
        domain: DOMAINS.SIDE,
        text: intl.formatMessage(messages.createError),
      }),
  });

  function onSubmit(values) {
    const {
      categories,
      categorySearch,
      dynamicPrice,
      minQuantity,
      maxQuantity,
      ...formValues
    } = values;

    const attributes = [
      { name: ATTRIBUTES.CATEGORIES, value: categories },
      {
        name: ATTRIBUTES.CATEGORY_SEARCH,
        value: categorySearch,
      },
    ];

    if (dynamicPrice) {
      attributes.push({ name: ATTRIBUTES.DYNAMIC_PRICE, value: dynamicPrice });
    }

    if (minQuantity) {
      attributes.push({ name: ATTRIBUTES.MIN_QUANTITY, value: minQuantity });
    }

    if (maxQuantity) {
      attributes.push({ name: ATTRIBUTES.MAX_QUANTITY, value: maxQuantity });
    }

    const variables = {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
      productTypeKey: BUNDLE_PRODUCT_TYPE,
      ...formValues,
      attributes,
    };

    return createBundle({ variables });
  }

  return (
    <InfoDetailPage
      onPreviousPathClick={() => history.push(mainRoute)}
      title={intl.formatMessage(messages.title)}
      previousPathLabel={intl.formatMessage(messages.backButton)}
    >
      <BundleForm
        onSubmit={onSubmit}
        data={data}
        loading={loading}
        redirect={mainRoute}
      />
    </InfoDetailPage>
  );
};
CreateBundleForm.displayName = 'CreateBundleForm';

export default CreateBundleForm;
