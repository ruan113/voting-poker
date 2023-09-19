import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BoardState, BoardUser } from 'src/_shared/types/board-game-types';
import { getBoardInitialState } from 'src/_shared/types/events';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  @Input() board: BoardState = getBoardInitialState();

  @Output() resetChoices = new EventEmitter<void>();
  @Output() revealUserChoices = new EventEmitter<void>();

  handleResetChoices() {
    this.resetChoices.emit();
  }
  handleRevealUserChoices() {
    this.revealUserChoices.emit();
  }

  getUserList(): GetUserListResult {
    const keys = ['upper', 'bottom'];
    const result: GetUserListResult = {
      upper: [],
      bottom: [],
    };

    if (this.board.users.length === 0) {
      return result;
    }

    this.board.users.forEach((it, index) => {
      result[keys[index % 2]].push(it);
    });

    return result;
  }
}

type GetUserListResult = {
  upper: BoardUser[];
  bottom: BoardUser[];
};
