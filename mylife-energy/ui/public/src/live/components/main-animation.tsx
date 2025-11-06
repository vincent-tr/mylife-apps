import React, { useMemo } from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { useScreenPhone, services } from 'mylife-tools-ui';
import icons from '../../common/icons';
import { getDevice, getFirstDeviceByType, getMeasure } from '../selectors';
import { LiveDevice } from '../../../../shared/metadata';
import { DeviceMeasure } from './common';
import { makeStyles, Paper, Typography, SvgIcon, colors } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  wrapper: {
    alignSelf: 'center',
  },
  wrapperSmall: {
    height: 200,
    width: 375,
  },
  container: {
    display: 'grid',
    gridTemplateColumns: '250px 250px 250px',
    gridTemplateRows: '200px 200px',
  },
  containerSmall: {
    transform: 'scale(0.5)',
    transformOrigin: 'top left',
    marginBottom: -200
  },
  cell: {
    alignSelf: 'center',
    justifySelf: 'center',
  },
  main: {
    gridColumn: 1,
    gridRow: 2,
  },
  solar: {
    gridColumn: 2,
    gridRow: 1,
  },
  total: {
    gridColumn: 3,
    gridRow: 2,
  },
  arrows: {
    gridColumn: 2,
    gridRow: 2,

    alignSelf: 'top',
    justifySelf: 'center',
  },
}));

const MainAnimation: React.FunctionComponent = () => {
  const classes = useStyles();
  const isPhone = useScreenPhone();

  const main = useSelector(state => getFirstDeviceByType(state, 'main'));
  const solar = useSelector(state => getFirstDeviceByType(state, 'solar'));
  const total = useSelector(state => getFirstDeviceByType(state, 'total'));

  const mainCurrent = useSelector(state => getMeasure(state, main?._id, 'current'))?.value;
  const solarCurrent = useSelector(state => getMeasure(state, solar?._id, 'current'))?.value;
  const totalCurrent = useSelector(state => getMeasure(state, total?._id, 'current'))?.value;

  if (!main || !solar || !total) {
    return null;
  }

  const solarToMain = solarCurrent > 0 && mainCurrent < 0;
  const solarToTotal = solarCurrent > 0 && totalCurrent > 0;
  const mainToTotal = mainCurrent > 0 && totalCurrent > 0;

  return (
    <div className={clsx(classes.wrapper, isPhone && classes.wrapperSmall)}>
      <div className={clsx(classes.container, isPhone && classes.containerSmall)}>
        <DeviceView className={clsx(classes.cell, classes.main)} deviceId={main._id} sensorKeys={['apparent-power']} />
        <DeviceView className={clsx(classes.cell, classes.solar)} deviceId={solar._id} sensorKeys={['apparent-power']} />
        <DeviceView className={clsx(classes.cell, classes.total)} deviceId={total._id} sensorKeys={['apparent-power', 'real-power']} />
        <ArrowsArea className={classes.arrows} solarToMain={solarToMain} solarToTotal={solarToTotal} mainToTotal={mainToTotal} />
      </div>
    </div>
  );
};

export default MainAnimation;

const useDeviceStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    width: 150,
    height: 100,
    alignItems: 'center',
  },
  icon: {
    height: 50,
    width: 50,
  },
}));

const DeviceView: React.FunctionComponent<{ deviceId: string; className?: string; sensorKeys: string[]; }> = ({ deviceId, className, sensorKeys }) => {
  const classes = useDeviceStyles();
  const device = useSelector(state => getDevice(state, deviceId));

  if (!device) {
    return null;
  }

  const Icon = getIcon(device);

  return (
    <Paper variant="outlined" className={clsx(classes.container, className)}>
      <Icon className={classes.icon} />
      <Typography>{device.display}</Typography>
      <DeviceMeasure deviceId={device._id} sensorKeys={sensorKeys} />
    </Paper>
  );
};

function getIcon(device: LiveDevice): typeof SvgIcon {
  switch(device.type) {
    case 'main':
      return icons.devices.Main;
    case 'total':
      return icons.devices.Total;
    case 'solar':
      return icons.devices.Solar;
  }

  return null;
}

