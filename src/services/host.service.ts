import { Injectable } from '@angular/core';
import Peer, { DataConnection } from 'peerjs';
import { boardState } from 'src/_shared/board';
import { EventListenerContainer } from 'src/_shared/types/event-types';
import {
  BoardReseted,
  BoardStateUpdated,
  ChoiceConfirmed,
  HostEvents,
  PingEmitted,
  PingRecognized,
  UserChoicesRevealed,
  UserDisconnected,
  UserNameChanged,
} from 'src/_shared/types/events';
import { addSecondsToDate } from 'src/_shared/utils/add-seconds-to-date';
import { RTCService } from './rtc.service';
import { UserService } from './user.service';

type ClientConnection = DataConnection & { lastEventAt?: Date };

@Injectable({
  providedIn: 'root',
})
export class HostService implements UserService {
  private listeners: EventListenerContainer<HostEvents> = {
    ChoiceConfirmed: (data: unknown) => {
      const event = data as ChoiceConfirmed;
      boardState.setUserChoice(event.data.peerId, event.data.newChoice);
      this.sendBoardStateForAllClients();
    },
    BoardReseted: (_: unknown) => {
      boardState.initializeNewRound();
      this.sendBoardStateForAllClients();
    },
    UserChoicesRevealed: (_: unknown) => {
      boardState.revealUserChoices();
      this.sendBoardStateForAllClients();
    },
    UserNameChanged: (data: unknown) => {
      const event = data as UserNameChanged;
      boardState.setUserName(event.data.peerId, event.data.newName);
      this.sendBoardStateForAllClients();
    },
    UserDisconnected: (data: unknown) => {
      const event = data as UserDisconnected;
      this.disconnectUser(event.data.peerId);
    },
    PingRecognized: (data: unknown) => {
      const event = data as PingRecognized;
      this.clientConnections = this.clientConnections.map((it) => {
        if (it.peer === event.data.peerId) {
          console.log(`ping recognized by ${it.peer}`);
          it.lastEventAt = new Date();
        }
        return it;
      });
    },
  };

  private clientConnections: ClientConnection[] = [];

  constructor(private readonly rtcService: RTCService) {
    setInterval(() => {
      this.clientConnections.forEach((client) => this.pingAClient(client));
    }, 10000);
    setInterval(() => {
      this.clientConnections.forEach((client): void => {
        this.updateUserStatusIfNeeded(client);
        this.disconnectUserIfDidntAnsweredWithinXSeconds(client, 30);
      });
    }, 1000);
  }

  private pingAClient(client: ClientConnection): void {
    const pingEmittedEvent: PingEmitted = {
      type: 'PingEmitted',
      data: {},
    };

    if (!client.lastEventAt) {
      client.send(pingEmittedEvent);
      return;
    }

    const lastEventTimePlusTenSeconds = addSecondsToDate(
      client.lastEventAt,
      10,
    );
    const lastEventHappenedWithinTenSeconds =
      lastEventTimePlusTenSeconds.getTime() > new Date().getTime();
    if (lastEventHappenedWithinTenSeconds) {
      return;
    }
    console.log('ping emitted');
    client.send(pingEmittedEvent);
  }

  private disconnectUserIfDidntAnsweredWithinXSeconds(
    client: ClientConnection,
    seconds: number,
  ) {
    if (!client || !client.lastEventAt) {
      return;
    }

    const lastEventTimePlusTimeToBeDisconnected = addSecondsToDate(
      client.lastEventAt,
      seconds,
    );
    const shouldBeDisconnected =
      new Date().getTime() > lastEventTimePlusTimeToBeDisconnected.getTime();
    if (shouldBeDisconnected) {
      this.disconnectUser(client.peer);
    }
  }

  private updateUserStatusIfNeeded(client: ClientConnection) {
    if (!client || !client.lastEventAt) return;

    if (
      addSecondsToDate(client.lastEventAt, 10).getTime() < new Date().getTime()
    ) {
      boardState.setUserState(client.peer, 'Away');
      this.sendBoardStateForAllClients();
    }
  }

  setup(peer: Peer) {
    boardState.addUserIntoBoard(this.rtcService.myId);

    peer.on('connection', (conn) => {
      console.log('incoming peer connection!');

      conn.on('open', () => {
        console.log('Connection opened');
        this.clientConnections.push(conn);
        boardState.addUserIntoBoard(conn.peer);
        this.sendBoardStateForAllClients();
      });

      conn.on('data', (event: any) => {
        console.log(`Event coming from peer ${conn.peer}, data: ${event}`);
        const handleFn = this.listeners[event.type];
        if (!handleFn) return;
        handleFn(event);

        const index = this.clientConnections.findIndex(
          (it) => it.peer === conn.peer,
        );
        if (index !== -1) return;
        this.clientConnections[index].lastEventAt = new Date();
      });

      conn.on('close', () => {
        console.log('Connection closed');
        const index = this.clientConnections.findIndex(
          (it) => it.peer === conn.peer,
        );
        if (index !== -1) return;

        boardState.removeUserFromBoard(conn.peer);
        this.clientConnections.splice(index, 1);
        this.sendBoardStateForAllClients();
      });
    });
  }

  private sendBoardStateForAllClients() {
    const event: BoardStateUpdated = {
      type: 'BoardStateUpdated',
      data: boardState.getCurrentState(),
    };
    for (const peerConn of this.clientConnections) {
      if (peerConn) peerConn.send(event);
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

  disconnectUser(peerId?: string): void {
    const index = this.clientConnections.findIndex((it) => it.peer === peerId);
    if (index === -1) return;

    boardState.removeUserFromBoard(peerId);
    this.clientConnections.splice(index, 1);
    this.sendBoardStateForAllClients();
  }
}
