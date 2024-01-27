import { Behaviour, GameObject, WebXRPlaneTracking, serializable, syncField } from "@needle-tools/engine";
import { PlayerSync } from "@needle-tools/engine";
import { isQuest } from "@needle-tools/engine";
import { PlayerState } from "@needle-tools/engine";
import { ShadowCatcher } from "@needle-tools/engine";
import { WebXRPlaneTrackingEvent } from "@needle-tools/engine";
import { Mesh, BufferGeometry, Material, MaterialLoader, BufferGeometryLoader, Matrix4, Vector3 } from "three";

class MeshData {
    pose: Matrix4;
    vertices: Vector3[];
    version: number;
}

const version = 3;

export class NetworkedMesh extends Behaviour { 

    @serializable(Material)
    material: Material;

    @syncField("onNewGeometry")
    private geometry: Array<MeshData> = [];

    start(): void {

        console.log("enabling NetworkedMesh", PlayerState.isLocalPlayer(this.gameObject));
        if (!PlayerState.isLocalPlayer(this.gameObject)) return;

        const planeTracking = GameObject.findObjectOfType(WebXRPlaneTracking);
        planeTracking?.addEventListener("plane-tracking", this.onPlaneTracking);
    }

    private onPlaneTracking = (evt: CustomEvent<WebXRPlaneTrackingEvent>) => {
        console.error("New plane", evt.detail.context.mesh);
        const mesh = evt.detail.context.mesh as Mesh;

        // convert vertices back to Vector3 array
        const vertices = new Array<Vector3>();
        for (let i = 0; i < mesh.geometry.attributes.position.count; i++) {
            const x = mesh.geometry.attributes.position.getX(i);
            const y = mesh.geometry.attributes.position.getY(i);
            const z = mesh.geometry.attributes.position.getZ(i);
            vertices.push(new Vector3(x, y, z));
        }

        const date = this.context.time.time;
        this.geometry.push({ vertices: vertices, version: date, pose: mesh.matrixWorld });
        
        // cleanup - remove outdated entries
        this.geometry = this.geometry.filter(x => x.version === date);
        console.log("UPDATING GEOMETRY", this.geometry.length)
    }

    private lastProcessingTime: number = 0;
    private lastDataReceiveTime: number = 0;
    private onNewGeometry(newGeometry, oldGeometry) {
        console.log("new geometry received",  newGeometry);
        this.lastDataReceiveTime = Date.now();
    }

    private processGeometry() {

        // don't do anything on ourselves
        if (PlayerState.isLocalPlayer(this.gameObject)) return;

        const newGeometry = this.geometry;

        console.log("new geometry", this.guid, newGeometry);

        const planeTracking = GameObject.findObjectOfType(WebXRPlaneTracking);
        if (!planeTracking) {
            console.error("BUG, plane tracking not found");
            return;
        }

        // add mesh to scene
        for (let i = 0; i < newGeometry.length; i++) {
            
            const geo = newGeometry[i];
            
            try {
                
                const geometry = planeTracking!.createPlaneGeometry!(geo.vertices);

                //const geoLoader = new BufferGeometryLoader();
                //const geometry = geoLoader.parse(geo.geometry);
                const mat = this.material;

                const mesh = new Mesh(geometry, mat);
                const floatArray = geo.pose.elements;
                mesh.matrix.fromArray(floatArray);
                mesh.matrix.decompose(mesh.position, mesh.quaternion, mesh.scale);
                this.gameObject.add(mesh);

                GameObject.setActive(mesh, true);
                
                // add shadow catcher component for occluder material
                const shadowCatcher = new ShadowCatcher();
                shadowCatcher.mode = 2; // occluder
                GameObject.addComponent(mesh, shadowCatcher);

                // so it's destroyed when the player leaves
                // GameObject.addNewComponent(mesh, PlayerState);

            } catch (e) {
                console.warn(e);
                console.warn(geo.geometry);
            }

            // const mesh = new Mesh(newGeometry[i].geometry.data, newGeometry[i].material);
            // this.gameObject.add(mesh);
        }
    }

    update() {

        if (Date.now() - this.lastDataReceiveTime > 500 && this.lastProcessingTime - this.lastDataReceiveTime < 0) {
            this.lastProcessingTime = Date.now();
            this.processGeometry();
        }
    }
}