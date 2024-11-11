import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradespageComponent } from './gradespage.component';

describe('GradespageComponent', () => {
  let component: GradespageComponent;
  let fixture: ComponentFixture<GradespageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GradespageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GradespageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
