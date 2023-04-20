import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddConversationComponent } from './dialog-add-conversation.component';

describe('DialogAddConversationComponent', () => {
  let component: DialogAddConversationComponent;
  let fixture: ComponentFixture<DialogAddConversationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAddConversationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogAddConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
