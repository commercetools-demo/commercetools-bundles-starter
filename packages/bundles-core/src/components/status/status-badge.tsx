import React, { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import Spacings from '@commercetools-uikit/spacings';
import styles from './status-badge.mod.css';
import messages from './messages';

export enum PRODUCT_STATUS {
  PUBLISHED = 'published',
  UNPUBLISHED = 'unpublished',
  MODIFIED = 'modified',
}

export enum PRODUCT_ACTIONS {
  PUBLISH = 'publish',
  UNPUBLISH = 'unpublish',
}

type Props = {
  className?: string;
  code:
    | PRODUCT_STATUS.PUBLISHED
    | PRODUCT_STATUS.UNPUBLISHED
    | PRODUCT_STATUS.MODIFIED
    | PRODUCT_ACTIONS.PUBLISH
    | PRODUCT_ACTIONS.UNPUBLISH;
};

const StatusBadge: FC<Props> = ({ className, code }) => (
  <div
    data-testid="status-badge"
    className={classNames(styles.container, className)}
  >
    <Spacings.Inline scale="s" alignItems="center">
      <div data-testid="status-indicator" className={styles[code]} />
      <span>
        <FormattedMessage data-testid="status-message" {...messages[code]} />
      </span>
    </Spacings.Inline>
  </div>
);
StatusBadge.displayName = 'StatusBadge';
export const getCode = (published: boolean, hasStagedChanges: boolean) => {
  let code;
  if (published && hasStagedChanges) {
    code = PRODUCT_STATUS.MODIFIED;
  } else if (published) {
    code = PRODUCT_STATUS.PUBLISHED;
  } else {
    code = PRODUCT_STATUS.UNPUBLISHED;
  }
  return code;
};

export default StatusBadge;
