import { ApplicationState } from "../../../../data/src/mod.ts";

let state: ApplicationState = { gamesStarted: [] };

export function getState(): ApplicationState {
  return state;
}

export function setState(newState: ApplicationState) {
  console.log("new state: ", newState);
  state = newState;
}
