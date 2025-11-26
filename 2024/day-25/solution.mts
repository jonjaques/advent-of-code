import FS from "node:fs";

interface Diagram {
  type: "lock" | "key";
  data: number[];
}

interface Combination {
  lock: Diagram;
  key: Diagram;
  fits: boolean;
  lastPositionBad?: number;
}

const DiagramTypes = {
  Lock: "lock",
  Key: "key",
} as const;

const input = FS.readFileSync("./2024/day-25/input.txt", "utf-8").trim();
const { locks, keys } = parseInput(input);
log("Total Locks:", locks.length);
log("Total Keys:", keys.length);

let uniquePairs = 0;

for (const lock of locks) {
  for (const key of keys) {
    const match = tryKey(lock, key);
    if (match.fits) {
      console.log("Found a matching key for lock!");
      console.log("Lock Data:", lock.data);
      console.log("Key Data:", key.data);
      uniquePairs++;
    } else {
      log(
        "No match:",
        "Lock Data:",
        lock.data,
        "Key Data:",
        key.data,
        "Last Bad Position:",
        match.lastPositionBad
      );
    }
  }
}
console.log("-----");
console.log("Total Unique Pairs:", uniquePairs);

function tryKey(lock: Diagram, key: Diagram): Combination {
  let fits = true;
  let lastPositionBad = -1;
  for (let i = 0; i < lock.data.length; i++) {
    const lockPin = lock.data[i]!;
    const keyPin = key.data[i]!;
    if (lockPin + keyPin > 5) {
      fits = false;
      lastPositionBad = i;
      break;
    }
  }
  return { lock, key, fits, lastPositionBad };
}

function parseInput(input: string) {
  const locks: Diagram[] = [];
  const keys: Diagram[] = [];
  const diagrams = input.split("\n\n");
  log("Total Diagrams:", diagrams.length);
  for (const rawDiagram of diagrams) {
    log("-----");
    const diagram = parseDiagram(rawDiagram);
    log("Diagram Type:", diagram.type);
    log("Diagram Data:", diagram.data);
    if (diagram.type === DiagramTypes.Lock) {
      locks.push(diagram);
    } else {
      keys.push(diagram);
    }
  }
  return { locks, keys };
}

function parseDiagram(diagram: string): Diagram {
  let pin1 = 0;
  let pin2 = 0;
  let pin3 = 0;
  let pin4 = 0;
  let pin5 = 0;

  const data = [pin1, pin2, pin3, pin4, pin5];
  const lines = diagram.split("\n");
  const isLock = lines[0]?.includes("#####");

  for (const line of lines.slice(1, 6)) {
    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === "#") {
        data[i!]!++;
      }
    }
  }
  return {
    type: isLock ? DiagramTypes.Lock : DiagramTypes.Key,
    data,
  };
}

function log(...args: any[]) {
  if (process.env.DEBUG) {
    console.log(...args);
  }
}

// Example Lock

/*
0,5,3,4,3
#####
.####
.####
.####
.#.#.
.#...
.....
*/

// Example Key

/*
5,0,2,1,3
.....
#....
#....
#...#
#.#.#
#.###
#####
*/
