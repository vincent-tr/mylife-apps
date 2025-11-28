import * as muiColors from '@mui/material/colors';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useScreenPhone, services } from 'mylife-tools';
import { LiveDevice } from '../../api';
import icons from '../../common/icons';
import { getDevice, getFirstDeviceByType, getMeasure } from '../selectors';
import { DeviceMeasure } from './common';

interface WrapperProps {
  isPhone?: boolean;
}

const StyledWrapper = styled('div')<WrapperProps>(({ isPhone }) => ({
  alignSelf: 'center',
  ...(isPhone && {
    height: 200,
    width: 375,
  }),
}));

const StyledContainer = styled('div')<WrapperProps>(({ isPhone }) => ({
  display: 'grid',
  gridTemplateColumns: '250px 250px 250px',
  gridTemplateRows: '200px 200px',
  ...(isPhone && {
    transform: 'scale(0.5)',
    transformOrigin: 'top left',
    marginBottom: -200,
  }),
}));

const StyledCell = styled('div')(() => ({
  alignSelf: 'center',
  justifySelf: 'center',
}));

const MainCell = styled(StyledCell)(() => ({
  gridColumn: 1,
  gridRow: 2,
}));

const SolarCell = styled(StyledCell)(() => ({
  gridColumn: 2,
  gridRow: 1,
}));

const TotalCell = styled(StyledCell)(() => ({
  gridColumn: 3,
  gridRow: 2,
}));

const ArrowsCell = styled('div')(() => ({
  gridColumn: 2,
  gridRow: 2,
  alignSelf: 'top',
  justifySelf: 'center',
}));

export default function MainAnimation() {
  const isPhone = useScreenPhone();

  const main = useSelector((state) => getFirstDeviceByType(state, 'main'));
  const solar = useSelector((state) => getFirstDeviceByType(state, 'solar'));
  const total = useSelector((state) => getFirstDeviceByType(state, 'total'));

  const mainCurrent = useSelector((state) => getMeasure(state, main?._id, 'current'))?.value;
  const solarCurrent = useSelector((state) => getMeasure(state, solar?._id, 'current'))?.value;
  const totalCurrent = useSelector((state) => getMeasure(state, total?._id, 'current'))?.value;

  if (!main || !solar || !total) {
    return null;
  }

  const solarToMain = solarCurrent > 0 && mainCurrent < 0;
  const solarToTotal = solarCurrent > 0 && totalCurrent > 0;
  const mainToTotal = mainCurrent > 0 && totalCurrent > 0;

  return (
    <StyledWrapper isPhone={isPhone}>
      <StyledContainer isPhone={isPhone}>
        <DeviceView as={MainCell} deviceId={main._id} sensorKeys={['apparent-power']} />
        <DeviceView as={SolarCell} deviceId={solar._id} sensorKeys={['apparent-power']} />
        <DeviceView as={TotalCell} deviceId={total._id} sensorKeys={['apparent-power', 'real-power']} />
        <ArrowsArea as={ArrowsCell} solarToMain={solarToMain} solarToTotal={solarToTotal} mainToTotal={mainToTotal} />
      </StyledContainer>
    </StyledWrapper>
  );
}

const StyledDevicePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  width: 150,
  height: 100,
  alignItems: 'center',
}));

const StyledDeviceIcon = styled(SvgIcon)(() => ({
  height: 50,
  width: 50,
}));

interface DeviceViewProps {
  deviceId: string;
  as?: React.ElementType;
  sensorKeys: string[];
}

function DeviceView({ deviceId, as: Component = 'div', sensorKeys }: DeviceViewProps) {
  const device = useSelector((state) => getDevice(state, deviceId));

  if (!device) {
    return null;
  }

  const Icon = getIcon(device);

  return (
    <Component>
      <StyledDevicePaper variant="outlined">
        <StyledDeviceIcon as={Icon} />
        <Typography>{device.display}</Typography>
        <DeviceMeasure deviceId={device._id} sensorKeys={sensorKeys} />
      </StyledDevicePaper>
    </Component>
  );
}

function getIcon(device: LiveDevice): React.ComponentType<any> | null {
  switch (device.type) {
    case 'main':
      return icons.devices.Main;
    case 'total':
      return icons.devices.Total;
    case 'solar':
      return icons.devices.Solar;
  }

  return null;
}

const StyledArrowsContainer = styled('div')(() => ({
  width: 250,
  height: 150,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
}));

const StyledArrowsSubContainer = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'stretch',
}));

const StyledTopArrow = styled('div')(() => ({
  width: 125,
  height: 125,
}));

const StyledBottomArrow = styled('div')(() => ({
  width: 250,
  height: 25,
}));

