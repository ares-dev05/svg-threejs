import {
  EVENT_LOADED,
  EVENT_LOADING,
  EVENT_ITEM_REMOVED,
  EVENT_NEW_PARAMETRIC_ITEM,
  EVENT_NEW_ITEM,
  EVENT_MODE_RESET,
  EVENT_EXTERNAL_FLOORPLAN_LOADED,
} from "../core/events.js";
import { EventDispatcher } from "three";
import { Floorplan } from "./floorplan.js";
import { Utils } from "../core/utils.js";
import { Factory } from "../items/factory.js";

/**
 * A Model is an abstract concept the has the data structuring a floorplan. It connects a {@link Floorplan} and a {@link Scene}
 */
export class Model extends EventDispatcher {
  /** Constructs a new model.
   * @param textureDir The directory containing the textures.
   */
  constructor() {
    super();
    this.__floorplan = new Floorplan();
    this.__roomItems = [];
    this.__svgData = [];
  }

  switchWireframe(flag) {
    this.scene.switchWireframe(flag);
  }

  loadSvgData(json) {
    this.__svgData = json;
  }

  loadSerialized(json) {
    console.log("== loadSerialized ==");
    // TODO: better documentation on serialization format.
    // TODO: a much better serialization format.
    this.dispatchEvent({ type: EVENT_LOADING, item: this });
    //      this.roomLoadingCallbacks.fire();

    var data = JSON.parse(json);

    // data = {
    //   floorplan: {
    //     version: "2.0.1a",
    //     corners: {
    //       a31e81d3: {
    //         x: 0,
    //         y: 0,
    //         elevation: 2.5,
    //       },
    //       "101940ce": {
    //         x: 5,
    //         y: 0,
    //         elevation: 2.5,
    //       },
    //       fa70876b: {
    //         x: 2.5,
    //         y: 2.5,
    //         elevation: 2.5,
    //       },
    //     },
    //     walls: [
    //       {
    //         corner1: "a31e81d3",
    //         corner2: "101940ce",
    //         frontTexture: {
    //           color: "#FFFFFF",
    //           repeat: 300,
    //           normalmap:
    //             "textures/Wall/Brick_Wall_017_SD/Brick_Wall_017_normal.jpg",
    //           roughnessmap:
    //             "textures/Wall/Brick_Wall_017_SD/Brick_Wall_017_roughness.jpg",
    //           colormap:
    //             "textures/Wall/Brick_Wall_017_SD/Brick_Wall_017_basecolor.jpg",
    //           ambientmap:
    //             "textures/Wall/Brick_Wall_017_SD/Brick_Wall_017_ambientOcclusion.jpg",
    //           bumpmap:
    //             "textures/Wall/Brick_Wall_017_SD/Brick_Wall_017_height.png",
    //           emissive: "#000000",
    //           reflective: 0.5,
    //           shininess: 0.5,
    //         },
    //         backTexture: {
    //           color: "#FFFFFF",
    //           repeat: 300,
    //           normalmap:
    //             "textures/Wall/Brick_Wall_017_SD/Brick_Wall_017_normal.jpg",
    //           roughnessmap:
    //             "textures/Wall/Brick_Wall_017_SD/Brick_Wall_017_roughness.jpg",
    //           colormap:
    //             "textures/Wall/Brick_Wall_017_SD/Brick_Wall_017_basecolor.jpg",
    //           ambientmap:
    //             "textures/Wall/Brick_Wall_017_SD/Brick_Wall_017_ambientOcclusion.jpg",
    //           bumpmap:
    //             "textures/Wall/Brick_Wall_017_SD/Brick_Wall_017_height.png",
    //           emissive: "#000000",
    //           reflective: 0.5,
    //           shininess: 0.5,
    //         },
    //         wallType: "STRAIGHT",
    //         a: {
    //           x: 1000000000000000000000000000000,
    //           y: 1000000000000000000000000000000,
    //         },
    //         b: { x: 0, y: 0 },
    //         thickness: 0.2,
    //       },
    //       {
    //         corner1: "101940ce",
    //         corner2: "fa70876b",
    //         frontTexture: {
    //           color: "#FFFFFF",
    //           repeat: 300,
    //           normalmap:
    //             "textures/Wall/Brick_Wall_017_SD/Brick_Wall_017_normal.jpg",
    //           roughnessmap:
    //             "textures/Wall/Brick_Wall_017_SD/Brick_Wall_017_roughness.jpg",
    //           colormap:
    //             "textures/Wall/Brick_Wall_017_SD/Brick_Wall_017_basecolor.jpg",
    //           ambientmap:
    //             "textures/Wall/Brick_Wall_017_SD/Brick_Wall_017_ambientOcclusion.jpg",
    //           bumpmap:
    //             "textures/Wall/Brick_Wall_017_SD/Brick_Wall_017_height.png",
    //           emissive: "#000000",
    //           reflective: 0.5,
    //           shininess: 0.5,
    //         },
    //         backTexture: {
    //           color: "#FFFFFF",
    //           repeat: 300,
    //           normalmap:
    //             "textures/Wall/Brick_Wall_017_SD/Brick_Wall_017_normal.jpg",
    //           roughnessmap:
    //             "textures/Wall/Brick_Wall_017_SD/Brick_Wall_017_roughness.jpg",
    //           colormap:
    //             "textures/Wall/Brick_Wall_017_SD/Brick_Wall_017_basecolor.jpg",
    //           ambientmap:
    //             "textures/Wall/Brick_Wall_017_SD/Brick_Wall_017_ambientOcclusion.jpg",
    //           bumpmap:
    //             "textures/Wall/Brick_Wall_017_SD/Brick_Wall_017_height.png",
    //           emissive: "#000000",
    //           reflective: 0.5,
    //           shininess: 0.5,
    //         },
    //         wallType: "STRAIGHT",
    //         a: { x: 0, y: 0 },
    //         b: { x: 0, y: 0 },
    //         thickness: 0.2,
    //       },
    //       {
    //         corner1: "fa70876b",
    //         corner2: "a31e81d3",
    //         frontTexture: {
    //           color: "#FFFFFF",
    //           repeat: 300,
    //           normalmap:
    //             "textures/Wall/Brick_Wall_017_SD/Brick_Wall_017_normal.jpg",
    //           roughnessmap:
    //             "textures/Wall/Brick_Wall_017_SD/Brick_Wall_017_roughness.jpg",
    //           colormap:
    //             "textures/Wall/Brick_Wall_017_SD/Brick_Wall_017_basecolor.jpg",
    //           ambientmap:
    //             "textures/Wall/Brick_Wall_017_SD/Brick_Wall_017_ambientOcclusion.jpg",
    //           bumpmap:
    //             "textures/Wall/Brick_Wall_017_SD/Brick_Wall_017_height.png",
    //           emissive: "#000000",
    //           reflective: 0.5,
    //           shininess: 0.5,
    //         },
    //         backTexture: {
    //           color: "#FFFFFF",
    //           repeat: 300,
    //           normalmap:
    //             "textures/Wall/Brick_Wall_017_SD/Brick_Wall_017_normal.jpg",
    //           roughnessmap:
    //             "textures/Wall/Brick_Wall_017_SD/Brick_Wall_017_roughness.jpg",
    //           colormap:
    //             "textures/Wall/Brick_Wall_017_SD/Brick_Wall_017_basecolor.jpg",
    //           ambientmap:
    //             "textures/Wall/Brick_Wall_017_SD/Brick_Wall_017_ambientOcclusion.jpg",
    //           bumpmap:
    //             "textures/Wall/Brick_Wall_017_SD/Brick_Wall_017_height.png",
    //           emissive: "#000000",
    //           reflective: 0.5,
    //           shininess: 0.5,
    //         },
    //         wallType: "STRAIGHT",
    //         a: { x: 0, y: 0 },
    //         b: { x: 0, y: 0 },
    //         thickness: 0.2,
    //       },
    //     ],
    //     rooms: {
    //       "a31e81d3,101940ce,fa70876b": { name: "A New Room" },
    //     },
    //     wallTextures: [],
    //     floorTextures: {},
    //     newFloorTextures: {
    //       "101940ce,a31e81d3,fa70876b": {
    //         color: "#FFFFFF",
    //         emissive: "#181818",
    //         repeat: 300,
    //         ambientmap:
    //           "textures/Floor/Marble_Tiles_001/Marble_Tiles_001_ambientOcclusion.jpg",
    //         colormap:
    //           "textures/Floor/Marble_Tiles_001/Marble_Tiles_001_basecolor.jpg",
    //         roughnessmap:
    //           "textures/Floor/Marble_Tiles_001/Marble_Tiles_001_roughness.jpg",
    //         normalmap:
    //           "textures/Floor/Marble_Tiles_001/Marble_Tiles_001_normal.jpg",
    //         reflective: 0.5,
    //         shininess: 0.5,
    //       },
    //     },
    //     carbonSheet: {},
    //     boundary: {
    //       points: [],
    //       style: {
    //         type: "color",
    //         color: "#00FF00",
    //         repeat: 50,
    //         colormap: null,
    //       },
    //     },
    //     units: "m",
    //   },
    //   items: [],
    // };
    console.log("= data", data);

    this.newDesign(data.floorplan, data.items);
    this.dispatchEvent({ type: EVENT_LOADED, item: this });
  }

