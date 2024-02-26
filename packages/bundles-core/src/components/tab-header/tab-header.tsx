import PropTypes, { ReactNodeLike } from 'prop-types';
import React, { FC } from 'react';
import classnames from 'classnames';
import { Link, withRouter, matchPath } from 'react-router-dom';
import styles from './tab-header.mod.css';

const pathWithoutSearch = (path) => path.split('?')[0];

interface LinkWrapperProps {
  to: string | null;
  children: React.ReactNode;
  className?: string;
}

// Suggested from https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/guides/migrating.md#link
const LinkWrapper: FC<LinkWrapperProps> = (props) => {
  const Component = props.to ? Link : 'a';
  return <>FIX ME</>; // <Component {...props}>{props.children}</Component>;
};
LinkWrapper.displayName = 'LinkWrapper';
LinkWrapper.propTypes = {
  to: PropTypes.string,
  children: PropTypes.node.isRequired,
};

type Props = {
  children: NonNullable<ReactNodeLike>;
  name: string;
  to: string;
  isDisabled?: boolean;
  exact?: boolean;
  // Injected
  location: {
    pathname: string;
  };
};

export const TabHeader: FC<Props> = (props) => (
  <li
    className={classnames(
      styles['header-list-item'],
      {
        [styles['header-list-item--active']]: Boolean(
          matchPath(props.location.pathname, {
            // strip the search, otherwise the path won't match
            path: pathWithoutSearch(props.to),
            exact: props.exact,
            strict: false,
          })
        ),
      },
      { [styles['header-list-item--disabled']]: props.isDisabled }
    )}
    data-track-component="Tab"
    data-track-event="click"
    data-track-label={props.name}
    data-testid={`header-list-item-${props.name}`}
  >
    <LinkWrapper
      to={props.isDisabled ? null : props.to}
      className={
        props.isDisabled ? styles['tab-text--disabled'] : styles['tab-text']
      }
    >
      {props.children}
    </LinkWrapper>
  </li>
);

TabHeader.displayName = 'TabHeader';

TabHeader.defaultProps = {
  isDisabled: false,
  exact: false,
};

// @ts-ignore
export default withRouter(TabHeader);
