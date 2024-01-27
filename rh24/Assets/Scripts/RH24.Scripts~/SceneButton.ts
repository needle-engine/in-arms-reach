import { Behaviour, GameObject, PointerEventData, serializable } from "@needle-tools/engine";

// Documentation → https://docs.needle.tools/scripting

export class SceneButton extends Behaviour {

    @serializable(GameObject)
    inner: GameObject;

    @serializable(GameObject)
    outer: GameObject;

    private innerScale: number = 1.0;
    private outerScale: number = 1.0;

    onEnable(): void {
        this.innerScale = this.inner.scale.x;
        this.outerScale = this.outer.scale.x;
    }

    onPointerEnter(args: PointerEventData) {
        const val = this.innerScale * 1.05;
        this.inner.scale.set(val, val, val);

        const val2 = this.outerScale * 1.12;
        this.outer.scale.set(val2, val2, val2);
    }

    onPointerExit(args: PointerEventData) {
        const val = this.innerScale;
        this.inner.scale.set(val, val, val);

        const val2 = this.outerScale;
        this.outer.scale.set(val2, val2, val2);
    }
}