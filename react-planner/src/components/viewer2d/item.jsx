import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import If from "../../utils/react-if";
import ItemDlg from "./ItemDlg";
import { Fragment } from "react";

const STYLE_LINE = {
  fill: "#0096fd",
  stroke: "#0096fd",
};

const STYLE_CIRCLE = {
  fill: "#0096fd",
  stroke: "#0096fd",
  cursor: "ew-resize",
};

const STYLE_CIRCLE2 = {
  fill: "none",
  stroke: "#0096fd",
  cursor: "ew-resize",
};
const STYLE_RECT_SELECTED = {
  fill: "#A0BEF7",
  strokeWidth: 1,
  stroke: "#A0BEF7",
};

export default function Item({ layer, item, scene, catalog }) {
  let { x, y, rotation, zoom } = item;

  const [scale, setScale] = useState(1);

  console.log('zoom', zoom)

  let renderedItem = catalog.getElement(item.type).render2D(item, layer, scene);

  const WIDTH = renderedItem.props.width;
  const DEPTH = renderedItem.props.height;
  const half_thickness = 1;
  const margin = 5;
  const CIRCLE_RADIUS = 4;
  const STROKE_WIDTH = 3;

  let poly11 = `${-WIDTH / 2 - margin},${half_thickness - DEPTH / 2 - margin}`,
    poly12 = `${WIDTH / 2 + margin},${half_thickness - DEPTH / 2 - margin}`,
    poly13 = `${WIDTH / 2 + margin},${-half_thickness - DEPTH / 2 - margin}`,
    poly14 = `${-WIDTH / 2 - margin},${-half_thickness - DEPTH / 2 - margin}`;
  let poly21 = `${-WIDTH / 2 - half_thickness - margin},${DEPTH / 2 + margin}`,
    poly22 = `${-WIDTH / 2 + half_thickness - margin},${DEPTH / 2 + margin}`,
    poly23 = `${-WIDTH / 2 + half_thickness - margin},${-DEPTH / 2 - margin}`,
    poly24 = `${-WIDTH / 2 - half_thickness - margin},${-DEPTH / 2 - margin}`;
  let poly31 = `${WIDTH / 2 - half_thickness + margin},${DEPTH / 2 + margin}`,
    poly32 = `${WIDTH / 2 + half_thickness + margin},${DEPTH / 2 + margin}`,
    poly33 = `${WIDTH / 2 + half_thickness + margin},${-DEPTH / 2 - margin}`,
    poly34 = `${WIDTH / 2 - half_thickness + margin},${-DEPTH / 2 - margin}`;
  let poly41 = `${-WIDTH / 2 - margin},${DEPTH / 2 + half_thickness + margin}`,
    poly42 = `${WIDTH / 2 + margin},${DEPTH / 2 + half_thickness + margin}`,
    poly43 = `${WIDTH / 2 + margin},${DEPTH / 2 - half_thickness + margin}`,
    poly44 = `${-WIDTH / 2 - margin},${DEPTH / 2 - half_thickness + margin}`;

  useEffect(() => {
    if (WIDTH != undefined && zoom != 0) {
      const delta = Math.abs(zoom) - (WIDTH * scale) / 2 - margin;
      const currentWidth = (WIDTH * scale) / 2 + delta;

      const nextScale = (currentWidth / WIDTH) * 2;

      if(nextScale != NaN) {
        setScale(nextScale);
      }

    }
  }, [item, catalog]);

  console.log('scale', scale)
  return (
    <Fragment>
      <g
        data-element-root
        data-prototype={item.prototype}
        data-id={item.id}
        data-selected={item.selected}
        data-layer={layer.id}
        style={item.selected ? { cursor: "move" } : {}}
        transform={`translate(${x},${y}) rotate(${rotation}) scale(${scale})`}
      >
        {renderedItem}

        <If condition={item.selected}>
          <g
            data-element-root
            data-prototype={item.prototype}
            data-id={item.id}
            data-selected={item.selected}
            data-layer={layer.id}
            data-part="rotation-anchor"
          >
            <circle cx="0" cy="150" r="10" style={STYLE_CIRCLE} />
            <circle cx="0" cy="0" r="150" style={STYLE_CIRCLE2} />
          </g>
        </If>
        <If condition={item.selected}>
          <g
            data-element-root
            data-prototype={item.prototype}
            data-id={item.id}
            data-selected={item.selected}
            data-layer={layer.id}
            data-part="outline-item"
            data-width={WIDTH}
            data-height={DEPTH}
            data-scale={scale}
          >
            <polygon
              points={`${poly11 + " " + poly12 + " " + poly13 + " " + poly14}`}
              style={STYLE_RECT_SELECTED}
            />
            <polygon
              points={`${poly21 + " " + poly22 + " " + poly23 + " " + poly24}`}
              style={STYLE_RECT_SELECTED}
            />
            <polygon
              points={`${poly31 + " " + poly32 + " " + poly33 + " " + poly34}`}
              style={STYLE_RECT_SELECTED}
            />
            <polygon
              points={`${poly41 + " " + poly42 + " " + poly43 + " " + poly44}`}
              style={STYLE_RECT_SELECTED}
            />
          </g>
        </If>
        <If condition={item.selected}>
          <g
            data-element-root
            data-prototype={item.prototype}
            data-id={item.id}
            data-selected={item.selected}
            data-layer={layer.id}
            data-part="resize-points-rb"
          >
            <circle
              cx={WIDTH / 2 + margin}
              cy={-DEPTH / 2 - margin}
              r={CIRCLE_RADIUS}
              stroke="#A0BEF7"
              strokeWidth={2}
              fill="#A0BEF7"
              style={{ cursor: "nwse-resize" }}
            />
          </g>
        </If>
        <If condition={item.selected}>
          <g
            data-element-root
            data-prototype={item.prototype}
            data-id={item.id}
            data-selected={item.selected}
            data-layer={layer.id}
            data-part="resize-points-rt"
          >
            <circle
              cx={WIDTH / 2 + margin}
              cy={DEPTH / 2 + margin}
              r={CIRCLE_RADIUS}
              stroke="#A0BEF7"
              strokeWidth={2}
              fill="#A0BEF7"
              style={{ cursor: "nesw-resize" }}
            />
          </g>
        </If>
        <If condition={item.selected}>
          <g
            data-element-root
            data-prototype={item.prototype}
            data-id={item.id}
            data-selected={item.selected}
            data-layer={layer.id}
            data-part="resize-points-lt"
          >
            <circle
              cx={-WIDTH / 2 - margin}
              cy={DEPTH / 2 + margin}
              r={CIRCLE_RADIUS}
              stroke="#A0BEF7"
              strokeWidth={2}
              fill="#A0BEF7"
              style={{ cursor: "nwse-resize" }}
            />
          </g>
        </If>
        <If condition={item.selected}>
          <g
            data-element-root
            data-prototype={item.prototype}
            data-id={item.id}
            data-selected={item.selected}
            data-layer={layer.id}
            data-part="resize-points-lb"
          >
            <circle
              cx={-WIDTH / 2 - margin}
              cy={-DEPTH / 2 - margin}
              r={CIRCLE_RADIUS}
              stroke="#A0BEF7"
              strokeWidth={2}
              fill="#A0BEF7"
              style={{ cursor: "nesw-resize" }}
            />
          </g>
        </If>
      </g>
    </Fragment>
  );
}

Item.propTypes = {
  item: PropTypes.object.isRequired,
  layer: PropTypes.object.isRequired,
  scene: PropTypes.object.isRequired,
  catalog: PropTypes.object.isRequired,
};
