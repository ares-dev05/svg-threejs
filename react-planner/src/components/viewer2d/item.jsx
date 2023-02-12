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


export default function Item({ layer, item, scene, catalog }) {
  let { x, y, rotation, zoom, horizontalFlip, verticalFlip } = item;

  const [scale, setScale] = useState(1);
  const [params, setParam] = useState({dis1: 0, dis2: 0, dis3: 0, dis4: 0});

  let renderedItem = catalog.getElement(item.type).render2D(item, layer, scene);

  const WIDTH = renderedItem.props.width;
  const DEPTH = renderedItem.props.height;
  const lines = renderedItem.props.lines;
  const xRuler = renderedItem.props.x;
  const yRuler = renderedItem.props.y;

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
    if (WIDTH != undefined && zoom != 0 && zoom != 'NaN') {
      const currentWidth = Math.abs(zoom) - margin;

      console.log('item', {zoom, WIDTH})

      const nextScale = (currentWidth / WIDTH) * 2;

      if(nextScale != NaN) {
        setScale(nextScale);
      }
    }
  }, [item, catalog]);

  useEffect(() => {
    try {
      let dis1 = 0, dis2 = 0, dis3 = 0, dis4 = 0;
      lines.map(line => {
        if(line.y1 > yRuler +  DEPTH * scale / 2 && ((line.x1 <= xRuler && line.x2 >= x) || (line.x2 <= xRuler && line.x1 >= x))) {
          if(dis1 == 0) {
            dis1 = line.y1 - yRuler -  DEPTH * scale / 2;
          } else if (dis1 > line.y1 - yRuler -  DEPTH * scale / 2) {
            dis1 = line.y1 - yRuler -  DEPTH * scale;
          }
        } else if(line.y1 < yRuler -  DEPTH * scale / 2 && ((line.x1 <= xRuler && line.x2 >= x) || (line.x2 <= xRuler && line.x1 >= x))) {
          if(dis2 == 0) {
            dis2 = yRuler -  DEPTH * scale / 2 - line.y1;
          } else if (dis2 > yRuler -  DEPTH * scale / 2 - line.y1) {
            dis2 = yRuler -  DEPTH * scale - line.y1;
          }
        } else if(line.x1 < xRuler -  WIDTH* scale / 2 && ((line.y1 <= yRuler && line.y2 >= y) || (line.y2 <= yRuler && line.y1 >= y))) {
          if(dis3 == 0) {
            dis3 = -line.x1 + xRuler -  WIDTH* scale / 2;
          } else if (dis3 > -line.x1 + xRuler -  WIDTH* scale / 2) {
            dis3 = -line.x1 + xRuler -  WIDTH* scale / 2;
          }
        } else if(line.x1 > xRuler +  WIDTH* scale / 2 && ((line.y1 <= yRuler && line.y2 >= y) || (line.y2 <= yRuler && line.y1 >= y))) {
          if(dis4 == 0) {
            dis4 = line.x1 - xRuler -  WIDTH* scale / 2;
          } else if (dis4 > line.x1 - xRuler -  WIDTH* scale / 2) {
            dis4 = line.x1 - xRuler -  WIDTH* scale / 2;
          }
        }
      })
      setParam({dis1: dis1, dis2: dis2, dis3: dis3, dis4: dis4})
    } catch(e) {
console.log('e', e)
    }
  }, [lines, xRuler, yRuler])

  console.log('param', params)
  return (
    <Fragment>
      <g
        data-element-root
        data-prototype={item.prototype}
        data-id={item.id}
        data-selected={item.selected}
        data-layer={layer.id}
        style={item.selected ? { cursor: "move" } : {}}
        transform={`translate(${x},${y})`}
      >
         <g
        data-element-root
        data-prototype={item.prototype}
        data-id={item.id}
        data-selected={item.selected}
        data-layer={layer.id}
        style={item.selected ? { cursor: "move" } : {}}
        transform={`rotate(${rotation}) scale(${scale * (verticalFlip? -1: 1)}, ${scale * (horizontalFlip? -1: 1)})`}
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
        {params.dis1 != 0 && item.selected && <g transform={`translate(${0}, ${ DEPTH * scale / 2} )`}>
          <text
            x="20"
            y={-params.dis1 / 2}
            transform={`scale(1, -1)`}
            style={STYLE_TEXT}
            filter="url(#rounded-corners)"
          >
            {params.dis1.toFixed(1)}
          </text>
          <line x1="-5" y1={params.dis1} x2="5" y2={params.dis1} style={STYLE} />
          <line x1="0" y1="0" x2="0" y2={params.dis1} style={STYLE} />
        </g>}
        {params.dis2 != 0 && item.selected && <g transform={`translate(${0}, ${-  DEPTH * scale / 2} )`}>
          <text
            x="20"
            y={params.dis2 / 2}
            transform={`scale(1, -1)`}
            style={STYLE_TEXT}
            filter="url(#rounded-corners)"
          >
            {params.dis2.toFixed(1)}
          </text>
          <line x1="-5" y1={-params.dis2} x2="5" y2={-params.dis2} style={STYLE} />
          <line x1="0" y1="0" x2="0" y2={-params.dis2} style={STYLE} />
        </g>}
        {params.dis3 != 0 && item.selected && <g transform={`translate(-${params.dis3 +  WIDTH* scale / 2}, ${0} )`}>
          <text
            x={params.dis3 / 2}
            y="-10"
            transform={`scale(1, -1)`}
            style={STYLE_TEXT}
            filter="url(#rounded-corners)"
          >
            {params.dis3.toFixed(1)}
          </text>
          <line x1={0} y1="-5" x2={0} y2="5" style={STYLE} />
          <line x1="0" y1="0" x2={params.dis3} y2="0" style={STYLE} />
        </g>}
        {params.dis4 != 0 && item.selected && <g transform={`translate(${ WIDTH* scale / 2}, ${0} )`}>
          <text
            x={params.dis4 / 2}
            y="-10"
            transform={`scale(1, -1)`}
            style={STYLE_TEXT}
            filter="url(#rounded-corners)"
          >
            {params.dis4.toFixed(1)}
          </text>
          <line x1={params.dis4} y1="-5" x2={params.dis4} y2="5" style={STYLE} />
          <line x1="0" y1="0" x2={params.dis4} y2="0" style={STYLE} />
        </g>}
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
