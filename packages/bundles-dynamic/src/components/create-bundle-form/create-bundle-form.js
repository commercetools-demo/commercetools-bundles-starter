import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { useMutation } from '@apollo/client';
import { DOMAINS, GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import Spacings from '@commercetools-uikit/spacings';
import {
  BackToList,
  TabContainer,
  View,
  ViewHeader,
} from '@commercetools-us-ps/bundles-core';
import { ATTRIBUTES, BUNDLE_PRODUCT_TYPE, ROOT_PATH } from '../../constants';
import { BundleForm } from '../bundle-form';
import CreateBundle from './create-bundle.graphql';
import messages from './messages';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';

const CreateBundleForm = ({ match }) => {
  const intl = useIntl();
  const { projectKey } = useApplicationContext((context) => ({
    projectKey: context.project.key ?? '',
  }));
  const mainRoute = `/${projectKey}/${ROOT_PATH}`;
  const showNotification = useShowNotification();
  const [createBundle, { data, loading }] = useMutation(CreateBundle, {
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
    <View>
      <ViewHeader
        title={<FormattedMessage {...messages.title} />}
        backToList={
          <BackToList
            href={mainRoute}
            label={intl.formatMessage(messages.backButton)}
          />
        }
      />
      <TabContainer>
        <Spacings.Stack scale="m">
          <BundleForm
            onSubmit={onSubmit}
            data={data}
            loading={loading}
            redirect={mainRoute}
          />
        </Spacings.Stack>
      </TabContainer>
    </View>
  );
};
CreateBundleForm.displayName = 'CreateBundleForm';
CreateBundleForm.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      projectKey: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default CreateBundleForm;
