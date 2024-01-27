import { TypeStore } from "@needle-tools/engine"

// Import types
import { DistanceToWall } from "../DistanceToWall.js";
import { HoleBorder } from "../HoleBorder.js";
import { HoleCutter } from "../HoleCutter.js";
import { LookFollow } from "../LookFollow.js";
import { NetworkedMesh } from "../NetworkedMesh.js";
import { PlaySoundCustom } from "../PlaySoundCustom.js";
import { RandomSound } from "../RandomSound.js";
import { RevealObj } from "../RevealObj.js";
import { SineMove } from "../SineMove.js";
import { CustomDepthSensing } from "../WallReveal.js";

// Register types
TypeStore.add("DistanceToWall", DistanceToWall);
TypeStore.add("HoleBorder", HoleBorder);
TypeStore.add("HoleCutter", HoleCutter);
TypeStore.add("LookFollow", LookFollow);
TypeStore.add("NetworkedMesh", NetworkedMesh);
TypeStore.add("PlaySoundCustom", PlaySoundCustom);
TypeStore.add("RandomSound", RandomSound);
TypeStore.add("RevealObj", RevealObj);
TypeStore.add("SineMove", SineMove);
TypeStore.add("CustomDepthSensing", CustomDepthSensing);
