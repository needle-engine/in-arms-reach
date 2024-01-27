import { serializable } from "@needle-tools/engine";
import { XRRig } from "@needle-tools/engine";
import { Behaviour, GameObject } from "@needle-tools/engine";
import { ShaderChunk, AgXToneMapping, Vector3, Quaternion } from "three";

// Documentation → https://docs.needle.tools/scripting

export class CustomDepthSensing extends Behaviour {

    @serializable(GameObject)
    revealObject: GameObject;

    @serializable(GameObject)
    scenePlacement: GameObject;

    private static _instance: CustomDepthSensing;
    public static get instance() {
        return this._instance;
    } 

    onEnable() {
        GameObject.setActive(this.scenePlacement, false);
    }

    firstPlacement(worldPoint: Vector3, worldQuaternion: Quaternion) {

        if (!this.scenePlacement) return;

        // show our content on first wall touch
        GameObject.setActive(this.scenePlacement, true);

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

        ShaderChunk.occlusion_pars_fragment = ShaderChunk.occlusion_pars_fragment.replace(
            `#endif`,
            `
            
            
            #endif`
        );

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