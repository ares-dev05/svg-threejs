import React, { useState, useEffect } from "react";

import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useNavigate } from "react-router-dom";

import actions from "../../actions/export";

const useStyles = makeStyles(() => ({
  background: {
    flexGrow: 1,
    position: "absolute",
    width: "144px",
    left: "63px",
    top: "52px",
    background: "#020916",
    borderRadius: "4px",
    zIndex: 2,
    paddingBottom: "20px",
    paddingLeft: "18px",
    "&::-webkit-scrollbar": {
      width: "5px",
    },

    /* Track */
    "&::-webkit-scrollbar-track": {
      background: "transparent",
    },

    /* Handle */
    "&::-webkit-scrollbar-thumb": {
      background: "#afa9a944",
      borderRadius: "5px",
      "&:hover": {
        background: "#555",
      },
    },
    "&::-webkit-scrollbar-thumb:hover": {
      background: "#555",
    },
    "&:after": {
      content: "",
      width: "10px",
      height: "10px",
      background: "red",
    },
  },
  container: {
    width: "961px",
    height: "457px",
    margin: "auto",
    background: "#FFFFFF",
    border: "1px dashed #A7A7A7",
    borderRadius: "18px",
    padding: "124px 135px",
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
    marginTop: "18px",
  },
  subtype: {
    fontFamily: "DM Sans",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "12px",
    lineHeight: "16px",
    color: "#FFFFFF",
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
}));
const menus = [
  {
    type: "menu",
    icon: "assets/externalline.png",
    name: "Exterior walls",
  },
  {
    type: "menu",
    icon: "/assets/interiorline.png",
    name: "Interior walls",
  },
  {
    type: "menu",
    icon: "/assets/dividerline.png",
    name: "Divider lines",
  },
];

export default function LinesBox(props) {
  const classes = useStyles();
  const navigate = useNavigate();

  const [menuItems, setmenuItems] = useState(menus);

  useEffect(() => {
    let { catalog } = props;
    props.dispatch(actions.projectActions.initCatalog(catalog));
  }, [props]);

  return (
    <Box className={classes.background}>
      <img
        src="/assets/arrow.png"
        style={{
          position: "absolute",
          left: "-6px",
          top: "21px",
          zIndex: "33",
        }}
      />
      {menuItems.map((menu, idx) => {
        if (menu.type == "title") {
          return (
            <Typography key={idx} className={classes.sub}>
              {menu.name}
            </Typography>
          );
        } else if (menu.type == "menu") {
          return (
            <Box
              key={idx}
              className={classes.wrap}
              onClick={() => {
                if (menu.name == "Interior walls")
                  props.dispatch(
                    actions.linesActions.selectToolDrawingLine("internalwall")
                  );
                else if (menu.name == "Exterior walls")
                  props.dispatch(
                    actions.linesActions.selectToolDrawingLine("externalwall")
                  );
                else if (menu.name == "Divider lines")
                  props.dispatch(
                    actions.linesActions.selectToolDrawingLine("dividerwall")
                  );
                // else props.dispatch(actions.projectActions.openCatalog());
              }}
            >
              <img src={menu.icon} />
              <Typography className={classes.subtype}>{menu.name}</Typography>
            </Box>
          );
        }
      })}
    </Box>
  );
}
