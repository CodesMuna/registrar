import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnroleesComponent } from './enrolees.component';

describe('EnroleesComponent', () => {
  let component: EnroleesComponent;
  let fixture: ComponentFixture<EnroleesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnroleesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnroleesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
