import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputUserNameModalComponent } from './input-user-name-modal.component';

describe('InputUserNameModalComponent', () => {
  let component: InputUserNameModalComponent;
  let fixture: ComponentFixture<InputUserNameModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InputUserNameModalComponent]
    });
    fixture = TestBed.createComponent(InputUserNameModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
