import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarpageComponent } from './registrarpage.component';

describe('RegistrarpageComponent', () => {
  let component: RegistrarpageComponent;
  let fixture: ComponentFixture<RegistrarpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarpageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
