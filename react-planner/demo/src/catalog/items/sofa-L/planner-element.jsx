import * as Three from 'three';
import React from 'react';

const ZOOM = 5;
const WIDTH = 26.01 * ZOOM;
const DEPTH = 17.42 * ZOOM;
const MHEIGHT = 7.75 * ZOOM;
const RADIUS = 1 * ZOOM;
const TOP = 2.38 * ZOOM;
const GAP1 = 1.93 * ZOOM;
const GAP2 = 7.45 * ZOOM;
const HEIGHT=150;

const STYLE_TRANPARENT = {
  strokeWidth: 1,
  stroke: "transparent",
  fill: "transparent",
};

const STYLE_RECT = {
  strokeWidth: 1,
  stroke: "#8E9BA2",
  fill: "#8B8B8B",
};
const STYLE_RECT_SELECTED = {
  fill: "#407AEC",
  strokeWidth: 1,
  stroke: "#407AEC",
};
const STYLE_PNG_BASE = {
  transform: 'translate(55px, 23px)'
};

const STYLE = {
  stroke: "#4F8BFF",
  strokeWidth: "1px",
};

const STYLE_TEXT = {
  fontFamily: "DM Sans",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: "11px",
  lineHeight: "12px",
  textAlign: "right",
  fill: "#F6F6F6",
  flex: "none",
  order: 0,
  flexGrow: 0,

  //http://stackoverflow.com/questions/826782/how-to-disable-text-selection-highlighting-using-css
  WebkitTouchCallout: "none" /* iOS Safari */,
  WebkitUserSelect: "none" /* Chrome/Safari/Opera */,
  MozUserSelect: "none" /* Firefox */,
  MsUserSelect: "none" /* Internet Explorer/Edge */,
  userSelect: "none",
};

