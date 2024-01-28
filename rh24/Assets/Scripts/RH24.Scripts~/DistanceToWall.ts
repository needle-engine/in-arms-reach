import { Behaviour, Context, GameObject, Gizmos, IPointerEventHandler, ObjectRaycaster, OrbitControls, PointerEventData, getParam } from "@needle-tools/engine";
import { CustomDepthSensing } from "./WallReveal";
import { Matrix4, Quaternion, Ray, Vector3 } from "three";
import { Renderer } from "@needle-tools/engine";
import { NeedleXRController } from "@needle-tools/engine";
import { syncInstantiate } from "@needle-tools/engine";
import { syncDestroy } from "@needle-tools/engine";
import { NEPointerEvent } from "@needle-tools/engine";

// Documentation → https://docs.needle.tools/scripting

const debug = getParam("debugrh");
const debugReach = getParam("reach");
const noSpawn = getParam("nospawn");

export class DistanceToWall extends Behaviour implements IPointerEventHandler {
    
    // 1: draw occlusion
    // 2: clean occlusion depth with "cleaner" objects that reset depth to far plane
    // 3: draw content of the world

    static hadFirstPlacement: boolean = false;

    static _instances: GameObject[] = [];

    onEnable() {
        // check if we have a raycaster, add one otherwise
        this.gameObject.addNewComponent(ObjectRaycaster);
        DistanceToWall._instances.push(this.gameObject);
    }

    onDisable() {
        DistanceToWall._instances = DistanceToWall._instances.filter(x => x !== this.gameObject);
    }

    onPointerEnter(args: PointerEventData) {
        if (debug) {
            console.log("Pointer Enter");
            Gizmos.DrawLine(args.point!, args.event.space.worldPosition, undefined, 5);
        }
    }

    /*
    onPointerMove(args: PointerEventData) {
        if (debug) {
            console.log("POINTER MOVE")
            if (!args.point) return;
            Gizmos.DrawLine(args.point, args.event.space.worldPosition);
        }
    }
    */

    onPointerExit(args: PointerEventData) {
        if (debug) {
            console.log("Pointer Exit");
        }
    }

