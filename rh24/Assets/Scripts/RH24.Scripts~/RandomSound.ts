import { AudioSource, Behaviour, delay, serializable } from "@needle-tools/engine";
import { Vector3 } from "three";

// Documentation → https://docs.needle.tools/scripting

export class RandomSound extends Behaviour {

    @serializable()
    minDelay: number = 3;

    @serializable()
    maxDelay: number = 5;

    private coroutine: Generator | null = null;
    private source: AudioSource | null = null;
    
    onEnable(): void {
        this.coroutine = this.startCoroutine(this.playSound());
        this.source = this.gameObject.getComponent(AudioSource);
    }

    onDisable(): void {
        if (!this.coroutine) return;
        this.stopCoroutine(this.coroutine);
    }

    *playSound() {
        while (true) {
            const delayTime = Math.random() * (this.maxDelay - this.minDelay) + this.minDelay;
            yield delay(delayTime);
            if (!this.source) continue;

            const radius = 3;
            this.source.gameObject.worldPosition = new Vector3(Math.random() * radius * 2 - radius, 2, Math.random() * radius * 2 - radius);
            this.source.play();
        }
    }
}