export abstract class UserService {
  abstract getUserCurrentChoice(): string | undefined;
  abstract submitChoice(newChoice?: string): void;
  abstract resetChoices(): void;
  abstract revealUserChoices(): void;
  abstract setUserName(newName: string): void;
  abstract setUserGameMode(gameMode: string): void;
  abstract disconnectUser(peerId?: string): void;
}
