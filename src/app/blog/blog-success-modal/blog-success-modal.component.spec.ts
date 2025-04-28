import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogSuccessModalComponent } from './blog-success-modal.component';

describe('BlogSuccessModalComponent', () => {
  let component: BlogSuccessModalComponent;
  let fixture: ComponentFixture<BlogSuccessModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlogSuccessModalComponent]
    });
    fixture = TestBed.createComponent(BlogSuccessModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
