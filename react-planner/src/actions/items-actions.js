import {
  SELECT_ITEM,
  SELECT_TOOL_DRAWING_ITEM,
  UPDATE_DRAWING_ITEM,
  END_DRAWING_ITEM,
  BEGIN_DRAGGING_ITEM,
  UPDATE_DRAGGING_ITEM,
  END_DRAGGING_ITEM,
  BEGIN_ROTATING_ITEM,
  UPDATE_ROTATING_ITEM,
  END_ROTATING_ITEM,
  BEGIN_RESIZE_ITEM_RIGHT_BOTTOM,
  UPDATE_RESIZE_ITEM_RIGHT_BOTTOM,
  END_RESIZE_ITEM_RIGHT_BOTTOM,
  BEGIN_RESIZE_ITEM_RIGHT_TOP,
  UPDATE_RESIZE_ITEM_RIGHT_TOP,
  END_RESIZE_ITEM_RIGHT_TOP,
  BEGIN_RESIZE_ITEM_LEFT_TOP,
  UPDATE_RESIZE_ITEM_LEFT_TOP,
  END_RESIZE_ITEM_LEFT_TOP,
  BEGIN_RESIZE_ITEM_LEFT_BOTTOM,
  UPDATE_RESIZE_ITEM_LEFT_BOTTOM,
  END_RESIZE_ITEM_LEFT_BOTTOM,
} from '../constants';

export function selectItem(layerID, itemID) {
  return {
    type: SELECT_ITEM,
    layerID,
    itemID
  }
}

export function selectToolDrawingItem(sceneComponentType) {
  return {
    type: SELECT_TOOL_DRAWING_ITEM,
    sceneComponentType
  }
}

export function updateDrawingItem(layerID, x, y) {
  return {
    type: UPDATE_DRAWING_ITEM,
    layerID, x, y
  }
}

export function endDrawingItem(layerID, x, y) {
  return {
    type: END_DRAWING_ITEM,
    layerID, x, y
  }
}

export function beginDraggingItem(layerID, itemID, x, y) {
  return {
    type: BEGIN_DRAGGING_ITEM,
    layerID, itemID, x, y
  }
}

export function updateDraggingItem(x, y) {
  return {
    type: UPDATE_DRAGGING_ITEM,
    x, y
  }
}

export function endDraggingItem(x, y) {
  return {
    type: END_DRAGGING_ITEM,
    x, y
  }
}

export function beginRotatingItem(layerID, itemID, x, y) {
  return {
    type: BEGIN_ROTATING_ITEM,
    layerID, itemID, x, y
  }
}


export function updateRotatingItem(x, y) {
  return {
    type: UPDATE_ROTATING_ITEM,
    x, y
  }
}

export function endRotatingItem(x, y) {
  return {
    type: END_ROTATING_ITEM,
    x, y
  }
}

export function beginResizingItemRB(layerID, itemID, x, y) {
  return {
    type: BEGIN_RESIZE_ITEM_RIGHT_BOTTOM,
    layerID, itemID, x, y
  }
}

export function updateResizingItemRB(x, y) {
  return {
    type: UPDATE_RESIZE_ITEM_RIGHT_BOTTOM,
    x, y
  }
}

export function endResizingItemRB(x, y) {
  return {
    type: END_RESIZE_ITEM_RIGHT_BOTTOM,
    x, y
  }
}

export function beginResizingItemRT(layerID, itemID, x, y) {
  return {
    type: BEGIN_RESIZE_ITEM_RIGHT_TOP,
    layerID, itemID, x, y
  }
}

export function updateResizingItemRT(x, y) {
  return {
    type: UPDATE_RESIZE_ITEM_RIGHT_TOP,
    x, y
  }
}

export function endResizingItemRT(x, y) {
  return {
    type: END_RESIZE_ITEM_RIGHT_TOP,
    x, y
  }
}

export function beginResizingItemLT(layerID, itemID, x, y) {
  return {
    type: BEGIN_RESIZE_ITEM_LEFT_TOP,
    layerID, itemID, x, y
  }
}

export function updateResizingItemLT(x, y) {
  return {
    type: UPDATE_RESIZE_ITEM_LEFT_TOP,
    x, y
  }
}

export function endResizingItemLT(x, y) {
  return {
    type: END_RESIZE_ITEM_LEFT_TOP,
    x, y
  }
}

export function beginResizingItemLB(layerID, itemID, x, y) {
  return {
    type: BEGIN_RESIZE_ITEM_LEFT_BOTTOM,
    layerID, itemID, x, y
  }
}

export function updateResizingItemLB(x, y) {
  return {
    type: UPDATE_RESIZE_ITEM_LEFT_BOTTOM,
    x, y
  }
}

export function endResizingItemLB(x, y) {
  return {
    type: END_RESIZE_ITEM_LEFT_BOTTOM,
    x, y
  }
}