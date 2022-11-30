import { ElementsFactories } from "react-planner";

const info = {
  title: "dividerwall",
  tag: ["dividerwall"],
  description: "Wall with bricks or painted",
  image: require("./wall.png"),
  visibility: {
    catalog: true,
    layerElementsVisible: true,
  },
  thickness: 0,
};

const textures = {
  bricks: {
    name: "Bricks",
    uri: require("./textures/painted.jpg"),
    lengthRepeatScale: 0.01,
    heightRepeatScale: 0.01,
    normal: {
      uri: require("./textures/painted-normal.jpg"),
      lengthRepeatScale: 0.01,
      heightRepeatScale: 0.01,
      normalScaleX: 0.8,
      normalScaleY: 0.8,
    },
  },
  painted: {
    name: "Painted",
    uri: require("./textures/painted.jpg"),
    lengthRepeatScale: 0.01,
    heightRepeatScale: 0.01,
    normal: {
      uri: require("./textures/painted-normal.jpg"),
      lengthRepeatScale: 0.01,
      heightRepeatScale: 0.01,
      normalScaleX: 0.4,
      normalScaleY: 0.4,
    },
  },
};

export default ElementsFactories.WallFactory("dividerwall", info, textures);
