import fs from "node:fs/promises";
import path from "node:path";

const projectRoot = path.resolve(process.cwd());
const srcNextStatic = path.join(projectRoot, ".next", "static");
const srcPublic = path.join(projectRoot, "public");

const destStandaloneRoot = path.join(projectRoot, ".next", "standalone");
const destNextStatic = path.join(destStandaloneRoot, ".next", "static");
const destPublic = path.join(destStandaloneRoot, "public");

async function pathExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function copyDirIfExists(src, dest) {
  if (!(await pathExists(src))) {
    return;
  }
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.cp(src, dest, { recursive: true, force: true });
}

if (!(await pathExists(destStandaloneRoot))) {
  throw new Error(
    "Expected '.next/standalone' to exist. Ensure next.config.ts has output: 'standalone' and run 'next build' first."
  );
}

await copyDirIfExists(srcNextStatic, destNextStatic);
await copyDirIfExists(srcPublic, destPublic);

console.log("Copied static assets into .next/standalone");

// Flatten logic for nested standalone output (common on Windows)
const serverJsPath = path.join(destStandaloneRoot, 'server.js');
const hasServerJsInRoot = await pathExists(serverJsPath);

if (!hasServerJsInRoot) {
  console.log("Detecting nested standalone structure...");
  
  async function findNestedRoot(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === 'public') continue;
      
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        const nestedServerJs = path.join(fullPath, 'server.js');
        if (await pathExists(nestedServerJs)) {
             return fullPath;
        }
        const found = await findNestedRoot(fullPath);
        if (found) return found;
      }
    }
    return null;
  }

  const nestedRoot = await findNestedRoot(destStandaloneRoot);
  
  if (nestedRoot) {
    console.log(`Found nested app at: ${nestedRoot}`);
    console.log(`Flattening to: ${destStandaloneRoot}`);
    
    // Copy all contents from nested root to standalone root, merging directories
    await fs.cp(nestedRoot, destStandaloneRoot, { recursive: true, force: true });
    
    // We leave the old folders there as duplications inside the zip don't break functionality, 
    // just add size. Ideally we'd remove 'CascadeProjects' but determining the top-level folder to remove is extra logic.
    // For now, priority is working deployment.
  } else {
    console.warn("Could not find server.js in nested structure. Deployment might fail.");
  }
}
