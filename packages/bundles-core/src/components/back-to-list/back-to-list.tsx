import React, { FC } from 'react';
import FlatButton from '@commercetools-uikit/flat-button';
import { ListIcon, BackIcon } from '@commercetools-uikit/icons';

type Props = {
  href: string;
  label: React.ReactNode;
  iconType?: 'list' | 'arrow';
};

export const BackToList: FC<Props> = ({ iconType = 'list', ...props }) => {
  const icon =
    iconType === 'list' ? (
      <ListIcon size="medium" color="primary" />
    ) : (
      <BackIcon size="medium" color="primary" />
    );
  return <FlatButton as="a" {...props} icon={icon} />;
};

BackToList.displayName = 'BackToList';

export default BackToList;
