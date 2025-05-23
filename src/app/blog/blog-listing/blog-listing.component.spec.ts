import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogListComponent } from './blog-listing.component';

describe('BlogListingComponent', () => {
  let component: BlogListComponent;
  let fixture: ComponentFixture<BlogListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlogListComponent]
    });
    fixture = TestBed.createComponent(BlogListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
