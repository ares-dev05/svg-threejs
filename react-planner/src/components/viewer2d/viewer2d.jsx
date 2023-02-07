import React, { useState, useEffect, useRef } from "react";

import PropTypes from "prop-types";

import {
  ReactSVGPanZoom,
  TOOL_NONE,
  TOOL_PAN,
  TOOL_ZOOM_IN,
  TOOL_ZOOM_OUT,
  TOOL_AUTO,
} from "react-svg-pan-zoom";

import { makeStyles } from "@material-ui/core/styles";

import { Box, Typography, TextField } from "@material-ui/core";

import * as constants from "../../constants";
import State from "./state";
import * as SharedStyle from "../../shared-style";
import { RulerX, RulerY } from "./export";

function mode2Tool(mode) {
  switch (mode) {
    case constants.MODE_2D_PAN:
      return TOOL_PAN;
    case constants.MODE_2D_ZOOM_IN:
      return TOOL_ZOOM_IN;
    case constants.MODE_2D_ZOOM_OUT:
      return TOOL_ZOOM_OUT;
    case constants.MODE_IDLE:
      return TOOL_AUTO;
    default:
      return TOOL_NONE;
  }
}

function mode2PointerEvents(mode) {
  switch (mode) {
    case constants.MODE_DRAWING_LINE:
    case constants.MODE_DRAWING_HOLE:
    case constants.MODE_DRAWING_ITEM:
    case constants.MODE_DRAGGING_HOLE:
    case constants.MODE_DRAGGING_ITEM:
    case constants.MODE_DRAGGING_LINE:
    case constants.MODE_DRAGGING_VERTEX:
      return { pointerEvents: "none" };

    default:
      return {};
  }
}

function mode2Cursor(mode) {
  switch (mode) {
    case constants.MODE_DRAGGING_HOLE:
    case constants.MODE_DRAGGING_LINE:
    case constants.MODE_DRAGGING_VERTEX:
    case constants.MODE_DRAGGING_ITEM:
      return { cursor: "move" };

    case constants.MODE_ROTATING_ITEM:
      return { cursor: "ew-resize" };
    case constants.MODE_RESIZE_ITEM_RIGHT_BOTTOM:
      return { cursor: "nwse-resize" };
    case constants.MODE_RESIZE_ITEM_RIGHT_TOP:
      return { cursor: "nesw-resize" };
    case constants.MODE_RESIZE_ITEM_LEFT_BOTTOM:
      return { cursor: "nesw-resize" };
    case constants.MODE_RESIZE_ITEM_LEFT_TOP:
      return { cursor: "nwse-resize" };

    case constants.MODE_WAITING_DRAWING_LINE:
    case constants.MODE_DRAWING_LINE:
      return { cursor: "crosshair" };
    default:
      return { cursor: "default" };
  }
}

function mode2DetectAutopan(mode) {
  switch (mode) {
    case constants.MODE_DRAWING_LINE:
    case constants.MODE_DRAGGING_LINE:
    case constants.MODE_DRAGGING_VERTEX:
    case constants.MODE_DRAGGING_HOLE:
    case constants.MODE_DRAGGING_ITEM:
    case constants.MODE_DRAWING_HOLE:
    case constants.MODE_DRAWING_ITEM:
      return true;

    default:
      return false;
  }
}

function extractElementData(node) {
  while (
    !node.attributes.getNamedItem("data-element-root") &&
    node.tagName !== "svg"
  ) {
    node = node.parentNode;
  }
  if (node.tagName === "svg") return null;

  return {
    part: node.attributes.getNamedItem("data-part")
      ? node.attributes.getNamedItem("data-part").value
      : undefined,
    layer: node.attributes.getNamedItem("data-layer").value,
    prototype: node.attributes.getNamedItem("data-prototype").value,
    selected: node.attributes.getNamedItem("data-selected").value === "true",
    id: node.attributes.getNamedItem("data-id").value,
  };
}

const useStyles = makeStyles(() => ({
  inputText: {
    "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "#5B5F66",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#5B5F66",
    },
    "& .MuiOutlinedInput-input": {
      color: "#fff",
      textAlign: "right",
      padding: "5px",
    },
    "& .Mui-focused": {
      borderColor: "white",
    },
    "& .MuiInputLabel-outlined.Mui-focused": {
      color: "#fff",
    },
    "& .MuiOutlinedInput-root": {
      backgroundColor: "transparent",
      borderRadius: "7px",
      padding: "offset",
    },
    "& .MuiInputBase-root": {
      color: "white",
      fontSize: "12px",
      lineHeight: "24px",
      width: "64px",
    },
    "& .MuiInputBase-input": {
      textAlign: "right",
    },
  },
}));

