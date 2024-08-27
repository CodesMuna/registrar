import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RosteringComponent } from './rostering.component';

describe('RosteringComponent', () => {
  let component: RosteringComponent;
  let fixture: ComponentFixture<RosteringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RosteringComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RosteringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
