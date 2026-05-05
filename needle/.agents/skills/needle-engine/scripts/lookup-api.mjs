#!/usr/bin/env node

/**
 * Needle Engine API Lookup Script
 *
 * Searches @needle-tools/engine .d.ts type definitions for classes, methods, and properties.
 * Use this to get accurate API signatures and JSDoc documentation.
 *
 * Usage:
 *   node lookup-api.mjs <project-path> <query>
 *   node lookup-api.mjs <project-path> --list              # list all available types
 *   node lookup-api.mjs <project-path> --file <filename>   # show full file contents
 *
 * Examples:
 *   node lookup-api.mjs ./my-app ContactShadows
 *   node lookup-api.mjs ./my-app "syncInstantiate"
 *   node lookup-api.mjs ./my-app PlayerSync
 *   node lookup-api.mjs ./my-app --list
 *   node lookup-api.mjs ./my-app --file engine_physics
 */

import { readdir, readFile, stat } from "fs/promises";
import { join, basename, relative } from "path";

const [,, projectPath, ...args] = process.argv;

if (!projectPath || args.length === 0) {
    console.log(`Usage: node lookup-api.mjs <project-path> <query>
       node lookup-api.mjs <project-path> --list
       node lookup-api.mjs <project-path> --file <filename>

Examples:
  node lookup-api.mjs ./my-app ContactShadows
  node lookup-api.mjs ./my-app "physics.raycast"
  node lookup-api.mjs ./my-app --list`);
    process.exit(1);
}

const engineLibPath = join(projectPath, "node_modules/@needle-tools/engine/lib");

try {
    await stat(engineLibPath);
} catch {
    console.error(`Error: Could not find @needle-tools/engine at ${engineLibPath}`);
    console.error("Make sure the project has node_modules installed (run npm install).");
    process.exit(1);
}

// Collect all .d.ts files recursively
async function collectFiles(dir, files = []) {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        if (entry.isDirectory()) {
            await collectFiles(fullPath, files);
        } else if (entry.name.endsWith(".d.ts")) {
            files.push(fullPath);
        }
    }
    return files;
}

const allFiles = await collectFiles(engineLibPath);

// --list mode: show all available type definition files
if (args[0] === "--list") {
    console.log(`Found ${allFiles.length} type definition files:\n`);
    const grouped = {};
    for (const f of allFiles) {
        const rel = relative(engineLibPath, f);
        const dir = rel.includes("/") ? rel.split("/").slice(0, -1).join("/") : "(root)";
        if (!grouped[dir]) grouped[dir] = [];
        grouped[dir].push(basename(f, ".d.ts"));
    }
    for (const [dir, files] of Object.entries(grouped).sort()) {
        console.log(`${dir}/`);
        for (const f of files.sort()) {
            console.log(`  ${f}`);
        }
        console.log();
    }
    process.exit(0);
}

// --file mode: show full contents of a specific file
if (args[0] === "--file") {
    const filename = args[1];
    if (!filename) {
        console.error("Usage: --file <filename> (without .d.ts extension)");
        process.exit(1);
    }
    const matches = allFiles.filter(f =>
        basename(f, ".d.ts").toLowerCase().includes(filename.toLowerCase())
    );
    if (matches.length === 0) {
        console.error(`No file matching "${filename}" found.`);
        process.exit(1);
    }
    for (const match of matches.slice(0, 3)) {
        const rel = relative(engineLibPath, match);
        const content = await readFile(match, "utf-8");
        console.log(`\n${"=".repeat(60)}`);
        console.log(`File: ${rel}`);
        console.log("=".repeat(60));
        console.log(content);
    }
    process.exit(0);
}

// Search mode: find query in all .d.ts files
const query = args.join(" ").toLowerCase();
const results = [];

for (const filePath of allFiles) {
    const content = await readFile(filePath, "utf-8");
    const lowerContent = content.toLowerCase();

    if (!lowerContent.includes(query)) continue;

    const rel = relative(engineLibPath, filePath);
    const lines = content.split("\n");
    const matchingRanges = [];

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].toLowerCase().includes(query)) {
            // Capture context: JSDoc above + a few lines below
            let start = i;
            // Walk back to find JSDoc comment start
            while (start > 0 && (lines[start - 1].trim().startsWith("*") ||
                                  lines[start - 1].trim().startsWith("/**") ||
                                  lines[start - 1].trim().startsWith("//") ||
                                  lines[start - 1].trim() === "")) {
                start--;
            }
            // Walk forward a few lines for context
            let end = Math.min(i + 10, lines.length - 1);
            // Extend to closing brace if it's a short block
            for (let j = i + 1; j <= Math.min(i + 30, lines.length - 1); j++) {
                end = j;
                if (lines[j].trim() === "}" || lines[j].trim() === "};") break;
            }

            matchingRanges.push({ start, end, matchLine: i });
        }
    }

    // Merge overlapping ranges
    const merged = [];
    for (const range of matchingRanges) {
        if (merged.length > 0 && range.start <= merged[merged.length - 1].end + 2) {
            merged[merged.length - 1].end = Math.max(merged[merged.length - 1].end, range.end);
        } else {
            merged.push({ ...range });
        }
    }

    // Limit to first 3 ranges per file
    for (const range of merged.slice(0, 3)) {
        const snippet = lines.slice(range.start, range.end + 1).join("\n");
        results.push({ file: rel, snippet, line: range.matchLine + 1 });
    }
}

if (results.length === 0) {
    console.log(`No results found for "${query}".`);
    console.log("\nTry:");
    console.log("  - A class name: ContactShadows, PlayerSync, SyncedRoom");
    console.log("  - A method name: raycast, syncInstantiate, addComponent");
    console.log("  - --list to see all available files");
    process.exit(0);
}

console.log(`Found ${results.length} result(s) for "${query}":\n`);

for (const { file, snippet, line } of results.slice(0, 10)) {
    console.log(`--- ${file}:${line} ---`);
    console.log(snippet);
    console.log();
}

if (results.length > 10) {
    console.log(`... and ${results.length - 10} more results. Use --file <name> to see full files.`);
}
