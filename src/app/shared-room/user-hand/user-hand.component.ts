import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-user-hand',
  templateUrl: './user-hand.component.html',
  styleUrls: ['./user-hand.component.scss'],
})
export class UserHandComponent {
  options = [0.5, 1, 2, 3, 5, 8];

  @Input() choice: number | undefined = undefined;
  @Output() choiceChanged = new EventEmitter<number | undefined>();

  setChoice(newChoice: number) {
    this.choiceChanged.emit(newChoice);
  }
}
