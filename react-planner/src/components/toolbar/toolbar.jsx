import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Box, Typography } from "@material-ui/core";
import ItemsBox from "./ItemsBox";
import LinesBox from "./LinesBox";
import RectangleBox from "./RectangleBox";
import RoomBox from "./RoomBox";

import If from "../../utils/react-if";
import {
  MODE_IDLE,
  MODE_3D_VIEW,
  MODE_3D_FIRST_PERSON,
  MODE_VIEWING_CATALOG,
  MODE_CONFIGURING_PROJECT,
} from "../../constants";
import * as SharedStyle from "../../shared-style";

const iconTextStyle = {
  fontSize: "19px",
  textDecoration: "none",
  fontWeight: "bold",
  margin: "0px",
  userSelect: "none",
};

const Icon2D = ({ style }) => <p style={{ ...iconTextStyle, ...style }}>2D</p>;
const Icon3D = ({ style }) => <p style={{ ...iconTextStyle, ...style }}>3D</p>;

const ASIDE_STYLE = {
  backgroundColor: SharedStyle.PRIMARY_COLOR.main,
  borderRight: SharedStyle.PRIMARY_COLOR.border,
  position: "relative",
};

const sortButtonsCb = (a, b) => {
  if (a.index === undefined || a.index === null) {
    a.index = Number.MAX_SAFE_INTEGER;
  }

  if (b.index === undefined || b.index === null) {
    b.index = Number.MAX_SAFE_INTEGER;
  }

  return a.index - b.index;
};

const mapButtonsCb = (el, ind) => {
  return (
    <If key={ind} condition={el.condition} style={{ position: "relative" }}>
      {el.dom}
    </If>
  );
};

