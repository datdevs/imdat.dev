import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ProfileButton } from '../../components/profile-button/profile-button';
import { MainLayout } from './main-layout';

@Component({
  selector: 'app-profile-button',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class MockProfileButton {}

describe('MainLayout', () => {
  let fixture: ComponentFixture<MainLayout>;

  beforeEach(async () => {
    TestBed.overrideComponent(MainLayout, {
      remove: {
        imports: [ProfileButton],
      },
      add: {
        imports: [MockProfileButton],
      },
    });

    await TestBed.configureTestingModule({
      imports: [MainLayout],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MainLayout);
    fixture.detectChanges();
  });

  it('renders the app shell container', () => {
    const shell = fixture.nativeElement.querySelector('.app-shell');

    expect(shell).not.toBeNull();
  });

  it('renders the app shell main container', () => {
    const shellMain = fixture.nativeElement.querySelector('.app-shell__main');

    expect(shellMain).not.toBeNull();
  });

  it('shows create button only when canCreate is true', () => {
    const canCreateSignal = signal(true);
    const localFixture = TestBed.createComponent(MainLayout);
    Object.defineProperty(localFixture.componentInstance, 'canCreate', {
      value: canCreateSignal,
      configurable: true,
    });
    localFixture.detectChanges();

    const createButtonVisible = Array.from(localFixture.nativeElement.querySelectorAll('button')).find(
      (button) =>
        [
          button.textContent?.includes('Create') ?? false,
          button.getAttribute('iconStart') === 'plus',
          button.getAttribute('ng-reflect-icon-start') === 'plus',
        ].some(Boolean),
    );
    expect(createButtonVisible).toBeTruthy();

    canCreateSignal.set(false);
    localFixture.detectChanges();

    const createButtonHidden = Array.from(localFixture.nativeElement.querySelectorAll('button')).find(
      (button) =>
        [
          button.textContent?.includes('Create') ?? false,
          button.getAttribute('iconStart') === 'plus',
          button.getAttribute('ng-reflect-icon-start') === 'plus',
        ].some(Boolean),
    );
    expect(createButtonHidden).toBeUndefined();
  });

  it('toggles sidebar control text after click', () => {
    const getToggleButton = () =>
      Array.from(fixture.nativeElement.querySelectorAll('button')).find(
        (button) => [button.textContent?.includes('Expand') ?? false, button.textContent?.includes('Collapse') ?? false].some(Boolean),
      ) as HTMLButtonElement;

    const toggleButton = getToggleButton();
    expect(toggleButton.textContent).toContain('Expand');

    toggleButton.click();
    fixture.detectChanges();

    expect(getToggleButton().textContent).toContain('Collapse');
  });
});