    static cleanUpClones() {
        for (const clone of DistanceToWall.allClones) {
            syncDestroy(clone, Context.Current.connection, true);
        }

        DistanceToWall.allClones = [];
        DistanceToWall.hadFirstPlacement = false;

        Context.Current.domElement.dispatchEvent(new CustomEvent("reset-placement"));

        if (Context.Current.xr?.isVR) {
            CustomDepthSensing.instance.firstPlacement(new Vector3(), new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), Math.PI));
        }
    }

    private lastOrigin: any;
    private lastSpace: GameObject;
    onPointerDown(args: PointerEventData) {

        // We can completely disable this once we have proper "touch wall" logic in place
        if (!debugReach && args.event.origin instanceof NeedleXRController) return;
        if (!args.point) return;

        const orbit = GameObject.findObjectOfType(OrbitControls);
        if (orbit) orbit.enabled = false;
        
        this.isPlacing = true;
        DistanceToWall.lastPlacementPosition.copy(args.point);
        this.lastOrigin = args.event.origin;
        this.lastSpace = args.event.space as GameObject;

        if (debug) {
            console.log("POINTER CLICk")
            Gizmos.DrawLine(args.point, args.event.space.worldPosition, undefined, 5);
        }

        if (args.normal) {
            DistanceToWall.placeAt({ point: args.point, normal: args.normal, object: args.object as GameObject });
        }

        // spawn "cleanup" object on wall
        // the cleanup object does NOT use occlusion
        // the cleanup object 
    }

    static placeAt(args: { point: Vector3, normal: Vector3, object: GameObject }) {

        const obj = CustomDepthSensing.instance.revealObject;
        if (!obj) return;

        const normal = args.normal.clone();
        // transform normal direction to world space
        const worldRotation = args.object.worldQuaternion;
        normal.applyQuaternion(worldRotation);
        const normalOffsetPoint = args.point.clone().sub(normal);

        if (debug) {
            Gizmos.DrawLine(args.point, normalOffsetPoint, 0xff0000, 2);
        }
        const mat = new Matrix4();
        mat.lookAt(args.point, normalOffsetPoint, new Vector3(0,1,0));
        const worldRot = new Quaternion();
        worldRot.setFromRotationMatrix(mat);

        const randomAxisRotation = new Quaternion();
        randomAxisRotation.setFromAxisAngle(new Vector3(0,0,1), Math.random() * Math.PI * 2);

        worldRot.multiply(randomAxisRotation);

        // random rotation around forward axis
        // clone.rotateOnAxis(new Vector3(0, 0, 1), Math.random() * Math.PI * 2);
        // random scale between 0.6 and 1
        const scale = (Math.random() * 0.4 + 0.6) * 0.3;
        const scaleVec = new Vector3(scale, scale, scale);

        if (!noSpawn) {
            const clone = syncInstantiate(obj, {
                position: args.point,
                rotation: worldRot,
                scale: scaleVec,
                parent: CustomDepthSensing.rigGuid,
            }) as GameObject;

            if (!clone) return;

            this.allClones.push(clone);
        }

        if (!DistanceToWall.hadFirstPlacement) {
            DistanceToWall.hadFirstPlacement = true;
            CustomDepthSensing.instance.firstPlacement(args.point, worldRot);
        }
        // clone?.lookAt(normal.add(args.point));
    }

    static allClones: GameObject[] = [];
    private isPlacing: boolean = false;
    private static lastPlacementPosition: Vector3 = new Vector3();

    onPointerUp(args: PointerEventData) {
        this.isPlacing = false;

        const orbit = GameObject.findObjectOfType(OrbitControls);
        if (orbit) orbit.enabled = true;
    }

    private ray: Ray = new Ray();
    update() {

        if (!debugReach && this.lastOrigin instanceof NeedleXRController) return;


        // extra guard: if no pointer is down anymore, isPlacing should be false
        if (this.isPlacing && this.context.input.getPointerPressedCount() === 0) {
            console.error("oops");

            const orbit = GameObject.findObjectOfType(OrbitControls);
            if (orbit) orbit.enabled = true;

            this.isPlacing = false;
        }
        
        if (!this.isPlacing) return;
    
        const wallObjects = DistanceToWall._instances;

        // raycast into the scene
        if (this.lastOrigin instanceof NeedleXRController) {
            this.ray.copy(this.lastOrigin.ray);
        }
        else {
            this.ray.set(this.lastSpace.worldPosition, this.lastSpace.worldForward);
        }
        const intersections = this.context.physics.raycastFromRay(this.ray, { targets: wallObjects });
        if (intersections.length > 0) {
            const i = intersections[0];
            const p = i.point;
            const n = i.normal;
            
            if (debug)
                Gizmos.DrawLine(p, p.clone().add(n!), 0x00ff00, 2);

            DistanceToWall.checkNewPlacement({ point: p, normal: n!, object: i.object as GameObject });

            const dist = DistanceToWall.lastPlacementPosition.distanceTo(p);

            if (dist > 0.15) {
                DistanceToWall.placeAt({ point: p, normal: n!, object: i.object as GameObject });
                DistanceToWall.lastPlacementPosition.copy(p);
            }
        }
    }

    static checkNewPlacement(args: { point: Vector3, normal: Vector3, object: GameObject }) {
        
        const p = args.point;
        const n = args.normal;
        const i = args.object;

        const dist = DistanceToWall.lastPlacementPosition.distanceTo(p);

        if (dist > 0.15) {
            DistanceToWall.placeAt({ point: p, normal: n!, object: i as GameObject });
            DistanceToWall.lastPlacementPosition.copy(p);
        }
    }
}