'use strict';

import { React, PropTypes, useMemo, mui, useDispatch, useSelector, useLifecycle } from 'mylife-tools-ui';
import { updateDocument, fetchKeywordsView, clearKeywordsView } from '../../actions';
import { getKeywords } from '../../selectors';
import { getFieldName } from '../../../common/metadata-utils';


const useConnect = () => {
  const dispatch = useDispatch();
  return {
    ...useSelector(state => ({
      keywords: getKeywords(state)
    })),
    ...useMemo(() => ({
      updateDocument : (document, values) => dispatch(updateDocument(document, values)),
      fetchKeywordsView : () => dispatch(fetchKeywordsView()),
      clearView : () => dispatch(clearKeywordsView()),
    }), [dispatch])
  };
};

const ChipList = ({ values, onChange, list }) => (
  <mui.Autocomplete
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
  const { updateDocument, keywords, fetchKeywordsView, clearView } = useConnect();
  useLifecycle(fetchKeywordsView, clearView);

  const onChange = values => updateDocument(document, { keywords: values });

  return (
    <mui.ListItem>
      <mui.ListItemText
        disableTypography
        primary={
          <mui.Typography>{getFieldName('document', 'keywords')}</mui.Typography>
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
