import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LobbyComponent } from './lobby/lobby.component';
import { SharedRoomComponent } from './shared-room/shared-room.component';

const routes: Routes = [
  { path: '', component: LobbyComponent },
  { path: 'shared-room/:peerId', component: SharedRoomComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
