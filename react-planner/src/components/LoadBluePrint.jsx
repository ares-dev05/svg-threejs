import React, { useState, useEffect } from "react";

import { Box, Typography, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link, useNavigate } from "react-router-dom";

import UploadSingleFile from "./UploadSingleFile";
import { loadProjectFromFile } from "./parse-svg";
import actions from "./../actions/export";

const useStyles = makeStyles(() => ({
  background: {
    backgroundColor: "#f8f8f8",
    flexGrow: 1,
    minHeight: "100vh",
    position: "relative",
    paddingTop: "252px",
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
    position: "absolute",
    top: "0px",
    left: "0px",
    background: "#FFFFFF",
    height: "56px",
    border: "1px solid #DEDEDE",
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
    lineHeight: "18px",
    color: "#333333",
    "&:hover": {
      cursor: "pointer",
    },
  },
  backbar: {
    margin: "0 22px",
    "&:hover": {
      cursor: "pointer",
    },
  },
  subscription: {
    fontFamily: "DM Sans",
    fontStyle: "normal",
    fontWeight: "700",
    fontSize: "32px",
    lineHeight: "44px",
    color: "#323337",
  },
  miniscription: {
    fontFamily: "DM Sans",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: "14px",
    lineHeight: "26px",
    color: "#323337",
    margin: "2rem 0",
  },
  uploadbtn: {
    background: "#333333",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
    borderRadius: "8px",
    fontFamily: "DM Sans",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: "14px",
    lineHeight: "18px",
    letterSpacing: "-0.02em",
    color: "#FFFFFF",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: "11px 18px",
    gap: "10px",
    float: "left",
    "&:hover": {
      background: "#333333db",
      cursor: "pointer",
    },
  },
  inputbox: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: "11px 18px 11px 13px",
    gap: "10px",
    background: "#EDEDED",
    borderRadius: "8px",
    marginRight: "1rem",
  },
  inputboxscript: {
    fontFamily: "DM Sans",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: "14px",
    lineHeight: "18px",
    letterSpacing: "-0.02em",
    color: "#262626",
    flex: "none",
    order: 0,
    flexGrow: 0,
  },
  close: {
    "&:hover": {
      cursor: "pointer",
    },
  },
}));

export default function LoadBluePrint(props) {
  const classes = useStyles();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);

  useEffect(() => {
    let { catalog } = props;
    props.dispatch(actions.projectActions.initCatalog(catalog));
  }, [props]);

  const checkType = (file) => {
    if (file == null) return false;
    if (
      file.type == "image/png" ||
      file.type == "image/jpeg" ||
      file.type == "image/svg+xml"
    ) {
      return true;
    }
    return false;
  };

  return (
    <Box className={classes.background}>
      <Box className={classes.menubar}>
        <Link
          to="/"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
          }}
        >
          <img src="/assets/backbar.png" className={classes.backbar} />
        </Link>
        <Link
          to="/"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography className={classes.barsub}>New Floorplan</Typography>
        </Link>
      </Box>
      <Grid
        container
        spacing={2}
        display="flex"
        justifyContent="space-between"
        className={classes.container}
      >
        <Grid item xs={12} sm={12} md={8}>
          <Typography className={classes.subscription}>
            Upload your blueprint
          </Typography>
          <Typography className={classes.miniscription}>
            Here we will tell about formats in which the blueprint should be.
            Something like <b>.PNG</b> or <b>.JPEG</b> and the size should be
            max <b>5 MB</b>.
          </Typography>

          {!checkType(file) && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <Typography
                className={classes.uploadbtn}
                onClick={() => {
                  var input = document.createElement("input");
                  input.type = "file";

                  input.onchange = (e) => {
                    var file = e.target.files[0];
                    setFile(file);
                  };

                  input.click();
                }}
              >
                Upload from computer
              </Typography>
              <UploadSingleFile value={file} onChange={setFile} />
            </Box>
          )}
          {checkType(file) && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <Box className={classes.inputbox}>
                <img src="/assets/check.png" />
                <Typography className={classes.inputboxscript}>
                  Blueprint has been succesfully uploaded
                </Typography>
                <img
                  src="/assets/close.png"
                  className={classes.close}
                  onClick={() => {
                    setFile(null);
                  }}
                />
              </Box>
              <Typography
                className={classes.uploadbtn}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  var reader = new FileReader();
                  reader.onload = function (e) {
                    const data = e.target.result;
                    const res = loadProjectFromFile(data);
                    // props.dispatch(actions.projectActions.newProject());
                    props.dispatch(actions.projectActions.loadProject(res));
                    navigate("/main", { replace: true });
                  };
                  reader.readAsText(file);
                }}
              >
                Continue
              </Typography>
            </Box>
          )}
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <img
            src="/assets/file.png"
            style={{
              marginTop: "2rem",
              marginLeft: "5rem",
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
