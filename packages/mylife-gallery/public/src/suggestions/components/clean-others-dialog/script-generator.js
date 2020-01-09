'use strict';

import { React, PropTypes, mui, useState, useRef } from 'mylife-tools-ui';

const useStyles = mui.makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    margin: theme.spacing(2),
  },
  scriptField: {
    height: '100%'
  }
}));

const ScriptGenerator = ({ documents, ...props}) => {
  const classes = useStyles();
  const scriptElementRef = useRef(null);

  const [pathSeparator, setPathSeparator] = useState('\\');
  const [filePlaceholder, setFilePlaceholder] = useState('${file}');
  const [template, setTemplate] = useState('Remove-Item –path "${file}" -whatif \n');
  const [script, setScript] = useState('');

  const onGenerate = () => setScript(generate({ documents, pathSeparator, filePlaceholder, template }));

  const onCopy = () => {
    // https://www.w3schools.com/howto/howto_js_copy_clipboard.asp
    const inputElement = scriptElementRef.current;
    inputElement.select();
    document.execCommand('copy');
  };

  return (
    <div {...props}>
      <mui.Paper variant='outlined' className={classes.paper}>
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
      </mui.Paper>
      <mui.Button onClick={onGenerate}>{'Générer le script'}</mui.Button>
      <mui.Button onClick={onCopy}>{'Copier'}</mui.Button>
      <mui.TextField value={script} onChange={e => setScript(e.target.value)} inputRef={scriptElementRef} fullWidth multiline variant='outlined' className={classes.scriptField} />
    </div>
  );
};

ScriptGenerator.propTypes = {
  documents: PropTypes.array.isRequired,
};

export default ScriptGenerator;

function generate({ documents, pathSeparator, filePlaceholder, template }) {
  const paths = [];
  for(const document of documents) {
    for(const { path } of document.paths) {
      paths.push(path);
    }
  }

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
