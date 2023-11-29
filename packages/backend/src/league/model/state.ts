import { State } from "@glitter-boys/data";

let state: State = { gamesStarted: [] };

export function getState(): State {
  return state;
}

export function setState(newState: State) {
  state = newState;
}
