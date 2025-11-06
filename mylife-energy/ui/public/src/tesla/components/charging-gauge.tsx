// from https://github.com/Reggino/react-svg-gauge/blob/master/src/Gauge.tsx

import React from 'react';
import { mui } from 'mylife-tools-ui';

//global unique key for every gauge (needed for SVG groups to stay separated)
let uniqueId = 0;

export interface ChargingGaugeProps {
  min: number;
  max: number;
  value: number;
  width: number;
  height: number;
  minText: string;
  maxText: string;
  valueText: string;
}

// TODO: pick from theme
const COLOR_PRIMARY = '#2196f3';
const COLOR_TEXT_SECONDARY = 'rgba(0, 0, 0, 0.54)';
const COLOR_BACKGROUND = 'rgba(0, 0, 0, 0.1)';

const minMaxLabelsOffset = 25;

export default class ChargingGauge extends React.Component<ChargingGaugeProps> {
  _getPathValues = (value: number) => {
    if (value < this.props.min) value = this.props.min;
    if (value > this.props.max) value = this.props.max;

    const dx = 0;
    const dy = 0;

    const alpha =
      (1 - (value - this.props.min) / (this.props.max - this.props.min)) *
      Math.PI;
    const Ro = this.props.width / 2 - this.props.width / 10;
    const Ri = Ro - this.props.width / 6.666666666666667;

    const Cx = this.props.width / 2 + dx;
    const Cy = this.props.height / 1.5 + dy;

    const Xo = this.props.width / 2 + dx + Ro * Math.cos(alpha);
    const Yo =
      this.props.height - (this.props.height - Cy) - Ro * Math.sin(alpha);
    const Xi = this.props.width / 2 + dx + Ri * Math.cos(alpha);
    const Yi =
      this.props.height - (this.props.height - Cy) - Ri * Math.sin(alpha);

    return { alpha, Ro, Ri, Cx, Cy, Xo, Yo, Xi, Yi };
  };

  _getPath = (value: number) => {
    const { Ro, Ri, Cx, Cy, Xo, Yo, Xi, Yi } = this._getPathValues(value);

    let path = `M${Cx - Ri},${Cy} `;
    path += `L${Cx - Ro},${Cy} `;
    path += `A${Ro},${Ro} 0 0 1 ${Xo},${Yo} `;
    path += `L${Xi},${Yi} `;
    path += `A${Ri},${Ri} 0 0 0 ${Cx - Ri},${Cy} `;
    path += "Z ";

    return path;
  };

  private uniqueFilterId: string;

  render() {
    const { Cx, Ro, Ri, Xo, Cy, Xi } = this._getPathValues(this.props.max);
    if (!this.uniqueFilterId) this.uniqueFilterId = `filter_${uniqueId++}`;
    return (
      <svg
        height="100%"
        version="1.1"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: this.props.width,
          height: this.props.height,
          overflow: "hidden",
          position: "relative",
          left: 0,
          top: 0,
        }}
      >
        <defs>
          <filter id={this.uniqueFilterId}>
            <feOffset dx="0" dy="3" />
            <feGaussianBlur result="offset-blur" stdDeviation="5" />
            <feComposite
              operator="out"
              in="SourceGraphic"
              in2="offset-blur"
              result="inverse"
            />
            <feFlood floodColor="black" floodOpacity="0.2" result="color" />
            <feComposite
              operator="in"
              in="color"
              in2="inverse"
              result="shadow"
            />
            <feComposite operator="over" in="shadow" in2="SourceGraphic" />
          </filter>
        </defs>
        <path
          fill={COLOR_BACKGROUND}
          stroke="none"
          d={this._getPath(this.props.max)}
          filter={`url(#${this.uniqueFilterId})`}
        />
        <path
          fill={COLOR_PRIMARY}
          stroke="none"
          d={this._getPath(this.props.value)}
          filter={`url(#${this.uniqueFilterId})`}
        />
        <text
          x={this.props.width / 2}
          y={this.props.height / 8}
          textAnchor="middle"
          className='MuiTypography-body1'
        >
          {this.props.valueText}
        </text>
        <text
          x={(Cx - Ro + (Cx - Ri)) / 2}
          y={Cy + minMaxLabelsOffset}
          textAnchor="middle"
          style={{ fill: COLOR_TEXT_SECONDARY}}
          className='MuiTypography-body1'
        >
          {this.props.minText}
        </text>
        <text
          x={(Xo + Xi) / 2}
          y={Cy + minMaxLabelsOffset}
          textAnchor="middle"
          style={{ fill: COLOR_TEXT_SECONDARY}}
          className='MuiTypography-body1'
        >
          {this.props.maxText}
        </text>
      </svg>
    );
  }
}