import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PortfolioForm } from './portfolio-form';

describe('PortfolioForm', () => {
  let component: PortfolioForm;
  let fixture: ComponentFixture<PortfolioForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioForm],
    }).compileComponents();

    fixture = TestBed.createComponent(PortfolioForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
