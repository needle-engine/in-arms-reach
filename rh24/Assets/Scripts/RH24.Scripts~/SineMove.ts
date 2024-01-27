import { Behaviour, serializable } from "@needle-tools/engine";
import { Euler, Vector3 } from "three";

// Documentation → https://docs.needle.tools/scripting

export class SineMove extends Behaviour {

    @serializable()
    rotate: number = 1;

    @serializable()
    move: number = 1;

    @serializable()
    moveMultiplier: Vector3 = new Vector3(1,1,1);

    private e: Euler = new Euler();
    private speeds: Vector3 = new Vector3(0.5, 0.7, 0.3);
    private moveSpeeds = new Vector3(0.5, 0.7, 0.3);

    private o: number;

    onEnable() {
        this.speeds.set(
            Math.random() * 0.5 + 0.5,
            Math.random() * 0.5 + 0.5,
            Math.random() * 0.5 + 0.5,
        );

        this.moveSpeeds.set(
            Math.random() * 0.5 + 0.5,
            Math.random() * 0.5 + 0.5,
            Math.random() * 0.5 + 0.5,
        );

        this.o = Math.random() * 100;
    }

    update() {
        const t = this.context.time.time;
     
        if (this.rotate !== 0) {
            this.e.set(
                Math.sin(t * this.speeds.x + this.o) * 0.1 * this.rotate,
                Math.sin(t * this.speeds.y + this.o) * 0.1 * this.rotate,
                Math.sin(t * this.speeds.z + this.o) * 0.1 * this.rotate,
            );
            this.gameObject.quaternion.setFromEuler(this.e);
        }
     
        if (this.move !== 0) {
            this.gameObject.position.set(
                Math.sin(t * this.moveSpeeds.x + this.o) * 0.1 * this.move * this.moveMultiplier.x,
                Math.sin(t * this.moveSpeeds.y + this.o) * 0.1 * this.move * this.moveMultiplier.y,
                Math.sin(t * this.moveSpeeds.z + this.o) * 0.1 * this.move * this.moveMultiplier.z,
            );
        }
    }
}