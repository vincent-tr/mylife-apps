'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';
import icons from '../../../common/icons';

const useStyles = mui.makeStyles(theme => ({
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const NavBar = ({ documentWithInfo, showDetail, onClose, onDetail, onPrev, onNext, ...props }) => {
  const { info } = documentWithInfo;
  const downloadInfo = getDownloadInfo(documentWithInfo);
  const classes = useStyles();
  return (
    <mui.AppBar {...props}>
      <mui.Toolbar>
        <mui.IconButton edge='start' color='inherit' onClick={onClose}>
          <icons.actions.Close />
        </mui.IconButton>
        <mui.IconButton color='inherit' onClick={onPrev} disabled={!onPrev}>
          <icons.actions.Previous />
        </mui.IconButton>
        <mui.IconButton color='inherit' onClick={onNext} disabled={!onNext}>
          <icons.actions.Next />
        </mui.IconButton>
        <mui.Typography variant='h6' className={classes.title}>
          {info.title}
        </mui.Typography>
        {showDetail && (
          <mui.IconButton color='inherit' onClick={onDetail}>
            <icons.actions.Detail />
          </mui.IconButton>
        )}
        <mui.IconButton edge='end' color='inherit' component={mui.Link} download={downloadInfo.filename} href={downloadInfo.url}>
          <icons.actions.Download />
        </mui.IconButton>
      </mui.Toolbar>
    </mui.AppBar>
  );
};

NavBar.propTypes = {
  documentWithInfo: PropTypes.object.isRequired,
  showDetail: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onDetail: PropTypes.func,
  onPrev: PropTypes.func,
  onNext: PropTypes.func,
};

export default NavBar;

function getDownloadInfo(documentWithInfo) {
  const { document, info } = documentWithInfo;
  return {
    filename: info.title,
    url: `/content/raw/${document._entity}/${document._id}`
  };
}
