import React from 'react';
import PropTypes from 'prop-types';
import If from '../../utils/react-if';

const STYLE_LINE = {
  fill: "#0096fd",
  stroke: "#0096fd"
};

const STYLE_CIRCLE = {
  fill: "#0096fd",
  stroke: "#0096fd",
  cursor: "ew-resize"
};

const STYLE_CIRCLE2 = {
  fill: "none",
  stroke: "#0096fd",
  cursor: "ew-resize"
};
const STYLE_RECT_SELECTED = {
  fill: "#A0BEF7",
  strokeWidth: 1,
  stroke: "#A0BEF7",
};

export default function Item({layer, item, scene, catalog}) {

  let {x, y, rotation} = item;

  let renderedItem = catalog.getElement(item.type).render2D(item, layer, scene);

  const WIDTH = renderedItem.props.width;
  const DEPTH = renderedItem.props.height;
  const half_thickness = 1;
  const margin = 5;
  const CIRCLE_RADIUS = 4;
  const STROKE_WIDTH = 3;

  let poly11 = `${-WIDTH / 2 - margin},${half_thickness - DEPTH / 2- margin}`, poly12 = `${WIDTH / 2 + margin},${half_thickness - DEPTH / 2- margin}`, poly13 = `${WIDTH / 2 + margin},${-half_thickness - DEPTH / 2- margin}`, poly14 = `${-WIDTH / 2 - margin},${-half_thickness - DEPTH / 2- margin}`;
  let poly21 = `${-WIDTH / 2 - half_thickness - margin},${DEPTH / 2+ margin}`, poly22 = `${-WIDTH / 2 + half_thickness - margin},${DEPTH / 2 + margin}`, poly23 = `${-WIDTH / 2 + half_thickness - margin},${ - DEPTH / 2 - margin}`, poly24 = `${-WIDTH / 2 - half_thickness - margin},${-DEPTH / 2 - margin}`;
  let poly31 = `${WIDTH / 2 - half_thickness + margin},${DEPTH / 2 + margin}`, poly32 = `${WIDTH / 2 + half_thickness + margin},${DEPTH / 2 + margin}`, poly33 = `${WIDTH / 2 + half_thickness + margin},${ - DEPTH / 2 - margin}`, poly34 = `${WIDTH / 2 - half_thickness + margin},${ - DEPTH / 2 - margin}`;
  let poly41 = `${-WIDTH / 2 - margin},${DEPTH / 2 + half_thickness + margin}`, poly42 = `${WIDTH / 2 + margin},${DEPTH / 2 + half_thickness + margin}`, poly43 = `${WIDTH / 2 + margin},${DEPTH / 2 - half_thickness + margin}`, poly44 = `${-WIDTH / 2 - margin},${DEPTH / 2 - half_thickness + margin}`;

  return (
    <g
      data-element-root
      data-prototype={item.prototype}
      data-id={item.id}
      data-selected={item.selected}
      data-layer={layer.id}
      style={item.selected ? {cursor: "move"} : {}}
      transform={`translate(${x},${y}) rotate(${rotation})`}>

      {renderedItem}
      
      <If condition={item.selected}>
        <g data-element-root
           data-prototype={item.prototype}
           data-id={item.id}
           data-selected={item.selected}
           data-layer={layer.id}
           data-part="rotation-anchor"
        >
          <circle cx="0" cy="150" r="10" style={STYLE_CIRCLE}/>
          <circle cx="0" cy="0" r="150" style={STYLE_CIRCLE2}/>
        </g>
      </If>
      <If condition={item.selected}>
        <g data-element-root
           data-prototype={item.prototype}
           data-id={item.id}
           data-selected={item.selected}
           data-layer={layer.id}
        >
          <polygon points={`${poly11 + " " + poly12 + " " + poly13 + " " + poly14}`} style={STYLE_RECT_SELECTED} />
          <polygon points={`${poly21 + " " + poly22 + " " + poly23 + " " + poly24}`} style={STYLE_RECT_SELECTED} />
          <polygon points={`${poly31 + " " + poly32 + " " + poly33 + " " + poly34}`} style={STYLE_RECT_SELECTED} />
          <polygon points={`${poly41 + " " + poly42 + " " + poly43 + " " + poly44}`} style={STYLE_RECT_SELECTED} />
        </g>
      </If>
      <If condition={item.selected}>
        <g data-element-root
           data-prototype={item.prototype}
           data-id={item.id}
           data-selected={item.selected}
           data-layer={layer.id}
           data-part="resize-points-rb"
        >
           <svg height={CIRCLE_RADIUS * 2 + 2 * STROKE_WIDTH} width={CIRCLE_RADIUS * 2 + 2 * STROKE_WIDTH} x={WIDTH / 2 + margin - CIRCLE_RADIUS - 2 * half_thickness} y={- 2 * half_thickness - DEPTH / 2 - margin - CIRCLE_RADIUS -2}>
            <circle cx={CIRCLE_RADIUS  + 3} cy={CIRCLE_RADIUS  + 3} r={CIRCLE_RADIUS} stroke="#A0BEF7" strokeWidth={2} fill="#A0BEF7" />
          </svg>
        </g>
      </If>
      <If condition={item.selected}>
        <g data-element-root
           data-prototype={item.prototype}
           data-id={item.id}
           data-selected={item.selected}
           data-layer={layer.id}
           data-part="resize-points-rt"
        >
           <svg height={CIRCLE_RADIUS * 2 + 2 * STROKE_WIDTH} width={CIRCLE_RADIUS * 2 + 2 * STROKE_WIDTH} x={WIDTH / 2 + margin - CIRCLE_RADIUS - 2 * half_thickness} y={DEPTH / 2 + margin - CIRCLE_RADIUS - 2 + 2 * half_thickness}>
            <circle cx={CIRCLE_RADIUS  + 3} cy={CIRCLE_RADIUS  + 3} r={CIRCLE_RADIUS} stroke="#A0BEF7" strokeWidth={2} fill="#A0BEF7" />
          </svg>
        </g>
      </If>
      <If condition={item.selected}>
        <g data-element-root
           data-prototype={item.prototype}
           data-id={item.id}
           data-selected={item.selected}
           data-layer={layer.id}
           data-part="resize-points-lt"
        >
           <svg height={CIRCLE_RADIUS * 2 + 2 * STROKE_WIDTH} width={CIRCLE_RADIUS * 2 + 2 * STROKE_WIDTH} x={-WIDTH / 2 - margin - 2 * half_thickness - CIRCLE_RADIUS} y={DEPTH / 2 + margin - CIRCLE_RADIUS - 2 + half_thickness}>
            <circle cx={CIRCLE_RADIUS  + 3} cy={CIRCLE_RADIUS  + 3} r={CIRCLE_RADIUS} stroke="#A0BEF7" strokeWidth={2} fill="#A0BEF7" />
          </svg>
        </g>
      </If>
      <If condition={item.selected}>
        <g data-element-root
           data-prototype={item.prototype}
           data-id={item.id}
           data-selected={item.selected}
           data-layer={layer.id}
           data-part="resize-points-lb"
        >
           <svg height={CIRCLE_RADIUS * 2 + 2 * STROKE_WIDTH} width={CIRCLE_RADIUS * 2 + 2 * STROKE_WIDTH} x={-WIDTH / 2 - margin - 2 * half_thickness - CIRCLE_RADIUS} y={- 2 * half_thickness - DEPTH / 2 - margin - CIRCLE_RADIUS -2}>
            <circle cx={CIRCLE_RADIUS  + 3} cy={CIRCLE_RADIUS  + 3} r={CIRCLE_RADIUS} stroke="#A0BEF7" strokeWidth={2} fill="#A0BEF7" />
          </svg>
        </g>
      </If>
    </g>
  )
}

Item.propTypes = {
  item: PropTypes.object.isRequired,
  layer: PropTypes.object.isRequired,
  scene: PropTypes.object.isRequired,
  catalog: PropTypes.object.isRequired
};

