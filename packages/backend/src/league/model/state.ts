import { ApplicationState } from "@glitter-boys/data";

let state: ApplicationState = { gamesStarted: [] };

export function getState(): ApplicationState {
  return state;
}

export function setState(newState: ApplicationState) {
  console.log("new state: ", newState);
  state = newState;
}
