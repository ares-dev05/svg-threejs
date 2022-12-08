import React from "react";
import { buildWall, updatedWall } from "./wall-factory-3d";
import * as SharedStyle from "../../shared-style";
import * as Geometry from "../../utils/geometry";
import Translator from "../../translator/translator";
import { GeometryUtils } from "../../utils/export";


const epsilon = 20;
const STYLE_TEXT = { textAnchor: "middle" };
const STYLE_LINE = { stroke: SharedStyle.LINE_MESH_COLOR.selected };
const STYLE_RECT = {
  strokeWidth: 1,
  stroke: SharedStyle.LINE_MESH_COLOR.unselected,
  fill: "#8B8B8B",
};
const STYLE_RECT_SELECTED = {
  fill: "#407AEC",
  strokeWidth: 1,
  stroke: SharedStyle.LINE_MESH_COLOR.selected,
};

let translator = new Translator();

export default function WallFactory(name, info, textures) {
  let wallElement = {
    name,
    prototype: "lines",
    info,
    properties: {
      height: {
        label: translator.t("height"),
        type: "length-measure",
        defaultValue: {
          length: 300,
        },
      },
      thickness: {
        label: translator.t("thickness"),
        type: "length-measure",
        defaultValue: {
          length: info.thickness,
        },
      },
    },

    render2D: function (element, layer, scene) {
      const lineType = element.getIn(["name"]);

      if (lineType == "Dividerwall") {
        let { x: x1, y: y1 } = layer.vertices.get(element.vertices.get(0));
        let { x: x2, y: y2 } = layer.vertices.get(element.vertices.get(1));

        let length = Geometry.pointsDistance(x1, y1, x2, y2);

        return element.selected ? (
          <g>
            <line
              x1="0"
              y1="0"
              x2={length}
              y2="0"
              style={STYLE_RECT_SELECTED}
              stroke="black"
              strokeDasharray="4"
            />
          </g>
        ) : (
          <g>
            <line
              x1="0"
              y1="0"
              x2={length}
              y2="0"
              style={STYLE_RECT}
              stroke="black"
              strokeDasharray="4"
            />
          </g>
        );
      } else {
        let { x: x1, y: y1 } = layer.vertices.get(element.vertices.get(0));
        let { x: x2, y: y2 } = layer.vertices.get(element.vertices.get(1));
        
        let line1 = null
        let line2 = null
        
        layer.lines.forEach(line => {
          if((line.vertices.get(0) == element.vertices.get(0) || line.vertices.get(1) == element.vertices.get(0)) && line.id != element.id)
          line1 = line
          else if((line.vertices.get(0) == element.vertices.get(1) || line.vertices.get(1) == element.vertices.get(1)) && line.id != element.id)
          line2 = line
        })
        
        let length = Geometry.pointsDistance(x1, y1, x2, y2);

        let thickness = element.getIn(["properties", "thickness", "length"]);
        let half_thickness = thickness / 2;

        let angle = GeometryUtils.angleBetweenTwoPointsAndOrigin(x1, y1, x2, y2);
        let angle1 = 0;
        let angle2 = 0;
        let beta1 = 0
        let beta2 = 0
        let poly1 = `0,${half_thickness}`, poly2 = `${length},${half_thickness}`, poly3 = `${length},${-half_thickness}`, poly4 = `0,-${half_thickness}`;

        if(line1 != null) {
          let { x:line1x1, y: line1y1 } = layer.vertices.get(line1.vertices.get(0));
          let { x: line1x2, y: line1y2 } = layer.vertices.get(line1.vertices.get(1));
          const tempAngle = GeometryUtils.angleBetweenTwoPointsAndOrigin(line1x1, line1y1, line1x2, line1y2);
          angle1 = 180 - (tempAngle - angle)
          if(angle1 > 180) {
            angle1 = 360 - angle1
          }

          beta1 = Math.tan((90 - angle1 / 2) * Math.PI / 180) * thickness / 2;

          let endPoint = { x:line1x1, y: line1y1 }
          if (element.vertices.get(0) == line1.vertices.get(0)) {
            endPoint = { x: line1x2, y: line1y2 }
          }

          if(y1 >= endPoint.y) {
            // Uper line is longer than the bottom line
            poly1 = `-${beta1},${half_thickness}`
            poly4 = `${beta1},-${half_thickness}`
          } else {
            poly1 = `-${beta1},${half_thickness}`
            poly4 = `${beta1},-${half_thickness}`
          }
        }
        if(line2 != null) {
          let { x:line2x1, y: line2y1 } = layer.vertices.get(line2.vertices.get(0));
          let { x: line2x2, y: line2y2 } = layer.vertices.get(line2.vertices.get(1));
          const tempAngle = GeometryUtils.angleBetweenTwoPointsAndOrigin(line2x1, line2y1, line2x2, line2y2);
          angle2 = 180 - (tempAngle - angle)
          if(angle2 > 180) {
            angle2 = 360 - angle2
          }
          beta2 = Math.tan((90 - angle2 / 2) * Math.PI / 180) * thickness / 2;

          let endPoint = { x:line2x1, y: line2y1 }
          if (element.vertices.get(1) == line2.vertices.get(0)) {
            endPoint = { x: line2x2, y: line2y2 }
          }

          if(y2 >= endPoint.y) {
            // Uper line is longer than the bottom line
            poly2 = `${length + beta2},${half_thickness}`
            poly3 = `${length - beta2},-${half_thickness}`
          } else {
            poly2 = `${length - beta2},${half_thickness}`
            poly3 = `${length + beta2},-${half_thickness}`
          }
        }

        console.log('line ' + element.id, {element, line1, line2, angle, angle1, angle2, beta1, beta2})

        console.log('poly',  {
          poly1,poly2,poly3,poly4
        })

        console.log('param', `${poly1 + " " + poly2 + " " + poly3 + " " + poly4}`)

        return element.selected ? (
          <g>
            <polygon points={`${poly1 + " " + poly2 + " " + poly3 + " " + poly4}`} style={STYLE_RECT_SELECTED} />
          </g>
        ) : (
          <polygon points={`${poly1 + " " + poly2 + " " + poly3 + " " + poly4}`} style={STYLE_RECT} />
        );
      }
    },

    render3D: function (element, layer, scene) {
      return buildWall(element, layer, scene, textures);
    },

    updateRender3D: (
      element,
      layer,
      scene,
      mesh,
      oldElement,
      differences,
      selfDestroy,
      selfBuild
    ) => {
      return updatedWall(
        element,
        layer,
        scene,
        textures,
        mesh,
        oldElement,
        differences,
        selfDestroy,
        selfBuild
      );
    },
  };

  if (textures && textures !== {}) {
    let textureValues = { none: "None" };

    for (let textureName in textures) {
      textureValues[textureName] = textures[textureName].name;
    }

    wallElement.properties.textureA = {
      label: translator.t("texture") + " A",
      type: "enum",
      defaultValue: textureValues.bricks ? "bricks" : "none",
      values: textureValues,
    };

    wallElement.properties.textureB = {
      label: translator.t("texture") + " B",
      type: "enum",
      defaultValue: textureValues.bricks ? "bricks" : "none",
      values: textureValues,
    };
  }

  return wallElement;
}
