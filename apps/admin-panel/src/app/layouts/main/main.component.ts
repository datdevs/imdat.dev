import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule, Routes } from '@angular/router';
import { TuiIcon } from '@taiga-ui/core';
import { filter } from 'rxjs/operators';

import { ProfileButtonComponent } from '../../components/profile-button/profile-button.component';

@Component({
  selector: 'app-main',
  imports: [AsyncPipe, RouterModule, AsyncPipe, ProfileButtonComponent, TuiIcon],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  mainMenu: Routes = [];
  title = '';
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  constructor() {
    this.getTitle();
    this.getMainMenu();
  }

  private getChild(activatedRoute: ActivatedRoute): ActivatedRoute {
    if (activatedRoute.firstChild) {
      return this.getChild(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }
  }

  private getMainMenu() {
    this.mainMenu = this.route.routeConfig?.children?.filter((route) => route?.data?.['mainMenu']) ?? [];
  }

  private getTitle() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      const route = this.getChild(this.route);
      this.title =
        route.routeConfig?.title && typeof route.routeConfig?.title === 'string' ? route.routeConfig?.title : '';
    });
  }
}
