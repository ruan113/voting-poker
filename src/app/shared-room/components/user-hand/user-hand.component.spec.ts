import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserHandComponent } from './user-hand.component';

describe('UserHandComponent', () => {
  let component: UserHandComponent;
  let fixture: ComponentFixture<UserHandComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserHandComponent]
    });
    fixture = TestBed.createComponent(UserHandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