const useArrowsStyles = makeStyles(theme => ({
  container: {
    width: 250,
    height: 150,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  subContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  topArrow: {
    width: 125,
    height: 125,
  },
  bottomArrow: {
    width: 250,
    height: 25,
  }
}));

const ArrowsArea: React.FunctionComponent<{ className?: string; solarToMain: boolean; solarToTotal: boolean; mainToTotal: boolean; }> = ({ className, solarToMain, solarToTotal, mainToTotal }) => {
  const classes = useArrowsStyles();

  return (
    <div className={clsx(classes.container, className)}>
      <div className={classes.subContainer}>
        <div className={classes.topArrow}>
          {solarToMain && (
            <ArrowTopToLeft />
          )}
        </div>

        <div className={classes.topArrow}>
          {solarToTotal && (
            <ArrowTopToRight />
          )}
        </div>
      </div>

      <div className={classes.bottomArrow}>
        {mainToTotal && (
          <ArrowLeftToRight />
        )}
      </div>
    </div>
  );
}

// Taken from https://enlighten.enphaseenergy.com/

const ArrowTopToRight: React.FunctionComponent = () => {
  const colors = useColors();

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 118.047 110.756">
      <g id="pv_to_consume_1_" data-name="pv to consume (1)" transform="translate(0 22)">
        <g id="pointer-solar-home" transform="translate(0 -7)">
          <circle id="Oval_Copy_8" cx="6.916" cy="6.916" r="5" fill={colors.good} opacity="0.2"></circle>
          <circle id="Oval_Copy_9" cx="2.305" cy="2.305" r="2" transform="translate(4.611 4.611)"fill={colors.good}></circle>
        </g>
        <g id="P_C" transform="translate(6.916)">
          <path id="Arrow_head" d="M86.611,71.575a.461.461,0,0,1-.1.288l-3.953,4.255a.3.3,0,0,1-.361.073.392.392,0,0,1-.2-.35v-8.46a.372.372,0,0,1,.2-.346.311.311,0,0,1,.36.058l3.953,4.2a.424.424,0,0,1,.1.282Z" transform="translate(24.52 10.23)"fill={colors.good}></path>
          <path id="motion-path-solar-home" d="M0-22V70.313A11.527,11.527,0,0,0,11.527,81.84h97.3" fill="none" stroke={colors.good} strokeWidth="1" fillRule="evenodd"></path>
        </g>
      </g>
      <animateMotion xlinkHref="#pointer-solar-home" dur="3s" begin="0s" fill="freeze" repeatCount="indefinite">
        <mpath xlinkHref="#motion-path-solar-home"></mpath>
      </animateMotion>
    </svg>
  );
};

const ArrowTopToLeft: React.FunctionComponent = () => {
  const colors = useColors();

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 118.046 110.756">
      <g id="pv_to_grid" data-name="pv to grid" transform="translate(12 22)">
        <g id="pointer-solar-grid" transform="translate(-6.5 -7)">
          <circle id="Oval_Copy_8" cx="6.916" cy="6.916" r="5" fill={colors.good} opacity="0.2"></circle>
          <circle id="Oval_Copy_9" cx="2.305" cy="2.305" r="2" transform="translate(4.611 4.611)" fill={colors.good}></circle>
        </g>
        <g id="P_G">
          <path id="motion-path-solar-grid" d="M98.825-22V70.313A11.527,11.527,0,0,1,87.3,81.84H-10" transform="translate(0.305)" fill="none" stroke={colors.good} strokeWidth="1" fillRule="evenodd"></path>
          <path id="Arrow_head" d="M0,71.575a.461.461,0,0,0,.1.288l3.953,4.255a.3.3,0,0,0,.361.073.392.392,0,0,0,.2-.349v-8.46a.372.372,0,0,0-.2-.346.311.311,0,0,0-.36.06L.1,71.3a.424.424,0,0,0-.1.275Z" transform="translate(-12 10.23)" fill={colors.good}></path>
        </g>
      </g>
      <animateMotion xlinkHref="#pointer-solar-grid" dur="3s" begin="0s" fill="freeze" repeatCount="indefinite">
        <mpath xlinkHref="#motion-path-solar-grid"></mpath>
      </animateMotion>
    </svg>
  );
};

const ArrowLeftToRight: React.FunctionComponent = () => {
  const colors = useColors();

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 244.803 13.857">
      <g id="Grid_to_consumption" data-name="Grid to consumption" transform="translate(0.001)">
        <g id="arrow" transform="translate(0.5 2.309)">
          <path id="motion-path-grid-home" data-name="arrow body" d="M58,1.078,299.338.5" transform="translate(-58 3.618)" fill="none" stroke={colors.bad} strokeWidth="1"></path>
          <path id="Arrow_head" data-name="Arrow head" d="M4.619,4.583a.458.458,0,0,1-.1.289L.557,9.133A.3.3,0,0,1,.2,9.206.392.392,0,0,1,0,8.856V.382A.373.373,0,0,1,.2.033a.312.312,0,0,1,.361.06L4.516,4.306A.425.425,0,0,1,4.619,4.583Z" transform="translate(239.183 -0.5)" fill={colors.bad}></path>
        </g>
        <g id="pointer-grid-home" transform="translate(-50 13.0) rotate(180)">
          <circle id="Oval_Copy_12" data-name="Oval Copy 12" cx="5" cy="6.928" r="5" fill={colors.bad} opacity="0.2"></circle>
          <circle id="Oval_Copy_13" data-name="Oval Copy 13" cx="2" cy="2.309" r="2" transform="translate(3.119 4.619)" fill={colors.bad}></circle>
        </g>
      </g>
      <animateMotion xlinkHref="#pointer-grid-home" dur="3s" begin="0s" fill="freeze" repeatCount="indefinite">
        <mpath xlinkHref="#motion-path-grid-home"></mpath>
      </animateMotion>
    </svg>
  );
};

function useColors() {
  const theme = services.useTheme();

  const colors = useMemo(() => ({
    bad: theme.palette.error.main,
    good: theme.palette.success.main,
    neutral: colors.grey[100],
  }), [theme]);

  return colors;
}
