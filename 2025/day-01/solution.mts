import FS from "node:fs";
import _ from "lodash";
import {
  DoublyLinkedList,
  DoublyLinkedListNode,
} from "@datastructures-js/linked-list";
const { range } = _;

const sampleInput = `
L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`.trim();

const method1 = 1;
const method2 = 0x434c49434b; // "CLICK" in hex ;)
const initialPosition = 50;

const input = FS.readFileSync("./2025/day-01/input.txt", "utf-8").trim();
const dialPositionsRange = range(0, 100);
const dialPositions = DoublyLinkedList.fromArray(
  dialPositionsRange.map((n) => new DoublyLinkedListNode(n))
);
dialPositions.tail().setNext(dialPositions.head());
dialPositions.head().setPrev(dialPositions.tail());
const movements = parseMovements(input);

console.log("Method 1:", tryMethod(method1));
console.log("Method 2:", tryMethod(method2));

function tryMethod(method: number) {
  let zeroCounter = 0;
  let currentPosition = dialPositions.find(
    (node) => node.getValue() === initialPosition
  )!;

  for (const movement of movements) {
    const { direction, steps } = movement;
    for (let step = 0; step < steps; step++) {
      currentPosition =
        direction === "L"
          ? currentPosition.getPrev()!
          : currentPosition.getNext()!;

      const lastClickOfMovement = step === steps - 1;
      if (
        currentPosition.getValue() === 0 &&
        ((method === method1 && lastClickOfMovement) || method === method2)
      ) {
        zeroCounter++;
      }
    }
  }
  return zeroCounter;
}

function parseMovements(input: string) {
  return input
    .trim()
    .split("\n")
    .reduce((acc, line) => {
      const [direction, stepsStr] = [line.charAt(0), line.slice(1)] as [
        "L" | "R",
        string
      ];
      const steps = parseInt(stepsStr, 10);
      acc.push({ direction, steps });
      return acc;
    }, [] as { direction: "L" | "R"; steps: number }[]);
}
