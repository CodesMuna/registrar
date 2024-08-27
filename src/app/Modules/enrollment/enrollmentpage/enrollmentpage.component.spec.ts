import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentpageComponent } from './enrollmentpage.component';

describe('EnrollmentpageComponent', () => {
  let component: EnrollmentpageComponent;
  let fixture: ComponentFixture<EnrollmentpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnrollmentpageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrollmentpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
