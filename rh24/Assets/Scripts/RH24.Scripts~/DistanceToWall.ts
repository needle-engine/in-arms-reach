import { Animator, AssetReference, Behaviour, GameObject, Gizmos, IPointerEventHandler, ObjectRaycaster, PointerEventData, WebXRPlaneTracking, instantiate, serializable } from "@needle-tools/engine";
import { CustomDepthSensing } from "./WallReveal";
import { Matrix4, Quaternion, Vector3 } from "three";

// Documentation → https://docs.needle.tools/scripting

export class DistanceToWall extends Behaviour implements IPointerEventHandler {
    
    // 1: draw occlusion
    // 2: clean occlusion depth with "cleaner" objects that reset depth to far plane
    // 3: draw content of the world

    private planes: WebXRPlaneTracking;

    onEnable() {
        this.planes = GameObject.findObjectOfType(WebXRPlaneTracking)!;
        // check if we have a raycaster, add one otherwise
        this.gameObject.addNewComponent(ObjectRaycaster);
    }

    onPointerEnter(args: PointerEventData) {
        console.log("Pointer Enter");
        Gizmos.DrawLine(args.point!, args.event.space.worldPosition, undefined, 5);
    }

    onPointerMove(args: PointerEventData) {
        console.log("POINTER MOVE")
        if (!args.point) return;
        Gizmos.DrawLine(args.point, args.event.space.worldPosition);
    }

    onPointerExit(args: PointerEventData) {
        console.log("Pointer Exit");
    }

    onPointerDown(args: PointerEventData) {
        console.log("POINTER CLICk")
        if (!args.point) return;
        Gizmos.DrawLine(args.point, args.event.space.worldPosition, undefined, 5);

        const obj = CustomDepthSensing.instance.revealObject;
        if (obj && args.normal) {
            const normal = args.normal.clone();
            // transform normal direction to world space
            const worldRotation = args.object.worldQuaternion;
            normal.applyQuaternion(worldRotation);
            const normalOffsetPoint = args.point.clone().sub(normal);

            console.log(args.point, normalOffsetPoint);
            Gizmos.DrawLine(args.point, normalOffsetPoint, 0xff0000, 2);

            const mat = new Matrix4();
            mat.lookAt(args.point, normalOffsetPoint, new Vector3(0,1,0));
            const worldRot = new Quaternion();
            worldRot.setFromRotationMatrix(mat);
            
            const clone = instantiate(obj, {
                position: args.point,
                rotation: worldRot,
            });

            if (!clone) return;

            GameObject.setActive(clone, true);

            // parent to wall for poor mans anchoring
            args.object.add(clone);

            // clone?.lookAt(normal.add(args.point));
        }

        // spawn "cleanup" object on wall
        // the cleanup object does NOT use occlusion
        // the cleanup object 
    }

    update() {
        // pointer has entered object, continue raycasting onto it
        // and spawn objects every N distance of movement

    }
}