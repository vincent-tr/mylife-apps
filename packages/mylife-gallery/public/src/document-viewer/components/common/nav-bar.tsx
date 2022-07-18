import { React, PropTypes, mui, useScreenSize } from 'mylife-tools-ui';
import icons from '../../../common/icons';

const useStyles = mui.makeStyles(theme => ({
  pad: {
    flex: 1
  },
  titleNormal: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  titleSmall: {
    flex: 1,
    textAlign: 'center'
  }
}));

interface NavBarProps {
  className?: string;
  documentWithInfo;
  showDetail?: boolean;
  onClose: () => void;
  onDetail?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

const NavBar: React.FunctionComponent<NavBarProps> = ({ documentWithInfo, showDetail = false, onClose, onDetail, onPrev, onNext, ...props }) => {
  const classes = useStyles();
  const screenSize = useScreenSize();
  const { info } = documentWithInfo;
  const downloadInfo = getDownloadInfo(documentWithInfo);

  const normalLayout = (
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
        <mui.Typography variant='h6' className={classes.titleNormal}>
          {info.title}
        </mui.Typography>
        {showDetail && (
          <mui.IconButton color='inherit' onClick={onDetail}>
            <icons.actions.Detail />
          </mui.IconButton>
        )}
        {downloadInfo && (
          <mui.IconButton edge='end' color='inherit' component={mui.Link} download={downloadInfo.filename} href={downloadInfo.url}>
            <icons.actions.Download />
          </mui.IconButton>
        )}
      </mui.Toolbar>
    </mui.AppBar>
  );

  const smallLayout = (
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

        <div className={classes.pad} />

        {showDetail && (
          <mui.IconButton color='inherit' onClick={onDetail}>
            <icons.actions.Detail />
          </mui.IconButton>
        )}
        {downloadInfo && (
          <mui.IconButton edge='end' color='inherit' component={mui.Link} download={downloadInfo.filename} href={downloadInfo.url}>
            <icons.actions.Download />
          </mui.IconButton>
        )}
      </mui.Toolbar>

      <mui.Toolbar>
        <mui.Typography variant='h6' className={classes.titleSmall}>
          {info.title}
        </mui.Typography>
      </mui.Toolbar>
    </mui.AppBar>
  );

  switch(screenSize) {
    case 'phone':
      return smallLayout;

    case 'tablet':
    case 'laptop':
    case 'wide':
      return normalLayout;
  }
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
  if(document.paths.length === 0) {
    return null;
  }
  
  const extension = document.paths[0].path.split('.').pop();
  return {
    filename: `${info.title}.${extension}`,
    url: `/content/raw/${document._entity}/${document._id}`
  };
}
