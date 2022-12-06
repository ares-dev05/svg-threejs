import React from 'react';
import * as Three from 'three';
import {loadObjWithMaterial} from '../../utils/load-obj';
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
  name: 'door-cursor',
  prototype: 'cursor',

  info: {
    title: 'door-cursor',
    tag: ['door-cursor'],
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
    let epsilon = 20;
    let holeWidth = 80;
    let holePath = `M${0} ${ -epsilon}  L${holeWidth} ${-epsilon}  L${holeWidth} ${0}  L${0} ${0}  z`;
    let arcPath = `M${0},${0}  A${holeWidth},${holeWidth} 0 0,1 ${holeWidth},${holeWidth}`;
    let holeStyle = element.selected ? STYLE_HOLE_SELECTED : STYLE_HOLE_BASE;
    let lineStyle = element.selected ? STYLE_LINE_SELECTED : STYLE_LINE_BASE;
    let arcStyle = element.selected ? STYLE_ARC_SELECTED : STYLE_ARC_BASE;
    let length = element.properties.get('width').get('length');

    return (
      <g transform={`translate(${-length / 2}, 0)`}>
        <path d={arcPath} style={STYLE_ARC_SELECTED} transform={`translate(${0},${holeWidth}) scale(${1},${-1}) rotate(${0})`}/>
        <line x1={0} y1={holeWidth} x2={0} y2={0 - EPSILON} style={STYLE_LINE_SELECTED} transform={`scale(${-1},${1})`}/>
        <path d={holePath} style={STYLE_HOLE_SELECTED}/>
        <image href="/assets/disable.png" style={STYLE_PNG_BASE}/>
      </g>
    )
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
