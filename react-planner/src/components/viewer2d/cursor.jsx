import React from "react";
import PropTypes from "prop-types";
import { GeometryUtils } from "../../utils/export";
import Ruler from "./ruler";

export default function Cursor({ layer, hole, scene, catalog }) {
  let renderedCursor = (hole) => {
    if (hole.type == "window-cursor") {
      let renderedCursor = catalog
        .getElement(hole.type)
        .render2D(hole, layer, scene);

      return (
        <g
          transform={`translate(${hole.x}, ${hole.y})`}
          data-element-root
          data-prototype={hole.prototype}
          data-id={hole.id}
          data-selected={hole.selected}
          data-layer={layer.id}
        >
          <g
            key={hole.id}
            transform={`translate(${0}, 0)`}
            data-element-root
            data-prototype={hole.prototype}
            data-id={hole.id}
            data-selected={hole.selected}
            data-layer={layer.id}
          >
            {renderedCursor}
            <img src="/assets/cursor.png" />
          </g>
        </g>
      );
    } else {
      return null;
    }
  };

  return renderedCursor(hole);
}

Cursor.propTypes = {
  hole: PropTypes.object.isRequired,
  layer: PropTypes.object.isRequired,
  scene: PropTypes.object.isRequired,
  catalog: PropTypes.object.isRequired,
};
