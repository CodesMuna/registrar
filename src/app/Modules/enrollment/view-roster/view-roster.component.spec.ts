import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRosterComponent } from './view-roster.component';

describe('ViewRosterComponent', () => {
  let component: ViewRosterComponent;
  let fixture: ComponentFixture<ViewRosterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewRosterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewRosterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
