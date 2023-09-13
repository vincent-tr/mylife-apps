'use strict';

import { React, PropTypes, mui, formatDate, addLineBreaks } from 'mylife-tools-ui';
import humanize from 'humanize';
import humanizeDuration from 'humanize-duration';

const DetailItem = ({ name, value, type }) =>  {
  if (!value) {
    return null;
  }

  if(!type) {
    if(Array.isArray(value)) {
      type = 'array';
    } else if(value instanceof Date) {
      type = 'date';
    }
  }

  switch(type) {
    case 'array': {
      if(value.length === 0) {
        return null;
      }

      value = addLineBreaks(value);
      break;
    }

    case 'date': {
      value = formatDate(value, 'dd/MM/yyyy HH:mm:ss');
      break;
    }

    case 'filesize': {
      value = humanize.filesize(value);
      break;
    }

    case 'duration': {
      value = humanizeDuration(value * 1000, { language: 'fr' });
      break;
    }

    default: {
      value = addLineBreaks(`${value}`.split('\n'));
      break;
    }
  }

  return (
    <mui.ListItem>
      <mui.ListItemText primary={name} secondary={value} />
    </mui.ListItem>
  );
};

DetailItem.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.any
};

export default DetailItem;
