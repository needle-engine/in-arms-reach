import { Behaviour, Renderer, serializable } from "@needle-tools/engine";
import { AlwaysDepth, EqualStencilFunc, MeshBasicMaterial, NotEqualStencilFunc } from "three";
import { ShaderMaterial } from "three/src/materials/ShaderMaterial";

// Documentation → https://docs.needle.tools/scripting

export class HoleCutter extends Behaviour {

    @serializable()
    doubleSided: boolean = false;

    private static DepthCutMat: ShaderMaterial | MeshBasicMaterial;
    private static DepthCutDoubleMat: ShaderMaterial | MeshBasicMaterial;

    onEnable() {

        if (!HoleCutter.DepthCutMat) {
            // HoleCutter.CreateMaterial_1();
            HoleCutter.CreateMaterial_2();

        }

        if (!HoleCutter.DepthCutDoubleMat) {
            HoleCutter.DepthCutDoubleMat = HoleCutter.DepthCutMat.clone();
            HoleCutter.DepthCutDoubleMat.side = 2;
        }

        let rend = this.gameObject.getComponentInChildren(Renderer)!;
        rend.sharedMaterial = this.doubleSided ? HoleCutter.DepthCutDoubleMat : HoleCutter.DepthCutMat;
        
        rend.gameObject.renderOrder = -90;
        
        // rend.setInstancingEnabled(false);
        // rend.setInstancingEnabled(true);
    }

    start() {
        let rend = this.gameObject.getComponentInChildren(Renderer)!;
        if(rend.handles && rend.handles.length >= 0) rend.handles[0].instancer.inst.renderOrder = -90;
    }

    static CreateMaterial_1() {
        HoleCutter.DepthCutMat = new ShaderMaterial(
            {
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

    static CreateMaterial_2() {
        HoleCutter.DepthCutMat = new MeshBasicMaterial();
        HoleCutter.DepthCutMat.depthFunc = AlwaysDepth;
        HoleCutter.DepthCutMat.depthWrite = true;
        HoleCutter.DepthCutMat.depthTest = true;
        HoleCutter.DepthCutMat.colorWrite = true;
        HoleCutter.DepthCutMat.onBeforeCompile = (shader) => {
            shader.extensionFragDepth = true;
            shader.fragmentShader = shader.fragmentShader.replace(
                `vec4 diffuseColor = vec4( diffuse, opacity );`,

                `gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
                gl_FragDepthEXT = 1.0;
                return;

                vec4 diffuseColor = vec4( diffuse, opacity );`
            );
        };
        HoleCutter.DepthCutMat.depthFunc = AlwaysDepth;
    }
}