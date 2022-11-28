import React, { useState, useEffect } from "react";

import { Box, Typography, TextField, Checkbox } from "@material-ui/core";

import { alpha, makeStyles } from "@material-ui/core/styles";

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
    backgroundColor: "transparent",
    flexGrow: 1,
    maxHeight: "52px",
    position: "absolute",
    bottom: "14px",
    right: "15.81px",
  },
  menubar: {
    background: "transparent",
    height: "52px",
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
  },
  wrap: {
    padding: "7px 13px",
    background: "#FFFFFF",
    border: "1px solid #E3E3E3",
    borderRadius: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  paragrah1: {
    fontFamily: "DM Sans",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "13px",
    lineHeight: "26px",
    color: "#333333",
    marginRight: "4px",
  },
  paragrah2: {
    fontFamily: "DM Sans",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "12px",
    lineHeight: "26px",
    color: "#B5B5B5",
    marginRight: "10px",
  },
  inputText: {
    "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "#0CA9EB",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#0CA9EB",
    },
    "& .MuiOutlinedInput-input": {
      color: "#000",
      padding: "11.5px 14px",
      fontFamily: "DM Sans",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "13px",
      lineHeight: "20px",
      color: "#9199A7",
    },
    "& .MuiInputLabel-outlined.Mui-focused": {
      color: "#000",
    },
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#fff",
      borderRadius: "6px",
      padding: "offset",
      width: "100px",
    },
  },
}));

export default function Footerbar(props) {
  const classes = useStyles();
  const navigate = useNavigate();

  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");

  useEffect(() => {
    let { catalog } = props;
    props.dispatch(actions.projectActions.initCatalog(catalog));
  }, [props]);

  return (
    <Box className={classes.background}>
      <Box className={classes.menubar}>
        <Box className={classes.wrap}>
          <Typography className={classes.paragrah1}>Width</Typography>
          <Typography className={classes.paragrah2}>mm</Typography>
          <TextField
            className={classes.inputText}
            fullWidth
            autoComplete="username"
            type="string"
            placeholder=""
            label=""
            value={width}
            sx={{ mb: 1 }}
            variant="outlined"
            onChange={(e) => {
              if (!isNaN(e.target.value)) setWidth(e.target.value);
            }}
          />
          <Typography
            className={classes.paragrah1}
            style={{ marginLeft: "24px" }}
          >
            Height
          </Typography>
          <Typography className={classes.paragrah2}>mm</Typography>
          <TextField
            className={classes.inputText}
            fullWidth
            autoComplete="username"
            type="string"
            placeholder=""
            label=""
            sx={{ mb: 1 }}
            variant="outlined"
            value={height}
            onChange={(e) => {
              if (!isNaN(e.target.value)) setHeight(e.target.value);
            }}
          />
        </Box>
        <Box className={classes.wrap} style={{ marginLeft: "12px" }}>
          <Checkbox
            sx={{
              "&.Mui-checked.MuiIconButton-colorSecondary": {
                color: "#407AEC",
              },
              "&.MuiCheckbox-indeterminate": {
                color: "#407AEC",
              },
              "&:hover, &.Mui-checked:hover": {
                backgroundColor: alpha("#407AEC", 0.08),
              },
            }}
          />
          <Typography
            style={{
              fontFamily: "DM Sans",
              fontStyle: "normal",
              fontWeight: 400,
              fontSize: "14px",
              lineHeight: "26px",
              color: "#333333",
            }}
          >
            Show blueprint
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