export default function Viewer2D(
  { state, width, height },
  {
    viewer2DActions,
    linesActions,
    holesActions,
    verticesActions,
    itemsActions,
    areaActions,
    projectActions,
    catalog,
  }
) {
  let { viewer2D, mode, scene } = state;

  const [load, setLoad] = useState(false);
  const [popup, setPopup] = useState(false);
  const [widthV, setWidth] = useState(0);
  const [heightV, setHeight] = useState(0);
  const [cordinate, setCordinate] = useState({x: 0, y: 0});

  const Viewer = useRef(null);

  const classes = useStyles();

  useEffect(() => {
    let viewerData = state.get("viewer2D").toJS();
    if (viewerData.SVGWidth != undefined && load == false) {
      const val = {
        a: viewerData.a,
        b: viewerData.b,
        SVGWidth: viewerData.SVGWidth,
        c: viewerData.c,
        mode: "idle",
        d: viewerData.d,
        e: -viewerData.SVGWidth / 2,
        f: -viewerData.SVGHeight / 2,
        miniatureOpen: true,
        SVGHeight: viewerData.SVGHeight,
        pinchPointDistance: null,
        lastAction: null,
        viewerWidth: viewerData.viewerWidth,
        startX: null,
        startY: null,
        version: 2,
        focus: false,
        viewerHeight: viewerData.viewerHeight,
        prePinchMode: null,
        endX: null,
        endY: null,
      };
      viewer2DActions.updateCameraView(val);
      setLoad(true);
    }
  }, [state]);

  let layerID = scene.selectedLayer;

  let mapCursorPosition = ({ x, y }) => {
    return { x, y: -y + scene.height };
  };

  let onMouseMove = (viewerEvent) => {
    //workaround that allow imageful component to work
    let evt = new Event("mousemove-planner-event");
    evt.viewerEvent = viewerEvent;
    document.dispatchEvent(evt);

    let { x, y } = mapCursorPosition(viewerEvent);

    projectActions.updateMouseCoord({ x, y });

    switch (mode) {
      case constants.MODE_DRAWING_LINE:
        linesActions.updateDrawingLine(x, y, state.snapMask);
        break;

      case constants.MODE_DRAWING_HOLE:
        holesActions.updateDrawingHole(layerID, x, y);
        break;

      case constants.MODE_DRAGGING_HOLE:
        holesActions.updateDraggingHole(x, y);
        break;

      case constants.MODE_DRAWING_ITEM:
        itemsActions.updateDrawingItem(layerID, x, y);
        break;

      case constants.MODE_DRAGGING_LINE:
        linesActions.updateDraggingLine(x, y, state.snapMask);
        break;

      case constants.MODE_DRAGGING_VERTEX:
        verticesActions.updateDraggingVertex(x, y, state.snapMask);
        break;

      case constants.MODE_DRAGGING_ITEM:
        itemsActions.updateDraggingItem(x, y);
        break;

      case constants.MODE_ROTATING_ITEM:
        itemsActions.updateRotatingItem(x, y);
        break;

      case constants.MODE_RESIZE_ITEM_RIGHT_BOTTOM:
        itemsActions.updateResizingItemRB(x, y);
        break;
      case constants.MODE_RESIZE_ITEM_RIGHT_TOP:
        itemsActions.updateResizingItemRT(x, y);
        break;

      case constants.MODE_RESIZE_ITEM_LEFT_BOTTOM:
        itemsActions.updateResizingItemLB(x, y);
        break;

      case constants.MODE_RESIZE_ITEM_LEFT_TOP:
        itemsActions.updateResizingItemLT(x, y);
        break;
    }

    viewerEvent.originalEvent.stopPropagation();
  };


  let onMouseDown = (viewerEvent) => {
    let event = viewerEvent.originalEvent;

    //workaround that allow imageful component to work
    let evt = new Event("mousedown-planner-event");
    evt.viewerEvent = viewerEvent;
    document.dispatchEvent(evt);

    let { x, y } = mapCursorPosition(viewerEvent);

    if (mode === constants.MODE_IDLE) {
      
      let elementData = extractElementData(event.target);
      if (!elementData || !elementData.selected) return;

      switch (elementData.prototype) {
        case "lines":
          linesActions.beginDraggingLine(
            elementData.layer,
            elementData.id,
            x,
            y,
            state.snapMask
          );
          break;

        case "vertices":
          verticesActions.beginDraggingVertex(
            elementData.layer,
            elementData.id,
            x,
            y,
            state.snapMask
          );
          break;

        case "items":
          if (elementData.part === "rotation-anchor") {
            itemsActions.beginRotatingItem(
              elementData.layer,
              elementData.id,
              x,
              y
            );
          } else if (elementData.part === "resize-points-rb") {
            itemsActions.beginResizingItemRB(
              elementData.layer,
              elementData.id,
              x,
              y
            );
          } else if (elementData.part === "resize-points-rt") {
            itemsActions.beginResizingItemRT(
              elementData.layer,
              elementData.id,
              x,
              y
            );
          } else if (elementData.part === "resize-points-lb") {
            itemsActions.beginResizingItemLB(
              elementData.layer,
              elementData.id,
              x,
              y
            );
          } else if (elementData.part === "resize-points-lt") {
            itemsActions.beginResizingItemLT(
              elementData.layer,
              elementData.id,
              x,
              y
            );
          } else if (elementData.part === "outline-item") {
            console.log("elementData", elementData);
            setPopup(true);

            var e = window.event;

            var posX = e.clientX;
            var posY = e.clientY;

            console.log('pos', {posX,posY})
            setCordinate({x: posX - 20, y: posY - 80});
          } else
            itemsActions.beginDraggingItem(
              elementData.layer,
              elementData.id,
              x,
              y
            );
          break;

        case "holes":
          holesActions.beginDraggingHole(
            elementData.layer,
            elementData.id,
            x,
            y
          );
          break;

        default:
          break;
      }
    }
    event.stopPropagation();
  };

  let onMouseUp = (viewerEvent) => {
    let event = viewerEvent.originalEvent;

    let evt = new Event("mouseup-planner-event");
    evt.viewerEvent = viewerEvent;
    document.dispatchEvent(evt);

    let { x, y } = mapCursorPosition(viewerEvent);

    switch (mode) {
      case constants.MODE_IDLE:
        let elementData = extractElementData(event.target);

        if (elementData && elementData.selected) return;

        switch (elementData ? elementData.prototype : "none") {
          case "areas":
            areaActions.selectArea(elementData.layer, elementData.id);
            break;

          case "lines":
            linesActions.selectLine(elementData.layer, elementData.id);
            break;

          case "holes":
            holesActions.selectHole(elementData.layer, elementData.id);
            break;

          case "items":
            itemsActions.selectItem(elementData.layer, elementData.id);
            break;

          case "none":
            projectActions.unselectAll();
            break;
        }
        break;

      case constants.MODE_WAITING_DRAWING_LINE:
        linesActions.beginDrawingLine(layerID, x, y, state.snapMask);
        break;

      case constants.MODE_DRAWING_LINE:
        linesActions.endDrawingLine(x, y, state.snapMask);
        linesActions.beginDrawingLine(layerID, x, y, state.snapMask);
        break;

      case constants.MODE_DRAWING_HOLE:
        holesActions.endDrawingHole(layerID, x, y);
        break;

      case constants.MODE_DRAWING_ITEM:
        itemsActions.endDrawingItem(layerID, x, y);
        break;

      case constants.MODE_DRAGGING_LINE:
        linesActions.endDraggingLine(x, y, state.snapMask);
        break;

      case constants.MODE_DRAGGING_VERTEX:
        verticesActions.endDraggingVertex(x, y, state.snapMask);
        break;

      case constants.MODE_DRAGGING_ITEM:
        itemsActions.endDraggingItem(x, y);
        break;

      case constants.MODE_DRAGGING_HOLE:
        holesActions.endDraggingHole(x, y);
        break;

      case constants.MODE_ROTATING_ITEM:
        itemsActions.endRotatingItem(x, y);
        break;

      case constants.MODE_RESIZE_ITEM_RIGHT_BOTTOM:
        itemsActions.endResizingItemRB(x, y);
        break;
      case constants.MODE_RESIZE_ITEM_RIGHT_TOP:
        itemsActions.endResizingItemRT(x, y);
        break;
      case constants.MODE_RESIZE_ITEM_LEFT_BOTTOM:
        itemsActions.endResizingItemLB(x, y);
        break;
      case constants.MODE_RESIZE_ITEM_LEFT_TOP:
        itemsActions.endResizingItemLT(x, y);
        break;
    }

    event.stopPropagation();
  };

  let onChangeValue = (value) => {
    // if (value.e < 0 && value.f < 0 && value.e > -8500 && value.f > -8500) {
    // }
    projectActions.updateZoomScale(value.a);
    return viewer2DActions.updateCameraView(value);
  };

  let onChangeTool = (tool) => {
    switch (tool) {
      case TOOL_NONE:
        projectActions.selectToolEdit();
        break;

      case TOOL_PAN:
        viewer2DActions.selectToolPan();
        break;

      case TOOL_ZOOM_IN:
        viewer2DActions.selectToolZoomIn();
        break;

      case TOOL_ZOOM_OUT:
        viewer2DActions.selectToolZoomOut();
        break;
    }
  };

  let { e, f, SVGWidth, SVGHeight } = state.get("viewer2D").toJS();

  let rulerSize = 0; //px
  let rulerUnitPixelSize = 100;
  let rulerBgColor = "#000";
  let rulerFnColor = SharedStyle.COLORS.white;
  let rulerMkColor = SharedStyle.SECONDARY_COLOR.main;
  let sceneWidth = SVGWidth || state.getIn(["scene", "width"]);
  let sceneHeight = SVGHeight || state.getIn(["scene", "height"]);
  let sceneZoom = state.zoom || 1;
  let rulerXElements = Math.ceil(sceneWidth / rulerUnitPixelSize) + 1;
  let rulerYElements = Math.ceil(sceneHeight / rulerUnitPixelSize) + 1;

  // const handleDocumentMouseUp = (event) => {
  //   console.log('popup', popup)
  //   setCordinate({x: event.clientX, y: event.clientY});
  // };

  // useEffect(() => {
  //   document.addEventListener("mouseup", handleDocumentMouseUp);
  //   return () => {
  //     document.removeEventListener('mouseup', handleDocumentMouseUp);
  //   };

  // }, []);

  // console.log('debug', {popup, cordinate})

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        display: "grid",
        gridRowGap: "0",
        gridColumnGap: "0",
        gridTemplateColumns: `${rulerSize}px ${width - rulerSize}px`,
        gridTemplateRows: `${rulerSize}px ${height - rulerSize}px`,
        position: "relative",
      }}
    >
      <div
        style={{ gridColumn: 1, gridRow: 1, backgroundColor: rulerBgColor }}
      ></div>
      <div
        style={{
          gridRow: 1,
          gridColumn: 2,
          position: "relative",
          overflow: "hidden",
        }}
        id="rulerX"
      >
        {sceneWidth ? (
          <RulerX
            unitPixelSize={rulerUnitPixelSize}
            zoom={sceneZoom}
            mouseX={state.mouse.get("x")}
            width={width - rulerSize}
            zeroLeftPosition={e || 0}
            backgroundColor={rulerBgColor}
            fontColor={rulerFnColor}
            markerColor={rulerMkColor}
            positiveUnitsNumber={rulerXElements}
            negativeUnitsNumber={0}
          />
        ) : null}
      </div>
      <div
        style={{
          gridColumn: 1,
          gridRow: 2,
          position: "relative",
          overflow: "hidden",
        }}
        id="rulerY"
      >
        {sceneHeight ? (
          <RulerY
            unitPixelSize={rulerUnitPixelSize}
            zoom={sceneZoom}
            mouseY={state.mouse.get("y")}
            height={height - rulerSize}
            zeroTopPosition={sceneHeight * sceneZoom + f || 0}
            backgroundColor={rulerBgColor}
            fontColor={rulerFnColor}
            markerColor={rulerMkColor}
            positiveUnitsNumber={rulerYElements}
            negativeUnitsNumber={0}
          />
        ) : null}
      </div>
      <ReactSVGPanZoom
        style={{ gridColumn: 0, gridRow: 0 }}
        width={width - rulerSize}
        height={height - rulerSize}
        value={viewer2D.isEmpty() ? null : viewer2D.toJS()}
        onChangeValue={onChangeValue}
        tool={mode2Tool(mode)}
        onChangeTool={onChangeTool}
        detectAutoPan={mode2DetectAutopan(mode)}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        miniaturePosition="none"
        toolbarPosition="none"
        // detectWheel={false}
        ref={Viewer}
        disableDoubleClickZoomWithToolAuto={false}
      >
        <svg width={scene.width} height={scene.height} fill="red">
          <g style={Object.assign(mode2Cursor(mode), mode2PointerEvents(mode))}>
            <State state={state} catalog={catalog} />
          </g>
        </svg>
      </ReactSVGPanZoom>
      <Box
        style={{
          flexGrow: 1,
          position: "absolute",
          width: "195px",
          height: "154px",
          left: cordinate.x,
          top: cordinate.y,
          background: "#020916",
          borderRadius: "4px",
          zIndex: 2,
          padding: "16.04px 14.23px",
          display: popup? 'block': 'none',
        }}
      >
        <img
          src="/assets/arrow.png"
          style={{
            position: "absolute",
            left: "-6px",
            top: "21px",
            zIndex: "33",
          }}
        />
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box
            display="flex"
            justifyContent="flex-start"
            alignItems="center"
            style={{ gap: "5px" }}
          >
            <Typography
              style={{
                fontFamily: "DM Sans",
                fontStyle: "normal",
                fontWeight: 400,
                fontSize: "12px",
                lineHeight: "16px",
                color: "#FFFFFF",
              }}
            >
              Width
            </Typography>
            <Typography
              style={{
                fontFamily: "DM Sans",
                fontStyle: "normal",
                fontWeight: 400,
                fontSize: "12px",
                lineHeight: "16px",
                color: "#3D424A",
              }}
            >
              mm
            </Typography>
          </Box>
          <TextField
            className={classes.inputText}
            type="text"
            placeholder=""
            label=""
            sx={{ mb: 1 }}
            value={widthV}
            variant="outlined"
          />
        </Box>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          marginTop="7px"
        >
          <Box
            display="flex"
            justifyContent="flex-start"
            alignItems="center"
            style={{ gap: "5px" }}
          >
            <Typography
              style={{
                fontFamily: "DM Sans",
                fontStyle: "normal",
                fontWeight: 400,
                fontSize: "12px",
                lineHeight: "16px",
                color: "#FFFFFF",
              }}
            >
              Height
            </Typography>
            <Typography
              style={{
                fontFamily: "DM Sans",
                fontStyle: "normal",
                fontWeight: 400,
                fontSize: "12px",
                lineHeight: "16px",
                color: "#3D424A",
              }}
            >
              mm
            </Typography>
          </Box>
          <TextField
            className={classes.inputText}
            type="text"
            placeholder=""
            label=""
            value={heightV}
            sx={{ mb: 1 }}
            variant="outlined"
          />
        </Box>

        <hr style={{
          borderColor: "#252A32",
          marginLeft: "-12px",
          marginRight: "-12px"
        }}/>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          marginTop="15px"
        >
          <Typography
            style={{
              fontFamily: "DM Sans",
              fontStyle: "normal",
              fontWeight: 400,
              fontSize: "12px",
              lineHeight: "16px",
              color: "#FFFFFF",
            }}
          >
            Flip horizontaly
          </Typography>
          <Typography
            style={{
              fontFamily: "DM Sans",
              fontStyle: "normal",
              fontWeight: 400,
              fontSize: "12px",
              lineHeight: "16px",
              color: "#FFFFFF",
            }}
          >
            H
          </Typography>
        </Box>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          marginTop="15px"
        >
          <Typography
            style={{
              fontFamily: "DM Sans",
              fontStyle: "normal",
              fontWeight: 400,
              fontSize: "12px",
              lineHeight: "16px",
              color: "#FFFFFF",
            }}
          >
            Flip verticaly
          </Typography>
          <Typography
            style={{
              fontFamily: "DM Sans",
              fontStyle: "normal",
              fontWeight: 400,
              fontSize: "12px",
              lineHeight: "16px",
              color: "#FFFFFF",
            }}
          >
            V
          </Typography>
        </Box>
      </Box>
    </div>
  );
}

Viewer2D.propTypes = {
  state: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

Viewer2D.contextTypes = {
  viewer2DActions: PropTypes.object.isRequired,
  linesActions: PropTypes.object.isRequired,
  holesActions: PropTypes.object.isRequired,
  verticesActions: PropTypes.object.isRequired,
  itemsActions: PropTypes.object.isRequired,
  areaActions: PropTypes.object.isRequired,
  projectActions: PropTypes.object.isRequired,
  catalog: PropTypes.object.isRequired,
};
