import { Injectable } from '@angular/core';
import Peer, { DataConnection } from 'peerjs';
import {
  AllEvents,
  BoardReseted,
  BoardState,
  ChoiceConfirmed,
  UpdateBoardState,
  UserChoicesRevealed,
} from 'src/_shared/events';
import { EventListenerContainer } from 'src/_shared/types/event-types';
import { RTCService } from './rtc.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class HostService implements UserService {
  boardState: BoardState = {
    users: [],
    areUserChoicesRevealed: false,
  };

  listeners: EventListenerContainer<AllEvents> = {
    ChoiceConfirmed: (data: unknown) => {
      const event = data as ChoiceConfirmed;
      const userIndex = this.boardState.users.findIndex(
        (it) => it.peerId === event.data.peerId,
      );

      if (userIndex === -1) return;

      this.boardState.users[userIndex].choice = event.data.newChoice;
      this.broadcastChangesToPeers();
    },
    BoardReseted: (_: unknown) => {
      for (const user of this.boardState.users) {
        user.choice = undefined;
      }
      this.boardState.areUserChoicesRevealed = false;
      this.broadcastChangesToPeers();
    },
    UserChoicesRevealed: (_: unknown) => {
      this.boardState.areUserChoicesRevealed = true;
      this.broadcastChangesToPeers();
    },
  };

  clientConnections: DataConnection[] = [];

  constructor(private readonly rtcService: RTCService) {}

  setup(peer: Peer) {
    this.boardState.users.push({
      name: this.rtcService.myId.slice(0, 5),
      peerId: this.rtcService.myId,
      choice: undefined,
    });
    peer.on('connection', (conn) => {
      console.log('incoming peer connection!');

      conn.on('open', () => {
        this.clientConnections.push(conn);

        const playerAlreadyAdded = this.boardState.users.find(
          (it) => it.peerId === conn.peer,
        );
        if (!playerAlreadyAdded)
          this.boardState.users.push({
            name: conn.peer.slice(0, 5),
            peerId: conn.peer,
            choice: undefined,
          });

        this.broadcastChangesToPeers();
      });

      conn.on('data', (event: any) => {
        console.log(`Event coming from peer ${conn.peer}, data: ${event}`);
        const handleFn = this.listeners[event.type];
        if (!handleFn) return;
        handleFn(event);
      });
    });
  }

  async broadcastChangesToPeers(): Promise<void> {
    const event: UpdateBoardState = {
      type: 'UpdateBoardState',
      data: this.boardState,
    };
    for (const peerConn of this.clientConnections) {
      peerConn.send(event);
    }
  }

  submitChoice(newChoice?: number): void {
    const event: ChoiceConfirmed = {
      type: 'ChoiceConfirmed',
      data: {
        newChoice,
        peerId: this.rtcService.myId,
      },
    };
    const handleFn = this.listeners[event.type];
    if (!handleFn) return;
    handleFn(event);
  }

  getBoardState(): BoardState {
    return this.boardState;
  }

  resetChoices(): void {
    const event: BoardReseted = {
      type: 'BoardReseted',
      data: {},
    };
    const handleFn = this.listeners[event.type];
    if (!handleFn) return;
    handleFn(event);
  }

  revealUserChoices(): void {
    const event: UserChoicesRevealed = {
      type: 'UserChoicesRevealed',
      data: {},
    };
    const handleFn = this.listeners[event.type];
    if (!handleFn) return;
    handleFn(event);
  }

  getUserCurrentChoice(): number | undefined {
    const user = this.boardState.users.find(
      (it) => it.peerId === this.rtcService.myId,
    );
    return user?.choice;
  }
}
