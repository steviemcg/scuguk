import React from 'react';
import cn from 'classnames';

/**
 * Minimal stand-ins for reactstrap's `Row` and `Col`, which were the only two things
 * this site ever imported from it. They emit the same Bootstrap 5 grid classes the
 * stylesheet already ships, so the markup is unchanged — this is a dependency removal,
 * not a layout change.
 *
 * Only the props the call sites actually use are supported: xs/sm/md/lg as a column
 * count, plus the usual div attributes. Add a breakpoint here if a page needs one.
 */

type Size = number | string;

type ColProps = React.HTMLAttributes<HTMLDivElement> & {
  xs?: Size;
  sm?: Size;
  md?: Size;
  lg?: Size;
};

export const Row = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('row', className)} {...props} />
);

export const Col = ({ xs, sm, md, lg, className, ...props }: ColProps) => {
  const sizes = [
    xs === undefined ? null : `col-${xs}`,
    sm === undefined ? null : `col-sm-${sm}`,
    md === undefined ? null : `col-md-${md}`,
    lg === undefined ? null : `col-lg-${lg}`,
  ].filter(Boolean);

  // reactstrap fell back to a plain `col` when given no breakpoints at all.
  return <div className={cn(sizes.length ? sizes : 'col', className)} {...props} />;
};
