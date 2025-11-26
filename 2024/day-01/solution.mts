import FS from "node:fs";

const input = FS.readFileSync("./2024/day-01/input.txt", "utf-8").trim();
const lines = input.split("\n").map((line) => line.split("   ").map(Number));
const listA = lines.map((line) => line[0]).sort((a, b) => a! - b!) as number[];
const listB = lines.map((line) => line[1]).sort((a, b) => a! - b!) as number[];

const distance = lines.reduce((acc, _, i) => {
  return acc + Math.abs(listA[i]! - listB[i]!);
}, 0);

console.log("Total Distance:", distance);

const similarity = listA.reduce((acc, val, i) => {
  const count = countOccurrences(listB, val);
  return acc + count * val;
}, 0);

console.log("Total Similarity:", similarity);

function countOccurrences(arr: number[], n: number) {
  return arr.reduce((count, element) => {
    return element === n ? count + 1 : count;
  }, 0);
}
