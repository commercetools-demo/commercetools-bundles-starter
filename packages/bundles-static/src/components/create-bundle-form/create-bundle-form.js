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
import { useHistory } from 'react-router-dom';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';

const CreateBundleForm = () => {
  const intl = useIntl();
  const { projectKey } = useApplicationContext((context) => ({
    projectKey: context.project?.key ?? '',
  }));
  const mainRoute = `/${projectKey}/${ROOT_PATH}`;
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
