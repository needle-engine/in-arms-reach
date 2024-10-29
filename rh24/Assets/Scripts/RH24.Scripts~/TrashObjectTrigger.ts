import { Behaviour, serializable, EventList } from "@needle-tools/engine";

// Documentation → https://docs.needle.tools/scripting

export class TrashObjectTrigger extends Behaviour {

    @serializable(EventList)
    triggerEventCustom? : EventList;


    
    start() {
    }

    runTriggerEvent() {
        this.triggerEventCustom?.invoke();
    }
}