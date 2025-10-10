import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Empty } from './empty';

describe('Empty', () => {
  let component: Empty;
  let fixture: ComponentFixture<Empty>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Empty],
    }).compileComponents();

    fixture = TestBed.createComponent(Empty);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
