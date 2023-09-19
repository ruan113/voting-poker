import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

const componentList = [
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  MatSelectModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
];

@NgModule({
  imports: componentList,
  exports: componentList,
})
export class MaterialModule {}
