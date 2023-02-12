import * as Three from 'three';
import React from 'react';

const ZOOM = 5;
const WIDTH = 26.01 * ZOOM;
const DEPTH = 17.42 * ZOOM;
const MHEIGHT = 7.75 * ZOOM;
const RADIUS = 1 * ZOOM;
const TOP = 2.38 * ZOOM;
const GAP1 = 1.82 * ZOOM;
const GAP2 = 6.03 * ZOOM;
const GAP3 = 6.08 * ZOOM;
const GAP4 = 6.12 * ZOOM;
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
  name: 'sofa-U',
  prototype: 'items',

  info: {
    tag: ['sofa-U', 'sofa-U'],
    title: 'sofa-U',
    description: 'sofa-U',
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

    let poly01 = `${- half_thickness},${DEPTH + half_thickness}`, poly02 = `${WIDTH + half_thickness},${DEPTH + half_thickness}`, poly03 = `${WIDTH + half_thickness},${0}`, poly04 = `${- half_thickness},${0}`;
    let poly11 = `${WIDTH - GAP1 - GAP2 },${half_thickness}`, poly12 = `${length - RADIUS},${half_thickness}`, poly13 = `${length - RADIUS},${-half_thickness}`, poly14 = `${WIDTH - GAP1 - GAP2 },-${half_thickness}`;
    let poly21 = `${-half_thickness},${DEPTH + half_thickness}`, poly22 = `${length + half_thickness},${DEPTH + half_thickness}`, poly23 = `${length - half_thickness},${DEPTH - half_thickness}`, poly24 = `${half_thickness}, ${DEPTH - half_thickness}`;
    let poly31 = `${-half_thickness},${DEPTH + half_thickness}`, poly32 = `${half_thickness},${DEPTH - half_thickness}`, poly33 = `${half_thickness},${RADIUS}`, poly34 = `${-half_thickness}, ${RADIUS}`;
    let poly41 = `${WIDTH -half_thickness},${DEPTH - half_thickness}`, poly42 = `${WIDTH + half_thickness},${DEPTH + half_thickness}`, poly43 = `${WIDTH + half_thickness},${RADIUS}`, poly44 = `${WIDTH -half_thickness}, ${RADIUS}`;
    
    let poly51 = `${-half_thickness},${DEPTH + half_thickness - TOP}`, poly52 = `${length + half_thickness},${DEPTH + half_thickness - TOP}`, poly53 = `${length - half_thickness},${DEPTH - half_thickness - TOP}`, poly54 = `${half_thickness}, ${DEPTH - half_thickness - TOP}`;
    let poly61 = `${-half_thickness + GAP1},${DEPTH + half_thickness - TOP}`, poly62 = `${half_thickness + GAP1},${DEPTH - half_thickness - TOP}`, poly63 = `${half_thickness + GAP1},${0}`, poly64 = `${-half_thickness + GAP1}, ${0}`;
    let poly71 = `${-half_thickness + GAP1 + GAP2},${DEPTH + half_thickness - TOP}`, poly72 = `${half_thickness + GAP1 + GAP2},${DEPTH - half_thickness - TOP}`, poly73 = `${half_thickness + GAP1 + GAP2},${0}`, poly74 = `${-half_thickness + GAP1 + GAP2}, ${0}`;
    let poly81 = `${-half_thickness + WIDTH - GAP1 - GAP2 },${DEPTH + half_thickness - TOP}`, poly82 = `${half_thickness + WIDTH - GAP1 - GAP2 },${DEPTH - half_thickness - TOP}`, poly83 = `${half_thickness + WIDTH - GAP1 - GAP2 },${0}`, poly84 = `${-half_thickness + WIDTH - GAP1 - GAP2 }, ${0}`;
    let poly91 = `${-half_thickness + WIDTH - GAP1},${DEPTH + half_thickness - TOP}`, poly92 = `${half_thickness + WIDTH - GAP1},${DEPTH - half_thickness - TOP}`, poly93 = `${half_thickness + WIDTH - GAP1},${0}`, poly94 = `${-half_thickness + WIDTH - GAP1}, ${0}`;

    let poly101 = `${RADIUS},${half_thickness}`, poly102 = `${GAP1 + GAP2},${half_thickness}`, poly103 = `${GAP1 + GAP2},${- half_thickness}`, poly104 = `${RADIUS},${- half_thickness}`;
    let poly111 = `${-half_thickness + WIDTH / 2},${DEPTH + half_thickness - TOP}`, poly112 = `${half_thickness + WIDTH / 2},${DEPTH - half_thickness - TOP}`, poly113 = `${half_thickness + WIDTH / 2},${DEPTH - GAP4 - TOP}`, poly114 = `${-half_thickness + WIDTH / 2}, ${DEPTH - GAP4 - TOP}`;
    let poly121 = `${GAP1 + GAP2},${half_thickness + DEPTH - GAP4 - TOP}`, poly122 = `${WIDTH - GAP1 - GAP2},${half_thickness + DEPTH - GAP4 - TOP}`, poly123 = `${GAP1 + GAP2},${- half_thickness + DEPTH - GAP4 - TOP}`, poly124 = `${WIDTH - GAP1 - GAP2},${- half_thickness + DEPTH - GAP4 - TOP}`;

    return element.selected ? (
      <g transform={`translate(${-WIDTH / 2},${-DEPTH / 2})`} width={WIDTH} height={DEPTH} lines={lines} x={x} y={y}>
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
        <polygon points={`${poly111 + " " + poly112 + " " + poly113 + " " + poly114}`} style={STYLE_RECT_SELECTED} />
        <polygon points={`${poly121 + " " + poly122 + " " + poly123 + " " + poly124}`} style={STYLE_RECT_SELECTED} />
        <svg height={RADIUS + 3} width={RADIUS + 3} x="-3px" y={-3}>
          <circle cx={RADIUS  + 3} cy={RADIUS  + 3} r={RADIUS} stroke="rgb(153, 195, 251)" strokeWidth="3" fill="transparent" />
        </svg>
        <svg height={RADIUS + 3} width={RADIUS + 3} x={WIDTH - half_thickness - RADIUS} y="-3px">
          <circle cx={0} cy={RADIUS  + 3} r={RADIUS} stroke="rgb(153, 195, 251)" strokeWidth="3" fill="transparent" />
        </svg>
        <image href="/assets/enable.png" style={STYLE_PNG_BASE}/>
       
      </g>
    ) : (
      <g transform={`translate(${-WIDTH / 2},${-DEPTH / 2})`} width={WIDTH} height={DEPTH}>
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
        <polygon points={`${poly111 + " " + poly112 + " " + poly113 + " " + poly114}`} style={STYLE_RECT} />
        <polygon points={`${poly121 + " " + poly122 + " " + poly123 + " " + poly124}`} style={STYLE_RECT} />
        <svg height={RADIUS + 3} width={RADIUS + 3} x="-3px" y={-3}>
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
