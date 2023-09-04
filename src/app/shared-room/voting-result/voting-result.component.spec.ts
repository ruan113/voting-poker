import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VotingResultComponent } from './voting-result.component';

describe('VotingResultComponent', () => {
  let component: VotingResultComponent;
  let fixture: ComponentFixture<VotingResultComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VotingResultComponent]
    });
    fixture = TestBed.createComponent(VotingResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
