import { BoardUser } from './board-game-types';
import { Event } from './event-types';

export type ChoiceConfirmed = Event<
  'ChoiceConfirmed',
  { newChoice: string | undefined; peerId: string }
>;

export type BoardReseted = Event<'BoardReseted', {}>;

export type UserChoicesRevealed = Event<'UserChoicesRevealed', {}>;
export type UserNameChanged = Event<
  'UserNameChanged',
  { peerId: string; newName: string }
>;

export function getBoardInitialState() {
  return {
    users: [],
    areUserChoicesRevealed: false,
  };
}

export type BoardState = {
  users: BoardUser[];
  areUserChoicesRevealed: boolean;
};

export type UpdateBoardState = Event<'UpdateBoardState', BoardState>;

export type AllEvents =
  | ChoiceConfirmed
  | BoardReseted
  | UserChoicesRevealed
  | UserNameChanged;
