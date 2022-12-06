import React from 'react';
import * as Three from 'three';
import {loadObjWithMaterial} from '../../utils/load-obj';
import { GeometryUtils } from "../../../../../src/utils/export";
import path from 'path';

let cached3DDoor = null;

const STYLE_HOLE_BASE = {stroke: '#FFF', strokeWidth: '0px', fill: '#FFF'};
const STYLE_HOLE_SELECTED = {stroke: '#0096fd', strokeWidth: '2px', fill: '#FFF', cursor: 'move'};
const STYLE_LINE_BASE = {stroke: '#BABABA', strokeWidth: '1px', fill: '#BABABA'};
const STYLE_LINE_SELECTED = {stroke: '#0096fd', strokeWidth: '2px', fill: '#none', cursor: 'move'};
const STYLE_ARC_BASE = {stroke: '#BABABA', strokeWidth: '1px', fill: 'none'};
const STYLE_ARC_SELECTED = {stroke: '#0096fd', strokeWidth: '1px', fill: 'none', cursor: 'move'};
const STYLE_PNG_BASE = { transform: 'translate(50px, -5px)' };
const EPSILON = 3;

export default {
  name: 'door',
  prototype: 'holes',

  info: {
    title: 'door',
    tag: ['door'],
    description: 'Wooden door',
    image: require('./door.png')
  },

  properties: {
    width: {
      label: 'Width',
      type: 'length-measure',
      defaultValue: {
        length: 80
      }
    },
    height: {
      label: 'Height',
      type: 'length-measure',
      defaultValue: {
        length: 215
      }
    },
    altitude: {
      label: 'Altitude',
      type: 'length-measure',
      defaultValue: {
        length: 0
      }
    },
    thickness: {
      label: 'Thickness',
      type: 'length-measure',
      defaultValue: {
        length: 30
      }
    },
    flip_orizzontal: {
      label: 'flip orizzontale',
      type: 'checkbox',
      defaultValue: false,
      values: {
        'none': false,
        'yes':  true
      }
    }
  },

  render2D: function (element, layer, scene) {
    let flip = element.properties.get('flip_orizzontal');
    let line = layer.lines.get(element.line);
    let epsilon = (line.properties.get("thickness").get("length")) / 2;
    let holeWidth = element.properties.get('width').get('length');
    let holePath = `M${0} ${ -epsilon}  L${holeWidth} ${-epsilon}  L${holeWidth} ${epsilon}  L${0} ${epsilon}  z`;
    let arcPath = `M${0},${0}  A${holeWidth},${holeWidth} 0 0,1 ${holeWidth},${holeWidth}`;
    let holeStyle = element.selected ? STYLE_HOLE_SELECTED : STYLE_HOLE_BASE;
    let lineStyle = element.selected ? STYLE_LINE_SELECTED : STYLE_LINE_BASE;
    let arcStyle = element.selected ? STYLE_ARC_SELECTED : STYLE_ARC_BASE;
    let length = element.properties.get('width').get('length');

    let vertex0 = layer.vertices.get(line.vertices.get(0));
    let vertex1 = layer.vertices.get(line.vertices.get(1));

    if (vertex0.id === vertex1.id || GeometryUtils.samePoints(vertex0, vertex1))
      return null; //avoid 0-length lines

    let { x: x1, y: y1 } = vertex0;
    let { x: x2, y: y2 } = vertex1;

    if (x1 > x2) {
      ({ x: x1, y: y1 } = vertex1);
      ({ x: x2, y: y2 } = vertex0);
    }

    let Linelength = GeometryUtils.pointsDistance(x1, y1, x2, y2);
    let angle = GeometryUtils.angleBetweenTwoPointsAndOrigin(x1, y1, x2, y2);

    if(flip == false) {
      return (
        <g transform={`translate(${-length / 2}, 0)`}>
          <path d={arcPath} style={arcStyle} transform={`translate(${0},${holeWidth}) scale(${1},${-1}) rotate(${0})`}/>
          <line x1={0} y1={holeWidth} x2={0} y2={0 - EPSILON} style={lineStyle} transform={`scale(${-1},${1})`}/>
          <path d={holePath} style={holeStyle}/>
          {element.selected && <image href="/assets/enable.png" style={STYLE_PNG_BASE}/> }
        </g>
      )
    }
    else{
      return (
        <g transform={`translate(${-length / 2}, 0)`}>
          <path d={arcPath} style={arcStyle} transform={`translate(${0},${-holeWidth}) scale(${1},${1}) rotate(${0})`}/>
          <line x1={0} y1={-holeWidth} x2={0} y2={0 - EPSILON} style={lineStyle} transform={`scale(${-1},${1})`}/>
          <path d={holePath} style={holeStyle}/>
          {element.selected && <image href="/assets/enable.png" style={STYLE_PNG_BASE}/> }
        </g>
      )
    }
  },

  render3D: function (element, layer, scene) {
    let onLoadItem = (object) => {
      let boundingBox = new Three.Box3().setFromObject(object);

      let initialWidth = boundingBox.max.x - boundingBox.min.x;
      let initialHeight = boundingBox.max.y - boundingBox.min.y;
      let initialThickness = boundingBox.max.z - boundingBox.min.z;

      if (element.selected) {
        let box = new Three.BoxHelper(object, 0x99c3fb);
        box.material.linewidth = 2;
        box.material.depthTest = false;
        box.renderOrder = 1000;
        object.add(box);
      }

      let width = element.properties.get('width').get('length');
      let height = element.properties.get('height').get('length');
      let thickness = element.properties.get('thickness').get('length');

      object.scale.set(width / initialWidth, height / initialHeight,
        thickness / initialThickness);

      return object;
    };

    if(cached3DDoor) {
      return Promise.resolve(onLoadItem(cached3DDoor.clone()));
    }

    let mtl = require('./door.mtl');
    let obj = require('./door.obj');
    let img = require('./texture.jpg');

    return loadObjWithMaterial(mtl, obj, path.dirname(img) + '/')
      .then(object => {
        cached3DDoor = object;
        return onLoadItem(cached3DDoor.clone())
      })

  }
};
