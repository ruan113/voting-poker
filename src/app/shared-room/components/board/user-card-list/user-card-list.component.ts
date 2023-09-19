import { Component, Input } from '@angular/core';
import { BoardUser } from 'src/_shared/types/board-game-types';

@Component({
  selector: 'app-user-card-list',
  templateUrl: './user-card-list.component.html',
  styleUrls: ['./user-card-list.component.scss'],
})
export class UserCardListComponent {
  @Input() users: BoardUser[] = [];
  @Input() areUserChoicesRevealed: boolean = false;
}
