import { Item } from '../class/export';
import { history } from '../utils/export';
import {
  SELECT_TOOL_DRAWING_ITEM,
  UPDATE_DRAWING_ITEM,
  END_DRAWING_ITEM,
  BEGIN_DRAGGING_ITEM,
  UPDATE_DRAGGING_ITEM,
  END_DRAGGING_ITEM,
  BEGIN_ROTATING_ITEM,
  UPDATE_ROTATING_ITEM,
  END_ROTATING_ITEM,
  SELECT_ITEM,
  BEGIN_RESIZE_ITEM_RIGHT_BOTTOM,
  UPDATE_RESIZE_ITEM_RIGHT_BOTTOM,
  END_RESIZE_ITEM_RIGHT_BOTTOM,
  BEGIN_RESIZE_ITEM_RIGHT_TOP,
  UPDATE_RESIZE_ITEM_RIGHT_TOP,
  END_RESIZE_ITEM_RIGHT_TOP,
  BEGIN_RESIZE_ITEM_LEFT_BOTTOM,
  UPDATE_RESIZE_ITEM_LEFT_BOTTOM,
  END_RESIZE_ITEM_LEFT_BOTTOM,
  BEGIN_RESIZE_ITEM_LEFT_TOP,
  UPDATE_RESIZE_ITEM_LEFT_TOP,
  END_RESIZE_ITEM_LEFT_TOP,
} from '../constants';

export default function (state, action) {
  switch (action.type) {
    case SELECT_ITEM:
      return Item.select(state, action.layerID, action.itemID).updatedState;

    case SELECT_TOOL_DRAWING_ITEM:
      state = state.merge({ sceneHistory: history.historyPush(state.sceneHistory, state.scene) });
      return Item.selectToolDrawingItem(state, action.sceneComponentType).updatedState;

    case UPDATE_DRAWING_ITEM:
      return Item.updateDrawingItem(state, action.layerID, action.x, action.y).updatedState;

    case END_DRAWING_ITEM:
      state = state.merge({ sceneHistory: history.historyPush(state.sceneHistory, state.scene) });
      return Item.endDrawingItem(state, action.layerID, action.x, action.y).updatedState;

    case BEGIN_DRAGGING_ITEM:
      state = state.merge({ sceneHistory: history.historyPush(state.sceneHistory, state.scene) });
      return Item.beginDraggingItem(state, action.layerID, action.itemID, action.x, action.y).updatedState;

    case UPDATE_DRAGGING_ITEM:
      return Item.updateDraggingItem(state, action.x, action.y).updatedState;

    case END_DRAGGING_ITEM:
      state = state.merge({ sceneHistory: history.historyPush(state.sceneHistory, state.scene) });
      return Item.endDraggingItem(state, action.x, action.y).updatedState;

    case BEGIN_ROTATING_ITEM:
      state = state.merge({ sceneHistory: history.historyPush(state.sceneHistory, state.scene) });
      return Item.beginRotatingItem(state, action.layerID, action.itemID, action.x, action.y).updatedState;

    case BEGIN_RESIZE_ITEM_RIGHT_BOTTOM:
      state = state.merge({ sceneHistory: history.historyPush(state.sceneHistory, state.scene) });
      return Item.beginResizingItemRB(state, action.layerID, action.itemID, action.x, action.y).updatedState;

    case UPDATE_RESIZE_ITEM_RIGHT_BOTTOM:
      return Item.updateResizingItemRB(state, action.x, action.y).updatedState;

    case END_RESIZE_ITEM_RIGHT_BOTTOM:
      state = state.merge({ sceneHistory: history.historyPush(state.sceneHistory, state.scene) });
      return Item.endResizingItemRB(state, action.x, action.y).updatedState;

    case BEGIN_RESIZE_ITEM_RIGHT_TOP:
      state = state.merge({ sceneHistory: history.historyPush(state.sceneHistory, state.scene) });
      return Item.beginResizingItemRT(state, action.layerID, action.itemID, action.x, action.y).updatedState;

    case UPDATE_RESIZE_ITEM_RIGHT_TOP:
      return Item.updateResizingItemRT(state, action.x, action.y).updatedState;

    case END_RESIZE_ITEM_RIGHT_TOP:
      state = state.merge({ sceneHistory: history.historyPush(state.sceneHistory, state.scene) });
      return Item.endResizingItemRT(state, action.x, action.y).updatedState;

    case BEGIN_RESIZE_ITEM_LEFT_TOP:
      state = state.merge({ sceneHistory: history.historyPush(state.sceneHistory, state.scene) });
      return Item.beginResizingItemLT(state, action.layerID, action.itemID, action.x, action.y).updatedState;

    case UPDATE_RESIZE_ITEM_LEFT_TOP:
      return Item.updateResizingItemLT(state, action.x, action.y).updatedState;

    case END_RESIZE_ITEM_LEFT_TOP:
      state = state.merge({ sceneHistory: history.historyPush(state.sceneHistory, state.scene) });
      return Item.endResizingItemLT(state, action.x, action.y).updatedState;

    case BEGIN_RESIZE_ITEM_LEFT_BOTTOM:
      state = state.merge({ sceneHistory: history.historyPush(state.sceneHistory, state.scene) });
      return Item.beginResizingItemLB(state, action.layerID, action.itemID, action.x, action.y).updatedState;

    case UPDATE_RESIZE_ITEM_LEFT_BOTTOM:
      return Item.updateResizingItemLB(state, action.x, action.y).updatedState;

    case END_RESIZE_ITEM_LEFT_BOTTOM:
      state = state.merge({ sceneHistory: history.historyPush(state.sceneHistory, state.scene) });
      return Item.endResizingItemLB(state, action.x, action.y).updatedState;

    case UPDATE_ROTATING_ITEM:
      return Item.updateRotatingItem(state, action.x, action.y).updatedState;

    case END_ROTATING_ITEM:
      state = state.merge({ sceneHistory: history.historyPush(state.sceneHistory, state.scene) });
      return Item.endRotatingItem(state, action.x, action.y).updatedState;

    default:
      return state;
  }
}
