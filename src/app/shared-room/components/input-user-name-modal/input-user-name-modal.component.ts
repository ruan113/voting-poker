import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-input-user-name-modal',
  templateUrl: './input-user-name-modal.component.html',
  styleUrls: ['./input-user-name-modal.component.scss'],
})
export class InputUserNameModalComponent {
  constructor(
    public dialogRef: MatDialogRef<InputUserNameModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string | undefined,
  ) {}

  cancel(): void {
    this.dialogRef.close();
  }
  confirm(): void {
    this.dialogRef.close(this.data);
  }
}
