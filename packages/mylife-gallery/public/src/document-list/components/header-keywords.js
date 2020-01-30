'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';

const useStyles = mui.makeStyles(theme => {
  const iconColor = mui.fade(theme.palette.text.primary, 0.26);
  return {
    // like Chip impl
    addIcon: {
      color: iconColor,
      '&:hover': {
        color: mui.fade(iconColor, 0.4)
      },
      marginRight: -theme.spacing(1)
    }

  };
});

const HeaderKeywords = ({ documents }) => {
  const classes = useStyles();
  const values = ['vmot1', 'vmot2', 'vmot3'];
  const onChange = (values) => console.log(values);
  return (
    <mui.Autocomplete
      multiple
      options={['mot1', 'mot2', 'mot3']}
      freeSolo
      disableClearable
      renderTags={(values, getTagProps) =>
        values.map((value, index) => (
          <mui.Chip key={index} variant='outlined' label={
            <>
              {value}
              <mui.Tooltip title={'Ajouter le mot clé à toute la sélection'}>
                <mui.IconButton size='small' className={classes.addIcon}>
                  <mui.icons.AddCircle />
                </mui.IconButton>
              </mui.Tooltip>
            </>
          } {...getTagProps({ index })} />
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
};

HeaderKeywords.propTypes = {
  documents: PropTypes.array.isRequired
};

export default HeaderKeywords;
