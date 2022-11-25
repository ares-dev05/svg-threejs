import React, { Component } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import Translator from "./translator/translator";
import Catalog from "./catalog/catalog";
import actions from "./actions/export";
import { objectsMap } from "./utils/objects-utils";
import {
  ToolbarComponents,
  Content,
  SidebarComponents,
  FooterBarComponents,
} from "./components/export";
import { VERSION } from "./version";
import "./styles/export";
import Topbar from "./components/Topbar";

const { Toolbar } = ToolbarComponents;
const { Sidebar } = SidebarComponents;
const { FooterBar } = FooterBarComponents;

const toolbarW = 52;
const sidebarW = 300;
const footerBarH = 20;

const wrapperStyle = {
  display: "flex",
  flexFlow: "row nowrap",
};

class ReactPlanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: 0,
    };
  }
  getChildContext() {
    return {
      ...objectsMap(actions, (actionNamespace) => this.props[actionNamespace]),
      translator: this.props.translator,
      catalog: this.props.catalog,
    };
  }

  componentWillMount() {
    let { store } = this.context;
    let { projectActions, catalog, stateExtractor, plugins } = this.props;

    plugins.forEach((plugin) => plugin(store, stateExtractor));
    projectActions.initCatalog(catalog);
  }

  componentWillReceiveProps(nextProps) {
    let { stateExtractor, state, projectActions, catalog } = nextProps;
    let plannerState = stateExtractor(state);
    let catalogReady = plannerState.getIn(["catalog", "ready"]);
    if (!catalogReady) {
      projectActions.initCatalog(catalog);
    }
  }

  render() {
    let { width, height, state, stateExtractor, dispatch, catalog, ...props } =
      this.props;

    // let contentW = width - toolbarW - sidebarW;
    let contentW = width - toolbarW;
    let heightTopBar = 52;
    // let toolbarH = height - footerBarH - heightTopBar;
    // let contentH = height - footerBarH - heightTopBar;
    // let sidebarH = height - footerBarH - heightTopBar;
    let toolbarH = height - heightTopBar;
    let contentH = height - heightTopBar;
    let sidebarH = height - heightTopBar;
    let wrapHeight = height - heightTopBar;

    let extractedState = stateExtractor(state);

    return (
      <div>
        <Topbar
          dispatch={dispatch}
          catalog={catalog}
          tab={this.state.tab}
          setTab={(tab) => {
            this.setState({
              tab: tab,
            });
          }}
        />
        <div style={{ ...wrapperStyle, wrapHeight }}>
          <Toolbar
            width={toolbarW}
            height={toolbarH}
            state={extractedState}
            dispatch={dispatch}
            {...props}
          />
          <Content
            width={contentW}
            height={contentH}
            state={extractedState}
            {...props}
            onWheel={(event) => event.preventDefault()}
          />
          {/* <Sidebar
            width={sidebarW}
            height={sidebarH}
            state={extractedState}
            {...props}
            disable={true}
          /> */}
          {/* <FooterBar
            width={width}
            height={footerBarH}
            state={extractedState}
            {...props}
          /> */}
        </div>
      </div>
    );
  }
}

ReactPlanner.propTypes = {
  translator: PropTypes.instanceOf(Translator),
  catalog: PropTypes.instanceOf(Catalog),
  allowProjectFileSupport: PropTypes.bool,
  plugins: PropTypes.arrayOf(PropTypes.func),
  autosaveKey: PropTypes.string,
  autosaveDelay: PropTypes.number,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  stateExtractor: PropTypes.func.isRequired,
  toolbarButtons: PropTypes.array,
  sidebarComponents: PropTypes.array,
  footerbarComponents: PropTypes.array,
  customContents: PropTypes.object,
  softwareSignature: PropTypes.string,
};

ReactPlanner.contextTypes = {
  store: PropTypes.object.isRequired,
};

ReactPlanner.childContextTypes = {
  ...objectsMap(actions, () => PropTypes.object),
  translator: PropTypes.object,
  catalog: PropTypes.object,
};

ReactPlanner.defaultProps = {
  translator: new Translator(),
  catalog: new Catalog(),
  plugins: [],
  allowProjectFileSupport: true,
  softwareSignature: `FloorPlan-3D ${VERSION}`,
  toolbarButtons: [],
  sidebarComponents: [],
  footerbarComponents: [],
  customContents: {},
};

//redux connect
function mapStateToProps(reduxState) {
  return {
    state: reduxState,
  };
}

function mapDispatchToProps(dispatch) {
  return objectsMap(actions, (actionNamespace) =>
    bindActionCreators(actions[actionNamespace], dispatch)
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(ReactPlanner);
