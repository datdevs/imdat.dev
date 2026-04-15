import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

jest.mock('@taiga-ui/addon-charts', () => {
  const ngCore = require('@angular/core');
  const mockComponent = (selector: string, options: Record<string, unknown> = {}) =>
    ngCore.Component({
      selector,
      standalone: true,
      template: '<ng-content />',
      ...options,
    })(class {});
  const MockLegendItem = class {
    tuiHoveredChange = new ngCore.EventEmitter<boolean>();
  };

  return {
    TuiAxes: mockComponent('tui-axes', { inputs: ['axisXLabels', 'axisYLabels'] }),
    TuiBarChart: mockComponent('tui-bar-chart', { inputs: ['max', 'value'] }),
    TuiLegendItem: ngCore.Component({
      selector: 'tui-legend-item',
      standalone: true,
      template: '<ng-content />',
      inputs: ['size', 'color', 'text'],
      outputs: ['tuiHoveredChange'],
    })(MockLegendItem),
    TuiPieChart: mockComponent('tui-pie-chart', { inputs: ['size', 'activeItemIndex', 'value'] }),
  };
});

jest.mock('../../core/environments', () => ({
  environment: {
    firebaseConfig: {},
    recaptchaV3SiteKey: '',
    storeWithDevTools: () => ({}),
  },
}));

import { PortfolioStore } from '../../store/portfolio/portfolio.store';
import { Dashboard } from './dashboard';

describe('Dashboard', () => {
  let fixture: ComponentFixture<Dashboard>;
  let loadDashboardPortfoliosMock: jest.Mock;
  let loadRecentPortfoliosMock: jest.Mock;

  beforeEach(async () => {
    loadDashboardPortfoliosMock = jest.fn();
    loadRecentPortfoliosMock = jest.fn();

    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [
        provideRouter([]),
        {
          provide: PortfolioStore,
          useValue: {
            isDashboardLoading: signal(false),
            isRecentPortfoliosLoading: signal(false),
            dashboardPortfolios: signal([]),
            recentPortfolios: signal([]),
            loadDashboardPortfolios: loadDashboardPortfoliosMock,
            loadRecentPortfolios: loadRecentPortfoliosMock,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    fixture.detectChanges();
  });

  it('renders the dashboard page wrapper', () => {
    const page = fixture.nativeElement.querySelector('.dashboard-page');

    expect(page).not.toBeNull();
  });

  it('loads dashboard and recent portfolios on initialization', () => {
    expect(loadDashboardPortfoliosMock).toHaveBeenCalledTimes(1);
    expect(loadRecentPortfoliosMock).toHaveBeenCalledTimes(1);
  });
});
