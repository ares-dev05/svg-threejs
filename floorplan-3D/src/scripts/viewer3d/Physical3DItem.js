import {
    Mesh, FontLoader, Line, TextGeometry, BufferGeometry, Box3, MathUtils, Group, Object3D,
    ExtrudeBufferGeometry, BoundingBoxHelper, Vector3, VertexColors, ArrowHelper, AxesHelper,
    SphereGeometry, MeshBasicMaterial, Matrix4, sRGBEncoding, LinearEncoding, PointLightHelper,
    SpotLight, PointLight, SpotLightHelper,TextureLoader,RepeatWrapping,MeshPhongMaterial, Plane
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { EVENT_ITEM_LOADED, EVENT_ITEM_LOADING, EVENT_UPDATED, EVENT_PARAMETRIC_GEOMETRY_UPATED } from "../core/events";
import { Utils } from "../core/utils"
import { BoxBufferGeometry, LineBasicMaterial, LineSegments, EdgesGeometry, ObjectLoader } from "three";
import { Dimensioning } from '../core/dimensioning.js';
import { FloorMaterial3D } from "../materials/FloorMaterial3D";
import {ConfigurationHelper} from '../helpers/ConfigurationHelper';
import gsap from 'gsap';
import { Vector2 } from "three/build/three.module";
import { WallItem } from "../items/wall_item";
import { InWallItem } from "../items/in_wall_item";
// import { Group } from "three/build/three.module";

export class Physical3DItem extends Mesh {
    constructor(itemModel, opts) {
        super();
        this.__itemModel = itemModel;
        this.__box = null;
        this.castShadow = true;
        this.receiveShadow = true;
        this.__center = null;
        this.__size = null;
        this.__itemType = null;
        this.__selected = false;
        this.__currentPosition = new Vector3();
        /** Show rotate option in context menu */
        this.allowRotate = true;
        this.halfSize = this.__itemModel.halfSize;//new Vector3(0, 0, 0);
        this.__options = opts;
        this.__selectedMaterial = new LineBasicMaterial({ color: 0x0000F0, linewidth: 2 });
        this.__boxhelper = new LineSegments(new EdgesGeometry(new BoxBufferGeometry(1, 1, 1)), this.__selectedMaterial);
        this.__pointLightHelper = null;
        this.__spotLightHelper = null;
        this.__customIntersectionPlanes = []; // Useful for intersecting only wall planes, only floorplanes, only ceiling planes etc
        this.configurationHelper = new ConfigurationHelper();
        this.__gltfLoader = new GLTFLoader();
        this.__gltfLoadingProgressEvent = this.__gltfLoadingProgress.bind(this);
        this.__gltfLoadedEvent = this.__gltfLoaded.bind(this);
        this.__itemUpdatedEvent = this.__itemUpdated.bind(this);
        this.__parametricGeometryUpdateEvent = this.__parametricGeometryUpdate.bind(this);

        this.__itemModel.addEventListener(EVENT_UPDATED, this.__itemUpdatedEvent);
        this.add(this.__boxhelper);
        this.selected = false;
        this.position.copy(this.__itemModel.position);
        if (this.__itemModel.isParametric) {
            this.__createParametricItem();
        } else {
            this.__loadItemModel();
        }
    }


    objectHalfSize(geometry) {
        geometry.computeBoundingBox();
        let objectBox = geometry.boundingBox.clone();
        return objectBox.max.clone().sub(objectBox.min).divideScalar(2);
    }

    __parametricGeometryUpdate(evt) {
        let mLocal = new Matrix4().getInverse(this.matrixWorld);
        this.__loadedItem.geometry = this.__itemModel.parametricClass.geometry;
        this.parent.needsUpdate = true;

        this.__box = this.__loadedItem.geometry.boundingBox.clone(); //new Box3().setFromObject(this.__loadedItem);
        this.__center = this.__box.getCenter(new Vector3());
        this.__size = this.__box.getSize(new Vector3());
        let localCenter = this.__center.clone().applyMatrix4(mLocal);
        let m = new Matrix4();
        m = m.makeTranslation(-localCenter.x, -localCenter.y, -localCenter.z);

        this.__boxhelper.geometry = new EdgesGeometry(new BoxBufferGeometry(this.__size.x, this.__size.y, this.__size.z));
        // this.__boxhelper.geometry.applyMatrix4(m);

        this.__boxhelper.rotation.x = this.__itemModel.combinedRotation.x;
        this.__boxhelper.rotation.y = this.__itemModel.combinedRotation.y;
        this.__boxhelper.rotation.z = this.__itemModel.combinedRotation.z;
    }

    __itemUpdated(evt) {
        let scope = this;
        let duration = 0.25;
        if (!scope.parent) {
            return;
        }
        function __tinyUpdate() {
            if (scope.parent) {
                scope.parent.needsUpdate = true;
            }
        }

        if (!this.__itemModel.offlineUpdate) {
            if (evt.property === 'position') {
                this.position.set(this.__itemModel.position.x, this.__itemModel.position.y, this.__itemModel.position.z);
                // gsap.to(this.position, { duration: duration, x: this.__itemModel.position.x, onUpdate: __tinyUpdate });
                // gsap.to(this.position, { duration: duration, y: this.__itemModel.position.y });
                // gsap.to(this.position, { duration: duration, z: this.__itemModel.position.z });
            }
            if (evt.property === 'rotation') {
                gsap.to(this.__loadedItem.rotation, { duration: duration, x: this.__itemModel.rotation.x, onUpdate: __tinyUpdate });
                gsap.to(this.__loadedItem.rotation, { duration: duration, y: this.__itemModel.rotation.y });
                gsap.to(this.__loadedItem.rotation, { duration: duration, z: this.__itemModel.rotation.z });
                gsap.to(this.__boxhelper.rotation, { duration: duration, x: this.__itemModel.rotation.x });
                gsap.to(this.__boxhelper.rotation, { duration: duration, y: this.__itemModel.rotation.y });
                gsap.to(this.__boxhelper.rotation, { duration: duration, z: this.__itemModel.rotation.z });
            }
             if (evt.property === 'innerRotation') {
                if (this.__loadedItem) {
                    gsap.to(this.__loadedItem.rotation, { duration: duration, x: this.__itemModel.innerRotation.x, onUpdate: __tinyUpdate });
                    gsap.to(this.__loadedItem.rotation, { duration: duration, y: this.__itemModel.innerRotation.y });
                    gsap.to(this.__loadedItem.rotation, { duration: duration, z: this.__itemModel.innerRotation.z });
                }
                gsap.to(this.__boxhelper.rotation, { duration: duration, x: this.__itemModel.innerRotation.x });
                gsap.to(this.__boxhelper.rotation, { duration: duration, y: this.__itemModel.innerRotation.y });
                gsap.to(this.__boxhelper.rotation, { duration: duration, z: this.__itemModel.innerRotation.z });
            }
                
        } else {
            if (evt.property === 'position') {
                this.position.set(this.__itemModel.position.x, this.__itemModel.position.y, this.__itemModel.position.z);
            }
          
            
            if (evt.property === 'innerRotation') {
                if (this.__loadedItem) {
                    this.__loadedItem.rotation.set(this.__itemModel.innerRotation.x, this.__itemModel.innerRotation.y, this.__itemModel.innerRotation.z);
                }
                this.__boxhelper.rotation.set(this.__itemModel.innerRotation.x, this.__itemModel.innerRotation.y, this.__itemModel.innerRotation.z);                               
            }
            if (evt.property === 'rotation') {
                if (this.__loadedItem) {
                    this.__loadedItem.rotation.set(this.__itemModel.rotation.x, this.__itemModel.rotation.y, this.__itemModel.rotation.z);
                }
                this.__boxhelper.rotation.set(this.__itemModel.rotation.x, this.__itemModel.rotation.y, this.__itemModel.rotation.z);
            }
        }
        if (evt.property === 'visible') {
            this.visible = this.__itemModel.visible;
        }
    }

    __initializeChildItem() {       
        this.name = 'Physical_' + this.__itemModel.__metadata.itemName;
        this.__box = new Box3().setFromObject(this.__loadedItem);
        
        this.__center = this.__box.getCenter(new Vector3());
        this.__size = this.__box.getSize(new Vector3());
        //this.__itemModel.__metadata.size=this.__size.toArray();
        this.__itemType = this.__itemModel.__metadata.itemType;
        this.__loadedItem.castShadow = true;
        this.__loadedItem.receiveShadow = true;

        this.__boxhelper.geometry = new EdgesGeometry(new BoxBufferGeometry(this.__size.x, this.__size.y, this.__size.z));
        this.__loadedItem.rotation.x = this.__itemModel.innerRotation.x;
        this.__loadedItem.rotation.y = this.__itemModel.innerRotation.y;
        this.__loadedItem.rotation.z = this.__itemModel.innerRotation.z;

        this.__boxhelper.rotation.x = this.__itemModel.innerRotation.x;
        this.__boxhelper.rotation.y = this.__itemModel.innerRotation.y;
        this.__boxhelper.rotation.z = this.__itemModel.innerRotation.z;


        // this.__boxhelper.position.x = this.__loadedItem.position.x;
        // this.__boxhelper.position.y = this.__loadedItem.position.y;
        // this.__boxhelper.position.z = this.__loadedItem.position.z;


        if (this.__itemModel.__metadata.isLight) {
            this.__loadedItem.name = this.__itemModel.__metadata.itemName;
            this.parent.__light3d.push(this.__loadedItem);
        }

        this.geometry = new BoxBufferGeometry(this.__size.x, this.__size.y, this.__size.z, 1, 1, 1);

        this.geometry.computeBoundingBox();
        if (this.__itemModel.__metadata.custom != undefined) {
            this.position.y = this.geometry.boundingBox.max.y + 2;
        }
        if (this.__itemModel.__metadata.WallItem != undefined) {
            // debugger;
            this.position.y = this.__itemModel.__metadata.position[1];
        }
        // this.halfSize = this.objectHalfSize(this.geometry);
        this.material.visible = false;
        this.material.transparent = true;
        this.material.opacity = 0;
        this.userData.currentPosition = this.__currentPosition;
        // console.log(this);
        let scope = this;
        if (scope.parent) {
            scope.parent.needsUpdate = true;
        }
        // this.__boxhelper.update();
        if(this.__itemModel.__metadata.itemType==1){
            const axesHelper = new AxesHelper( 500 );
            //this.__loadedItem.add( axesHelper );
        }
        
        this.add(this.__loadedItem);
        this.dispatchEvent({ type: EVENT_UPDATED });
    }

    __loadItemModel() {

        this.__itemModel.name = this.__itemModel.__metadata.itemName || null;
        if (!this.__itemModel.modelURL || this.__itemModel.modelURL === undefined || this.__itemModel.modelURL === 'undefined') {
            return;
        }

        if (this.__loadedItem) {
            this.remove(this.__loadedItem);
        }

        this.__gltfLoader.load(this.__itemModel.modelURL, this.__gltfLoadedEvent, this.__gltfLoadingProgressEvent);

    }

    __gltfLoaded(gltfModel) {

        this.__itemModelglb = gltfModel;
        this.__loadedItem = gltfModel.scene;
        this.__loadedItem.castShadow = true;
        this.__loadedItem.receiveShadow = true;
        this.__loadedItem.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                if (child.material.map) child.material.map.anisotropy = 16;

            }
            if (child.material) {
                if (child.material.map) {
                    child.material.map.encoding = sRGBEncoding;
                }
            }
        });
        this.__initializeChildItem();       
        this.dispatchEvent({ type: EVENT_ITEM_LOADED });
    }

    __gltfLoadingProgress(xhr) {
        this.dispatchEvent({ type: EVENT_ITEM_LOADING, loaded: xhr.loaded, total: xhr.total, percent: (xhr.loaded / xhr.total) * 100, jsraw: xhr });
    }

    __createParametricItem() {
        let parametricData = this.__itemModel.parametricClass;
        if (parametricData) {
            this.__loadedItem = new Mesh(parametricData.geometry, parametricData.material);
            this.__itemModel.parametricClass.addEventListener(EVENT_PARAMETRIC_GEOMETRY_UPATED, this.__parametricGeometryUpdateEvent);
            this.__initializeChildItem();
            this.dispatchEvent({ type: EVENT_ITEM_LOADED });
        }
    }

    dispose() {
        this.__itemModel.dispose();
        this.__itemModel.removeEventListener(EVENT_UPDATED, this.__itemUpdatedEvent);
        this.parent.remove(this);
    }

    /**
     * 
     * @param {Vector3} position 
     * @param {Boolean} midPoints 
     * @param {Boolean} forWallItem 
     * @param {Boolean} noConversionTo2D 
     * @description Returns the plane that make up this item based on its size. For a floor item it returns
     * the plane on (x, z) coordinates. For a wall item depending on its orientation it will return the plane.
     * Also if the noConversionTo3D is true, it returns the plane on the wall in 3D.
     * @returns {Array} of {Vector2} or {Vector3} depending on noConversionTo2D
     */
    getItemPolygon(position=null, midPoints = false, forWallItem = false, noConversionTo2D=false){
        let coords = [];
        let c1 = new Vector3(-this.halfSize.x, (!forWallItem) ? 0 : -this.halfSize.y, (forWallItem) ? 0 : -this.halfSize.z);
        let c2 = new Vector3(this.halfSize.x, (!forWallItem) ? 0 : -this.halfSize.y, (forWallItem) ? 0 : -this.halfSize.z);
        let c3 = new Vector3(this.halfSize.x, (!forWallItem) ? 0 : this.halfSize.y, (forWallItem) ? 0 : this.halfSize.z);
        let c4 = new Vector3(-this.halfSize.x, (!forWallItem) ? 0 : this.halfSize.y, (forWallItem) ? 0 : this.halfSize.z);
        let midC1C2 = null;
        let midC2C3 = null;
        let midC3C4 = null;
        let midC4C1 = null;
        
        let transform = new Matrix4();
        position = position || this.__itemModel.position;

        if(forWallItem){
            transform.makeRotationY(this.__itemModel.rotation.y);
        }
        else{
            transform.makeRotationY(this.__itemModel.innerRotation.y);
        }        
        transform.setPosition(position);

        c1 = c1.applyMatrix4(transform);
        c2 = c2.applyMatrix4(transform);
        c3 = c3.applyMatrix4(transform);
        c4 = c4.applyMatrix4(transform);        
        
        if(forWallItem){
            coords.push(c1);        
            coords.push(c2);
            coords.push(c3);
            coords.push(c4);
        }
        else{
            coords.push(new Vector2(c1.x, c1.z));        
            coords.push(new Vector2(c2.x, c2.z));
            coords.push(new Vector2(c3.x, c3.z));
            coords.push(new Vector2(c4.x, c4.z));
        }        

        if(midPoints){
            midC1C2 = c1.clone().add(c2.clone().sub(c1).multiplyScalar(0.5));
            midC2C3 = c2.clone().add(c3.clone().sub(c2).multiplyScalar(0.5));
            midC3C4 = c3.clone().add(c4.clone().sub(c3).multiplyScalar(0.5));
            midC4C1 = c4.clone().add(c1.clone().sub(c4).multiplyScalar(0.5));
            if(forWallItem){
                coords.push(midC1C2);
                coords.push(midC2C3);
                coords.push(midC3C4);
                coords.push(midC4C1);
            }
            else{
                coords.push(new Vector2(midC1C2.x, midC1C2.z));
                coords.push(new Vector2(midC2C3.x, midC2C3.z));
                coords.push(new Vector2(midC3C4.x, midC3C4.z));
                coords.push(new Vector2(midC4C1.x, midC4C1.z));
            }            
        }

        if(forWallItem && !noConversionTo2D){
            return Utils.polygons2DFrom3D(coords);
        }
        else if(forWallItem && noConversionTo2D)
        {
            return coords;
        }
        return coords;
    }   

    getAlignedPositionForFloor(toAlignWith){
        function getCoordinate3D(selected, alignWith, position){
            let vector = null;
            selected = new Vector3(selected.x, position.y, selected.y);
            alignWith = new Vector3(alignWith.x, position.y, alignWith.y);
            vector = selected.clone().sub(position);
            return alignWith.clone().sub(vector);

        }
        let myPosition = this.__itemModel.position;
        let myPolygon2D = this.getItemPolygon(myPosition, true);
        let otherPolygon2D = toAlignWith.getItemPolygon(null, true);
        let minimalDistance = 10.0;//Set a threshold of 10 cms to check closest points
        let finalCoordinate3d = null;        
        myPolygon2D.forEach((coord) => {
            otherPolygon2D.forEach((otherCoord)=>{
                let distance = coord.clone().sub(otherCoord).length();
                if(distance < minimalDistance){   
                    finalCoordinate3d = getCoordinate3D(coord, otherCoord, myPosition);
                    minimalDistance = distance;
                }
            });
        });  
           
        return finalCoordinate3d;
    }

    getAlignedPositionForWall(toAlignWith){
        function getCoordinate3D(selected, alignWith, position){
            let vector = null;
            let newPosition = null;
            vector = selected.clone().sub(position);
            newPosition = alignWith.clone().sub(vector);
            return newPosition;
        }
        let myPosition = this.__itemModel.position;
        let myPolygon3D = this.getItemPolygon(null, true, true, true);
        let otherPolygon3D = toAlignWith.getItemPolygon(null, true, true, true);
        let minimalDistance = 9999999.0;//Set a threshold of 10 cms to check closest points
        let finalCoordinate3d = null;
        myPolygon3D.forEach((coord) => {
            otherPolygon3D.forEach((otherCoord)=>{
                let distance = coord.clone().sub(otherCoord).length();
                if(distance < minimalDistance){                    
                    finalCoordinate3d = getCoordinate3D(coord, otherCoord, myPosition);
                    minimalDistance = distance;
                }
            });
        });
        return finalCoordinate3d;
    }

    handleFloorItemsPositioning(coordinate3d, normal, intersectingPlane){
        let withinRoomBounds = false;
        let myPolygon2D = this.getItemPolygon(coordinate3d, false);
        let rooms = this.__itemModel.model.floorplan.getRooms();
        let i = 0;
        for (i = 0; i < rooms.length; i++) {
            let flag = Utils.polygonInsidePolygon(myPolygon2D, rooms[i].interiorCorners);
            if(flag){
                withinRoomBounds = true;
            }            
        }

        for (i = 0; i < this.parent.physicalRoomItems.length;i++){
            let otherObject = this.parent.physicalRoomItems[i];
            let otherPolygon2D = null;
            let flag = false;
            if(otherObject != this && !otherObject.itemModel.isWallDependent){ 
                otherPolygon2D = otherObject.polygon2D;
                flag = Utils.polygonOutsidePolygon(myPolygon2D, otherPolygon2D);
                if(!flag){
                    let alignedCoordinate = this.getAlignedPositionForFloor(otherObject);
                    if(alignedCoordinate){
                        coordinate3d = alignedCoordinate;
                    }                    
                    break;
                }
            }
        }
        if(withinRoomBounds){
            this.__itemModel.snapToPoint(coordinate3d, normal, intersectingPlane, this);
        }   
    }

    handleWallItemsPositioning(coordinate3d, normal, intersectingPlane){
        let myPolygon2D = this.getItemPolygon(coordinate3d, true, true);
        let i = 0;
        let myWallUUID = (this.itemModel.currentWall) ? this.itemModel.currentWall.uuid : null;
        // let plane = new Plane(normal);
        // let projectedPoint = new Vector3();
        for (i = 0; i < this.parent.physicalRoomItems.length;i++){
            let otherObject = this.parent.physicalRoomItems[i];
            let otherWallUUID = (otherObject.itemModel.isWallDependent && otherObject.itemModel.currentWall) ? otherObject.itemModel.currentWall.uuid: null;
            let otherPolygon2D = null;
            let flag = false;
            if(!myWallUUID || !otherWallUUID || myWallUUID != otherWallUUID){
                continue;
            }
            if(otherObject != this){
                otherPolygon2D = otherObject.polygon2D;
                flag = Utils.polygonOutsidePolygon(myPolygon2D, otherPolygon2D);
                if(!flag){
                    let alignedCoordinate = this.getAlignedPositionForWall(otherObject);
                    if(alignedCoordinate){
                        coordinate3d = alignedCoordinate;
                    }
                    break;
                }
            }
        }
        // plane.projectPoint(coordinate3d, projectedPoint);
        // console.log(coordinate3d, projectedPoint);
        this.__itemModel.snapToPoint(coordinate3d, normal, intersectingPlane, this);
    }

    snapToPoint(coordinate3d, normal, intersectingPlane) {
        if(this.itemModel.isWallDependent) {
            this.handleWallItemsPositioning(coordinate3d, normal, intersectingPlane);            
            return;
        }
        this.handleFloorItemsPositioning(coordinate3d, normal, intersectingPlane);
    }   

    snapToWall(coordinate3d, wall, wallEdge) {
        this.__itemModel.snapToWall(coordinate3d, wall, wallEdge);
    }

    get worldBox(){
        // return this.box.clone().applyMatrix4(this.__loadedItem.matrixWorld.clone().multiply(this.matrixWorld));
        return this.box.clone().applyMatrix4(this.matrixWorld);
    }

    get box(){
        return this.__box;
    }

    get selected() {
        return this.__selected;
    }

    set selected(flag) {
        this.__selected = flag;
        this.__boxhelper.visible = flag;    }

    set location(coordinate3d) {
        this.__itemModel.position = coordinate3d;
    }

    get location() {
        return this.__itemModel.position.clone();
    }

    get intersectionPlanes() {
        return this.__itemModel.intersectionPlanes;
    }

    get intersectionPlanes_wall() {
        return this.__itemModel.intersectionPlanes_wall;
    }

    get itemModel() {
        return this.__itemModel;
    }

    get polygon2D(){
        if(this.itemModel.isWallDependent){
            return this.getItemPolygon(null, false, true);
        }
        return this.getItemPolygon();
    }
}

/**
export class Physical3DItem {
    constructor(itemModel) {
        console.log(this);
        return new Proxy(new Physical3DItemNonProxy(itemModel), {
            get(target, name, receiver) {
                console.log('USING REFLECT.GET ', target);
                if (!Reflect.has(target, name) && !Reflect.has(target.itemModel, name)) {
                    return undefined;
                }
                if (Reflect.has(target, name)) {
                    return Reflect.get(target, name);
                }
                if (Reflect.has(target.itemModel, name)) {
                    return Reflect.get(target.itemModel, name);
                }
                return undefined;
            }
        });
    }
}
 */