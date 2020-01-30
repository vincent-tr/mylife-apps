'use strict';

import { React, PropTypes, mui, useDispatch, useSelector, useMemo, DebouncedTextField } from 'mylife-tools-ui';
import { getFieldName } from '../../common/metadata-utils';
import { useKeywordView } from '../../common/keyword-view';
import { updateAlbum } from '../actions';
import { getAlbum } from '../selectors';

const useConnect = () => {
  const dispatch = useDispatch();
  return {
    ...useSelector(state => ({
      album: getAlbum(state),
    })),
    ...useMemo(() => ({
      updateAlbum: (album, values) => dispatch(updateAlbum(album, values)),
    }), [dispatch])
  };
};

const Field = ({ field, children }) => (
  <mui.ListItem>
    <mui.ListItemText
      disableTypography
      primary={
        <mui.Typography>
          {getFieldName('album', field)}
        </mui.Typography>
      }
      secondary={children} />
  </mui.ListItem>
);

Field.propTypes = {
  field: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([ PropTypes.arrayOf(PropTypes.node), PropTypes.node ]),
};

const TextField = ({ field }) => {
  const { album, updateAlbum } = useConnect();
  const value = album[field];
  const onChanged = value => updateAlbum(album, { [field]: value });

  return (
    <Field field={field}>
      <DebouncedTextField value={value} onChange={onChanged} />
    </Field>
  );
};

TextField.propTypes = {
  field: PropTypes.string.isRequired,
};

const KeywordsField = () => {
  const { keywords } = useKeywordView();
  const { album, updateAlbum } = useConnect();
  const values = album.keywords;
  const onChange = (e, values) => updateAlbum(album, { keywords: values });

  return (
    <Field field='keywords'>
      <mui.Autocomplete
        filterSelectedOptions
        multiple
        options={keywords}
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
        onChange={onChange}
      />
    </Field>
  );
};

const Detail = React.forwardRef(({ ...props }, ref) => {
  const { album } = useConnect();

  return (
    <mui.List ref={ref} {...props}>
      {album && (
        <>
          <TextField field='title' />
          <TextField field='caption' />
          <KeywordsField />
          Thumbnails
        </>
      )}
    </mui.List>
  );
});
Detail.displayName = 'Detail';


export default Detail;
