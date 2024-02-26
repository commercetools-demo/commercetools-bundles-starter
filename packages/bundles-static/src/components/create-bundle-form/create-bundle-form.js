import { useMutation } from '@apollo/client';
import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { DOMAINS, GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import { BUNDLE_PRODUCT_TYPE, ROOT_PATH } from '../../constants';
import { BundleForm } from '../bundle-form';
import CreateBundle from './create-bundle.graphql';
import messages from './messages';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import { InfoDetailPage } from '@commercetools-frontend/application-components';

const CreateBundleForm = ({ match }) => {
  const intl = useIntl();
  const mainRoute = `/${match.params.projectKey}/${ROOT_PATH}`;
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
    const variables = {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
      productTypeKey: BUNDLE_PRODUCT_TYPE,
      ...values,
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
CreateBundleForm.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      projectKey: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default CreateBundleForm;
