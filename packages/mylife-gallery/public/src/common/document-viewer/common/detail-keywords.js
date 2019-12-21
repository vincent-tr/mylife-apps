'use strict';

import { React, PropTypes, useMemo, mui, useDispatch, DebouncedTextField } from 'mylife-tools-ui';
import { updateDocument } from '../actions';
import { getFieldName } from '../../metadata-utils';

const useConnect = () => {
  const dispatch = useDispatch();
  return useMemo(() => ({
    updateDocument : (document, values) => dispatch(updateDocument(document, values)),
  }), [dispatch]);
};

const useStyles = mui.makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'left',
    flexWrap: 'wrap',
    padding: theme.spacing(0.5),
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));


const values = ['chip1', 'chip2', 'chip3'];

const ChipList = ({ values, onDelete }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {values.map((value, index) => {
        return (
          <mui.Chip
            key={value}
            label={value}
            onDelete={() => onDelete(index)}
            className={classes.chip}
          />
        );
      })}
    </div>
  );
};

const DetailKeywords = ({ document }) => {
  const { updateDocument } = useConnect();
  const onChanged = value => updateDocument(document, { keywords: value });

  return (
    <mui.ListItem>
      <mui.ListItemText
        disableTypography
        primary={
          <mui.Typography>{getFieldName('document', 'keywords')}</mui.Typography>
        }
        secondary={
          <ChipList values={values} onDelete={(index) => console.log('delete', index)} />
        } />
    </mui.ListItem>
  );
};

DetailKeywords.propTypes = {
  document: PropTypes.object.isRequired
};

export default DetailKeywords;
