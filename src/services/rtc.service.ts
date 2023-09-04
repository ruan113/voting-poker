import { Injectable } from '@angular/core';

import { Peer } from 'peerjs';
import { waitUntil } from 'src/_shared/wait-until';
import { ClientService } from './client.service';
import { HostService } from './host.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class RTCService {
  private _myId: string = '';
  private peer: Peer;

  isReady = false;

  constructor() {
    this.peer = new Peer();

    this.peer.on('open', (id) => {
      console.log(
        'My connection was stabilished with PeerJs, my peer ID is: ' + id,
      );
      this._myId = id;
      this.isReady = true;
    });

    this.peer.on('error', (error) => {
      console.error(error);
    });
  }

  get myId() {
    return this._myId;
  }

  async joinRoom(peerId: string): Promise<UserService> {
    console.log(`Connecting to ${peerId}...`);
    await waitUntil(() => Boolean(this.isReady), true);
    if (peerId === this._myId) {
      console.log('I am the host');

      const hostService = new HostService(this);
      hostService.setup(this.peer);
      return hostService;
    }

    console.log('I am a peer');
    let conn = this.peer.connect(peerId);
    console.log(conn);

    return new Promise((resolve, reject) => {
      conn.on('open', () => {
        console.log(`Client ${this._myId} connected to ${peerId}`);
        resolve(new ClientService(this._myId, conn));
      });
      conn.on('error', (error) => {
        reject(error);
      });
    });
  }
}
