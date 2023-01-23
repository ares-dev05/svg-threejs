import * as Three from 'three';
import React from 'react';

const WIDTH=150;
const DEPTH=150;
const HEIGHT=150;

const STYLE_RECT = {
  strokeWidth: 1,
  stroke: "#8E9BA2",
  fill: "#8B8B8B",
};
const STYLE_RECT_SELECTED = {
  fill: "#407AEC",
  strokeWidth: 1,
  stroke: "#99C3FB",
};
const STYLE_PNG_BASE = {
  transform: 'translate(80px, 50px)'
};

export default {
  name: 'room',
  prototype: 'items',

  info: {
    tag: ['room', 'wall'],
    title: 'room',
    description: 'room',
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
    console.log('render2D', element, layer, scene)
    const half_thickness = 10;
    const length = WIDTH;
    const lines = []
    layer.lines.map(line => {
      const vertices = layer.vertices;
      const {x: x1, y: y1} =  vertices.get(line.vertices.get(0))
      const {x: x2, y: y2} =  vertices.get(line.vertices.get(1))

      lines.push({x1, y1, x2, y2})
    })

    console.log('lines', lines)
    const x = element.x;
    const y = element.y;

    let dis1 = 0, dis2 = 0, dis3 = 0, dis4 = 0;

    lines.map(line => {
      if(line.y1 > y + DEPTH / 2 && line.x1 <= x - WIDTH / 2 && line.x2 >= x + WIDTH / 2) {
        if(dis1 == 0) {
          dis1 = line.y1 - y - DEPTH / 2;
        } else if (dis1 > line.y1 - y - DEPTH / 2) {
          dis1 = line.y1 - y - DEPTH / 2;
        }
      } else if(line.y1 < y - DEPTH / 2 && line.x1 <= x - WIDTH / 2 && line.x2 >= x + WIDTH / 2) {
        if(dis2 == 0) {
          dis2 = line.y1 - y - DEPTH / 2;
        } else if (dis2 > line.y1 - y - DEPTH / 2) {
          dis2 = line.y1 - y - DEPTH / 2;
        }
      } else if(line.x1 < x - DEPTH / 2 && ((line.y1 <= y - DEPTH / 2 && line.y2 >= y + DEPTH / 2) || (line.y2 <= y - DEPTH / 2 && line.y1 >= y + DEPTH / 2))) {
        if(dis3 == 0) {
          dis3 = -line.x1 + x + DEPTH / 2;
        } else if (dis3 > -line.x1 + x + DEPTH / 2) {
          dis3 = -line.x1 + x + DEPTH / 2;
        }
      } 
    })

    console.log('dis1', dis1)
    console.log('dis2', dis2)
    console.log('dis3', dis3)

    let poly11 = `${half_thickness},${half_thickness}`, poly12 = `${length - half_thickness},${half_thickness}`, poly13 = `${length + half_thickness},${-half_thickness}`, poly14 = `-${half_thickness},-${half_thickness}`;
    let poly21 = `${-half_thickness},${DEPTH + half_thickness}`, poly22 = `${length + half_thickness},${DEPTH + half_thickness}`, poly23 = `${length - half_thickness},${DEPTH - half_thickness}`, poly24 = `${half_thickness}, ${DEPTH - half_thickness}`;
    let poly31 = `${-half_thickness},${DEPTH + half_thickness}`, poly32 = `${half_thickness},${DEPTH - half_thickness}`, poly33 = `${half_thickness},${half_thickness}`, poly34 = `${-half_thickness}, -${half_thickness}`;
    let poly41 = `${WIDTH -half_thickness},${DEPTH - half_thickness}`, poly42 = `${WIDTH + half_thickness},${DEPTH + half_thickness}`, poly43 = `${WIDTH + half_thickness},-${half_thickness}`, poly44 = `${WIDTH -half_thickness}, ${half_thickness}`;

    return element.selected ? (
      <g transform={`translate(${-WIDTH / 2},${-DEPTH / 2})`}>
        <polygon points={`${poly11 + " " + poly12 + " " + poly13 + " " + poly14}`} style={STYLE_RECT_SELECTED} />
        <polygon points={`${poly21 + " " + poly22 + " " + poly23 + " " + poly24}`} style={STYLE_RECT_SELECTED} />
        <polygon points={`${poly31 + " " + poly32 + " " + poly33 + " " + poly34}`} style={STYLE_RECT_SELECTED} />
        <polygon points={`${poly41 + " " + poly42 + " " + poly43 + " " + poly44}`} style={STYLE_RECT_SELECTED} />
        <image href="/assets/enable.png" style={STYLE_PNG_BASE}/>
      </g>
    ) : (
      <g transform={`translate(${-WIDTH / 2},${-DEPTH / 2})`}>
        <polygon points={`${poly11 + " " + poly12 + " " + poly13 + " " + poly14}`} style={STYLE_RECT} />
        <polygon points={`${poly21 + " " + poly22 + " " + poly23 + " " + poly24}`} style={STYLE_RECT} />
        <polygon points={`${poly31 + " " + poly32 + " " + poly33 + " " + poly34}`} style={STYLE_RECT} />
        <polygon points={`${poly41 + " " + poly42 + " " + poly43 + " " + poly44}`} style={STYLE_RECT} />
      </g>
    );
  },

  render3D: function (element, layer, scene) {
    return null;
  }

};
