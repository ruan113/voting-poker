import { DataConnection } from 'peerjs';
import { boardState } from 'src/_shared/board';
import { EventListenerContainer } from 'src/_shared/types/event-types';
import {
  BoardReseted,
  ChoiceConfirmed,
  UpdateBoardState,
  UserChoicesRevealed,
  UserNameChanged,
} from 'src/_shared/types/events';
import { UserService } from './user.service';

export class ClientService implements UserService {
  listeners: EventListenerContainer<UpdateBoardState> = {
    UpdateBoardState: async (event: UpdateBoardState) => {
      boardState.updateBoardState(event.data);
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
}
