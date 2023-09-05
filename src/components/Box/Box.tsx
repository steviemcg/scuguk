import React from 'react';
import cn from 'classnames';
import styles from './Box.module.scss';
import Button from '../Button';

type BoxProps = {
  small?: boolean;
  background?: string;
  heading?: string;
  link?: {
    text: string;
    href: string;
  };
  theme: 'green' | 'white';
  children?: React.ReactNode;
};

const Box = ({ small, background, heading, theme, link, children }: BoxProps) => {
  const backgroundImage = background ? `url(${background})` : 'none';

  return (
    <section
      className={cn(styles.box, styles[`box--${theme}`], {
        [styles['box--small']]: small,
      })}
      style={{ backgroundImage }}
    >
      {heading && <h2>{heading}</h2>}
      <div>{children}</div>
      {link && (
        <div className={styles['box__button-wrapper']}>
          <Button href={link.href}>{link.text}</Button>
        </div>
      )}
    </section>
  );
};

export default Box;
