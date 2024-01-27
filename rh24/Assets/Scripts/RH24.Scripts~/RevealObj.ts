import { Animator } from "@needle-tools/engine";
import { GameObject } from "@needle-tools/engine";
import { Behaviour, serializable } from "@needle-tools/engine";

// Documentation → https://docs.needle.tools/scripting

export class RevealObj extends Behaviour {

    onEnable() {
        const animator = this.gameObject.getComponent(Animator);
        if (animator) {
            animator!.reset();
            animator!.initializeRuntimeAnimatorController(true);
        }
    }
}