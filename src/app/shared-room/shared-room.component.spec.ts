import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedRoomComponent } from './shared-room.component';

describe('SharedRoomComponent', () => {
  let component: SharedRoomComponent;
  let fixture: ComponentFixture<SharedRoomComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SharedRoomComponent],
    });
    fixture = TestBed.createComponent(SharedRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
