import { Injectable } from '@angular/core';
import Peer, { DataConnection } from 'peerjs';
import { boardState } from 'src/_shared/board';
import { EventListenerContainer } from 'src/_shared/types/event-types';
import {
  AppEvent,
  BoardReseted,
  BoardStateUpdated,
  ChoiceConfirmed,
  GameModeType,
  HostEvents,
  PingEmitted,
  PingRecognized,
  UserChoicesRevealed,
  UserDisconnected,
  UserGameModeChanged,
  UserNameChanged,
} from 'src/_shared/types/events';
import { addSecondsToDate } from 'src/_shared/utils/add-seconds-to-date';
import { ConfettiService } from './confetti.service';
import { RTCService } from './rtc.service';
import { UserService } from './user.service';

const TIME_TO_CONSIDER_AWAY = 20;

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
    UserChoicesRevealed: (data: unknown) => {
      const event = data as BoardStateUpdated;
      if (
        boardState.areUserChoicesRevealed === false &&
        event.data.areUserChoicesRevealed === true
      ) {
        this.checkIfConfettiShouldDeploy();
      }
      boardState.revealUserChoices();
      this.sendBoardStateForAllClients();
    },
    UserNameChanged: (data: unknown) => {
      const event = data as UserNameChanged;
      boardState.setUserName(event.data.peerId, event.data.newName);
      this.sendBoardStateForAllClients();
    },
    UserGameModeChanged: (data: unknown) => {
      const event = data as UserGameModeChanged;
      boardState.setUserGameMode(event.data.peerId, event.data.newGameMode);
      this.sendBoardStateForAllClients();
    },
    UserDisconnected: (data: unknown) => {
      const event = data as UserDisconnected;
      this.disconnectUser(event.data.peerId);
    },
    PingRecognized: (data: unknown) => {
      const event = data as PingRecognized;
      const index = this.clientConnections.findIndex(
        (it) => it.peer === event.data.peerId,
      );

      if (index !== -1) {
        this.clientConnections[index].lastEventAt = new Date();
        boardState.setUserState(
          this.clientConnections[index].peer,
          'Connected',
        );
        this.sendBoardStateForAllClients();
        console.log(
          `${this.clientConnections[index].peer} reconized at: ${this.clientConnections[index].lastEventAt}`,
        );
      }
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
    if (lastEventHappenedWithinTenSeconds) return;

    console.log('ping emitted');
    client.send(pingEmittedEvent);
  }

  private disconnectUserIfDidntAnsweredWithinXSeconds(
    client: ClientConnection,
    seconds: number,
  ) {
    if (!client || !client.lastEventAt) return;

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
      new Date().getTime() >
      addSecondsToDate(client.lastEventAt, TIME_TO_CONSIDER_AWAY).getTime()
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
        this.appendEvent(event);

        const index = this.clientConnections.findIndex(
          (it) => it.peer === conn.peer,
        );
        if (index === -1) return;
        this.clientConnections[index].lastEventAt = new Date();
      });

      conn.on('close', () => {
        console.log('Connection closed');
        const index = this.clientConnections.findIndex(
          (it) => it.peer === conn.peer,
        );
        if (index === -1) return;

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

  private appendEvent(event: AppEvent): void {
    const handleFn = this.listeners[event.type];
    if (!handleFn) return;
    handleFn(event);
  }

  submitChoice(newChoice?: string): void {
    const event: ChoiceConfirmed = {
      type: 'ChoiceConfirmed',
      data: {
        newChoice,
        peerId: this.rtcService.myId,
      },
    };
    this.appendEvent(event);
  }

  resetChoices(): void {
    const event: BoardReseted = {
      type: 'BoardReseted',
      data: {},
    };
    this.appendEvent(event);
  }

  revealUserChoices(): void {
    const event: UserChoicesRevealed = {
      type: 'UserChoicesRevealed',
      data: {},
    };
    this.appendEvent(event);
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
    this.appendEvent(event);
  }

  setUserGameMode(gameMode: GameModeType): void {
    const event: UserGameModeChanged = {
      type: 'UserGameModeChanged',
      data: {
        newGameMode: gameMode,
        peerId: this.rtcService.myId,
      },
    };
    this.appendEvent(event);
  }

  disconnectUser(peerId?: string): void {
    const index = this.clientConnections.findIndex((it) => it.peer === peerId);
    if (index === -1) return;

    boardState.removeUserFromBoard(peerId);
    this.clientConnections.splice(index, 1);
    this.sendBoardStateForAllClients();
  }
}
