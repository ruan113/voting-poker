import { BoardState } from './board-game-types';
import { Event } from './event-types';

export type GameModeType = 'Player' | 'Viewer';

export type ChoiceConfirmed = Event<
  'ChoiceConfirmed',
  { newChoice: string | undefined; peerId: string }
>;

export type BoardReseted = Event<'BoardReseted', {}>;

export type UserChoicesRevealed = Event<'UserChoicesRevealed', {}>;

export type UserGameModeChanged = Event<
  'UserGameModeChanged',
  { peerId: string; newGameMode: GameModeType }
>;

export type UserNameChanged = Event<
  'UserNameChanged',
  { peerId: string; newName: string }
>;

export type UserDisconnected = Event<'UserDisconnected', { peerId: string }>;

export type PingEmitted = Event<'PingEmitted', {}>;
export type PingRecognized = Event<'PingRecognized', { peerId: string }>;

export function getBoardInitialState(): BoardState {
  return {
    users: [],
    areUserChoicesRevealed: false,
  };
}

export type BoardStateUpdated = Event<'BoardStateUpdated', BoardState>;

export type HostEvents =
  | ChoiceConfirmed
  | BoardReseted
  | UserChoicesRevealed
  | UserNameChanged
  | UserGameModeChanged
  | UserDisconnected
  | PingRecognized;

export type ClientEvents = BoardStateUpdated | PingEmitted;

export type AppEvent = HostEvents | ClientEvents;
