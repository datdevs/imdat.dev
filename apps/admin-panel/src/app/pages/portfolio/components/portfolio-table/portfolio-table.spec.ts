import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PortfolioTable } from './portfolio-table';

describe('PortfolioTable', () => {
  let component: PortfolioTable;
  let fixture: ComponentFixture<PortfolioTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioTable],
    }).compileComponents();

    fixture = TestBed.createComponent(PortfolioTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
