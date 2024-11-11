import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentgradesComponent } from './studentgrades.component';

describe('StudentgradesComponent', () => {
  let component: StudentgradesComponent;
  let fixture: ComponentFixture<StudentgradesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentgradesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentgradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
