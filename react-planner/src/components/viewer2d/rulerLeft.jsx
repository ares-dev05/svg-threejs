import React from "react";
import PropTypes from "prop-types";

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

export default function RulerLeft({
  length,
  margin,
  half_thickness,
  mode = 0,
}) {
  let distanceText = `${(length / 100).toFixed(2)}`;
  return (
    <g transform={`translate(${-margin}, 0 )`}>
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
      <text
        x={length / 2}
        y="-10"
        transform={`scale(1, -1)`}
        style={STYLE_TEXT}
        filter="url(#rounded-corners)"
      >
        {distanceText}
      </text>
      <line x1={length} y1="-5" x2={length} y2="5" style={STYLE} />
      <line x1="0" y1="0" x2={length} y2="0" style={STYLE} />
    </g>
  );
}

RulerLeft.propTypes = {
  length: PropTypes.number.isRequired,
  margin: PropTypes.number.isRequired,
  half_thickness: PropTypes.number.isRequired,
};
