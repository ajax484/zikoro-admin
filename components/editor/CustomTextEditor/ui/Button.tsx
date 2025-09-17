//

import type {JSX} from 'react';

import './Button.css';

import * as React from 'react';
import {ReactNode} from 'react';

import joinClasses from '../utils/joinClasses';

export default function Button({
  'data-test-id': dataTestId,
  children,
  className,
  onClick,
  disabled,
  small,
  title,
  style
}: {
  'data-test-id'?: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick: () => void;
  small?: boolean;
  title?: string;
  style?: React.CSSProperties 
}): JSX.Element {
  return (
    <button
    style={style}
      disabled={disabled}
      className={joinClasses(
        'Button__root',
        disabled && 'Button__disabled',
        small && 'Button__small',
        className,
      )}
      onClick={onClick}
      title={title}
      aria-label={title}
      {...(dataTestId && {'data-test-id': dataTestId})}>
      {children}
    </button>
  );
}
