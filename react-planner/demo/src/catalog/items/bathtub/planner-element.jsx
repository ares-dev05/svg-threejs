import * as Three from 'three';
import React from 'react';

const ZOOM = 5;
const WIDTH = 28 * ZOOM;
const DEPTH = 16 * ZOOM;
const STROKE_WIDTH = 3;
const INNER_WIDTH = 23.95 * ZOOM;
const INNER_HEIGHT = 11.88 * ZOOM;
const CIRCLE_RADIUS = 1 * ZOOM;
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
  transform: 'translate(-11px, 26.95px)'
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
  name: 'bathtub',
  prototype: 'items',

  info: {
    tag: ['bathtub', 'bathtub'],
    title: 'bathtub',
    description: 'bathtub',
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

    let poly01 = `${-WIDTH / 2 - half_thickness},${DEPTH + half_thickness}`, poly02 = `${WIDTH / 2 + half_thickness},${DEPTH + half_thickness}`, poly03 = `${WIDTH / 2 + half_thickness},${0}`, poly04 = `${-WIDTH / 2 - half_thickness},${0}`;
    let poly11 = `${-WIDTH / 2},${half_thickness}`, poly12 = `${WIDTH / 2},${half_thickness}`, poly13 = `${WIDTH / 2},-${half_thickness}`, poly14 = `${-WIDTH / 2},-${half_thickness}`;
    let poly21 = `${-WIDTH / 2 - half_thickness},${DEPTH}`, poly22 = `${-WIDTH / 2 + half_thickness},${DEPTH}`, poly23 = `${-WIDTH / 2 + half_thickness},${0}`, poly24 = `${-WIDTH / 2 - half_thickness},${0}`;
    let poly31 = `${WIDTH / 2 - half_thickness},${DEPTH}`, poly32 = `${WIDTH / 2 + half_thickness},${DEPTH}`, poly33 = `${WIDTH / 2 + half_thickness},${0}`, poly34 = `${WIDTH / 2 - half_thickness},${0}`;
    let poly41 = `${-WIDTH / 2},${DEPTH + half_thickness}`, poly42 = `${WIDTH / 2},${DEPTH + half_thickness}`, poly43 = `${WIDTH / 2},${DEPTH - half_thickness}`, poly44 = `${-WIDTH / 2},${DEPTH - half_thickness}`;
    
   
    return element.selected ? (
      <g transform={`translate(${0},${-DEPTH / 2})`} width={WIDTH} height={DEPTH} lines={lines} x={x} y={y}>
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
        <svg width={INNER_WIDTH + 2 * STROKE_WIDTH} height={INNER_HEIGHT + 2 * STROKE_WIDTH} x={-(INNER_WIDTH + 2 * STROKE_WIDTH) / 2} y={(DEPTH - INNER_HEIGHT) / 2 - STROKE_WIDTH}>
          <rect x={STROKE_WIDTH} y={STROKE_WIDTH} rx={INNER_HEIGHT / 2} ry={INNER_HEIGHT / 2} width={INNER_WIDTH} height={INNER_HEIGHT} stroke="#407AEC" strokeWidth={STROKE_WIDTH} fill="transparent" />
        </svg>
        <svg height={CIRCLE_RADIUS * 2 + 2 * STROKE_WIDTH} width={CIRCLE_RADIUS * 2 + 2 * STROKE_WIDTH} x={-(CIRCLE_RADIUS * 2 + 2 * STROKE_WIDTH) / 2 - WIDTH * 2.5 / 7} y={(DEPTH - 2 *  CIRCLE_RADIUS) / 2 - STROKE_WIDTH}>
          <circle cx={CIRCLE_RADIUS  + 3} cy={CIRCLE_RADIUS  + 3} r={CIRCLE_RADIUS} stroke="#407AEC" strokeWidth={1} fill="transparent" />
        </svg>

        <image href="/assets/enable.png" style={STYLE_PNG_BASE}/>
       
      </g>
    ) : (
      <g transform={`translate(${0},${-DEPTH / 2})`} width={WIDTH} height={DEPTH}>
        <polygon points={`${poly01 + " " + poly02 + " " + poly03 + " " + poly04}`} style={STYLE_TRANPARENT} />
        <polygon points={`${poly11 + " " + poly12 + " " + poly13 + " " + poly14}`} style={STYLE_RECT} />
        <polygon points={`${poly21 + " " + poly22 + " " + poly23 + " " + poly24}`} style={STYLE_RECT} />
        <polygon points={`${poly31 + " " + poly32 + " " + poly33 + " " + poly34}`} style={STYLE_RECT} />
        <polygon points={`${poly41 + " " + poly42 + " " + poly43 + " " + poly44}`} style={STYLE_RECT} />
        <svg width={INNER_WIDTH + 2 * STROKE_WIDTH} height={INNER_HEIGHT + 2 * STROKE_WIDTH} x={-(INNER_WIDTH + 2 * STROKE_WIDTH) / 2} y={(DEPTH - INNER_HEIGHT) / 2 - STROKE_WIDTH}>
          <rect x={STROKE_WIDTH} y={STROKE_WIDTH} rx={INNER_HEIGHT / 2} ry={INNER_HEIGHT / 2} width={INNER_WIDTH} height={INNER_HEIGHT} stroke="#8E9BA2" strokeWidth={STROKE_WIDTH} fill="transparent" />
        </svg>
        <svg height={CIRCLE_RADIUS * 2 + 2 * STROKE_WIDTH} width={CIRCLE_RADIUS * 2 + 2 * STROKE_WIDTH} x={-(CIRCLE_RADIUS * 2 + 2 * STROKE_WIDTH) / 2 - WIDTH * 2.5 / 7} y={(DEPTH - 2 *  CIRCLE_RADIUS) / 2 - STROKE_WIDTH}>
          <circle cx={CIRCLE_RADIUS  + 3} cy={CIRCLE_RADIUS  + 3} r={CIRCLE_RADIUS} stroke="#8E9BA2" strokeWidth={1} fill="transparent" />
        </svg>
      </g>
    );
  },

  render3D: function (element, layer, scene) {
    return null;
  }

};
