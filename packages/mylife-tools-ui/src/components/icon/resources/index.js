'use strict';

import React from 'react';
import SvgIcon from '../svg-icon';

import spinner from '-!svg-react-loader!./spinner.svg';
import info from '-!svg-react-loader!./info.svg';
import error from '-!svg-react-loader!./error.svg';

export const Spinner = ({ ... props }) => (<SvgIcon as={spinner} {...props} />);
export const InfoSvg = ({ ... props }) => (<SvgIcon as={info} {...props} />);
export const ErrorSvg = ({ ... props }) => (<SvgIcon as={error} {...props} />);
