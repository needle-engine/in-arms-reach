import { Context, Gizmos, NeedleXRController, getParam, serializable, syncDestroy } from "@needle-tools/engine";
import { NEPointerEvent } from "@needle-tools/engine";
import { XRRig } from "@needle-tools/engine";
import { Behaviour, GameObject } from "@needle-tools/engine";
import { DistanceToWall } from "./DistanceToWall.js";
import { ShaderChunk, AgXToneMapping, Vector3, Quaternion, Ray, MeshStandardMaterial, Mesh, BoxGeometry, Scene } from "three";
import { NeedleXREventArgs } from "@needle-tools/engine";

// Documentation → https://docs.needle.tools/scripting

const debugReach = getParam("reach");
const debug = getParam("debugrh");

export class CustomDepthSensing extends Behaviour {

    @serializable(GameObject)
    revealObject: GameObject;

    @serializable(GameObject)
    scenePlacement: GameObject;

    @serializable(GameObject)
    scenesRoot: GameObject;

    private static _instance: CustomDepthSensing;
    public static get instance() {
        return this._instance;
    } 

    onEnable() {
        GameObject.setActive(this.scenePlacement, false);
        this.context.input.addEventListener("pointermove", this.pointerMove.bind(this));
    }

    onEnterXR(args: NeedleXREventArgs) {
        if (args.xr.isVR) {
            // this.firstPlacement(new Vector3(), new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), 1 * Math.PI));
        }
    }

    onDisable(): void {
        // sync destroy all clones
        for (const clone of DistanceToWall.allClones) {
            syncDestroy(clone, this.context.connection, true);
        }

        DistanceToWall.allClones = [];
        DistanceToWall.hadFirstPlacement = false;
    
        this.context.domElement.dispatchEvent(new CustomEvent("reset-placement"));
    }
    
    private ray: Ray = new Ray();
    pointerMove(args: NEPointerEvent) {
        if (debugReach) return;
        // only makes sense for XR controllers / spatial controllers
        if (!(args.origin instanceof NeedleXRController)) return;
        if (!CustomDepthSensing._instance) return;

        // console.log(args.origin);

        // raycast into the scene
        if (args.origin instanceof NeedleXRController) {
            this.ray.copy(args.origin.ray);
            // move ray a bit back
            this.ray.origin.add(this.ray.direction.clone().multiplyScalar(-0.1));
        }
        else {
            this.ray.set(args.space.worldPosition, args.space.worldForward);
        }

        const wallObjects = DistanceToWall._instances;
        const intersections = this.context.physics.raycastFromRay(this.ray, { targets: wallObjects });
        
        if (intersections.length > 0) {
            const i = intersections[0];
            const p = i.point;
            const n2 = i.normal?.clone();
            const o = i.object as GameObject;
            
            if (n2)
                n2.applyQuaternion(o.worldQuaternion);

            // check how far from the wall we are
            const dist = p.distanceTo(this.ray.origin);
            // console.log ("measured distance", dist)

            // 10cm behind hand / 20cm in front of hand to accomodate for wall inaccuracies
            if (dist > 0.3) return; 

            if (debug)
                Gizmos.DrawLine(p, p.clone().add(n2!), 0xffff00, 2);

            DistanceToWall.checkNewPlacement({ point: p, normal: i.normal!, object: o, id: args.pointerId });
        }
    }

    firstPlacement(worldPoint: Vector3, worldQuaternion: Quaternion) {

        if (!this.scenePlacement) return;

        // show our content on first wall touch
        GameObject.setActive(this.scenePlacement, true);
        GameObject.setActive(this.scenesRoot, true);

        this.context.domElement.dispatchEvent(new CustomEvent("first-placement"));

        // only place when we're in XR
        if (!Context.Current.isInXR) return;

        // we just want to rotate this.
        // assumes that worldQuaternion is still aligned "upwards"
        this.scenePlacement.worldQuaternion = worldQuaternion;
        const wp = worldPoint.clone();
        wp.y = 0;
        this.scenePlacement.worldPosition = wp;
        this.scenePlacement.matrixWorldNeedsUpdate = true;

        // this is easier, just ensure it's looking away from us
        const camWP = this.context.mainCameraComponent!.worldPosition.clone();
        const ourWP = this.scenePlacement.worldPosition;
        camWP.y = ourWP.y;
        this.scenePlacement.lookAt(camWP);
        // rotate 180°
        this.scenePlacement.rotateY(Math.PI);
    }

    public static rigGuid: string = "";

    awake() {

        // find Rig
        const rig = GameObject.findObjectOfType(XRRig)?.gameObject;
        CustomDepthSensing.rigGuid = rig?.guid ?? "";

        CustomDepthSensing._instance = this;

        // adjust tonemapping if wanted
        this.context.renderer.toneMapping = AgXToneMapping;

        // Patch three.js shader chunks responsible for depth sensing.
        ShaderChunk.occlusion_fragment = ShaderChunk.occlusion_fragment.replace(
            // the line we're replacing – this just takes the existing occlusion value and fades objects out.
            `gl_FragColor *= 1.0 - occlusion;`,
            // our new code – draws an intersection line and fades the objects out just a bit, but not fully.
`
float depthMm = Depth_GetCameraDepthInMeters(depthColor, depthUv, arrayIndex);


// requires also patching ShaderChunk.occlusion_pars_fragment and adding some noise function
// float noise = snoise(gl_FragCoord.xy * 0.005);
// depthMm += noise * 0.002;

float absDistance = abs(assetDepthM - depthMm);
float v = 0.0025;
absDistance = saturate(v - absDistance) / v;

gl_FragColor.rgb += vec3(absDistance * 2.0, absDistance * 2.0, absDistance * 12.0);
gl_FragColor = mix(gl_FragColor, vec4(0.0, 0.0, 0.0, 0.0), occlusion * 0.7);

`);

    }
}