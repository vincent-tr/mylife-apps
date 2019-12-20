'use strict';

import { React, PropTypes, mui, formatDate } from 'mylife-tools-ui';
import humanize from 'humanize';

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
      value = formatDate(value, 'dd/MM/yyyy');
      break;
    }

    case 'filesize': {
      value = humanize.filesize(value);
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

function addLineBreaks(values) {
  return values.map((text, index) => (
    <React.Fragment key={index}>
      {text}
      {index < values.length -1 && (
        <br />
      )}
    </React.Fragment>
  ));
}
