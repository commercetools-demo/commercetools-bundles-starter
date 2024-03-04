import React, { FC, useState } from 'react';
import { Redirect } from 'react-router';
import { useIntl } from 'react-intl';
import { useMutation } from '@apollo/client';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import { ConfirmationDialog } from '@commercetools-frontend/application-components';
import { DOMAINS, GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { BinLinearIcon } from '@commercetools-uikit/icons';
import IconButton from '@commercetools-uikit/icon-button';
import { usePathContext } from '../../context';
import EditBundle from './edit-bundle.graphql';
import DeleteBundle from './delete-bundle.graphql';
import messages from './messages';
import styles from './bundle-commands.mod.css';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { StatusSelect } from '../status';

type Props = {
  id: string;
  version: number;
  published: boolean;
  hasStagedChanges: boolean;
  onComplete(): void;
};

const BundleCommands: FC<Props> = ({
  id,
  version,
  published,
  hasStagedChanges,
  onComplete,
}) => {
  const intl = useIntl();
  const { projectKey } = useApplicationContext((context) => ({
    projectKey: context.project?.key ?? '',
  }));

  const rootPath = usePathContext();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const showNotification = useShowNotification();

  const variables = {
    target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    id,
    version,
  };

  const [deleteBundle, { data, loading }] = useMutation(DeleteBundle, {
    variables,
    onCompleted() {
      showNotification({
        kind: 'success',
        domain: DOMAINS.SIDE,
        text: intl.formatMessage(messages.deleteSuccess),
      });
    },
    onError() {
      showNotification({
        kind: 'error',
        domain: DOMAINS.SIDE,
        text: intl.formatMessage(messages.deleteError),
      });
    },
  });
  const [editBundle] = useMutation(EditBundle, {
    onCompleted() {
      showNotification({
        kind: 'success',
        domain: DOMAINS.SIDE,
        text: intl.formatMessage(messages.editSuccess),
      });
    },
    onError() {
      showNotification({
        kind: 'error',
        domain: DOMAINS.SIDE,
        text: intl.formatMessage(messages.editError),
      });
    },
  });

  async function onStatusChange(value) {
    const actions: Array<any> = [];

    if (value) {
      actions.push({ publish: { scope: 'All' } });
    } else {
      actions.push({ unpublish: {} });
    }

    await editBundle({ variables: { ...variables, actions } });
    onComplete();
  }

  if (!loading && data) {
    return <Redirect to={`/${projectKey}/${rootPath}`} />;
  }

  return (
    <div className={styles.commands}>
      <Spacings.Inline alignItems="center">
        <Text.Body intlMessage={messages.status} />
        <StatusSelect
          className={styles['status-select']}
          published={published}
          hasStagedChanges={hasStagedChanges}
          onChange={onStatusChange}
        />
        {!published && (
          <IconButton
            icon={<BinLinearIcon />}
            label={intl.formatMessage(messages.deleteBundle)}
            onClick={() => setConfirmingDelete(true)}
          />
        )}
        <ConfirmationDialog
          title={intl.formatMessage(messages.deleteBundle)}
          isOpen={confirmingDelete}
          onClose={() => setConfirmingDelete(false)}
          onCancel={() => setConfirmingDelete(false)}
          onConfirm={() => deleteBundle()}
        >
          <Text.Body intlMessage={messages.deleteBundleConfirmation} />
        </ConfirmationDialog>
      </Spacings.Inline>
    </div>
  );
};
BundleCommands.displayName = 'BundleCommands';

export default BundleCommands;
