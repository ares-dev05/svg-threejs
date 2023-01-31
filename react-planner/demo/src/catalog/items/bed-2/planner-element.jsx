import * as Three from 'three';
import React from 'react';

const ZOOM = 5;
const WIDTH = 12.99 * ZOOM;
const DEPTH = 22.78 * ZOOM;
const H1 = 20.78 * ZOOM;
const H2 = 14.56 * ZOOM;
const H3 = 2 * ZOOM;
const BOTTOM1 = 18.39 * ZOOM;
const BOTTOM2 = 20.39 * ZOOM;
const BOTTOM3 = 7.38 * ZOOM;
const PADDING_LEFT = 1.35 * ZOOM;
const PADDING_TOP = 1.31 * ZOOM;
const HEIGHT=150;

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
  transform: 'translate(-11px, 40.95px)'
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
  name: 'bed-2',
  prototype: 'items',

  info: {
    tag: ['bed-2', 'bed-2'],
    title: 'bed-2',
    description: 'bed-2',
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
      } else if(line.x1 < x - BOTTOM1 / 2 && ((line.y1 <= y && line.y2 >= y) || (line.y2 <= y && line.y1 >= y))) {
        if(dis3 == 0) {
          dis3 = -line.x1 + x - BOTTOM1 / 2;
        } else if (dis3 > -line.x1 + x - BOTTOM1 / 2) {
          dis3 = -line.x1 + x - BOTTOM1 / 2;
        }
      } else if(line.x1 > x + BOTTOM1 / 2 && ((line.y1 <= y && line.y2 >= y) || (line.y2 <= y && line.y1 >= y))) {
        if(dis4 == 0) {
          dis4 = line.x1 - x - BOTTOM1 / 2;
        } else if (dis4 > line.x1 - x - BOTTOM1 / 2) {
          dis4 = line.x1 - x - BOTTOM1 / 2;
        }
      }
    })

    let poly11 = `${-BOTTOM1 / 2},${half_thickness}`, poly12 = `${BOTTOM1 / 2},${half_thickness}`, poly13 = `${BOTTOM1 / 2},-${half_thickness}`, poly14 = `${-BOTTOM1 / 2},-${half_thickness}`;
    let poly21 = `${-BOTTOM1 / 2 - half_thickness},${H1}`, poly22 = `${-BOTTOM1 / 2 + half_thickness},${H1}`, poly23 = `${-BOTTOM1 / 2 + half_thickness},${0}`, poly24 = `${-BOTTOM1 / 2 - half_thickness},${0}`;
    let poly31 = `${BOTTOM1 / 2 - half_thickness},${H1}`, poly32 = `${BOTTOM1 / 2 + half_thickness},${H1}`, poly33 = `${BOTTOM1 / 2 + half_thickness},${0}`, poly34 = `${BOTTOM1 / 2 - half_thickness},${0}`;
    let poly41 = `${-BOTTOM1 / 2},${H1+ half_thickness}`, poly42 = `${BOTTOM1 / 2},${H1 + half_thickness}`, poly43 = `${BOTTOM1 / 2},${H1 - half_thickness}`, poly44 = `${-BOTTOM1 / 2},${H1 - half_thickness}`;

    let poly51 = `${-BOTTOM1 / 2 + PADDING_LEFT},${half_thickness + H2}`, poly52 = `${-BOTTOM1 / 2 + PADDING_LEFT + BOTTOM3},${half_thickness + H2}`, poly53 = `${-BOTTOM1 / 2 + PADDING_LEFT + BOTTOM3},${-half_thickness + H2}`, poly54 = `${-BOTTOM1 / 2 + PADDING_LEFT},${-half_thickness + H2}`;
    let poly61 = `${-BOTTOM1 / 2 + PADDING_LEFT},${half_thickness + H1 - PADDING_TOP}`, poly62 = `${-BOTTOM1 / 2 + BOTTOM3 + PADDING_LEFT},${half_thickness + H1 - PADDING_TOP}`, poly63 = `${-BOTTOM1 / 2 + BOTTOM3 + PADDING_LEFT},${-half_thickness + H1 - PADDING_TOP}`, poly64 = `${-BOTTOM1 / 2 + PADDING_LEFT},${-half_thickness + H1 - PADDING_TOP}`;
    let poly71 = `${-BOTTOM1 / 2 - half_thickness + PADDING_LEFT},${H1 - PADDING_TOP}`, poly72 = `${-BOTTOM1 / 2 + half_thickness + PADDING_LEFT},${H1 - PADDING_TOP}`, poly73 = `${-BOTTOM1 / 2 + half_thickness + PADDING_LEFT},${H2}`, poly74 = `${-BOTTOM1 / 2 - half_thickness + PADDING_LEFT},${H2}`;
    let poly81 = `${-BOTTOM1 / 2 + BOTTOM3 + PADDING_LEFT - half_thickness},${H1 - PADDING_TOP}`, poly82 = `${-BOTTOM1 / 2 + BOTTOM3 + PADDING_LEFT + half_thickness},${H1 - PADDING_TOP}`, poly83 = `${-BOTTOM1 / 2 + BOTTOM3 + PADDING_LEFT + half_thickness},${H2}`, poly84 = `${-BOTTOM1 / 2 + BOTTOM3 + PADDING_LEFT - half_thickness},${H2}`;

    let poly131 = `${BOTTOM1 / 2 - PADDING_LEFT - BOTTOM3},${half_thickness + H2}`, poly132 = `${BOTTOM1 / 2 - PADDING_LEFT},${half_thickness + H2}`, poly133 = `${BOTTOM1 / 2 - PADDING_LEFT},${-half_thickness + H2}`, poly134 = `${BOTTOM1 / 2 - PADDING_LEFT - BOTTOM3},${-half_thickness + H2}`;
    let poly141 = `${BOTTOM1 / 2 - PADDING_LEFT - BOTTOM3},${half_thickness + H1 - PADDING_TOP}`, poly142 = `${BOTTOM1 / 2 - PADDING_LEFT},${half_thickness + H1 - PADDING_TOP}`, poly143 = `${BOTTOM1 / 2 - PADDING_LEFT},${-half_thickness + H1 - PADDING_TOP}`, poly144 = `${BOTTOM1 / 2 - PADDING_LEFT - BOTTOM3},${-half_thickness + H1 - PADDING_TOP}`;
    let poly151 = `${BOTTOM1 / 2 - PADDING_LEFT - BOTTOM3 - half_thickness},${H1 - PADDING_TOP}`, poly152 = `${BOTTOM1 / 2 - PADDING_LEFT - BOTTOM3 + half_thickness},${H1 - PADDING_TOP}`, poly153 = `${BOTTOM1 / 2 - PADDING_LEFT - BOTTOM3 + half_thickness},${H2}`, poly154 = `${BOTTOM1 / 2 - PADDING_LEFT - BOTTOM3 - half_thickness},${H2}`;
    let poly161 = `${BOTTOM1 / 2 - PADDING_LEFT - half_thickness},${H1 - PADDING_TOP}`, poly162 = `${BOTTOM1 / 2 - PADDING_LEFT + half_thickness},${H1 - PADDING_TOP}`, poly163 = `${BOTTOM1 / 2 - PADDING_LEFT + half_thickness},${H2}`, poly164 = `${BOTTOM1 / 2 - PADDING_LEFT - half_thickness},${H2}`;

    let poly91 = `${-BOTTOM2 / 2},${H1 + half_thickness}`, poly92 = `${BOTTOM2 / 2},${H1 + half_thickness}`, poly93 = `${BOTTOM2 / 2},${H1 - half_thickness}`, poly94 = `${-BOTTOM2 / 2},${H1 - half_thickness}`;
    let poly101 = `${-BOTTOM2 / 2 - half_thickness},${H1}`, poly102 = `${-BOTTOM2 / 2 + half_thickness},${H1}`, poly103 = `${-BOTTOM2 / 2 + half_thickness},${H1 + H3}`, poly104 = `${-BOTTOM2 / 2 - half_thickness},${H1 + H3}`;
    let poly111 = `${BOTTOM2 / 2 - half_thickness},${H1}`, poly112 = `${BOTTOM2 / 2 + half_thickness},${H1}`, poly113 = `${BOTTOM2 / 2 + half_thickness},${H1 + H3}`, poly114 = `${BOTTOM2 / 2 - half_thickness},${H1 + H3}`;
    let poly121 = `${-BOTTOM2 / 2},${H1 + H3 + half_thickness}`, poly122 = `${BOTTOM2 / 2},${H1 + H3 + half_thickness}`, poly123 = `${BOTTOM2 / 2},${H1 + H3 - half_thickness}`, poly124 = `${-BOTTOM2 / 2},${H1 + H3 - half_thickness}`;

    return element.selected ? (
      <g transform={`translate(${0},${-DEPTH / 2})`}>
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
        <polygon points={`${poly131 + " " + poly132 + " " + poly133 + " " + poly134}`} style={STYLE_RECT_SELECTED} />
        <polygon points={`${poly141 + " " + poly142 + " " + poly143 + " " + poly144}`} style={STYLE_RECT_SELECTED} />
        <polygon points={`${poly151 + " " + poly152 + " " + poly153 + " " + poly154}`} style={STYLE_RECT_SELECTED} />
        <polygon points={`${poly161 + " " + poly162 + " " + poly163 + " " + poly164}`} style={STYLE_RECT_SELECTED} />

        <image href="/assets/enable.png" style={STYLE_PNG_BASE}/>
        {dis1 != 0 && <g transform={`translate(${0}, ${DEPTH} )`}>
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
        {dis2 != 0 && <g transform={`translate(${0}, ${0} )`}>
          <text
            x="20"
            y={dis2 / 2}
            transform={`scale(1, -1)`}
            style={STYLE_TEXT}
            filter="url(#rounded-corners)"
          >
            {dis2.toFixed(1)}
          </text>
          <line x1="-5" y1={-dis2} x2="5" y2={-dis2} style={STYLE} />
          <line x1="0" y1="0" x2="0" y2={-dis2} style={STYLE} />
        </g>}
        {dis3 != 0 && <g transform={`translate(-${dis3 + BOTTOM1 / 2}, ${DEPTH / 2} )`}>
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
        {dis4 != 0 && <g transform={`translate(${BOTTOM1 / 2}, ${DEPTH / 2} )`}>
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
      <g transform={`translate(${0},${-DEPTH / 2})`}>
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
        <polygon points={`${poly131 + " " + poly132 + " " + poly133 + " " + poly134}`} style={STYLE_RECT} />
        <polygon points={`${poly141 + " " + poly142 + " " + poly143 + " " + poly144}`} style={STYLE_RECT} />
        <polygon points={`${poly151 + " " + poly152 + " " + poly153 + " " + poly154}`} style={STYLE_RECT} />
        <polygon points={`${poly161 + " " + poly162 + " " + poly163 + " " + poly164}`} style={STYLE_RECT} />
      </g>
    );
  },

  render3D: function (element, layer, scene) {
    return null;
  }

};
