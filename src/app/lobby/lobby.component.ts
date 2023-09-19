import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { boardState } from 'src/_shared/board';
import {
  VotingSystemOption,
  votingSystemValues,
} from 'src/_shared/types/board-game-types';
import { waitUntil } from 'src/_shared/utils/wait-until';
import { RTCService } from 'src/services/rtc.service';

const DEFAULT_VOTING_SYSTEM = votingSystemValues[0];

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
  gameName?: string;
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private readonly rtcService: RTCService,
  ) {}

  async goToSharedRoom(): Promise<void> {
    this.loading = true;
    try {
      boardState.initializeNewBoard(
        votingSystemValues.find(
          (it) => it.key === this.votingSystemControl.value,
        ) ?? DEFAULT_VOTING_SYSTEM,
        this.gameName,
      );

      await waitUntil(() => this.rtcService.myId !== '', true);

      this.router.navigate(['shared-room', `${this.rtcService.myId}`], {
        relativeTo: this.route,
      });
    } catch (error) {
      console.error(error);
    }
    this.loading = false;
  }
}
