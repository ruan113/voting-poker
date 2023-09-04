import { BoardUser } from './types/board-game-types';
import { Event } from './types/event-types';

export type ChoiceConfirmed = Event<
  'ChoiceConfirmed',
  { newChoice: number | undefined; peerId: string }
>;

export type BoardReseted = Event<'BoardReseted', {}>;

export type UserChoicesRevealed = Event<'UserChoicesRevealed', {}>;

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

export type AllEvents = ChoiceConfirmed | BoardReseted | UserChoicesRevealed;
