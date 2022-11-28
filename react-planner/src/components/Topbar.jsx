import React, { useState, useEffect } from "react";

import { Box, Typography, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link, useNavigate } from "react-router-dom";

import UploadSingleFile from "./UploadSingleFile";
import { loadProjectFromFile } from "./parse-svg";
import actions from "../actions/export";
import {
  MODE_IDLE,
  MODE_3D_VIEW,
  MODE_3D_FIRST_PERSON,
  MODE_VIEWING_CATALOG,
  MODE_CONFIGURING_PROJECT,
} from "../constants";

const useStyles = makeStyles(() => ({
  background: {
    backgroundColor: "#f8f8f8",
    flexGrow: 1,
    maxHeight: "52px",
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
  menubar: {
    background: "#FFFFFF",
    height: "52px",
    borderBottom: "1px solid #DEDEDE",
    zIndex: 1,
    width: "100%",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  barsub: {
    fontFamily: "DM Sans",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: "14px",
    lineHeight: "24px",
    color: "#1F2735",
    display: "block",
    "&:hover": {
      cursor: "pointer",
    },
  },
  barsubbar: {
    fontFamily: "DM Sans",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: "14px",
    lineHeight: "50px",
    color: "#9199A7",
    display: "block",
    marginLeft: "24px",
    cursor: "pointer",
    "&:hover": {
      color: "#1F2735",
    },
  },
  barsubbarH: {
    fontFamily: "DM Sans",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: "14px",
    lineHeight: "50px",
    display: "block",
    marginLeft: "24px",
    cursor: "pointer",
    color: "#1F2735",
    borderBottom: "2px solid #1F2735",
  },
  backbarWrap: {
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    background: "#FFFFFF",
    borderRight: "1px solid #E4E8EE",
    width: "52px",
    height: "50px",
    "&:hover": {
      "& $backbar": {
        cursor: "pointer",
        width: "18px",
        height: "18px",
        transition: "0.01s ease",
      },
    },
  },
  backbar: {
    margin: "18px",
    width: "16px",
    height: "16px",
  },
  sub: {
    fontFamily: "DM Sans",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "13px",
    lineHeight: "20px",
    color: "#4D5B73",
  },
}));

export default function Topbar(props) {
  const classes = useStyles();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);

  useEffect(() => {
    let { catalog } = props;
    props.dispatch(actions.projectActions.initCatalog(catalog));
  }, [props]);

  return (
    <Box className={classes.background}>
      <Box className={classes.menubar}>
        <Link to="/" className={classes.backbarWrap}>
          <img src="/assets/back1.png" className={classes.backbar} />
        </Link>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            width: "calc(100% - 16px)",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              className={
                props.tab == 0 ? classes.barsubbarH : classes.barsubbar
              }
              onClick={() => {
                props.setTab(0);
                console.log("setTab");
                props.dispatch(actions.projectActions.setMode(MODE_IDLE));
              }}
            >
              Drawing
            </Typography>
            <Typography
              className={
                props.tab == 1 ? classes.barsubbarH : classes.barsubbar
              }
              onClick={() => {
                props.setTab(1);
              }}
            >
              Decoration
            </Typography>
            <Typography
              className={
                props.tab == 2 ? classes.barsubbarH : classes.barsubbar
              }
              onClick={() => {
                props.setTab(2);
                props.dispatch(actions.viewer3DActions.selectTool3DView());
              }}
            >
              3D
            </Typography>
          </Box>
          <Typography className={classes.barsub}>New Floorplan</Typography>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography className={classes.sub}>Your file is saved</Typography>
            <img
              src="/assets/cloudadd.png"
              style={{
                margin: "0 1rem",
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
