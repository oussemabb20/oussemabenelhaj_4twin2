import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmDialogComponent } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.isOpen).toBeFalse();
    expect(component.title).toBe('Confirm Delete');
    expect(component.message).toBe('This action cannot be undone.');
  });

  it('should emit confirmed event on confirm', () => {
    spyOn(component.confirmed, 'emit');
    component.onConfirm();
    expect(component.confirmed.emit).toHaveBeenCalled();
  });

  it('should emit cancelled event on cancel', () => {
    spyOn(component.cancelled, 'emit');
    component.onCancel();
    expect(component.cancelled.emit).toHaveBeenCalled();
  });

  it('should show dialog when isOpen is true', () => {
    component.isOpen = true;
    fixture.detectChanges();
    const overlay = fixture.nativeElement.querySelector('.overlay');
    expect(overlay).toBeTruthy();
  });

  it('should hide dialog when isOpen is false', () => {
    component.isOpen = false;
    fixture.detectChanges();
    const overlay = fixture.nativeElement.querySelector('.overlay');
    expect(overlay).toBeFalsy();
  });

  it('should display custom title and message', () => {
    component.isOpen = true;
    component.title = 'Custom Title';
    component.message = 'Custom Message';
    fixture.detectChanges();
    const title = fixture.nativeElement.querySelector('h3');
    const message = fixture.nativeElement.querySelector('p');
    expect(title.textContent).toBe('Custom Title');
    expect(message.textContent).toBe('Custom Message');
  });
});