export default {
  name: 'sofa-L',
  prototype: 'items',

  info: {
    tag: ['sofa-L', 'sofa-L'],
    title: 'sofa-L',
    description: 'sofa-L',
    image: null
  },
  properties: {
    altitude: {
      label: 'quota',
      type: 'length-measure',
      defaultValue: {
        length: 220,
        unit: 'cm'
      }
    }
  },

  render2D: function (element, layer, scene) {
    const half_thickness = 1;
    const length = WIDTH;
    const lines = []
    layer.lines.map(line => {
      const vertices = layer.vertices;
      const {x: x1, y: y1} =  vertices.get(line.vertices.get(0))
      const {x: x2, y: y2} =  vertices.get(line.vertices.get(1))

      lines.push({x1, y1, x2, y2})
    })

    const x = element.x;
    const y = element.y;

    let dis1 = 0, dis2 = 0, dis3 = 0, dis4 = 0;

    lines.map(line => {
      if(line.y1 > y + DEPTH / 2 && ((line.x1 <= x && line.x2 >= x) || (line.x2 <= x && line.x1 >= x))) {
        if(dis1 == 0) {
          dis1 = line.y1 - y - DEPTH / 2;
        } else if (dis1 > line.y1 - y - DEPTH / 2) {
          dis1 = line.y1 - y - DEPTH / 2;
        }
      } else if(line.y1 < y - DEPTH / 2 && ((line.x1 <= x && line.x2 >= x) || (line.x2 <= x && line.x1 >= x))) {
        if(dis2 == 0) {
          dis2 = y - DEPTH / 2 - line.y1;
        } else if (dis2 > y - DEPTH / 2 - line.y1) {
          dis2 = y - DEPTH / 2 - line.y1;
        }
      } else if(line.x1 < x - WIDTH / 2 && ((line.y1 <= y && line.y2 >= y) || (line.y2 <= y && line.y1 >= y))) {
        if(dis3 == 0) {
          dis3 = -line.x1 + x - WIDTH / 2;
        } else if (dis3 > -line.x1 + x - WIDTH / 2) {
          dis3 = -line.x1 + x - WIDTH / 2;
        }
      } else if(line.x1 > x + WIDTH / 2 && ((line.y1 <= y && line.y2 >= y) || (line.y2 <= y && line.y1 >= y))) {
        if(dis4 == 0) {
          dis4 = line.x1 - x - WIDTH / 2;
        } else if (dis4 > line.x1 - x - WIDTH / 2) {
          dis4 = line.x1 - x - WIDTH / 2;
        }
      }
    })
    let poly01 = `${-WIDTH / 2 - half_thickness},${DEPTH + half_thickness}`, poly02 = `${WIDTH / 2 + half_thickness},${DEPTH + half_thickness}`, poly03 = `${WIDTH / 2 + half_thickness},${0}`, poly04 = `${-WIDTH / 2 - half_thickness},${0}`;
    let poly11 = `${GAP1 + 2 * GAP2},${half_thickness}`, poly12 = `${length - RADIUS},${half_thickness}`, poly13 = `${length - RADIUS},${-half_thickness}`, poly14 = `${GAP1 + 2 * GAP2},-${half_thickness}`;
    let poly21 = `${-half_thickness},${DEPTH + half_thickness}`, poly22 = `${length + half_thickness},${DEPTH + half_thickness}`, poly23 = `${length - half_thickness},${DEPTH - half_thickness}`, poly24 = `${half_thickness}, ${DEPTH - half_thickness}`;
    let poly31 = `${-half_thickness},${DEPTH + half_thickness}`, poly32 = `${half_thickness},${DEPTH - half_thickness}`, poly33 = `${half_thickness},${DEPTH - MHEIGHT}`, poly34 = `${-half_thickness}, ${DEPTH - MHEIGHT}`;
    let poly41 = `${WIDTH -half_thickness},${DEPTH - half_thickness}`, poly42 = `${WIDTH + half_thickness},${DEPTH + half_thickness}`, poly43 = `${WIDTH + half_thickness},${RADIUS}`, poly44 = `${WIDTH -half_thickness}, ${RADIUS}`;
    
    let poly51 = `${-half_thickness},${DEPTH + half_thickness - TOP}`, poly52 = `${length + half_thickness},${DEPTH + half_thickness - TOP}`, poly53 = `${length - half_thickness},${DEPTH - half_thickness - TOP}`, poly54 = `${half_thickness}, ${DEPTH - half_thickness - TOP}`;
    let poly61 = `${-half_thickness + GAP1},${DEPTH + half_thickness - TOP}`, poly62 = `${half_thickness + GAP1},${DEPTH - half_thickness - TOP}`, poly63 = `${half_thickness + GAP1},${DEPTH - MHEIGHT - RADIUS}`, poly64 = `${-half_thickness + GAP1}, ${DEPTH - MHEIGHT - RADIUS}`;
    let poly71 = `${-half_thickness + GAP1 + GAP2},${DEPTH + half_thickness - TOP}`, poly72 = `${half_thickness + GAP1 + GAP2},${DEPTH - half_thickness - TOP}`, poly73 = `${half_thickness + GAP1 + GAP2},${DEPTH - MHEIGHT - RADIUS}`, poly74 = `${-half_thickness + GAP1 + GAP2}, ${DEPTH - MHEIGHT - RADIUS}`;
    let poly81 = `${-half_thickness + GAP1 + 2 * GAP2},${DEPTH + half_thickness - TOP}`, poly82 = `${half_thickness + GAP1 + 2 * GAP2},${DEPTH - half_thickness - TOP}`, poly83 = `${half_thickness + GAP1 + 2 * GAP2},${0}`, poly84 = `${-half_thickness + GAP1 + 2 * GAP2}, ${0}`;
    let poly91 = `${-half_thickness + WIDTH - GAP1},${DEPTH + half_thickness - TOP}`, poly92 = `${half_thickness + WIDTH - GAP1},${DEPTH - half_thickness - TOP}`, poly93 = `${half_thickness + WIDTH - GAP1},${0}`, poly94 = `${-half_thickness + WIDTH - GAP1}, ${0}`;

    let poly101 = `${RADIUS},${DEPTH + half_thickness - MHEIGHT - RADIUS}`, poly102 = `${GAP1 + 2 * GAP2},${DEPTH + half_thickness - MHEIGHT - RADIUS}`, poly103 = `${GAP1 + 2 * GAP2},${DEPTH - half_thickness - MHEIGHT - RADIUS}`, poly104 = `${RADIUS},${DEPTH - half_thickness - MHEIGHT - RADIUS}`;

    return element.selected ? (
      <g transform={`translate(${-WIDTH / 2},${-DEPTH / 2})`}>
        <defs>
          <filter id="rounded-corners" x="-25%" width="150%" y="-25%" height="150%">
            <feFlood floodColor="#407AEC" />
            <feGaussianBlur stdDeviation="2" />
            <feComponentTransfer>
              <feFuncA type="table" tableValues="0 0 0 1" />
            </feComponentTransfer>

            <feComponentTransfer>
              <feFuncA type="table" tableValues="0 1 1 1 1 1 1 1" />
            </feComponentTransfer>
            <feComposite operator="over" in="SourceGraphic" />
          </filter>
        </defs>
        <polygon points={`${poly01 + " " + poly02 + " " + poly03 + " " + poly04}`} style={STYLE_TRANPARENT} />
        <polygon points={`${poly11 + " " + poly12 + " " + poly13 + " " + poly14}`} style={STYLE_RECT_SELECTED} />
        <polygon points={`${poly21 + " " + poly22 + " " + poly23 + " " + poly24}`} style={STYLE_RECT_SELECTED} />
        <polygon points={`${poly31 + " " + poly32 + " " + poly33 + " " + poly34}`} style={STYLE_RECT_SELECTED} />
        <polygon points={`${poly41 + " " + poly42 + " " + poly43 + " " + poly44}`} style={STYLE_RECT_SELECTED} />
        <polygon points={`${poly51 + " " + poly52 + " " + poly53 + " " + poly54}`} style={STYLE_RECT_SELECTED} />
        <polygon points={`${poly61 + " " + poly62 + " " + poly63 + " " + poly64}`} style={STYLE_RECT_SELECTED} />
        <polygon points={`${poly71 + " " + poly72 + " " + poly73 + " " + poly74}`} style={STYLE_RECT_SELECTED} />
        <polygon points={`${poly81 + " " + poly82 + " " + poly83 + " " + poly84}`} style={STYLE_RECT_SELECTED} />
        <polygon points={`${poly91 + " " + poly92 + " " + poly93 + " " + poly94}`} style={STYLE_RECT_SELECTED} />
        <polygon points={`${poly101 + " " + poly102 + " " + poly103 + " " + poly104}`} style={STYLE_RECT_SELECTED} />
        <svg height={RADIUS + 3} width={RADIUS + 3} x="-3px" y={DEPTH - MHEIGHT - RADIUS - 3}>
          <circle cx={RADIUS  + 3} cy={RADIUS  + 3} r={RADIUS} stroke="rgb(153, 195, 251)" strokeWidth="3" fill="transparent" />
        </svg>
        <svg height={RADIUS + 3} width={RADIUS + 3} x={WIDTH - half_thickness - RADIUS} y="-3px">
          <circle cx={0} cy={RADIUS  + 3} r={RADIUS} stroke="rgb(153, 195, 251)" strokeWidth="3" fill="transparent" />
        </svg>
        <image href="/assets/enable.png" style={STYLE_PNG_BASE}/>
        {dis1 != 0 && <g transform={`translate(${WIDTH / 2}, ${DEPTH} )`}>
          <text
            x="20"
            y={-dis1 / 2}
            transform={`scale(1, -1)`}
            style={STYLE_TEXT}
            filter="url(#rounded-corners)"
          >
            {dis1.toFixed(1)}
          </text>
          <line x1="-5" y1={dis1} x2="5" y2={dis1} style={STYLE} />
          <line x1="0" y1="0" x2="0" y2={dis1} style={STYLE} />
        </g>}
        {dis2 != 0 && <g transform={`translate(${WIDTH / 2}, ${DEPTH - MHEIGHT - RADIUS} )`}>
          <text
            x="20"
            y={dis2 / 2}
            transform={`scale(1, -1)`}
            style={STYLE_TEXT}
            filter="url(#rounded-corners)"
          >
            {dis2.toFixed(1)}
          </text>
          <line x1="-5" y1={-dis2 - DEPTH + MHEIGHT + RADIUS} x2="5" y2={-dis2 - DEPTH + MHEIGHT + RADIUS} style={STYLE} />
          <line x1="0" y1="0" x2="0" y2={-dis2 - DEPTH + MHEIGHT + RADIUS} style={STYLE} />
        </g>}
        {dis3 != 0 && <g transform={`translate(-${dis3}, ${DEPTH  * 3 / 4} )`}>
          <text
            x={dis3 / 2}
            y="-10"
            transform={`scale(1, -1)`}
            style={STYLE_TEXT}
            filter="url(#rounded-corners)"
          >
            {dis3.toFixed(1)}
          </text>
          <line x1={0} y1="-5" x2={0} y2="5" style={STYLE} />
          <line x1="0" y1="0" x2={dis3} y2="0" style={STYLE} />
        </g>}
        {dis4 != 0 && <g transform={`translate(${WIDTH}, ${DEPTH / 2} )`}>
          <text
            x={dis4 / 2}
            y="-10"
            transform={`scale(1, -1)`}
            style={STYLE_TEXT}
            filter="url(#rounded-corners)"
          >
            {dis4.toFixed(1)}
          </text>
          <line x1={dis4} y1="-5" x2={dis4} y2="5" style={STYLE} />
          <line x1="0" y1="0" x2={dis4} y2="0" style={STYLE} />
        </g>}
      </g>
    ) : (
      <g transform={`translate(${-WIDTH / 2},${-DEPTH / 2})`}>
        <polygon points={`${poly01 + " " + poly02 + " " + poly03 + " " + poly04}`} style={STYLE_TRANPARENT} />
        <polygon points={`${poly11 + " " + poly12 + " " + poly13 + " " + poly14}`} style={STYLE_RECT} />
        <polygon points={`${poly21 + " " + poly22 + " " + poly23 + " " + poly24}`} style={STYLE_RECT} />
        <polygon points={`${poly31 + " " + poly32 + " " + poly33 + " " + poly34}`} style={STYLE_RECT} />
        <polygon points={`${poly41 + " " + poly42 + " " + poly43 + " " + poly44}`} style={STYLE_RECT} />
        <polygon points={`${poly51 + " " + poly52 + " " + poly53 + " " + poly54}`} style={STYLE_RECT} />
        <polygon points={`${poly61 + " " + poly62 + " " + poly63 + " " + poly64}`} style={STYLE_RECT} />
        <polygon points={`${poly71 + " " + poly72 + " " + poly73 + " " + poly74}`} style={STYLE_RECT} />
        <polygon points={`${poly81 + " " + poly82 + " " + poly83 + " " + poly84}`} style={STYLE_RECT} />
        <polygon points={`${poly91 + " " + poly92 + " " + poly93 + " " + poly94}`} style={STYLE_RECT} />
        <polygon points={`${poly101 + " " + poly102 + " " + poly103 + " " + poly104}`} style={STYLE_RECT} />
        <svg height={RADIUS + 3} width={RADIUS + 3} x="-3px" y={DEPTH - MHEIGHT - RADIUS - 3}>
          <circle cx={RADIUS  + 3} cy={RADIUS  + 3} r={RADIUS} stroke="rgb(139, 139, 139)" strokeWidth="3" fill="transparent" />
        </svg>
        <svg height={RADIUS + 3} width={RADIUS + 3} x={WIDTH - half_thickness - RADIUS} y="-3px">
          <circle cx={0} cy={RADIUS  + 3} r={RADIUS} stroke="rgb(139, 139, 139)" strokeWidth="3" fill="transparent" />
        </svg>
      </g>
    );
  },

  render3D: function (element, layer, scene) {
    return null;
  }

};
