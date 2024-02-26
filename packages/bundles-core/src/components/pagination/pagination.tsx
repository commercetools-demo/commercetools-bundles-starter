import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import Spacings from '@commercetools-uikit/spacings';
import FlatButton from '@commercetools-uikit/flat-button';
import messages from './messages';

type Props = {
  next(...args: unknown[]): unknown;
  previous(...args: unknown[]): unknown;
  offset: number;
  rowCount: number;
  total: number;
};

export const Pagination: FC<Props> = ({
  previous,
  next,
  offset,
  rowCount,
  total,
}) => {
  const disabled = {
    next: offset + rowCount === total,
    previous: offset === 0,
  };
  const intl = useIntl();

  return (
    <Spacings.Inline
      data-testid="pagination"
      scale="m"
      justifyContent="flex-end"
    >
      <FlatButton
        data-testid="previous-button"
        label={intl.formatMessage(messages.previousButton)}
        isDisabled={disabled.previous}
        onClick={previous}
      />
      <FlatButton
        data-testid="next-button"
        label={intl.formatMessage(messages.nextButton)}
        isDisabled={disabled.next}
        onClick={next}
      />
    </Spacings.Inline>
  );
};
Pagination.displayName = 'Pagination';

export default Pagination;
