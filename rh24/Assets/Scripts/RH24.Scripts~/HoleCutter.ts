import { Behaviour, serializable } from "@needle-tools/engine";
import { AlwaysDepth, MeshBasicMaterial } from "three";
import { ShaderMaterial } from "three/src/materials/ShaderMaterial";

// Documentation → https://docs.needle.tools/scripting

export class HoleCutter extends Behaviour {
    
    private static DepthCutMat: ShaderMaterial;

    onEnable() {

        // TODO do this for all children?

        if (!HoleCutter.DepthCutMat) {
            HoleCutter.DepthCutMat = new ShaderMaterial({
                depthWrite: true,
                depthTest: true,
                depthFunc: AlwaysDepth,
                colorWrite: true,
                fragmentShader: `
                    void main() {
                        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
                        gl_FragDepthEXT = 1.0;
                    }
                `,
            });
            HoleCutter.DepthCutMat.extensions.fragDepth = true;
        }

        this.gameObject.material = HoleCutter.DepthCutMat;
        this.gameObject.renderOrder = -90;
    }
}