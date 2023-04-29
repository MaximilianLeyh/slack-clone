import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditProfilePictureComponent } from './dialog-edit-profile-picture.component';

describe('DialogEditProfilePictureComponent', () => {
  let component: DialogEditProfilePictureComponent;
  let fixture: ComponentFixture<DialogEditProfilePictureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogEditProfilePictureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogEditProfilePictureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