function ArrowsArea({
  as: Component = 'div',
  solarToMain,
  solarToTotal,
  mainToTotal,
}: {
  as?: React.ElementType;
  solarToMain: boolean;
  solarToTotal: boolean;
  mainToTotal: boolean;
}) {
  return (
    <Component>
      <StyledArrowsContainer>
        <StyledArrowsSubContainer>
          <StyledTopArrow>{solarToMain && <ArrowTopToLeft />}</StyledTopArrow>

          <StyledTopArrow>{solarToTotal && <ArrowTopToRight />}</StyledTopArrow>
        </StyledArrowsSubContainer>

        <StyledBottomArrow>{mainToTotal && <ArrowLeftToRight />}</StyledBottomArrow>
      </StyledArrowsContainer>
    </Component>
  );
}

// Taken from https://enlighten.enphaseenergy.com/

function ArrowTopToRight() {
  const colors = useColors();

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 118.047 110.756">
      <g id="pv_to_consume_1_" data-name="pv to consume (1)" transform="translate(0 22)">
        <g id="pointer-solar-home" transform="translate(0 -7)">
          <circle id="Oval_Copy_8" cx="6.916" cy="6.916" r="5" fill={colors.good} opacity="0.2"></circle>
          <circle id="Oval_Copy_9" cx="2.305" cy="2.305" r="2" transform="translate(4.611 4.611)" fill={colors.good}></circle>
        </g>
        <g id="P_C" transform="translate(6.916)">
          <path
            id="Arrow_head"
            d="M86.611,71.575a.461.461,0,0,1-.1.288l-3.953,4.255a.3.3,0,0,1-.361.073.392.392,0,0,1-.2-.35v-8.46a.372.372,0,0,1,.2-.346.311.311,0,0,1,.36.058l3.953,4.2a.424.424,0,0,1,.1.282Z"
            transform="translate(24.52 10.23)"
            fill={colors.good}
          ></path>
          <path id="motion-path-solar-home" d="M0-22V70.313A11.527,11.527,0,0,0,11.527,81.84h97.3" fill="none" stroke={colors.good} strokeWidth="1" fillRule="evenodd"></path>
        </g>
      </g>
      <animateMotion xlinkHref="#pointer-solar-home" dur="3s" begin="0s" fill="freeze" repeatCount="indefinite">
        <mpath xlinkHref="#motion-path-solar-home"></mpath>
      </animateMotion>
    </svg>
  );
}

function ArrowTopToLeft() {
  const colors = useColors();

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 118.046 110.756">
      <g id="pv_to_grid" data-name="pv to grid" transform="translate(12 22)">
        <g id="pointer-solar-grid" transform="translate(-6.5 -7)">
          <circle id="Oval_Copy_8" cx="6.916" cy="6.916" r="5" fill={colors.good} opacity="0.2"></circle>
          <circle id="Oval_Copy_9" cx="2.305" cy="2.305" r="2" transform="translate(4.611 4.611)" fill={colors.good}></circle>
        </g>
        <g id="P_G">
          <path
            id="motion-path-solar-grid"
            d="M98.825-22V70.313A11.527,11.527,0,0,1,87.3,81.84H-10"
            transform="translate(0.305)"
            fill="none"
            stroke={colors.good}
            strokeWidth="1"
            fillRule="evenodd"
          ></path>
          <path
            id="Arrow_head"
            d="M0,71.575a.461.461,0,0,0,.1.288l3.953,4.255a.3.3,0,0,0,.361.073.392.392,0,0,0,.2-.349v-8.46a.372.372,0,0,0-.2-.346.311.311,0,0,0-.36.06L.1,71.3a.424.424,0,0,0-.1.275Z"
            transform="translate(-12 10.23)"
            fill={colors.good}
          ></path>
        </g>
      </g>
      <animateMotion xlinkHref="#pointer-solar-grid" dur="3s" begin="0s" fill="freeze" repeatCount="indefinite">
        <mpath xlinkHref="#motion-path-solar-grid"></mpath>
      </animateMotion>
    </svg>
  );
}

function ArrowLeftToRight() {
  const colors = useColors();

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 244.803 13.857">
      <g id="Grid_to_consumption" data-name="Grid to consumption" transform="translate(0.001)">
        <g id="arrow" transform="translate(0.5 2.309)">
          <path id="motion-path-grid-home" data-name="arrow body" d="M58,1.078,299.338.5" transform="translate(-58 3.618)" fill="none" stroke={colors.bad} strokeWidth="1"></path>
          <path
            id="Arrow_head"
            data-name="Arrow head"
            d="M4.619,4.583a.458.458,0,0,1-.1.289L.557,9.133A.3.3,0,0,1,.2,9.206.392.392,0,0,1,0,8.856V.382A.373.373,0,0,1,.2.033a.312.312,0,0,1,.361.06L4.516,4.306A.425.425,0,0,1,4.619,4.583Z"
            transform="translate(239.183 -0.5)"
            fill={colors.bad}
          ></path>
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
}

function useColors() {
  const theme = services.useTheme();

  const colors = useMemo(
    () => ({
      bad: theme.palette.error.main,
      good: theme.palette.success.main,
      neutral: muiColors.grey[100],
    }),
    [theme]
  );

  return colors;
}
