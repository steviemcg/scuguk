import React from 'react';
import cn from 'classnames';
import styles from './Container.module.scss';

type ContainerProps = {
  className?: string;
  children: React.ReactNode;
};

const Container = ({ className, children }: ContainerProps) => (
  <div className={cn(styles.container, className)}>{children}</div>
);

export default Container;
