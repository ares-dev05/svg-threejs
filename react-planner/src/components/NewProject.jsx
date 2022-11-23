import React, { useState, useEffect } from "react";

import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

import actions from "./../actions/export";

const useStyles = makeStyles(() => ({
  background: {
    backgroundColor: "#f8f8f8",
    flexGrow: 1,
    minHeight: "100vh",
  },
  container: {
    width: "879px",
    margin: "auto",
  },
  title: {
    fontFamily: "DM Sans",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: "32px",
    lineHeight: "44px",
    color: "#323337",
    paddingTop: "252px",
    paddingBottom: "100px",
    textAlign: "center",
  },
  wrap: {
    background: "rgba(255, 255, 255, 0.6)",
    border: "1px solid #E1E1E1",
    borderRadius: "18px",
    width: "400px",
    height: "267px",
    paddingLeft: "30px",
    "&:hover": {
      cursor: "pointer",
      width: "405px",
      height: "269px",
      background: "#FFFFFF",
      border: "1px solid #2390F4",
      boxShadow: "0px 4px 44px rgba(15, 62, 104, 0.05)",
      borderRadius: "18px",
      color: "#2390F4",
      "& $subscription": {
        color: "#2390F4",
      },
      "& $miniscription": {
        color: "#2390F4",
      },
    },
    transition: "0.3s ease",
  },
  icon1: {
    paddingTop: "85px",
    paddingBottom: "1rem",
  },
  icon2: {
    paddingTop: "73px",
    paddingBottom: "0.8rem",
  },
  subscription: {
    fontFamily: "DM Sans",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: "24px",
    lineHeight: "44px",
    color: "#323337",
    textDecoration: "none",
  },
  miniscription: {
    fontFamily: "DM Sans",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "14px",
    lineHeight: "24px",
    color: "#828282",
    textDecoration: "none",
  },
}));

export default function NewProject(props) {
  const classes = useStyles();

  useEffect(() => {}, []);

  return (
    <Box className={classes.background}>
      <Typography className={classes.title}>New Floor Plan</Typography>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        className={classes.container}
      >
        <Link
          to="/"
          style={{
            textDecoration: "none",
          }}
        >
          <Box className={classes.wrap}>
            <img src="/assets/Vector.png" className={classes.icon1} />
            <Typography className={classes.subscription}>
              Start from scratch
            </Typography>
            <Typography className={classes.miniscription}>
              Lets draw your ground. You can either trace a hand drawn plan or
              start from scratch
            </Typography>
          </Box>
        </Link>
        <Link
          to="/load"
          style={{
            textDecoration: "none",
          }}
        >
          <Box
            className={classes.wrap}
            onClick={() => {
              props.dispatch(actions.projectActions.newProject());
            }}
          >
            <img src="/assets/Group.png" className={classes.icon2} />
            <Typography className={classes.subscription}>
              Create from your blueprint
            </Typography>
            <Typography className={classes.miniscription}>
              Lets draw your ground. You can either trace a hand drawn plan or
              start from scratch
            </Typography>
          </Box>
        </Link>
      </Box>
    </Box>
  );
}
