import { useMutation } from '@apollo/client';
import React from 'react';
import { useIntl } from 'react-intl';
import { DOMAINS, GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import { BUNDLE_PRODUCT_TYPE, ROOT_PATH } from '../../constants';
import { BundleForm } from '../bundle-form';
import CreateBundle from './create-bundle.graphql';
import messages from './messages';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import { InfoDetailPage } from '@commercetools-frontend/application-components';
import { useHistory, useRouteMatch } from 'react-router-dom';

const CreateBundleForm = () => {
  const match = useRouteMatch();
  const intl = useIntl();
  const mainRoute = `/${match.params.projectKey}/${ROOT_PATH}`;
  const showNotification = useShowNotification();
  const history = useHistory();
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

export default CreateBundleForm;
