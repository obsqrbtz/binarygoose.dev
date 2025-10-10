const { spawn } = require("child_process");
const chokidar = require("chokidar");

let currentBuild = null;
let rebuildQueued = false;

function runBuild() {
  if (currentBuild) {
    rebuildQueued = true;
    return;
  }

  console.log("Rebuilding...");
  currentBuild = spawn("npm", ["run", "build"], {
    shell: true,
    stdio: "inherit",
  });

  currentBuild.on("exit", (code) => {
    console.log(code === 0 ? "Build completed" : "Build failed");
    currentBuild = null;

    if (rebuildQueued) {
      rebuildQueued = false;
      runBuild();
    }
  });
}

const watcher = chokidar.watch(["./src", "./content"], {
  persistent: true,
  ignoreInitial: true,
  usePolling: true,
  interval: 300,
  awaitWriteFinish: {
    stabilityThreshold: 200,
    pollInterval: 100,
  },
});

watcher
  .on("ready", () => {
    console.log("Watching for changes...");
    runBuild();
  })
  .on("add", (path) => {
    console.log(`Added: ${path}`);
    runBuild();
  })
  .on("change", (path) => {
    console.log(`Changed: ${path}`);
    runBuild();
  })
  .on("unlink", (path) => {
    console.log(`Removed: ${path}`);
    runBuild();
  })
  .on("error", (err) => console.error("Watcher error:", err));
