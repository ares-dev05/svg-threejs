import React from "react";
import ReactDOM from "react-dom";
import ContainerDimensions from "react-container-dimensions";
import Immutable, { Map } from "immutable";
import immutableDevtools from "immutable-devtools";
import { createStore } from "redux";
import { Provider as ReduxProvider } from "react-redux";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import MyCatalog from "./catalog/mycatalog";

import ToolbarScreenshotButton from "./ui/toolbar-screenshot-button";
import NewProject from "../../src/components/NewProject";
import LoadBluePrint from "../../src/components/LoadBluePrint";

import {
  Models as PlannerModels,
  reducer as PlannerReducer,
  ReactPlanner,
  Plugins as PlannerPlugins,
} from "react-planner"; //react-planner

//define state
let AppState = Map({
  "react-planner": new PlannerModels.State(),
});

//define reducer
let reducer = (state, action) => {
  state = state || AppState;
  state = state.update("react-planner", (plannerState) =>
    PlannerReducer(plannerState, action)
  );
  return state;
};

let blackList =
  isProduction === true
    ? []
    : ["UPDATE_MOUSE_COORDS", "UPDATE_ZOOM_SCALE", "UPDATE_2D_CAMERA"];

if (!isProduction) {
  console.info(
    "Environment is in development and these actions will be blacklisted",
    blackList
  );
  console.info("Enable Chrome custom formatter for Immutable pretty print");
  immutableDevtools(Immutable);
}

//init store
let store = createStore(
  reducer,
  null,
  !isProduction && window.devToolsExtension
    ? window.devToolsExtension({
        features: {
          pause: true, // start/pause recording of dispatched actions
          lock: true, // lock/unlock dispatching actions and side effects
          persist: true, // persist states on page reloading
          export: true, // export history of actions in a file
          import: "custom", // import history of actions from a file
          jump: true, // jump back and forth (time travelling)
          skip: true, // skip (cancel) actions
          reorder: true, // drag and drop actions in the history list
          dispatch: true, // dispatch custom actions or action creators
          test: true, // generate tests for the selected actions
        },
        actionsBlacklist: blackList,
        maxAge: 999999,
      })
    : (f) => f
);

const { dispatch, getState } = store;

let plugins = [
  PlannerPlugins.Keyboard(),
  PlannerPlugins.Autosave("react-planner_v0"),
  PlannerPlugins.ConsoleDebugger(),
];

let toolbarButtons = [ToolbarScreenshotButton];

//render
ReactDOM.render(
  <ReduxProvider store={store}>
    <BrowserRouter>
      <Routes>
        <Route
          path="/main"
          element={
            <ContainerDimensions>
              {({ width, height }) => (
                <ReactPlanner
                  catalog={MyCatalog}
                  width={width}
                  height={height}
                  plugins={plugins}
                  toolbarButtons={toolbarButtons}
                  stateExtractor={(state) => state.get("react-planner")}
                  dispatch={dispatch}
                />
              )}
            </ContainerDimensions>
          }
        />
        <Route
          path="/"
          element={
            <NewProject
              stateExtractor={(state) => state.get("react-planner")}
              plugins={plugins}
              toolbarButtons={toolbarButtons}
              catalog={MyCatalog}
              dispatch={dispatch}
            />
          }
        />
        <Route
          path="/load"
          element={
            <LoadBluePrint
              stateExtractor={(state) => state.get("react-planner")}
              plugins={plugins}
              toolbarButtons={toolbarButtons}
              catalog={MyCatalog}
              dispatch={dispatch}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  </ReduxProvider>,
  document.getElementById("app")
);
