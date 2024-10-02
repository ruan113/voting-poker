import { ConfettiService } from 'src/services/confetti.service';
import {
  BoardState,
  BoardUser,
  UserState,
  VotingSystemOption,
  votingSystemValues,
} from './types/board-game-types';
import { GameModeType, getBoardInitialState } from './types/events';

const DEFAULT_GAME_NAME = 'Planning poker game';
const DEFAULT_VOTING_SYSTEM = votingSystemValues[0];

export class Board {
  private _votingSystem: VotingSystemOption = votingSystemValues[0];
  private _gameName: string = DEFAULT_GAME_NAME;
  private _users: BoardUser[] = [];
  private _areUserChoicesRevealed = false;

  initializeNewBoard(
    votingSystem?: VotingSystemOption,
    gameName?: string,
  ): void {
    this._gameName = gameName ?? DEFAULT_GAME_NAME;
    this._votingSystem = votingSystem ?? DEFAULT_VOTING_SYSTEM;
    this.updateBoardState(getBoardInitialState());
  }

  get areUserChoicesRevealed(): boolean {
    return this._areUserChoicesRevealed;
  }

  get votingSystem(): VotingSystemOption {
    return this._votingSystem;
  }

  get gameName(): string {
    return this._gameName;
  }

  getUsers(): BoardUser[] {
    return this._users;
  }

  initializeNewRound(): void {
    for (const user of this.getUsers()) {
      user.choice = undefined;
    }
    this._areUserChoicesRevealed = false;
  }

  revealUserChoices(): void {
    this._areUserChoicesRevealed = true;

    const choices = Array.from(
      this._users.reduce((acc, it) => {
        const isEmpty = it.choice === undefined || it.choice === null;
        const isNumber = !isNaN(Number(it.choice));
        if (!isEmpty && isNumber) acc.add(it.choice);
        return acc;
      }, new Set()),
    );

    if (choices.length === 1) {
      const confettiService = new ConfettiService();
      confettiService.execDefaultAnimation();
    }
  }

  setUserChoice(userPeerId: string, newChoice?: string): void {
    const userIndex = boardState
      .getUsers()
      .findIndex((it) => it.peerId === userPeerId);

    if (userIndex === -1) return;

    this._users[userIndex].choice = newChoice;
  }

  getCurrentState(): BoardState {
    return {
      areUserChoicesRevealed: this._areUserChoicesRevealed,
      users: this._users,
    };
  }

  updateBoardState(newState: BoardState): void {
    this._areUserChoicesRevealed = newState.areUserChoicesRevealed;
    this._users = newState.users;
  }

  getUserChoice(userPeerId: string): string | undefined {
    const user = boardState.getUsers().find((it) => it.peerId === userPeerId);
    return user?.choice;
  }

  getUserGameMode(userPeerId: string): GameModeType | undefined {
    const user = boardState.getUsers().find((it) => it.peerId === userPeerId);
    return user?.gameMode;
  }

  setUserName(userPeerId: string, userName: string): void {
    this._users = this._users.map((user) => {
      if (user.peerId === userPeerId) {
        user.name = userName;
      }
      return user;
    });
  }

  setUserGameMode(userPeerId: string, gameMode: GameModeType): void {
    this._users = this._users.map((user) => {
      if (user.peerId === userPeerId) {
        user.gameMode = gameMode;
      }
      return user;
    });
  }

  setUserState(userPeerId: string, state: UserState): void {
    this._users = this._users.map((user) => {
      if (user.peerId === userPeerId) {
        user.state = state;
      }
      return user;
    });
  }

  addUserIntoBoard(userPeerId: string): void {
    const playerAlreadyAdded = this._users.find(
      (it) => it.peerId === userPeerId,
    );

    if (playerAlreadyAdded) {
      return;
    }
    this._users.push({
      peerId: userPeerId,
      name: this.getAnAnonymousName(),
      state: 'Connected',
      gameMode: 'Player',
    });
  }

  removeUserFromBoard(userPeerId): void {
    const userIndex = this._users.findIndex((it) => it.peerId === userPeerId);

    if (userIndex === -1) return;

    this._users.splice(userIndex, 1);
  }

  private getAnAnonymousName() {
    const availableNames = this._users.map((it) => it.name);
    let i = 1;
    let nameAlreadyExists = true;
    let result;
    do {
      result = `Anonymous ${i}`;
      nameAlreadyExists = availableNames.includes(result);
      i++;
    } while (nameAlreadyExists);
    return result;
  }
}

export const boardState = new Board();
