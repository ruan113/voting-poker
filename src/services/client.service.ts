import { DataConnection } from 'peerjs';
import { boardState } from 'src/_shared/board';
import { EventListenerContainer } from 'src/_shared/types/event-types';
import {
  BoardReseted,
  BoardStateUpdated,
  ChoiceConfirmed,
  ClientEvents,
  GameModeType,
  PingRecognized,
  UserChoicesRevealed,
  UserDisconnected,
  UserGameModeChanged,
  UserNameChanged,
} from 'src/_shared/types/events';
import { ConfettiService } from './confetti.service';
import { UserService } from './user.service';

export class ClientService implements UserService {
  private listeners: EventListenerContainer<ClientEvents> = {
    BoardStateUpdated: async (data: unknown) => {
      const event = data as BoardStateUpdated;
      if (
        boardState.areUserChoicesRevealed === false &&
        event.data.areUserChoicesRevealed === true
      ) {
        this.checkIfConfettiShouldDeploy();
      }
      boardState.updateBoardState(event.data);
    },
    PingEmitted: async (_: unknown) => {
      const event: PingRecognized = {
        type: 'PingRecognized',
        data: {
          peerId: this.peerId,
        },
      };
      this.hostConnection.send(event);
    },
  };

  constructor(
    private readonly peerId: string,
    private readonly hostConnection: DataConnection,
  ) {
    hostConnection.on('data', (event: any) => {
      console.log(`Player ${peerId} received: ${event}`);
      const handleFn = this.listeners[event.type];
      if (!handleFn) return;
      handleFn(event);
    });
  }

  private checkIfConfettiShouldDeploy() {
    const choices = Array.from(
      boardState.getUsers().reduce((acc, it) => {
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

  submitChoice(newChoice?: string): void {
    const event: ChoiceConfirmed = {
      type: 'ChoiceConfirmed',
      data: {
        newChoice,
        peerId: this.peerId,
      },
    };
    boardState.setUserChoice(this.peerId, newChoice);

    this.hostConnection.send(event);
  }

  resetChoices(): void {
    const event: BoardReseted = {
      type: 'BoardReseted',
      data: {},
    };
    boardState.initializeNewRound();
    this.hostConnection.send(event);
  }

  revealUserChoices(): void {
    const event: UserChoicesRevealed = {
      type: 'UserChoicesRevealed',
      data: {},
    };
    this.checkIfConfettiShouldDeploy();
    boardState.revealUserChoices();
    this.hostConnection.send(event);
  }

  getUserCurrentChoice(): string | undefined {
    return boardState.getUserChoice(this.peerId);
  }

  setUserName(newName: string): void {
    const event: UserNameChanged = {
      type: 'UserNameChanged',
      data: {
        newName,
        peerId: this.peerId,
      },
    };
    boardState.setUserName(this.peerId, newName);
    this.hostConnection.send(event);
  }

  setUserGameMode(gameMode: GameModeType): void {
    const event: UserGameModeChanged = {
      type: 'UserGameModeChanged',
      data: {
        newGameMode: gameMode,
        peerId: this.peerId,
      },
    };
    boardState.setUserGameMode(this.peerId, gameMode);
    this.hostConnection.send(event);
  }

  async disconnectUser(): Promise<void> {
    const event: UserDisconnected = {
      type: 'UserDisconnected',
      data: {
        peerId: this.peerId,
      },
    };
    boardState.initializeNewBoard();
    this.hostConnection.send(event);
  }
}
