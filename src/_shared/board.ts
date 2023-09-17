import {
  BoardUser,
  VotingSystemOption,
  votingSystemValues,
} from './types/board-game-types';
import { BoardState } from './types/events';

export class Board {
  private _votingSystem: VotingSystemOption = votingSystemValues[0];
  private _gameName: string = 'Planning poker game';
  private _users: BoardUser[] = [];
  private _areUserChoicesRevealed = false;

  get areUserChoicesRevealed(): boolean {
    return this._areUserChoicesRevealed;
  }

  get votingSystem(): VotingSystemOption {
    return this._votingSystem;
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

  revealUserChoices() {
    this._areUserChoicesRevealed = true;
  }

  setUserChoice(userPeerId: string, newChoice?: string) {
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

  getUserChoice(userPeerId: string): string | undefined {
    const user = boardState.getUsers().find((it) => it.peerId === userPeerId);
    return user?.choice;
  }

  addUserIntoBoard(user: BoardUser) {
    const playerAlreadyAdded = this._users.find(
      (it) => it.peerId === user.peerId,
    );

    if (playerAlreadyAdded) {
      return;
    }
    this._users.push(user);
  }
}

export const boardState = new Board();
