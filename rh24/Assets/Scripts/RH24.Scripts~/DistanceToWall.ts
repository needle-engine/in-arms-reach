import { AssetReference, Behaviour, GameObject, Gizmos, IPointerEventHandler, ObjectRaycaster, PointerEventData, WebXRPlaneTracking, instantiate, serializable } from "@needle-tools/engine";
import { CustomDepthSensing } from "./WallReveal";

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
            args.object.localToWorld(normal);
            const clone = instantiate(obj, {
                position: args.point,
            });
            clone?.lookAt(normal.add(args.point));
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