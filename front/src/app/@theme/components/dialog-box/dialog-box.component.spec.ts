import { ComponentFixture, TestBed } from '@angular/core/testing';

import { dialogBoxComponent } from './dialog-box.component';

describe('dialogBoxComponent', () => {
  let component: dialogBoxComponent;
  let fixture: ComponentFixture<dialogBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ dialogBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(dialogBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

