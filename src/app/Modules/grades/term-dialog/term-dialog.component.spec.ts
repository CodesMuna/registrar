import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermDialogComponent } from './term-dialog.component';

describe('TermDialogComponent', () => {
  let component: TermDialogComponent;
  let fixture: ComponentFixture<TermDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TermDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TermDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
