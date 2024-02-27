import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import PrimaryButton from '@commercetools-uikit/primary-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import styles from './save-toolbar.module.css';
import messages from './messages';

type ButtonProps = { isDisabled?: boolean; label?: string };

type Props = {
  buttonProps?: {
    cancel?: ButtonProps;
    save?: ButtonProps;
  };
  isVisible?: boolean;
  onSave?: () => void;
  onCancel: () => void;
};

const SaveToolbar: FC<Props> = ({
  isVisible,
  buttonProps,
  onCancel,
  onSave,
}) => {
  const { formatMessage } = useIntl();
  if (!isVisible) return null;

  return (
    <div className={styles.container}>
      <ul className={styles['list-left']}>
        <li className={styles['list-item']}>
          <SecondaryButton
            label={formatMessage(messages.cancel)}
            onClick={onCancel}
            {...buttonProps?.cancel}
          />
        </li>
      </ul>

      <ul className={styles['list-right']}>
        <li className={styles['list-item']}>
          {onSave && (
            <PrimaryButton
              label={formatMessage(messages.save)}
              onClick={onSave}
              {...buttonProps?.save}
            />
          )}
        </li>
      </ul>
    </div>
  );
};
export default SaveToolbar;
