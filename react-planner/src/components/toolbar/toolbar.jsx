import React, { Component } from "react";
import PropTypes from "prop-types";
import { MdSettings, MdUndo, MdDirectionsRun } from "react-icons/md";
import { FaFile, FaMousePointer, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import { Box, Typography, Grid } from "@material-ui/core";

import ToolbarButton from "./toolbar-button";
import ToolbarSaveButton from "./toolbar-save-button";
import ToolbarLoadButton from "./toolbar-load-button";
import ToolbarLoadSVGButton from "./toolbar-load-svg-button";
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
});
class Toolbar extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { cursor: 0, hover: 0, selectedCursor: 0 };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  render() {
    let {
      props: { state, width, height, toolbarButtons, allowProjectFileSupport },
      context: { projectActions, viewer3DActions, translator },
    } = this;

    const { classes } = this.props;

    // Load 3D model forcely
    // viewer3DActions.selectTool3DView();

    let mode = state.get("mode");
    let alterate = state.get("alterate");
    let alterateColor = alterate ? SharedStyle.MATERIAL_COLORS[500].orange : "";

    let sorter = [
      {
        index: 0,
        condition: allowProjectFileSupport,
        dom: (
          <Box className={this.state.cursor == 0 ? classes.boxH : classes.box}>
            <img
              src={
                this.state.cursor == 0
                  ? "/assets/cursor-hover.png"
                  : "/assets/cursor.png"
              }
              className={classes.icon}
              onMouseOver={() => {
                const temp = this.state.cursor;
                this.setState({ cursor: 0, hover: temp });
              }}
              onMouseLeave={() => {
                this.setState({ cursor: this.state.hover, hover: -1 });
              }}
            />
          </Box>
        ),
      },
      {
        index: 1,
        condition: allowProjectFileSupport,
        dom: (
          <Box className={this.state.cursor == 1 ? classes.boxH : classes.box}>
            <img
              src={
                this.state.cursor == 1
                  ? "/assets/line-hover.png"
                  : "/assets/line.png"
              }
              className={classes.icon}
              onMouseOver={() => {
                const temp = this.state.cursor;
                this.setState({ cursor: 1, hover: temp });
              }}
              onMouseLeave={() => {
                this.setState({ cursor: this.state.hover, hover: -1 });
              }}
            />
          </Box>
        ),
      },
      {
        index: 2,
        condition: allowProjectFileSupport,
        dom: (
          <Box className={this.state.cursor == 2 ? classes.boxH : classes.box}>
            <img
              src={
                this.state.cursor == 2
                  ? "/assets/rectangle-hover.png"
                  : "/assets/rectangle.png"
              }
              className={classes.icon}
              onMouseOver={() => {
                const temp = this.state.cursor;
                this.setState({ cursor: 2, hover: temp });
              }}
              onMouseLeave={() => {
                this.setState({ cursor: this.state.hover, hover: -1 });
              }}
            />
          </Box>
        ),
      },
      {
        index: 3,
        condition: allowProjectFileSupport,
        dom: (
          <Box className={this.state.cursor == 3 ? classes.boxH : classes.box}>
            <img
              src={
                this.state.cursor == 3
                  ? "/assets/grid-hover.png"
                  : "/assets/grid.png"
              }
              className={classes.icon}
              onMouseOver={() => {
                const temp = this.state.cursor;
                this.setState({ cursor: 3, hover: temp });
              }}
              onMouseLeave={() => {
                this.setState({ cursor: this.state.hover, hover: -1 });
              }}
            />
          </Box>
        ),
      },
      {
        index: 4,
        condition: allowProjectFileSupport,
        dom: (
          <Box className={this.state.cursor == 4 ? classes.boxH : classes.box}>
            <img
              src={
                this.state.cursor == 4
                  ? "/assets/items-hover.png"
                  : "/assets/items.png"
              }
              className={classes.icon}
              onMouseOver={() => {
                const temp = this.state.cursor;
                this.setState({ cursor: 4, hover: temp });
              }}
              onMouseLeave={() => {
                this.setState({ cursor: this.state.hover, hover: -1 });
              }}
            />
          </Box>
        ),
      },
      {
        index: 5,
        condition: allowProjectFileSupport,
        dom: (
          <Box
            className={this.state.cursor == 5 ? classes.boxH : classes.box}
            onMouseOver={() => {
              console.log("--", this.state.cursor);
              const temp = this.state.cursor;
              this.setState({ cursor: 5, hover: temp });
            }}
            onMouseLeave={() => {
              this.setState({ cursor: this.state.hover, hover: -1 });
            }}
          >
            <img
              src={
                this.state.cursor == 5
                  ? "/assets/comb-hover.png"
                  : "/assets/comb.png"
              }
              className={classes.icon}
            />
          </Box>
        ),
      },
      // {
      //   index: 1,
      //   condition: allowProjectFileSupport,
      //   dom: <ToolbarSaveButton state={state} />,
      // },
      // {
      //   index: 2,
      //   condition: allowProjectFileSupport,
      //   dom: <ToolbarLoadButton state={state} />,
      // },
      // {
      //   index: 3,
      //   condition: allowProjectFileSupport,
      //   dom: <ToolbarLoadSVGButton state={state} />,
      // },
      // {
      //   index: 4,
      //   condition: true,
      //   dom: (
      //     <ToolbarButton
      //       active={[MODE_VIEWING_CATALOG].includes(mode)}
      //       tooltip={translator.t("Open catalog")}
      //       onClick={(event) => projectActions.openCatalog()}
      //     >
      //       <FaPlus />
      //     </ToolbarButton>
      //   ),
      // },
      // {
      //   index: 5,
      //   condition: true,
      //   dom: (
      //     <ToolbarButton
      //       active={[MODE_3D_VIEW].includes(mode)}
      //       tooltip={translator.t("3D View")}
      //       onClick={(event) => viewer3DActions.selectTool3DView()}
      //     >
      //       <Icon3D />
      //     </ToolbarButton>
      //   ),
      // },
      // {
      //   index: 6,
      //   condition: true,
      //   dom: (
      //     <ToolbarButton
      //       active={[MODE_IDLE].includes(mode)}
      //       tooltip={translator.t("2D View")}
      //       onClick={(event) => projectActions.setMode(MODE_IDLE)}
      //     >
      //       {[MODE_3D_FIRST_PERSON, MODE_3D_VIEW].includes(mode) ? (
      //         <Icon2D style={{ color: alterateColor }} />
      //       ) : (
      //         <FaMousePointer style={{ color: alterateColor }} />
      //       )}
      //     </ToolbarButton>
      //   ),
      // },
      // {
      //   index: 7,
      //   condition: true,
      //   dom: (
      //     <ToolbarButton
      //       active={[MODE_3D_FIRST_PERSON].includes(mode)}
      //       tooltip={translator.t("3D First Person")}
      //       onClick={(event) => viewer3DActions.selectTool3DFirstPerson()}
      //     >
      //       <MdDirectionsRun />
      //     </ToolbarButton>
      //   ),
      // },
      // {
      //   index: 8,
      //   condition: true,
      //   dom: (
      //     <ToolbarButton
      //       active={false}
      //       tooltip={translator.t("Undo (CTRL-Z)")}
      //       onClick={(event) => projectActions.undo()}
      //     >
      //       <MdUndo />
      //     </ToolbarButton>
      //   ),
      // },
      // {
      //   index: 9,
      //   condition: true,
      //   dom: (
      //     <ToolbarButton
      //       active={[MODE_CONFIGURING_PROJECT].includes(mode)}
      //       tooltip={translator.t("Configure project")}
      //       onClick={(event) => projectActions.openProjectConfigurator()}
      //     >
      //       <MdSettings />
      //     </ToolbarButton>
      //   ),
      // },
    ];

