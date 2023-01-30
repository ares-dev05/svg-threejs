import React, { useState, useEffect } from "react";

import { Box, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link, useNavigate } from "react-router-dom";

import actions from "../../actions/export";

const useStyles = makeStyles(() => ({
  background: {
    flexGrow: 1,
    position: "absolute",
    width: "264px",
    height: "calc(100vh - 52px)",
    left: "52px",
    top: "0px",
    background: "#FFFFFF",
    borderRight: "1px solid #E4E8EE",
    zIndex: 2,
    padding: "20px",
    overflowY: "auto",
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
}));
const menus = [
  {
    type: "title",
    name: "TABLE",
  },
  {
    type: "menu",
    icon: "/assets/roundtable.png",
    name: "Round table",
  },
  {
    type: "menu",
    icon: "/assets/squaretable.png",
    name: "Square table",
  },
  {
    type: "menu",
    icon: "/assets/rectangletable.png",
    name: "Rectangle table",
  },
  {
    type: "title",
    name: "SOFA",
  },
  {
    type: "menu",
    icon: "/assets/sofa.png",
    name: "Sofa",
  },
  {
    type: "menu",
    icon: "/assets/sofaL.png",
    name: "Sofa - L shape",
  },
  {
    type: "menu",
    icon: "/assets/sofaU.png",
    name: "Sofa - U shape",
  },
  {
    type: "title",
    name: "BED",
  },
  {
    type: "menu",
    icon: "/assets/bed1x.png",
    name: "Bed - 1x",
  },
  {
    type: "menu",
    icon: "/assets/bed2x.png",
    name: "Bed - 2x",
  },
  {
    type: "title",
    name: "WORDROBE",
  },
  {
    type: "menu",
    icon: "/assets/wordrob.png",
    name: "Wordrobe",
  },
  {
    type: "menu",
    icon: "/assets/dresser.png",
    name: "Dresser",
  },
  {
    type: "menu",
    icon: "/assets/nightstand.png",
    name: "Nightstand",
  },
  {
    type: "title",
    name: "BATHROOM",
  },
  {
    type: "menu",
    icon: "/assets/bathtub.png",
    name: "Bathtub",
  },
  {
    type: "menu",
    icon: "/assets/shower.png",
    name: "Shower",
  },
  {
    type: "menu",
    icon: "/assets/sink.png",
    name: "Sink",
  },
  {
    type: "menu",
    icon: "/assets/toilet.png",
    name: "Toilet",
  },
  {
    type: "title",
    name: "Kitchen",
  },
  {
    type: "menu",
    icon: "/assets/washingmachine.png",
    name: "Washing machine",
  },
  {
    type: "menu",
    icon: "/assets/oven.png",
    name: "Oven",
  },
  {
    type: "menu",
    icon: "/assets/cooktop2x.png",
    name: "Cooktop - 2x",
  },
  {
    type: "menu",
    icon: "/assets/cooktop4x.png",
    name: "Cooktop - 4x",
  },
  {
    type: "menu",
    icon: "/assets/rangehood.png",
    name: "Range hood",
  },
];

export default function ItemsBox(props) {
  const classes = useStyles();

  const [menuItems, setmenuItems] = useState(menus);
  const onChangeSearchInput = (e) => {
    if (e.target.value == "") {
      setmenuItems(menus);
    } else {
      let searchedMenus = [];
      menus.map((menu, id) => {
        if (
          menu.type == "menu" &&
          menu.name.toLowerCase().includes(e.target.value)
        )
          searchedMenus.push(menu);
      });
      setmenuItems(searchedMenus);
    }
  };

  useEffect(() => {
    let { catalog } = props;
    props.dispatch(actions.projectActions.initCatalog(catalog));
  }, [props]);

  return (
    <Box className={classes.background}>
      <TextField
        className={classes.inputText}
        fullWidth
        autoComplete="username"
        type="email"
        placeholder="Search..."
        label=""
        sx={{ mb: 1 }}
        variant="outlined"
        onChange={onChangeSearchInput}
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
            <Box key={idx} className={classes.wrap} onClick={() => {
              if(menu.name == "Sofa") {
                props.dispatch(actions.itemsActions.selectToolDrawingItem("sofa"));
              } else if(menu.name == "Sofa - L shape") {
                props.dispatch(actions.itemsActions.selectToolDrawingItem("sofa-L"));
              } else if(menu.name == "Sofa - U shape") {
                props.dispatch(actions.itemsActions.selectToolDrawingItem("sofa-U"));
              } else if(menu.name == "Bed - 1x") {
                props.dispatch(actions.itemsActions.selectToolDrawingItem("bed-1"));
              } else if(menu.name == "Bed - 2x") {
                props.dispatch(actions.itemsActions.selectToolDrawingItem("bed-2"));
              } else if(menu.name == "Nightstand") {
                props.dispatch(actions.itemsActions.selectToolDrawingItem("nightstand"));
              } else if(menu.name == "Round table") {
                props.dispatch(actions.itemsActions.selectToolDrawingItem("round-table"));
              } else if(menu.name == "Square table") {
                props.dispatch(actions.itemsActions.selectToolDrawingItem("square-table"));
              } else if(menu.name == "Rectangle table") {
                console.log('rectangle-table')
                props.dispatch(actions.itemsActions.selectToolDrawingItem("rectangle-table"));
              } else if(menu.name == "Wordrobe") {
                props.dispatch(actions.itemsActions.selectToolDrawingItem("wordrobe"));
              } else if(menu.name == "Dresser") {
                props.dispatch(actions.itemsActions.selectToolDrawingItem("dresser"));
              } else if(menu.name == "Bathtub") {
                props.dispatch(actions.itemsActions.selectToolDrawingItem("bathtub"));
              }
            }}>
              <img src={menu.icon} />
              <Typography className={classes.subtype}>{menu.name}</Typography>
            </Box>
          );
        }
      })}
    </Box>
  );
}
