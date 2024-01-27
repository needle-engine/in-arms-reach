import { Behaviour, GameObject, serializable } from "@needle-tools/engine";
import { DistanceToWall } from "./DistanceToWall.js";
import { CustomDepthSensing } from "./WallReveal.js";

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

        // we want to wait for first placement again
        DistanceToWall.hadFirstPlacement = false;
        GameObject.setActive(CustomDepthSensing.instance.scenesRoot, false);

        for (let i = 0; i < this.scenes.length; i++) {
            GameObject.setActive(this.scenes[i], i === index);
        }

        DistanceToWall.cleanUpClones();
    }
}