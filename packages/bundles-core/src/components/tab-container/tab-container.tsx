import React, { FC } from 'react';
import styles from './tab-container.mod.css';

type Props = {
  color?: 'surface' | 'neutral';
  children?: React.ReactNode;
};

const TabContainer: FC<Props> = ({ color = 'surface', children, ...rest }) => (
  <div className={styles[`container-color-${color}`]} {...rest}>
    {children}
  </div>
);

TabContainer.displayName = 'TabContainer';

export default TabContainer;
