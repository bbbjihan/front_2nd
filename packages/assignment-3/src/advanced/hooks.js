import { deepEquals } from "../../../assignment-2/src/basic/basic";

export function createHooks(callback) {
  let states = [];
  let statesCurrentIndex = -1;
  let waitingFrameCnt = 0;

  function waitForNextFrame() {
    if (waitingFrameCnt === 0) {
      waitingFrameCnt = requestAnimationFrame(() => {
        callback();
        waitingFrameCnt = 0;
      });
    }
  }

  const useState = (initState) => {
    states.push(initState);
    statesCurrentIndex += 1;
    const currentIndex = statesCurrentIndex;

    const state = states[currentIndex];

    const setState = function (newValue) {
      if (!deepEquals(states[currentIndex], newValue)) {
        states[currentIndex] = newValue;

        waitForNextFrame();

        // https://developer.mozilla.org/ko/docs/Web/API/Window/requestAnimationFrame
      }
    };

    return [state, setState];
  };

  let memoValues = [];
  let memoRefs = [];
  let memosCurrentIndex = -1;

  const useMemo = (fn, refs) => {
    memoValues.push(fn());
    memoRefs.push(refs);
    memosCurrentIndex += 1;
    const currentIndex = memosCurrentIndex;

    if (!deepEquals(memoRefs[currentIndex], refs)) {
      memoRefs[currentIndex] = refs;
      memoValues[currentIndex] = fn();
    }

    const value = memoValues[currentIndex];
    return value;
  };

  const resetContext = () => {
    statesCurrentIndex = -1;
    memosCurrentIndex = -1;
  };

  return { useState, useMemo, resetContext };
}
