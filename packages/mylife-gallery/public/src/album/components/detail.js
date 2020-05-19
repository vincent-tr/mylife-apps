'use strict';

import { React, PropTypes, mui, routing, useDispatch, useSelector, useMemo, DebouncedTextField, DeleteButton, services } from 'mylife-tools-ui';
import { useKeywordView } from '../../common/keyword-view';
import { THUMBNAIL_SIZE, ThumbnailAlbum } from '../../common/thumbnail';
import { updateAlbum, deleteAlbum } from '../actions';
import { getAlbum } from '../selectors';

const useConnect = () => {
  const dispatch = useDispatch();
  return {
    ...useSelector(state => ({
      album: getAlbum(state),
    })),
    ...useMemo(() => ({
      updateAlbum: (album, values) => dispatch(updateAlbum(album, values)),
      deleteAlbum: (album) => dispatch(deleteAlbum(album)),
    }), [dispatch])
  };
};

const useStyles = mui.makeStyles(theme => ({
  thumbnail: {
    // size + position
    height: THUMBNAIL_SIZE,
    width: THUMBNAIL_SIZE,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),

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
          {services.getFieldName('album', field)}
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
      <DebouncedTextField value={value} onChange={onChanged} fullWidth />
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

const DeleteAlbum = () => {
  const { album, deleteAlbum } = useConnect();
  const { navigate } = routing.useRoutingConnect();

  const handleDelete = () => {
    // navigate on delete because the album is not available right after
    deleteAlbum(album);
    navigate('/'); // goto home => album list
  };

  return (
    <mui.ListItem>
      <mui.ListItemText
        disableTypography
        primary={
          <DeleteButton
            tooltip={'Supprimer l\'album'}
            icon
            text='Supprimer'
            confirmText={`Etes-vous sûr de vouloir supprimer l'album '${album.title}' ?`}
            onConfirmed={handleDelete}
          />
        }
      />
    </mui.ListItem>
  );
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
          <DeleteAlbum />
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
