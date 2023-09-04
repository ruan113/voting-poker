import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RTCService } from 'src/services/rtc.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss'],
})
export class LobbyComponent {
  activeScreen: 'Lobby' | 'ConnectToRoom' = 'Lobby';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private readonly rtcService: RTCService,
  ) {}

  goToSharedRoom() {
    this.router.navigate(['shared-room', `${this.rtcService.myId}`], {
      relativeTo: this.route,
    });
  }

  goToConnectToRoomScreen() {
    this.activeScreen = 'ConnectToRoom';
  }
}
