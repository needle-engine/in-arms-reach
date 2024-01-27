import { TypeStore } from "@needle-tools/engine"

// Import types
import { DistanceToWall } from "../DistanceToWall.js";
import { HoleCutter } from "../HoleCutter.js";
import { RandomSound } from "../RandomSound.js";
import { CustomDepthSensing } from "../WallReveal.js";

// Register types
TypeStore.add("DistanceToWall", DistanceToWall);
TypeStore.add("HoleCutter", HoleCutter);
TypeStore.add("RandomSound", RandomSound);
TypeStore.add("CustomDepthSensing", CustomDepthSensing);
