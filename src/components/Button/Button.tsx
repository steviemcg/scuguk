import Link from 'next/link';
import styles from './Button.module.scss';
import cn from 'classnames';

type ButtonProps = {
  href?: string;
  children?: React.ReactNode;
  className?: string;
};

const Button = ({ href, children, className }: ButtonProps) =>
  href ? (
    <Link className={cn(styles.button, className)} href={href}>
      {children}
    </Link>
  ) : (
    <button className={cn(styles.button, className)} type='submit'>
      {children}
    </button>
  );

export default Button;
