import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RTCService } from 'src/services/rtc.service';

@Component({
  selector: 'app-connect-to-room',
  templateUrl: './connect-to-room.component.html',
  styleUrls: ['./connect-to-room.component.scss'],
})
export class ConnectToRoomComponent {
  inputText: string = ''; // Para armazenar o texto digitado no campo.

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private readonly rtcService: RTCService,
  ) {}

  async createRoom(): Promise<void> {
    await this.rtcService.joinRoom(this.inputText);
    this.router.navigate(['shared-room', this.inputText], {
      relativeTo: this.route,
    });
  }
}
