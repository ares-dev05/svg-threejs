import React from "react";
import PropTypes from "prop-types";

const STYLE = {
  stroke: "#99BCFF",
  strokeWidth: "1px",
};

const STYLE_TEXT = {
  fontFamily: "DM Sans",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: "11px",
  lineHeight: "9px",
  textAlign: "right",
  fill: "#407AEC",

  //http://stackoverflow.com/questions/826782/how-to-disable-text-selection-highlighting-using-css
  WebkitTouchCallout: "none" /* iOS Safari */,
  WebkitUserSelect: "none" /* Chrome/Safari/Opera */,
  MozUserSelect: "none" /* Firefox */,
  MsUserSelect: "none" /* Internet Explorer/Edge */,
  userSelect: "none",
};

export default function Ruler({ length, unit, half_thickness, mode = 0 }) {
  let distanceText = `${(length / 100).toFixed(2)} M`;

  if (mode == 0)
    return (
      <g transform={`translate(0, ${half_thickness + 10} )`}>
        <text
          x={length / 2}
          y="-10"
          transform={`scale(1, -1)`}
          style={STYLE_TEXT}
        >
          A: {distanceText}
        </text>
        <polygon points="0,-5 0,5 4,0" style={STYLE} />
        <line x1={length} y1="-5" x2={length} y2="5" style={STYLE} />
        <polygon
          points={`${length},-5 ${length},5 ${length - 4} 0`}
          style={STYLE}
        />
        <line x1="0" y1="0" x2={length} y2="0" style={STYLE} />
      </g>
    );
  else
    return (
      <g transform={`translate(0, ${-half_thickness - 10} )`}>
        <text
          x={length / 2}
          y="20"
          transform={`scale(1, -1)`}
          style={STYLE_TEXT}
        >
          B: {distanceText}
        </text>
        <polygon points="0,-5 0,5 4,0" style={STYLE} />
        <line x1={length} y1="-5" x2={length} y2="5" style={STYLE} />
        <polygon
          points={`${length},-5 ${length},5 ${length - 4} 0`}
          style={STYLE}
        />
        <line x1="0" y1="0" x2={length} y2="0" style={STYLE} />
      </g>
    );
}

Ruler.propTypes = {
  length: PropTypes.number.isRequired,
  unit: PropTypes.string.isRequired,
  half_thickness: PropTypes.number.isRequired,
};
