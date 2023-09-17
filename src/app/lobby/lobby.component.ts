import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  VotingSystemOption,
  votingSystemValues,
} from 'src/_shared/types/board-game-types';
import { RTCService } from 'src/services/rtc.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss'],
})
export class LobbyComponent {
  votingSystemOptions: VotingSystemOption[] = votingSystemValues;
  votingSystemControl = new FormControl<string>(
    this.votingSystemOptions[0].key,
    Validators.nullValidator,
  );

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
}
