import { TypeStore } from "@needle-tools/engine"

// Import types
import { CamRotator } from "../CamRotator.js";
import { DistanceToWall } from "../DistanceToWall.js";
import { HoleBorder } from "../HoleBorder.js";
import { HoleCutter } from "../HoleCutter.js";
import { LookFollow } from "../LookFollow.js";
import { NetworkedMesh } from "../NetworkedMesh.js";
import { PlaySoundCustom } from "../PlaySoundCustom.js";
import { RandomSound } from "../RandomSound.js";
import { RevealObj } from "../RevealObj.js";
import { SceneButton } from "../SceneButton.js";
import { SineMove } from "../SineMove.js";
import { SwitchScene } from "../SwitchScene.js";
import { Tagalong } from "../Tagalong.js";
import { CustomDepthSensing } from "../WallReveal.js";

// Register types
TypeStore.add("CamRotator", CamRotator);
TypeStore.add("DistanceToWall", DistanceToWall);
TypeStore.add("HoleBorder", HoleBorder);
TypeStore.add("HoleCutter", HoleCutter);
TypeStore.add("LookFollow", LookFollow);
TypeStore.add("NetworkedMesh", NetworkedMesh);
TypeStore.add("PlaySoundCustom", PlaySoundCustom);
TypeStore.add("RandomSound", RandomSound);
TypeStore.add("RevealObj", RevealObj);
TypeStore.add("SceneButton", SceneButton);
TypeStore.add("SineMove", SineMove);
TypeStore.add("SwitchScene", SwitchScene);
TypeStore.add("Tagalong", Tagalong);
TypeStore.add("CustomDepthSensing", CustomDepthSensing);
