'use strict';

import { React, PropTypes, mui, fireAsync, useState, useEffect } from 'mylife-tools-ui';
import { makeUrl } from '../tools';
import ini from 'ini';

const useStyles = mui.makeStyles(theme => ({
  content: {
    margin: theme.spacing(2)
  }
}));

const Url = ({ data, ...props }) => {
  const url = useUrl(data);
  const classes = useStyles();

  if(!url) {
    return (
      <div {...props}>
        <mui.Typography className={classes.content}>
          {`Chargement ...`}
        </mui.Typography>
      </div>
    );
  }

  return (
    <div {...props}>
      <mui.Tooltip title={url}>
        <mui.Button variant='contained' color='primary' href={url} target='_blank' className={classes.content}>
          Ouvrir
        </mui.Button>
      </mui.Tooltip>
    </div>
  );
};

Url.propTypes = {
  data: PropTypes.object.isRequired,
};

export default Url;

function useUrl(data) {
  const sourceUrl = makeUrl(data);
  const [result, setResult] = useState(null);
  useEffect(() => {
    fireAsync(async () => {
      setResult(null);
      const res = await fetchAndParse(sourceUrl);
      setResult(res);
    });
  }, [sourceUrl]);

  return result;
}

async function fetchAndParse(url) {
  const response = await fetch(url);
  const text = await response.text();
  const content = ini.parse(text);
  return content.InternetShortcut.URL;
}