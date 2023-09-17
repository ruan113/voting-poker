import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BoardState } from 'src/_shared/types/events';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  @Input() board: BoardState = {
    users: [],
    areUserChoicesRevealed: false,
  };

  @Output() resetChoices = new EventEmitter<void>();
  @Output() revealUserChoices = new EventEmitter<void>();

  handleResetChoices() {
    this.resetChoices.emit();
  }
  handleRevealUserChoices() {
    this.revealUserChoices.emit();
  }
}
