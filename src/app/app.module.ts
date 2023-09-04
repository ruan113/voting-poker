import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';
import { ServiceModule } from 'src/services/services.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConnectToRoomComponent } from './lobby/connect-to-room/connect-to-room.component';
import { LobbyComponent } from './lobby/lobby.component';
import { SharedRoomComponent } from './shared-room/shared-room.component';
import { BoardComponent } from './shared-room/board/board.component';
import { UserHandComponent } from './shared-room/user-hand/user-hand.component';
import { VotingResultComponent } from './shared-room/voting-result/voting-result.component';

@NgModule({
  declarations: [
    AppComponent,
    SharedRoomComponent,
    LobbyComponent,
    ConnectToRoomComponent,
    BoardComponent,
    UserHandComponent,
    VotingResultComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, ServiceModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