    // sorter = sorter.concat(
    //   toolbarButtons.map((Component, key) => {
    //     return Component.prototype //if is a react component
    //       ? {
    //           condition: true,
    //           dom: React.createElement(Component, { mode, state, key }),
    //         }
    //       : {
    //           //else is a sortable toolbar button
    //           index: Component.index,
    //           condition: Component.condition,
    //           dom: React.createElement(Component.dom, { mode, state, key }),
    //         };
    //   })
    // );

    return (
      <aside
        style={{ ...ASIDE_STYLE, width: width, maxHeight: height }}
        className="toolbar"
      >
        <Box
          className={this.state.cursor == 0 ? classes.boxH : classes.box}
          onMouseOver={() => {
            const temp = this.state.cursor;
            this.setState({
              cursor: 0,
              hover: temp,
              selectedCursor: this.state.selectedCursor,
            });
          }}
          onMouseLeave={() => {
            this.setState({ cursor: this.state.selectedCursor, hover: -1 });
          }}
          onClick={() => {
            this.setState({ cursor: 0, selectedCursor: 0 });
          }}
        >
          <img
            src={
              this.state.cursor == 0
                ? "/assets/cursor-hover.png"
                : "/assets/cursor.png"
            }
            className={classes.icon}
          />
        </Box>
        <Box
          className={this.state.cursor == 1 ? classes.boxH : classes.box}
          onMouseOver={() => {
            const temp = this.state.cursor;
            this.setState({
              cursor: 1,
              hover: temp,
              selectedCursor: this.state.selectedCursor,
            });
          }}
          onMouseLeave={() => {
            this.setState({ cursor: this.state.selectedCursor, hover: -1 });
          }}
          onClick={() => {
            this.setState({ cursor: 1, selectedCursor: 1 });
          }}
        >
          <img
            src={
              this.state.cursor == 1
                ? "/assets/line-hover.png"
                : "/assets/line.png"
            }
            className={classes.icon}
          />
        </Box>
        <Box
          className={this.state.cursor == 2 ? classes.boxH : classes.box}
          onMouseOver={() => {
            const temp = this.state.cursor;
            this.setState({
              cursor: 2,
              hover: temp,
              selectedCursor: this.state.selectedCursor,
            });
          }}
          onMouseLeave={() => {
            this.setState({ cursor: this.state.selectedCursor, hover: -1 });
          }}
          onClick={() => {
            this.setState({ cursor: 2, selectedCursor: 2 });
          }}
        >
          <img
            src={
              this.state.cursor == 2
                ? "/assets/rectangle-hover.png"
                : "/assets/rectangle.png"
            }
            className={classes.icon}
          />
        </Box>
        <Box
          className={this.state.cursor == 3 ? classes.boxH : classes.box}
          onMouseOver={() => {
            const temp = this.state.cursor;
            this.setState({
              cursor: 3,
              hover: temp,
              selectedCursor: this.state.selectedCursor,
            });
          }}
          onMouseLeave={() => {
            this.setState({ cursor: this.state.selectedCursor, hover: -1 });
          }}
          onClick={() => {
            this.setState({ cursor: 3, selectedCursor: 3 });
          }}
        >
          <img
            src={
              this.state.cursor == 3
                ? "/assets/grid-hover.png"
                : "/assets/grid.png"
            }
            className={classes.icon}
          />
        </Box>
        <Box
          className={this.state.cursor == 4 ? classes.boxH : classes.box}
          onMouseOver={() => {
            const temp = this.state.cursor;
            this.setState({
              cursor: 4,
              hover: temp,
              selectedCursor: this.state.selectedCursor,
            });
          }}
          onMouseLeave={() => {
            this.setState({ cursor: this.state.selectedCursor, hover: -1 });
          }}
          onClick={() => {
            this.setState({ cursor: 4, selectedCursor: 4 });
          }}
        >
          <img
            src={
              this.state.cursor == 4
                ? "/assets/items-hover.png"
                : "/assets/items.png"
            }
            className={classes.icon}
          />
        </Box>
        <Box
          className={this.state.cursor == 5 ? classes.boxH : classes.box}
          onMouseOver={() => {
            const temp = this.state.cursor;
            this.setState({
              cursor: 5,
              hover: temp,
              selectedCursor: this.state.selectedCursor,
            });
          }}
          onMouseLeave={() => {
            this.setState({ cursor: this.state.selectedCursor, hover: -1 });
          }}
          onClick={() => {
            this.setState({ cursor: 5, selectedCursor: 5 });
          }}
        >
          <img
            src={
              this.state.cursor == 5
                ? "/assets/comb-hover.png"
                : "/assets/comb.png"
            }
            className={classes.icon}
          />
        </Box>
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
