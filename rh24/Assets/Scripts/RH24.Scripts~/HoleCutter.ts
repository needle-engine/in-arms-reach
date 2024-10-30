import { Behaviour, InstancingHandler, Renderer, serializable } from "@needle-tools/engine";
import { DoubleSide } from "three";
import { AlwaysDepth, EqualStencilFunc, MeshBasicMaterial, NotEqualStencilFunc } from "three";
import { ShaderMaterial } from "three";

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
            HoleCutter.DepthCutDoubleMat = HoleCutter.makeMat();
            HoleCutter.DepthCutDoubleMat.side = DoubleSide;
        }

        let rend = this.gameObject.getComponentInChildren(Renderer)!;
        rend.sharedMaterial = this.doubleSided ? HoleCutter.DepthCutDoubleMat : HoleCutter.DepthCutMat;
        
        rend.gameObject.renderOrder = -90;
        
        // rend.setInstancingEnabled(false);
        // rend.setInstancingEnabled(true);
    }

    start() {
        let rend = this.gameObject.getComponentInChildren(Renderer)!;
        if (rend.instances) {
            for (const inst of rend.instances) {
                inst.renderer["_batchedMesh"].renderOrder = -90;
            }
        }
        // if(rend.handles && rend.handles.length >= 0) rend.handles[0].instancer.inst.renderOrder = -90;
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
        HoleCutter.DepthCutMat = this.makeMat();
    }

    static makeMat(): MeshBasicMaterial {
        const mat = new MeshBasicMaterial();
        mat.depthFunc = AlwaysDepth;
        mat.depthWrite = true;
        mat.depthTest = true;
        mat.colorWrite = true;
        mat.onBeforeCompile = (shader) => {
            shader.extensionFragDepth = true;
            shader.fragmentShader = shader.fragmentShader.replace(
                `vec4 diffuseColor = vec4( diffuse, opacity );`,

                `gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
                gl_FragDepthEXT = 1.0;
                return;

                vec4 diffuseColor = vec4( diffuse, opacity );`
            );
        };
        mat.depthFunc = AlwaysDepth;
        return mat;
    }
}