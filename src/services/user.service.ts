import { BoardState } from 'src/_shared/events';

export abstract class UserService {
  abstract getUserCurrentChoice(): number | undefined;
  abstract submitChoice(newChoice?: number): void;
  abstract getBoardState(): BoardState;
  abstract resetChoices(): void;
  abstract revealUserChoices(): void;
}
