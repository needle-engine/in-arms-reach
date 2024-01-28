import { Behaviour, serializable } from "@needle-tools/engine";
import { AlwaysDepth, EqualStencilFunc, MeshBasicMaterial, NotEqualStencilFunc } from "three";
import { ShaderMaterial } from "three/src/materials/ShaderMaterial";

// Documentation → https://docs.needle.tools/scripting

export class HoleCutter extends Behaviour {
    
    @serializable()
    doubleSided: boolean = false;

    private static DepthCutMat: ShaderMaterial;
    private static DepthCutDoubleMat: ShaderMaterial;

    onEnable() {

        if (!HoleCutter.DepthCutMat) {
            HoleCutter.DepthCutMat = new ShaderMaterial({
                depthWrite: true,
                depthTest: true,
                depthFunc: AlwaysDepth,
                colorWrite: true,

                /*
                stencilRef: 1,
                stencilFunc: NotEqualStencilFunc,
                stencilWrite: true,
                */
                
                // TODO can we sample an animated cutout texture of sorts here? in worldspace?
                fragmentShader: `
                    void main() {
                        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
                        gl_FragDepthEXT = 1.0;
                    }
                `,
            });
            HoleCutter.DepthCutMat.extensions.fragDepth = true;
        }

        if (!HoleCutter.DepthCutDoubleMat) {
            HoleCutter.DepthCutDoubleMat = HoleCutter.DepthCutMat.clone();
            HoleCutter.DepthCutDoubleMat.side = 2;
        }

        this.gameObject.material = this.doubleSided ? HoleCutter.DepthCutDoubleMat : HoleCutter.DepthCutMat;
        this.gameObject.renderOrder = -90;
    }
}