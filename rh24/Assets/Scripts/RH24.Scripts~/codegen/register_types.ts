import { TypeStore } from "@needle-tools/engine"

// Import types
import { DistanceToWall } from "../DistanceToWall.js";
import { HoleBorder } from "../HoleBorder.js";
import { HoleCutter } from "../HoleCutter.js";
import { RandomSound } from "../RandomSound.js";
import { SineMove } from "../SineMove.js";
import { CustomDepthSensing } from "../WallReveal.js";

// Register types
TypeStore.add("DistanceToWall", DistanceToWall);
TypeStore.add("HoleBorder", HoleBorder);
TypeStore.add("HoleCutter", HoleCutter);
TypeStore.add("RandomSound", RandomSound);
TypeStore.add("SineMove", SineMove);
TypeStore.add("CustomDepthSensing", CustomDepthSensing);
