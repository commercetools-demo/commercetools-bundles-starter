import React, { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import Stamp from '@commercetools-uikit/stamp';
import messages from './messages';
import { TTone } from '@commercetools-uikit/stamp/dist/declarations/src/stamp';

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

export const mapStatusCodeToTone = (statusCode: string): TTone | undefined => {
  switch (statusCode) {
    case 'unpublished':
    case 'unpublish':
      return 'critical';
    case 'published':
    case 'publish':
      return 'primary';
    case 'modified':
      return 'warning';
    default:
      return undefined;
  }
};

const StatusBadge: FC<Props> = ({ className, code }) => (
  <div data-testid="status-badge">
    <Stamp
      isCondensed={true}
      tone={mapStatusCodeToTone(code)}
      label={messages[code].defaultMessage}
    />
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
