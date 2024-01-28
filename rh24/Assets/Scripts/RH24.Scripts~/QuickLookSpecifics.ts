import { USDZExporter } from "@needle-tools/engine";
import { GameObject } from "@needle-tools/engine";
import { Behaviour, serializable } from "@needle-tools/engine";
import { DistanceToWall } from "./DistanceToWall.js";

// Documentation → https://docs.needle.tools/scripting

export class QuickLookSpecifics extends Behaviour {
    
    @serializable(GameObject)
    objectsToExclude: GameObject[] = [];

    @serializable(GameObject)
    object1: GameObject;
    @serializable(GameObject)
    object2: GameObject;
    @serializable(GameObject)
    object3: GameObject;
    @serializable(GameObject)
    object4: GameObject;
    @serializable(GameObject)
    object5: GameObject;
    @serializable(GameObject)
    object6: GameObject;
    @serializable(GameObject)
    object7: GameObject;
    @serializable(GameObject)
    object8: GameObject;

    start() {
        console.log("Exclude: ", this.objectsToExclude);
        console.log("Exlude single:", this.object1);

        this.objectsToExclude.push(...[this.object1, this.object2, this.object3, this.object4, this.object5, this.object6, this.object7, this.object8]);

        const exporter = GameObject.findObjectOfType(USDZExporter);
        if (!exporter) {
            console.error("no USDZ exporter found");
            return;
        }

        const map = new Map<GameObject, boolean>();
        
        exporter.addEventListener("before-export", () => {

            const clonedList = this.objectsToExclude.filter(o => o);
            clonedList.push(...DistanceToWall.allClones);

            for (const o of clonedList) {
                if (!o) continue;
                map.set(o, o.activeSelf);
                GameObject.setActive(o, false);
            }
        });

        exporter.addEventListener("after-export", () => {
            for (const [o, active] of map) {
                GameObject.setActive(o, active);
            }
            // clear map
            map.clear();
        });
    }
}