  loadLockedSerialized(json) {
    var data = JSON.parse(json);
    this.floorplan.loadLockedFloorplan(data.floorplan);
    this.dispatchEvent({ type: EVENT_EXTERNAL_FLOORPLAN_LOADED, item: this });
  }

  exportSerialized() {
    console.log("== exportSerialized ==");
    let floorplanJSON = this.floorplan.saveFloorplan();
    let roomItemsJSON = [];
    this.__roomItems.forEach((item) => {
      // item.updateMetadataExplicit();
      roomItemsJSON.push(item.metadata);
    });
    var room = { floorplan: floorplanJSON, items: roomItemsJSON };
    return JSON.stringify(room);
  }

  newDesign(floorplan, items) {
    this.__roomItems = [];
    this.floorplan.loadFloorplan(floorplan);
    for (let i = 0; i < items.length; i++) {
      let itemMetaData = items[i];
      let itemType = itemMetaData.itemType;
      let item = new (Factory.getClass(itemType))(
        itemMetaData,
        this,
        itemMetaData.id
      );
      this.__roomItems.push(item);
    }
  }

  reset() {
    this.floorplan.reset();
    this.__roomItems.length = 0;
    this.dispatchEvent({ type: EVENT_MODE_RESET });
  }

  /** Gets the items.
   * @returns The items.
   */
  getItems() {
    return this.__roomItems;
  }

