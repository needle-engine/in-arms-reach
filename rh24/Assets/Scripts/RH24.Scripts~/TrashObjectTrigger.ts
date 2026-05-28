import { Behaviour, serializable, EventList, PointerEventData, ObjectRaycaster } from "@needle-tools/engine";
import { Object3D } from "three";

// Documentation → https://docs.needle.tools/scripting

export class TrashObjectTrigger extends Behaviour {

    @serializable(EventList)
    triggerEventCustom? : EventList;

        @serializable(Object3D)
    triggerObject? : Object3D;


    
    start() {
        // Determine which object should receive pointer events
        const targetObject = this.triggerObject || this.gameObject;
        
        console.log("TrashObjectTrigger start() on", this.gameObject.name, "target:", targetObject.name, "visible:", targetObject.visible);
        
        // Check if the target object and its children have meshes for raycasting
        let meshCount = 0;
        let meshLayer = -1;
        targetObject.traverse((child: any) => {
            if (child.isMesh) {
                meshCount++;
                meshLayer = child.layers.mask;
                console.log("  - Found Mesh:", child.name, "visible:", child.visible, "layer:", child.layers.mask);
            }
        });
        console.log("TrashObjectTrigger: Total meshes found in", targetObject.name, ":", meshCount);
        
        // IMPORTANT: Raycasting works on Layer 0 (same as walls)
        // Set all objects to Layer 0 for raycasting to work
        const raycastLayer = 0;
        console.log("TrashObjectTrigger: Setting to Layer 0 for raycasting compatibility");
        targetObject.layers.set(raycastLayer);
        
        // Set layer on all children too
        targetObject.traverse((child: any) => {
            child.layers.set(raycastLayer);
        });
        
        // Add ObjectRaycaster so the target object can receive pointer events
        if (!targetObject.getComponent(ObjectRaycaster)) {
            console.log("TrashObjectTrigger: Adding ObjectRaycaster to", targetObject.name, "(triggerObject:", !!this.triggerObject, ")");
            const raycaster = targetObject.addComponent(ObjectRaycaster) as ObjectRaycaster;
            console.log("TrashObjectTrigger: ObjectRaycaster added, layer:", targetObject.layers.mask);
        } else {
            console.log("TrashObjectTrigger: ObjectRaycaster already exists on", targetObject.name);
        }
        
        // If triggerObject is set, we need to add this script to it too so it receives the pointer events
        if (this.triggerObject && this.triggerObject !== this.gameObject) {
            console.log("TrashObjectTrigger: triggerObject is set, adding TrashObjectTrigger to it");
            const existingTrigger = this.triggerObject.getComponent(TrashObjectTrigger);
            if (!existingTrigger) {
                const newTrigger = this.triggerObject.addComponent(TrashObjectTrigger) as TrashObjectTrigger;
                newTrigger.triggerEventCustom = this.triggerEventCustom;
                // Don't set triggerObject on the new component to avoid infinite loop
            }
        }
    }
    
    onPointerDown(args: PointerEventData) {
        console.log("TrashObjectTrigger: onPointerDown triggered on", this.gameObject.name);
        this.runTriggerEvent();
    }
    
    onPointerEnter(args: PointerEventData) {
        console.log("TrashObjectTrigger: onPointerEnter on", this.gameObject.name);
    }

    runTriggerEvent() {
        console.log("TrashObjectTrigger: runTriggerEvent called, has event?", !!this.triggerEventCustom);
        this.triggerEventCustom?.invoke();
    }
}