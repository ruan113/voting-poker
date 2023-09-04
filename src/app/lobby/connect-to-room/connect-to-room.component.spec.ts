import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectToRoomComponent } from './connect-to-room.component';

describe('ConnectToRoomComponent', () => {
  let component: ConnectToRoomComponent;
  let fixture: ComponentFixture<ConnectToRoomComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConnectToRoomComponent]
    });
    fixture = TestBed.createComponent(ConnectToRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
