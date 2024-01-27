import { getWorldPosition } from "@needle-tools/engine";
import { getWorldQuaternion } from "@needle-tools/engine";
import { Mathf } from "@needle-tools/engine";
import { Behaviour, serializable } from "@needle-tools/engine";
import { Matrix4, Object3D, Quaternion, Vector3 } from "three";

// Documentation → https://docs.needle.tools/scripting

export class LookFollow extends Behaviour {
    
    @serializable(Object3D)
    target: Object3D | null = null;

    @serializable() 
    followFactor: number = .1;

    @serializable()
    rotateFactor: number = .1;

    private _firstUpdate: boolean = false;
    private _lastTargetPos: Vector3 = new Vector3();

    updateNow(hard: boolean) {
        if (!this.target || this.target === this.gameObject) return;
        
        if (this.followFactor > 0) {
            const wp = getWorldPosition(this.target);
            const fpos = this._firstUpdate || hard ? 1 : Mathf.clamp01(this.context.time.deltaTime * this.followFactor);
            const currentPosition = this.worldPosition;

            currentPosition.x = Mathf.lerp(currentPosition.x, wp.x, fpos);
            currentPosition.y = Mathf.lerp(currentPosition.y, wp.y, fpos);
            currentPosition.z = Mathf.lerp(currentPosition.z, wp.z, fpos);

            this.worldPosition = currentPosition;

            if (this.rotateFactor > 0) {
                // calc distance from this.worldPosition to this._lastTargetPos
                const distance = this._lastTargetPos.distanceTo(currentPosition);
                if (distance > 0.05) {
                    
                    const mat = new Matrix4();
                    mat.lookAt(this._lastTargetPos, currentPosition, new Vector3(0,1,0));
                    const worldRot = new Quaternion();
                    worldRot.setFromRotationMatrix(mat);

                    const frot = this._firstUpdate || hard ? 1 : Mathf.clamp01(this.context.time.deltaTime * this.rotateFactor);
                    this.worldQuaternion = this.worldQuaternion.slerp(worldRot, frot);
                }
            }
        }

        this._firstUpdate = false;
    }
}