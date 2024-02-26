import PropTypes from 'prop-types';
import React, { FC } from 'react';
import classnames from 'classnames';
import Text from '@commercetools-uikit/text';
import styles from './view-header.mod.css';

type Props = {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  backToList?: React.ReactNode;
  withBottomLine?: boolean;
  color?: 'surface' | 'neutral';
  commands?: React.ReactNode;
  children?: React.ReactNode;
};

const ViewHeader: FC<Props> = ({
  backToList,
  title,
  subtitle,
  children,
  commands,
  color = 'neutral',
  withBottomLine = true,
}) => (
  <div
    className={classnames(styles[`header-color-${color}`], {
      [styles['header-color-with-bottom-line']]: withBottomLine,
    })}
  >
    <div className={styles.details}>
      <div className={styles.info}>
        {backToList || null}
        <div className={styles['title-container']}>
          <Text.Headline as="h2">{title}</Text.Headline>
        </div>
        {Boolean(subtitle) && (
          <div className={styles['subtitle-container']}>{subtitle}</div>
        )}
        <div className={styles.tabs}>
          <ul className={styles['tabs-list']}>{children}</ul>
        </div>
      </div>
      <div className={styles.commands}>{commands || null}</div>
    </div>
  </div>
);

ViewHeader.displayName = 'ViewHeader';

export default ViewHeader;