  /** Gets the count of items.
   * @returns The count.
   */
  itemCount() {
    return this.__roomItems.length;
  }

  /** Removes all items. */
  clearItems() {
    let scope = this;
    this.__roomItems.forEach((item) => {
      scope.removeItem(item, false);
    });
    this.__roomItems = [];
  }

  /**
   * Removes an item.
   * @param item The item to be removed.
   * @param dontRemove If not set, also remove the item from the items list.
   */
  removeItem(item, keepInList) {
    // use this for item meshes
    this.remove(item, keepInList);
    this.dispatchEvent({ type: EVENT_ITEM_REMOVED, item: item });
  }

  /** Removes a non-item, basically a mesh, from the scene.
   * @param mesh The mesh to be removed.
   */
  remove(roomItem, keepInList) {
    keepInList = keepInList || false;
    if (!keepInList) {
      roomItem.destroy();
      Utils.removeValue(this.__roomItems, roomItem);
    }
  }

  /**
   * Creates an item and adds it to the scene.
   * @param itemType The type of the item given by an enumerator.
   * @param fileName The name of the file to load.
   * @param metadata TODO
   * @param position The initial position.
   * @param rotation The initial rotation around the y axis.
   * @param scale The initial scaling.
   * @param fixed True if fixed.
   * @param newItemDefinitions - Object with position and 'edge' attribute if it is a wall item
   */
  addItemByMetaData(metadata) {
    //TODO
    this.dispatchEvent({ type: EVENT_NEW_ITEM, item: null });
  }
  addItem(item) {
    this.__roomItems.push(item);
    this.dispatchEvent({ type: EVENT_NEW_ITEM, item: item });
  }

  get roomItems() {
    return this.__roomItems;
  }

  get floorplan() {
    return this.__floorplan;
  }
}
