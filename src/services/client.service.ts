import { DataConnection } from 'peerjs';
import { EventListenerContainer } from 'src/_shared/types/event-types';
import {
  BoardReseted,
  BoardState,
  ChoiceConfirmed,
  UpdateBoardState,
  UserChoicesRevealed,
} from 'src/_shared/types/events';
import { UserService } from './user.service';

export class ClientService implements UserService {
  boardState: BoardState = {
    areUserChoicesRevealed: false,
    users: [],
  };

  listeners: EventListenerContainer<UpdateBoardState> = {
    UpdateBoardState: async (event: UpdateBoardState) => {
      this.boardState = event.data;
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

  submitChoice(newChoice?: number): void {
    const event: ChoiceConfirmed = {
      type: 'ChoiceConfirmed',
      data: {
        newChoice,
        peerId: this.peerId,
      },
    };
    const user = this.boardState.users.find((it) => it.peerId === this.peerId);
    if (user) user.choice = newChoice;

    this.hostConnection.send(event);
  }

  getBoardState(): BoardState {
    return this.boardState;
  }

  resetChoices(): void {
    const event: BoardReseted = {
      type: 'BoardReseted',
      data: {},
    };
    for (const user of this.boardState.users) {
      user.choice = undefined;
    }
    this.boardState.areUserChoicesRevealed = false;

    this.hostConnection.send(event);
  }

  revealUserChoices(): void {
    const event: UserChoicesRevealed = {
      type: 'UserChoicesRevealed',
      data: {},
    };
    this.boardState.areUserChoicesRevealed = true;
    this.hostConnection.send(event);
  }

  getUserCurrentChoice(): number | undefined {
    const user = this.boardState.users.find((it) => it.peerId === this.peerId);
    return user?.choice;
  }
}
