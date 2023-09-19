import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceModule } from 'src/services/services.module';
import { LogoWithTitleComponent } from '../_shared/components/logo-with-title/logo-with-title.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LobbyComponent } from './lobby/lobby.component';
import { MaterialModule } from './material.module';
import { BoardComponent } from './shared-room/components/board/board.component';
import { UserCardListComponent } from './shared-room/components/board/user-card-list/user-card-list.component';
import { InputUserNameModalComponent } from './shared-room/components/input-user-name-modal/input-user-name-modal.component';
import { UserHandComponent } from './shared-room/components/user-hand/user-hand.component';
import { VotingResultComponent } from './shared-room/components/voting-result/voting-result.component';
import { SharedRoomComponent } from './shared-room/shared-room.component';

@NgModule({
  declarations: [
    AppComponent,
    SharedRoomComponent,
    LobbyComponent,
    BoardComponent,
    UserHandComponent,
    VotingResultComponent,
    LogoWithTitleComponent,
    UserCardListComponent,
    InputUserNameModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ServiceModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
