import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Board, boardState } from 'src/_shared/board';
import { BoardUser } from 'src/_shared/types/board-game-types';
import { RTCService } from 'src/services/rtc.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-shared-room',
  templateUrl: './shared-room.component.html',
  styleUrls: ['./shared-room.component.scss'],
})
export class SharedRoomComponent {
  peerIdFromRoute: string = '';
  isConnected = false;

  users: BoardUser[] = [];

  userService: UserService | undefined = undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private readonly rtcService: RTCService,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const peerIdFromRoute = params.get('peerId');

      if (peerIdFromRoute === null || peerIdFromRoute === '') {
        this.router.navigate([''], { relativeTo: this.route });
      }

      this.peerIdFromRoute = peerIdFromRoute!;
      this.rtcService
        .joinRoom(this.peerIdFromRoute)
        .then((res) => {
          this.isConnected = true;
          this.userService = res;
        })
        .catch((error) => {
          console.error(error);
          this.goBackToLobby();
        });
    });
  }

  setChoice(newChoice?: string) {
    if (!this.getBoardState().areUserChoicesRevealed) {
      this.userService?.submitChoice(newChoice);
    }
  }

  getBoardState(): Board {
    return boardState;
  }

  getCurrentUserChoice(): string | undefined {
    return this.getBoardState().getUserChoice(this.rtcService.myId);
  }

  goBackToLobby() {
    this.router.navigate([''], { relativeTo: this.route });
  }

  resetChoices() {
    this.userService?.resetChoices();
  }

  revealUserChoices() {
    this.userService?.revealUserChoices();
  }
}
