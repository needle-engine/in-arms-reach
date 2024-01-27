import { serializable } from "@needle-tools/engine";
import { Behaviour, GameObject } from "@needle-tools/engine";
import { ShaderChunk, AgXToneMapping, Vector3, Quaternion } from "three";

// Documentation → https://docs.needle.tools/scripting

export class CustomDepthSensing extends Behaviour {

    @serializable()
    revealObject: GameObject;

    @serializable()
    scenePlacement: GameObject;

    private static _instance: CustomDepthSensing;
    public static get instance() {
        return this._instance;
    } 

    firstPlacement(worldPoint: Vector3, worldQuaternion: Quaternion) {
        // we just want to rotate this.
        // assumes that worldQuaternion is still aligned "upwards"
        this.scenePlacement.quaternion.copy(worldQuaternion);
        const wp = worldPoint.clone();
        wp.y = 0;
        this.scenePlacement.position.copy(wp);
        this.scenePlacement.matrixWorldNeedsUpdate = true;
    }

    awake() {
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