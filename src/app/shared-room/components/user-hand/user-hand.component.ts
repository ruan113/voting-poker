import { Component, EventEmitter, Input, Output } from '@angular/core';
import { boardState } from 'src/_shared/board';
import { GameModeType } from 'src/_shared/types/events';

@Component({
  selector: 'app-user-hand',
  templateUrl: './user-hand.component.html',
  styleUrls: ['./user-hand.component.scss'],
})
export class UserHandComponent {
  options = boardState.votingSystem.cards;

  @Input() gameMode: GameModeType = 'Player';

  @Input() choice: string | undefined = undefined;
  @Output() choiceChanged = new EventEmitter<string | undefined>();

  setChoice(newChoice: string) {
    if (newChoice === this.choice) {
      this.choiceChanged.emit(undefined);
    } else {
      this.choiceChanged.emit(newChoice);
    }
  }
}
