import { Animator, AssetReference, Behaviour, GameObject, Gizmos, IPointerEventHandler, ObjectRaycaster, PointerEventData, WebXRPlaneTracking, getParam, instantiate, serializable } from "@needle-tools/engine";
import { CustomDepthSensing } from "./WallReveal";
import { Matrix4, Quaternion, Ray, Vector3 } from "three";

// Documentation → https://docs.needle.tools/scripting

const debug = getParam("debugrh");

export class DistanceToWall extends Behaviour implements IPointerEventHandler {
    
    // 1: draw occlusion
    // 2: clean occlusion depth with "cleaner" objects that reset depth to far plane
    // 3: draw content of the world

    private planes: WebXRPlaneTracking;
    private hadFirstPlacement: boolean = false;

    onEnable() {
        this.planes = GameObject.findObjectOfType(WebXRPlaneTracking)!;
        // check if we have a raycaster, add one otherwise
        this.gameObject.addNewComponent(ObjectRaycaster);
    }

    onPointerEnter(args: PointerEventData) {
        if (debug) {
            console.log("Pointer Enter");
            Gizmos.DrawLine(args.point!, args.event.space.worldPosition, undefined, 5);
        }
    }

    onPointerMove(args: PointerEventData) {
        if (debug) {
            console.log("POINTER MOVE")
            if (!args.point) return;
            Gizmos.DrawLine(args.point, args.event.space.worldPosition);
        }
    }

    onPointerExit(args: PointerEventData) {
        if (debug) {
            console.log("Pointer Exit");
        }
    }

    private lastSpace: GameObject;
    onPointerDown(args: PointerEventData) {
        if (!args.point) return;
        
        this.isPlacing = true;
        this.lastPlacementPosition.copy(args.point);
        this.lastSpace = args.event.space as GameObject;

        if (debug) {
            console.log("POINTER CLICk")
            Gizmos.DrawLine(args.point, args.event.space.worldPosition, undefined, 5);
        }

        
        if (args.normal) {
            this.placeAt({ point: args.point, normal: args.normal, object: args.object as GameObject });
        }

        // spawn "cleanup" object on wall
        // the cleanup object does NOT use occlusion
        // the cleanup object 
    }

    private placeAt(args: { point: Vector3, normal: Vector3, object: GameObject }) {

        const obj = CustomDepthSensing.instance.revealObject;
        if (!obj) return;

        const normal = args.normal.clone();
        // transform normal direction to world space
        const worldRotation = args.object.worldQuaternion;
        normal.applyQuaternion(worldRotation);
        const normalOffsetPoint = args.point.clone().sub(normal);

        if (debug) {
            console.log(args.point, normalOffsetPoint);
            Gizmos.DrawLine(args.point, normalOffsetPoint, 0xff0000, 2);
        }
        const mat = new Matrix4();
        mat.lookAt(args.point, normalOffsetPoint, new Vector3(0,1,0));
        const worldRot = new Quaternion();
        worldRot.setFromRotationMatrix(mat);
        
        const clone = instantiate(obj, {
            position: args.point,
            rotation: worldRot,
        });

        if (!clone) return;

        if (!this.hadFirstPlacement) {
            this.hadFirstPlacement = true;
            CustomDepthSensing.instance.firstPlacement(args.point, worldRot);
        }

        // random rotation around forward axis
        clone.rotateOnAxis(new Vector3(0, 0, 1), Math.random() * Math.PI * 2);
        // random scale between 0.6 and 1
        const scale = (Math.random() * 0.4 + 0.6) * 0.3;
        clone.scale.set(scale, scale, scale);

        if (!clone) return;

        GameObject.setActive(clone, true);

        // parent to wall for poor mans anchoring
        args.object.attach(clone);

        const animator = clone.getComponent(Animator);
        if (animator) {
            animator!.reset();
            animator!.initializeRuntimeAnimatorController(true);
        }
        // clone?.lookAt(normal.add(args.point));
    }

    private isPlacing: boolean = false;
    private lastPlacementPosition: Vector3 = new Vector3();

    onPointerUp(args: PointerEventData) {
        this.isPlacing = false;
    }

    private ray: Ray = new Ray();
    update() {
        if (!this.isPlacing) return;
    
        const allWalls = this.planes.trackedPlanes;
        const wallObjects = Array.from(allWalls).map(x => x.mesh!);

        // raycast into the scene
        this.ray.set(this.lastSpace!.worldPosition, this.lastSpace!.worldForward);
        const intersections = this.context.physics.raycastFromRay(this.ray, { targets: wallObjects });
        if (intersections.length > 0) {
            const i = intersections[0];
            const p = i.point;
            const n = i.normal;
            Gizmos.DrawLine(p, p.clone().add(n!), 0x00ff00, 2);

            const dist = this.lastPlacementPosition.distanceTo(p);
            if (dist > 0.15) {
                this.placeAt({ point: p, normal: n!, object: i.object as GameObject });
                this.lastPlacementPosition.copy(p);
            }
        }
    }
}