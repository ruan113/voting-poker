import {
  BoardUser,
  VotingSystemOption,
  votingSystemValues,
} from './types/board-game-types';
import { BoardState } from './types/events';

const DEFAULT_GAME_NAME = 'Planning poker game';

export class Board {
  private _votingSystem: VotingSystemOption = votingSystemValues[0];
  private _gameName: string = DEFAULT_GAME_NAME;
  private _users: BoardUser[] = [];
  private _areUserChoicesRevealed = false;

  initializeNewBoard(
    votingSystem: VotingSystemOption,
    gameName?: string,
  ): void {
    this._gameName = gameName ?? DEFAULT_GAME_NAME;
    this._votingSystem = votingSystem;
    this._users = [];
    this._areUserChoicesRevealed = false;
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

  setUserName(userPeerId: string, userName: string): void {
    this._users = this._users.map((user) => {
      if (user.peerId === userPeerId) {
        user.name = userName;
      }
      return user;
    });
  }

  addUserIntoBoard(user: Omit<BoardUser, 'name'> & { name?: string }): void {
    const playerAlreadyAdded = this._users.find(
      (it) => it.peerId === user.peerId,
    );

    if (playerAlreadyAdded) {
      return;
    }
    this._users.push({ ...user, name: user.name ?? this.getAnAnonymousName() });
  }

  private getAnAnonymousName() {
    const availableNames = this._users.map((it) => it.name);
    let i = 1;
    let result = `Anonymous ${i}`;
    while (availableNames.includes(result)) {
      i++;
    }
    return result;
  }
}

export const boardState = new Board();
