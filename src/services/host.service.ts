import { Injectable } from '@angular/core';
import Peer, { DataConnection } from 'peerjs';
import { boardState } from 'src/_shared/board';
import { EventListenerContainer } from 'src/_shared/types/event-types';
import {
  AllEvents,
  BoardReseted,
  ChoiceConfirmed,
  UpdateBoardState,
  UserChoicesRevealed,
  UserNameChanged,
} from 'src/_shared/types/events';
import { RTCService } from './rtc.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class HostService implements UserService {
  listeners: EventListenerContainer<AllEvents> = {
    ChoiceConfirmed: (data: unknown) => {
      const event = data as ChoiceConfirmed;
      boardState.setUserChoice(event.data.peerId, event.data.newChoice);
      this.broadcastChangesToPeers();
    },
    BoardReseted: (_: unknown) => {
      boardState.initializeNewRound();
      this.broadcastChangesToPeers();
    },
    UserChoicesRevealed: (_: unknown) => {
      boardState.revealUserChoices();
      this.broadcastChangesToPeers();
    },
    UserNameChanged: (data: unknown) => {
      const event = data as UserNameChanged;
      boardState.setUserName(event.data.peerId, event.data.newName);
      this.broadcastChangesToPeers();
    },
  };

  clientConnections: DataConnection[] = [];

  constructor(private readonly rtcService: RTCService) {}

  setup(peer: Peer) {
    boardState.addUserIntoBoard({
      peerId: this.rtcService.myId,
      choice: undefined,
    });
    peer.on('connection', (conn) => {
      console.log('incoming peer connection!');

      conn.on('open', () => {
        this.clientConnections.push(conn);
        boardState.addUserIntoBoard({
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
      data: boardState.getCurrentState(),
    };
    for (const peerConn of this.clientConnections) {
      peerConn.send(event);
    }
  }

  submitChoice(newChoice?: string): void {
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

  getUserCurrentChoice(): string | undefined {
    return boardState.getUserChoice(this.rtcService.myId);
  }

  setUserName(newName: string): void {
    const event: UserNameChanged = {
      type: 'UserNameChanged',
      data: {
        newName,
        peerId: this.rtcService.myId,
      },
    };
    const handleFn = this.listeners[event.type];
    if (!handleFn) return;
    handleFn(event);
  }
}
