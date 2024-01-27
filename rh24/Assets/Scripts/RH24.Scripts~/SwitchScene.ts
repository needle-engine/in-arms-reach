import { Behaviour, GameObject, serializable } from "@needle-tools/engine";
import { DistanceToWall } from "./DistanceToWall.js";

// Documentation → https://docs.needle.tools/scripting

export class SwitchScene extends Behaviour {

    @serializable()
    startScene: number = 0;

    @serializable(GameObject)
    scenes: GameObject[] = [];
    
    onEnable(): void {
        if (this.startScene >= 0) {
            this.setScene(this.startScene);
        }
    }

    setScene(index: number) {
        console.log("set scene", index);

        for (let i = 0; i < this.scenes.length; i++) {
            GameObject.setActive(this.scenes[i], i === index);
        }

        DistanceToWall.hadFirstPlacement = false;
        DistanceToWall.cleanUpClones();
    }
}