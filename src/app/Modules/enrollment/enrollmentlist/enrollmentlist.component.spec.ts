import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentlistComponent } from './enrollmentlist.component';

describe('EnrollmentlistComponent', () => {
  let component: EnrollmentlistComponent;
  let fixture: ComponentFixture<EnrollmentlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnrollmentlistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrollmentlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
