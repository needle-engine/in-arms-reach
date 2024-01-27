import { Behaviour, serializable } from "@needle-tools/engine";
import { AdditiveBlending, AlwaysDepth, GreaterDepth } from "three";

// Documentation → https://docs.needle.tools/scripting

export class HoleBorder extends Behaviour {
    
    onEnable() {
        // adjust render order and transparency mode for this material

        // AFTER walls but BEFORE holes
        this.gameObject.renderOrder = -80;
        this.gameObject.material.transparent = false;
        let mat = this.gameObject.material;
        this.gameObject.material = mat;
        mat.transparent = false;
        mat.depthFunc = GreaterDepth;
        // additive blending
        mat.blending = AdditiveBlending;
    }
}