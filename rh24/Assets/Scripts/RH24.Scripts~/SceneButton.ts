import { Behaviour, GameObject, PointerEventData, serializable, EventList, ObjectRaycaster } from "@needle-tools/engine";

// Documentation → https://docs.needle.tools/scripting

export class SceneButton extends Behaviour {

    @serializable(GameObject)
    inner: GameObject;

    @serializable(GameObject)
    outer: GameObject;

    @serializable(EventList)
    triggerEventCustom? : EventList;

    private innerScale: number = 1.0;
    private outerScale: number = 1.0;

    onEnable(): void {
        this.innerScale = this.inner.scale.x;
        this.outerScale = this.outer.scale.x;
        
        // Ensure ObjectRaycaster exists for pointer events
        if (!this.gameObject.getComponent(ObjectRaycaster)) {
            console.log("SceneButton: Adding ObjectRaycaster to", this.gameObject.name);
            this.gameObject.addComponent(ObjectRaycaster);
        } else {
            console.log("SceneButton: ObjectRaycaster already exists on", this.gameObject.name);
        }
    }

     onPointerEnter(args: PointerEventData) {
        console.log("SceneButton: onPointerEnter on", this.gameObject.name);
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
    
    onPointerDown(args: PointerEventData) {
        console.log("SceneButton: onPointerDown triggered on", this.gameObject.name);
        this.runTriggerEvent();
    }

    runTriggerEvent() {
        console.log("SceneButton: runTriggerEvent called, has event?", !!this.triggerEventCustom);
        this.triggerEventCustom?.invoke();
    }
}