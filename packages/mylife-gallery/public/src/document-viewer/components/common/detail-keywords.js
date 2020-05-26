'use strict';

import { React, PropTypes, useMemo, mui, useDispatch, services } from 'mylife-tools-ui';
import { updateDocument } from '../../actions';
import { useKeywordView } from '../../../common/shared-views';

const useConnect = () => {
  const dispatch = useDispatch();
  return useMemo(() => ({
    updateDocument : (document, values) => dispatch(updateDocument(document, values)),
  }), [dispatch]);
};

const ChipList = ({ values, onChange, list }) => (
  <mui.Autocomplete
    filterSelectedOptions
    multiple
    options={list}
    freeSolo
    disableClearable
    renderTags={(values, getTagProps) =>
      values.map((value, index) => (
        <mui.Chip key={index} variant='outlined' label={value} {...getTagProps({ index })} />
      ))
    }
    renderInput={params => (
      <mui.TextField
        {...params}
        placeholder='Mot clé'
        fullWidth
      />
    )}
    value={values}
    onChange={(e, values) => onChange(values)}
  />
);

ChipList.propTypes = {
  values: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  list: PropTypes.array.isRequired
};

const DetailKeywords = ({ document }) => {
  const { updateDocument } = useConnect();
  const { keywords } = useKeywordView();

  const onChange = values => updateDocument(document, { keywords: values });

  return (
    <mui.ListItem>
      <mui.ListItemText
        disableTypography
        primary={
          <mui.Typography>{services.getFieldName('document', 'keywords')}</mui.Typography>
        }
        secondary={
          <ChipList values={document.keywords} onChange={onChange} list={keywords} />
        } />
    </mui.ListItem>
  );
};

DetailKeywords.propTypes = {
  document: PropTypes.object.isRequired
};

export default DetailKeywords;
