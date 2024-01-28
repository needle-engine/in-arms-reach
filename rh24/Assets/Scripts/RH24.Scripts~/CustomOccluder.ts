import { Behaviour, serializable } from "@needle-tools/engine";
import { AlwaysStencilFunc, MeshBasicMaterial, ReplaceStencilOp, ShaderMaterial } from "three";

// Documentation → https://docs.needle.tools/scripting

export class CustomOccluder extends Behaviour {

    private static DepthCutMat: MeshBasicMaterial;

    onEnable() {

        if (!CustomOccluder.DepthCutMat) {
            CustomOccluder.DepthCutMat = new MeshBasicMaterial();
            const mat = CustomOccluder.DepthCutMat;
            mat.depthWrite = true;
            mat.stencilWrite = true;
            mat.colorWrite = false;
            mat.color.setRGB(1, 1, 1);
            mat.opacity = 0;

            mat.stencilWrite = true;
            mat.stencilRef = 1;
            mat.stencilFunc = AlwaysStencilFunc;
            mat.stencilZPass = ReplaceStencilOp;
        }

        this.gameObject.material = CustomOccluder.DepthCutMat;
        this.gameObject.renderOrder = -120;
    }
}