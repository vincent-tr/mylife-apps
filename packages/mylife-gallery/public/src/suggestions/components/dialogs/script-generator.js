'use strict';

import { React, PropTypes, mui, useState, useRef } from 'mylife-tools-ui';

const useStyles = mui.makeStyles(theme => ({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  criteria: {
    margin: theme.spacing(2),
  },
  buttons: {
    margin: theme.spacing(2),
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  script: {
    flex: '1 1 auto',
    margin: theme.spacing(2),
  },
  scriptField: {
    height: '100%',
  }
}));

const ScriptGenerator = ({ paths, ...props}) => {
  const classes = useStyles();
  const scriptElementRef = useRef(null);

  const [pathSeparator, setPathSeparator] = useState('\\');
  const [filePlaceholder, setFilePlaceholder] = useState('${file}');
  const [template, setTemplate] = useState('Remove-Item –path "${file}" -whatif\n');
  const [script, setScript] = useState('');

  const onGenerate = () => setScript(generate({ paths, pathSeparator, filePlaceholder, template }));

  const onCopy = () => {
    // https://www.w3schools.com/howto/howto_js_copy_clipboard.asp
    const inputElement = scriptElementRef.current;
    inputElement.select();
    document.execCommand('copy');
  };

  return (
    <div className={classes.container}>
      <div className={classes.criteria}>
        <mui.Grid container spacing={2} {...props}>
          <mui.Grid item xs={6} container spacing={2}>
            <mui.Grid item xs={12}>
              <mui.Typography>{'Modèle'}</mui.Typography>
            </mui.Grid>
            <mui.Grid item xs={12}>
              <mui.TextField value={template} onChange={e => setTemplate(e.target.value)} fullWidth multiline rows={6} variant='outlined' />
            </mui.Grid>
          </mui.Grid>
          <mui.Grid item xs={6} container spacing={2}>
            <mui.Grid item xs={12} />
            <mui.Grid item xs={4}>
              <mui.Typography>{'Séparateur de chemin'}</mui.Typography>
            </mui.Grid>
            <mui.Grid item xs={8}>
              <mui.TextField value={pathSeparator} onChange={e => setPathSeparator(e.target.value)} fullWidth />
            </mui.Grid>
            <mui.Grid item xs={4}>
              <mui.Typography>{'Séquence de remplacement'}</mui.Typography>
            </mui.Grid>
            <mui.Grid item xs={8}>
              <mui.TextField value={filePlaceholder} onChange={e => setFilePlaceholder(e.target.value)} fullWidth />
            </mui.Grid>
            <mui.Grid item xs={12} />
            <mui.Grid item xs={12} />
          </mui.Grid>
        </mui.Grid>
      </div>
      <div className={classes.buttons}>
        <mui.Button onClick={onGenerate} variant='contained' color='primary'>{'Générer le script'}</mui.Button>
        <mui.Button onClick={onCopy} variant='contained'>{'Copier'}</mui.Button>
      </div>
      <div className={classes.script}>
        <mui.TextField
          value={script}
          onChange={e => setScript(e.target.value)}
          inputRef={scriptElementRef}
          fullWidth
          multiline
          variant='outlined'
          className={classes.scriptField}
          InputProps={{className: classes.scriptField /* InputProps = wrapper div props, inputProps = textarea props */ }}
          inputProps={{style: { height: '100%', overflow: 'auto' /* cannot use class because it is overhidden */ }}}
        />
      </div>
    </div>
  );
};

ScriptGenerator.propTypes = {
  className: PropTypes.string,
  paths: PropTypes.array.isRequired,
};

export default ScriptGenerator;

function generate({ paths, pathSeparator, filePlaceholder, template }) {
  const parts = paths.map(path => {
    const formattedPath = path.split('/').join(pathSeparator);
    return replaceAll(template, filePlaceholder, formattedPath);
  });

  return parts.join('');
}

// https://stackoverflow.com/questions/1144783/how-to-replace-all-occurrences-of-a-string
function replaceAll(str, search, replacement) {
  return str.split(search).join(replacement);
}
