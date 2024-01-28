import { Behaviour, serializable } from "@needle-tools/engine";
import { Euler, MathUtils, Quaternion, Vector3 } from "three";

// Documentation → https://docs.needle.tools/scripting

export class CamRotator extends Behaviour {    
    private lastOffset = new Vector3(0, 0, 0);
    private euler = new Euler(0, 0, 0);
    private vec = new Vector3(0, 0, 0);

    onEnable(): void {
        // sensor fallback
        if ("DeviceMotionEvent" in globalThis)
        {
            let haveCheckedPermissions = false;
            this.context.domElement.addEventListener("click", () => {
                if (haveCheckedPermissions) return;
                haveCheckedPermissions = true;

                this.deviceMotionFallback();
            });
        }
    }

    private alphaBetaGammaOffset: Vector3 | undefined = undefined;
    recenter() {
        // doesn't really work yet
        this.alphaBetaGammaOffset = undefined;
    }


    update() {
        const mouseSensitivity = 0.25;

        // get mouse coordinates
        if (this.useMouseData) {
            const m = this.context.input.mousePositionRC;
            this.vec.set(-m.y * mouseSensitivity, -m.x * mouseSensitivity, 0);
            this.lastOffset.lerp(this.vec, this.context.time.deltaTime);
            this.euler.setFromVector3(this.lastOffset);
            this.gameObject.quaternion.setFromEuler(this.euler);
            this.gameObject.matrixWorldNeedsUpdate = true;
        }
    }

    private deviceMotionFallback() {
        //@ts-ignore
        if ("requestPermission" in DeviceMotionEvent) {
            //@ts-ignore
            DeviceMotionEvent.requestPermission().then(response => {
                if (response == 'granted') {
                    this.connectDeviceMotionEvents();
                }
            });
        }
        else {
            this.connectDeviceMotionEvents();
        }
    }

    private useMouseData = true;

    private connectDeviceMotionEvents() {
        window.addEventListener('deviceorientation', (event) => {  

            this.useMouseData = false;
            if (!event.alpha || !event.beta || !event.gamma) return;

            // convert alpha, beta, gamma to radians
            const alpha = MathUtils.degToRad(event.alpha); //z
            const beta = MathUtils.degToRad(event.beta); //x
            const gamma = MathUtils.degToRad(event.gamma); //y

            // get orientation offset of the device (portrait/landscape)
            const deviceZAngle = this.getOrientation();

            //reset object
            this.gameObject.quaternion.set(0, 0, 0, 1); 

            // correct origin
            this.gameObject.rotateX(-Math.PI / 2); // rotate the origin to face forward (0,0,1)
            
            // apply gyro rotatinons (order is important)
            this.gameObject.rotateZ(alpha);
            this.gameObject.rotateX(beta);
            this.gameObject.rotateY(gamma);

            // compensate for device orientation offset (portrait/landscape)
            this.gameObject.rotateZ(MathUtils.degToRad(-deviceZAngle)); 

            // this.gameObject.quaternion.invert();

            this.gameObject.quaternion.slerp(this.identityQuaternion, 0.7);

            // this.setOrientationLabel();
        });
    }

    private identityQuaternion = new Quaternion();

        // https://gist.github.com/bellbind/d2be9cc09bf6241f255d
        private getOrientation = function () {
            // W3C DeviceOrientation Event Specification (Draft)
            if (window.screen.orientation) return window.screen.orientation.angle;
            // Safari
            if (typeof window.orientation === "number") return window.orientation;
            // workaround for android firefox
            //@ts-ignore
            if (window.screen.mozOrientation) return {
                "portrait-primary": 0,
                "portrait-secondary": 180,
                "landscape-primary": 90,
                "landscape-secondary": 270,
            //@ts-ignore
            }[window.screen.mozOrientation];
            // otherwise
            return 0;
        };
}