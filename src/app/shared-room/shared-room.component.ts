import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Board, boardState } from 'src/_shared/board';
import { BoardUser } from 'src/_shared/types/board-game-types';
import { waitUntil } from 'src/_shared/utils/wait-until';
import { RTCService } from 'src/services/rtc.service';
import { UserService } from 'src/services/user.service';
import { InputUserNameModalComponent } from './components/input-user-name-modal/input-user-name-modal.component';

@Component({
  selector: 'app-shared-room',
  templateUrl: './shared-room.component.html',
  styleUrls: ['./shared-room.component.scss'],
})
export class SharedRoomComponent {
  peerIdFromRoute: string = '';
  isConnected = false;
  showTakingTooLongMessage = false;

  users: BoardUser[] = [];

  userService: UserService | undefined = undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private readonly rtcService: RTCService,
    public dialog: MatDialog,
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

          this.openInputUserNameModal();
        })
        .catch((error) => {
          console.error(error);
          this.goBackToLobby();
        });

      waitUntil(() => this.isConnected, true)
        .then()
        .catch(() => {
          this.showTakingTooLongMessage = true;
        });
    });
  }

  ngOnDestroy() {
    this.userService?.disconnectUser();
  }

  openInputUserNameModal(): void {
    const dialogRef = this.dialog.open(InputUserNameModalComponent, {
      data: undefined,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService?.setUserName(result);
      }
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
