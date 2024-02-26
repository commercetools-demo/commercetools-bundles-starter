import React, { FC } from 'react';
import styles from './view.mod.css';

type Props = {
  children?: React.ReactNode;
};

const View: FC<Props> = ({ children, ...rest }) => (
  <div className={styles.view} {...rest}>
    {children}
  </div>
);

View.displayName = 'View';

export default View;
