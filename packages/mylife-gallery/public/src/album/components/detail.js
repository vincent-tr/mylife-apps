'use strict';

import { React, PropTypes, mui, useDispatch, useSelector, useMemo, DebouncedTextField } from 'mylife-tools-ui';
import { getFieldName } from '../../common/metadata-utils';
import { useKeywordView } from '../../common/keyword-view';
import { THUMBNAIL_SIZE, ThumbnailAlbum } from '../../common/thumbnail';
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

const useStyles = mui.makeStyles(theme => ({
  thumbnail: {
    // size + position
    height: THUMBNAIL_SIZE,
    width: THUMBNAIL_SIZE,

    // border
    borderWidth: 1,
    borderColor: mui.colors.grey[300],
    borderStyle: 'solid',

    // inner img positionning
    position: 'relative',
    '& > img': {
      position: 'absolute',
      margin: 'auto',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
  }
}));

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

const ThumbnailsField = ({ selectedDocuments }) => {
  const classes = useStyles();
  const { album, updateAlbum } = useConnect();
  const thumbnails = useMemo(() => extractThumbnails(selectedDocuments), [selectedDocuments]);
  const handleChange = () => updateAlbum(album, { thumbnails });

  return (
    <Field field='thumbnails'>
      <ThumbnailAlbum album={album} className={classes.thumbnail} />
      <mui.Button variant='contained' disabled={!thumbnails.length} onClick={handleChange}>
        {'Utiliser la sélection'}
      </mui.Button>
    </Field>
  );
};

ThumbnailsField.propTypes = {
  selectedDocuments: PropTypes.array.isRequired
};

const Detail = React.forwardRef(({ selectedDocuments, ...props }, ref) => {
  const { album } = useConnect();

  return (
    <mui.List ref={ref} {...props}>
      {album && (
        <>
          <TextField field='title' />
          <TextField field='caption' />
          <KeywordsField />
          <ThumbnailsField selectedDocuments={selectedDocuments} />
        </>
      )}
    </mui.List>
  );
});

Detail.displayName = 'Detail';

Detail.propTypes = {
  selectedDocuments: PropTypes.array.isRequired
};

export default Detail;

function extractThumbnails(documents) {
  const thumbnails = [];
  for(const document of documents) {
    switch(document._entity) {

      case 'image': {
        thumbnails.push(document.thumbnail);
        break;
      }

      case 'video': {
        for(const thumbnail of document.thumbnails) {
          thumbnails.push(thumbnail);
        }
        break;
      }

    }
  }
  return thumbnails;
}