const styles = (theme) => ({
  box: {
    width: "52px",
    height: "52px",
    position: "relative",
    background: "#FFFFFF",
    borderBottom: "1px solid #E4E8EE",
    cursor: "pointer",
    borderRight: "1px solid #E4E8EE",
  },
  boxH: {
    width: "52px",
    height: "52px",
    position: "relative",
    background: "#FFFFFF",
    borderBottom: "1px solid #E4E8EE",
    borderRight: "1px solid #E4E8EE",
    background: "#407AEC",
    cursor: "pointer",
  },
  icon: {
    position: "absolute",
    top: "50%",
    right: "50%",
    transform: "translate(50%,-50%)",
  },
  snap: {
    position: "absolute",
    top: "50%",
    right: "20%",
    transform: "translate(50%,-50%)",
  },
  btmbox: {
    width: "52px",
    height: "52px",
    position: "relative",
    background: "#FFFFFF",
    borderTop: "1px solid #E4E8EE",
    cursor: "pointer",
    borderRight: "1px solid #E4E8EE",
    "&:active": {
      background: "#407AEC",
    },
  },
  sub: {
    fontFamily: "DM Sans",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "12px",
    lineHeight: "16px",
    letterSpacing: "2px",
    textTransform: "uppercase",
    color: "#9199A7",
    marginTop: "24px",
  },
  subtype: {
    fontFamily: "DM Sans",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "14px",
    lineHeight: "20px",
    color: "#1F2735",
    marginLeft: "15.15px",
  },
  wrap: {
    marginTop: "24px",
    cursor: "pointer",
    paddingBottom: "5px",
    display: "flex",
    alignItems: "center",
    "&:hover": {
      // borderBottom: "1px solid #407AEC33",
      "& $subtype": {
        color: "#4e83e1",
        // fontSize: "15px",
      },
    },
  },
});
class Toolbar extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { cursor: 0, hover: 0, selectedCursor: 0, click: false };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.state.mode !== nextProps.state.mode ||
      this.props.height !== nextProps.height ||
      this.props.width !== nextProps.width ||
      this.props.state.alterate !== nextProps.state.alterate ||
      nextState.cursor != this.state.cursor ||
      nextState.selectedCursor != this.state.selectedCursor ||
      nextState.click != this.state.click ||
      this.props.state.viewer2D != nextProps.state.viewer2D
    );
  }

  render() {
    let {
      props: { state, width, height, dispatch },
      context: { viewer2DActions, projectActions, viewer3DActions, translator },
    } = this;

    const { classes } = this.props;
    let { viewer2D, mode, scene } = state;

    // Load 3D model forcely
    // viewer3DActions.selectTool3DView();

    return (
      <aside
        style={{ ...ASIDE_STYLE, width: width, maxHeight: height }}
        className="toolbar"
      >
        <Box
          className={
            this.state.selectedCursor == 0
              ? classes.boxH
              : this.state.cursor == 0
              ? classes.boxH
              : classes.box
          }
          onMouseOver={() => {
            this.setState({
              cursor: 0,
              selectedCursor: this.state.selectedCursor,
            });
          }}
          onMouseLeave={() => {
            this.setState({ cursor: -1, hover: -1 });
          }}
          onClick={() => {
            this.setState({ cursor: 0, selectedCursor: 0, click: 1 });
          }}
        >
          <img
            src={
              this.state.selectedCursor == 0
                ? "/assets/cursor-hover.png"
                : this.state.cursor == 0
                ? "/assets/cursor-hover.png"
                : "/assets/cursor.png"
            }
            className={classes.icon}
          />
        </Box>
        <Box
          className={
            this.state.selectedCursor == 1
              ? classes.boxH
              : this.state.cursor == 1
              ? classes.boxH
              : classes.box
          }
          onMouseOver={() => {
            this.setState({
              cursor: 1,
              selectedCursor: this.state.selectedCursor,
            });
          }}
          onMouseLeave={() => {
            this.setState({ cursor: -1, hover: -1 });
          }}
          onClick={() => {
            if (this.state.selectedCursor == 1)
              this.setState({
                cursor: 1,
                selectedCursor: 1,
                click: !this.state.click,
              });
            else
              this.setState({
                cursor: 1,
                selectedCursor: 1,
                click: true,
              });
          }}
        >
          <img
            src={
              this.state.selectedCursor == 1
                ? "/assets/line-hover.png"
                : this.state.cursor == 1
                ? "/assets/line-hover.png"
                : "/assets/line.png"
            }
            className={classes.icon}
          />
          {this.state.selectedCursor == 1 && this.state.click == true && (
            <img src="/assets/right.png" className={classes.snap} />
          )}
          {this.state.selectedCursor == 1 && this.state.click == false && (
            <img src="/assets/down-hover.png" className={classes.snap} />
          )}
          {this.state.selectedCursor != 1 && this.state.cursor == 1 && (
            <img src="/assets/down-hover.png" className={classes.snap} />
          )}
          {this.state.selectedCursor != 1 && this.state.cursor != 1 && (
            <img src="/assets/down.png" className={classes.snap} />
          )}
        </Box>
        <Box
          className={
            this.state.selectedCursor == 2
              ? classes.boxH
              : this.state.cursor == 2
              ? classes.boxH
              : classes.box
          }
          onMouseOver={() => {
            this.setState({
              cursor: 2,

              selectedCursor: this.state.selectedCursor,
            });
          }}
          onMouseLeave={() => {
            this.setState({ cursor: -1, hover: -1 });
          }}
          onClick={() => {
            if (this.state.selectedCursor == 2)
              this.setState({
                cursor: 2,
                selectedCursor: 2,
                click: !this.state.click,
              });
            else
              this.setState({
                cursor: 2,
                selectedCursor: 2,
                click: true,
              });
          }}
        >
          <img
            src={
              this.state.selectedCursor == 2
                ? "/assets/rectangle-hover.png"
                : this.state.cursor == 2
                ? "/assets/rectangle-hover.png"
                : "/assets/rectangle.png"
            }
            className={classes.icon}
          />
          {this.state.selectedCursor == 2 && this.state.click == true && (
            <img src="/assets/right.png" className={classes.snap} />
          )}
          {this.state.selectedCursor == 2 && this.state.click == false && (
            <img src="/assets/down-hover.png" className={classes.snap} />
          )}
          {this.state.selectedCursor != 2 && this.state.cursor == 2 && (
            <img src="/assets/down-hover.png" className={classes.snap} />
          )}
          {this.state.selectedCursor != 2 && this.state.cursor != 2 && (
            <img src="/assets/down.png" className={classes.snap} />
          )}
        </Box>
        <Box
          className={
            this.state.selectedCursor == 3
              ? classes.boxH
              : this.state.cursor == 3
              ? classes.boxH
              : classes.box
          }
          onMouseOver={() => {
            this.setState({
              cursor: 3,

              selectedCursor: this.state.selectedCursor,
            });
          }}
          onMouseLeave={() => {
            this.setState({ cursor: -1, hover: -1 });
          }}
          onClick={() => {
            if (this.state.selectedCursor == 3)
              this.setState({
                cursor: 3,
                selectedCursor: 3,
                click: !this.state.click,
              });
            else
              this.setState({
                cursor: 3,
                selectedCursor: 3,
                click: true,
              });
          }}
        >
          <img
            src={
              this.state.selectedCursor == 3
                ? "/assets/grid-hover.png"
                : this.state.cursor == 3
                ? "/assets/grid-hover.png"
                : "/assets/grid.png"
            }
            className={classes.icon}
          />
          {this.state.selectedCursor == 3 && this.state.click == true && (
            <img src="/assets/right.png" className={classes.snap} />
          )}
          {this.state.selectedCursor == 3 && this.state.click == false && (
            <img src="/assets/down-hover.png" className={classes.snap} />
          )}
          {this.state.selectedCursor != 3 && this.state.cursor == 3 && (
            <img src="/assets/down-hover.png" className={classes.snap} />
          )}
          {this.state.selectedCursor != 3 && this.state.cursor != 3 && (
            <img src="/assets/down.png" className={classes.snap} />
          )}
        </Box>
        <Box
          className={
            this.state.selectedCursor == 4
              ? classes.boxH
              : this.state.cursor == 4
              ? classes.boxH
              : classes.box
          }
          onMouseOver={() => {
            this.setState({
              cursor: 4,

              selectedCursor: this.state.selectedCursor,
            });
          }}
          onMouseLeave={() => {
            this.setState({ cursor: -1, hover: -1 });
          }}
          onClick={() => {
            if (this.state.selectedCursor == 4)
              this.setState({
                cursor: 4,
                selectedCursor: 4,
                click: !this.state.click,
              });
            else
              this.setState({
                cursor: 4,
                selectedCursor: 4,
                click: true,
              });
          }}
        >
          <img
            src={
              this.state.selectedCursor == 4
                ? "/assets/items-hover.png"
                : this.state.cursor == 4
                ? "/assets/items-hover.png"
                : "/assets/items.png"
            }
            className={classes.icon}
          />
          {this.state.selectedCursor == 4 && this.state.click == true && (
            <img src="/assets/right.png" className={classes.snap} />
          )}
          {this.state.selectedCursor == 4 && this.state.click == false && (
            <img src="/assets/down-hover.png" className={classes.snap} />
          )}
          {this.state.selectedCursor != 4 && this.state.cursor == 4 && (
            <img src="/assets/down-hover.png" className={classes.snap} />
          )}
          {this.state.selectedCursor != 4 && this.state.cursor != 4 && (
            <img src="/assets/down.png" className={classes.snap} />
          )}
        </Box>
        <Box
          className={
            this.state.selectedCursor == 5
              ? classes.boxH
              : this.state.cursor == 5
              ? classes.boxH
              : classes.box
          }
          onMouseOver={() => {
            this.setState({
              cursor: 5,
              selectedCursor: this.state.selectedCursor,
            });
          }}
          onMouseLeave={() => {
            this.setState({ cursor: -1, hover: -1 });
          }}
          onClick={() => {
            if (this.state.selectedCursor == 1)
              this.setState({
                cursor: 5,
                selectedCursor: 5,
                click: !this.state.click,
              });
            else
              this.setState({
                cursor: 5,
                selectedCursor: 5,
                click: true,
              });
          }}
        >
          <img
            src={
              this.state.selectedCursor == 5
                ? "/assets/comb-hover.png"
                : this.state.cursor == 5
                ? "/assets/comb-hover.png"
                : "/assets/comb.png"
            }
            className={classes.icon}
          />
          {this.state.selectedCursor == 5 && this.state.click == true && (
            <img src="/assets/right.png" className={classes.snap} />
          )}
          {this.state.selectedCursor == 5 && this.state.click == false && (
            <img src="/assets/down-hover.png" className={classes.snap} />
          )}
          {this.state.selectedCursor != 5 && this.state.cursor == 5 && (
            <img src="/assets/down-hover.png" className={classes.snap} />
          )}
          {this.state.selectedCursor != 5 && this.state.cursor != 5 && (
            <img src="/assets/down.png" className={classes.snap} />
          )}
        </Box>
        <Box sx={{ position: "absolute", bottom: 0 }}>
          <Box
            className={classes.btmbox}
            onClick={() => {
              const scenseValue = viewer2D.toJS();
              const newVal = {
                a: scenseValue.a * 1.06,
                b: 0,
                SVGWidth: scenseValue.SVGWidth,
                c: 0,
                mode: "idle",
                d: scenseValue.d * 1.06,
                e: scenseValue.e - scenseValue.SVGWidth * scenseValue.a * 0.03,
                f: scenseValue.f - scenseValue.SVGHeight * scenseValue.d * 0.03,
                miniatureOpen: true,
                SVGHeight: scenseValue.SVGHeight,
                pinchPointDistance: null,
                lastAction: null,
                viewerWidth: scenseValue.viewerWidth,
                startX: null,
                startY: null,
                version: 2,
                focus: false,
                viewerHeight: scenseValue.viewerHeight,
                prePinchMode: null,
                endX: null,
                endY: null,
              };
              viewer2DActions.updateCameraView(newVal);
            }}
          >
            <img src="/assets/plus.png" className={classes.icon} />
          </Box>
          <Box
            className={classes.btmbox}
            onClick={() => {
              const scenseValue = viewer2D.toJS();
              const newVal = {
                a: scenseValue.a / 1.06,
                b: 0,
                SVGWidth: scenseValue.SVGWidth,
                c: 0,
                mode: "idle",
                d: scenseValue.d / 1.06,
                e:
                  scenseValue.e +
                  (scenseValue.SVGWidth * scenseValue.a * 0.03) / 1.06,
                f:
                  scenseValue.f +
                  (scenseValue.SVGHeight * scenseValue.d * 0.03) / 1.06,
                miniatureOpen: true,
                SVGHeight: scenseValue.SVGHeight,
                pinchPointDistance: null,
                lastAction: null,
                viewerWidth: scenseValue.viewerWidth,
                startX: null,
                startY: null,
                version: 2,
                focus: false,
                viewerHeight: scenseValue.viewerHeight,
                prePinchMode: null,
                endX: null,
                endY: null,
              };
              viewer2DActions.updateCameraView(newVal);
            }}
          >
            <img src="/assets/minus.png" className={classes.icon} />
          </Box>
          <Box
            className={classes.btmbox}
            onClick={() => {
              const scenseValue = viewer2D.toJS();
              const newVal = {
                a: 1,
                b: 0,
                SVGWidth: scenseValue.SVGWidth,
                c: 0,
                mode: "idle",
                d: 1,
                e: 0,
                f: 0,
                miniatureOpen: true,
                SVGHeight: scenseValue.SVGHeight,
                pinchPointDistance: null,
                lastAction: null,
                viewerWidth: scenseValue.viewerWidth,
                startX: null,
                startY: null,
                version: 2,
                focus: false,
                viewerHeight: scenseValue.viewerHeight,
                prePinchMode: null,
                endX: null,
                endY: null,
              };
              viewer2DActions.updateCameraView(newVal);
            }}
          >
            <img src="/assets/refresh.png" className={classes.icon} />
          </Box>
        </Box>
        {this.state.selectedCursor == 1 && this.state.click == true && (
          <LinesBox dispatch={dispatch} />
        )}
        {this.state.selectedCursor == 2 && this.state.click == true && (
          <RoomBox dispatch={dispatch} />
        )}
        {this.state.selectedCursor == 3 && this.state.click == true && (
          <RectangleBox dispatch={dispatch} />
        )}
        {this.state.selectedCursor == 4 && this.state.click == true && (
          <ItemsBox dispatch={dispatch} />
        )}
      </aside>
    );
  }
}

export default withStyles(styles)(Toolbar);

Toolbar.propTypes = {
  state: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  allowProjectFileSupport: PropTypes.bool.isRequired,
  toolbarButtons: PropTypes.array,
  dispatch: PropTypes.func,
};

Toolbar.contextTypes = {
  projectActions: PropTypes.object.isRequired,
  viewer2DActions: PropTypes.object.isRequired,
  viewer3DActions: PropTypes.object.isRequired,
  linesActions: PropTypes.object.isRequired,
  holesActions: PropTypes.object.isRequired,
  itemsActions: PropTypes.object.isRequired,
  translator: PropTypes.object.isRequired,
};
