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
import { BoardComponent } from './shared-room/board/board.component';
import { UserCardListComponent } from './shared-room/board/user-card-list/user-card-list.component';
import { SharedRoomComponent } from './shared-room/shared-room.component';
import { UserHandComponent } from './shared-room/user-hand/user-hand.component';
import { VotingResultComponent } from './shared-room/voting-result/voting-result.component';

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
