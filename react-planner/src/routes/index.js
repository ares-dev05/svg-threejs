import NProgress from "nprogress";
import { Switch, Route } from "react-router-dom";
import { Suspense, Fragment, lazy, useEffect, useMemo } from "react";
// material
import { makeStyles } from "@material-ui/core/styles";
// components
import LoadingScreen from "../components/LoadingScreen";
import ReactPlanner from "../react-planner";
// ----------------------------------------------------------------------

const nprogressStyle = makeStyles((theme) => ({
  "@global": {
    "#nprogress": {
      pointerEvents: "none",
      "& .bar": {
        top: 0,
        left: 0,
        height: 2,
        width: "100%",
        position: "fixed",
        zIndex: theme.zIndex.snackbar,
        backgroundColor: theme.palette.primary.main,
        boxShadow: `0 0 2px ${theme.palette.primary.main}`,
      },
      "& .peg": {
        right: 0,
        opacity: 1,
        width: 100,
        height: "100%",
        display: "block",
        position: "absolute",
        transform: "rotate(3deg) translate(0px, -4px)",
        boxShadow: `0 0 10px ${theme.palette.primary.main}, 0 0 5px ${theme.palette.primary.main}`,
      },
    },
  },
}));

function RouteProgress(props) {
  nprogressStyle();

  NProgress.configure({
    speed: 500,
    showSpinner: false,
  });

  useMemo(() => {
    NProgress.start();
  }, []);

  useEffect(() => {
    NProgress.done();
  }, []);

  return <Route {...props} />;
}

export function renderRoutes(routes = []) {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Switch>
        {routes.map((route, idx) => {
          const Component = route.component;

          return (
            <RouteProgress
              key={`routes-${idx}`}
              path={route.path}
              exact={route.exact}
              render={(props) => (
                <div>
                  {route.routes ? (
                    renderRoutes(route.routes)
                  ) : (
                    <Component {...props} />
                  )}
                </div>
              )}
            />
          );
        })}
      </Switch>
    </Suspense>
  );
}

const routes = [
  // Others Routes
  {
    exact: true,
    path: "/",
    component: lazy(() => ReactPlanner),
  },
];
export default routes;
