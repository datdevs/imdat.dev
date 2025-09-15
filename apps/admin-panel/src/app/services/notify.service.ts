import { Injectable } from '@angular/core';
import { INotifyOptions } from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

@Injectable({
  providedIn: 'root',
})
export class NotifyService {
  private notify = Notify;
  private options: INotifyOptions = {
    className: 'idv-notif', // It's important to style the notification
    clickToClose: true,
    cssAnimationDuration: 600,
    cssAnimationStyle: 'from-right',
    failure: {
      background: '#e53935',
      notiflixIconColor: '#fff',
      textColor: '#fff',
    },
    fontFamily: 'Poppins',
    fontSize: '12px',
    info: {
      background: '#42a5f5',
      notiflixIconColor: '#fff',
      textColor: '#fff',
    },
    success: {
      background: '#66bb6a',
      notiflixIconColor: '#fff',
      textColor: '#fff',
    },
    timeout: 5000,
    warning: {
      background: '#ffca28',
      notiflixIconColor: '#424242',
      textColor: '#424242',
    },
  };

  error(message: string, options?: INotifyOptions) {
    this.notify.failure(message, options);
  }

  info(message: string, options?: INotifyOptions) {
    this.notify.info(message, options);
  }

  init(options?: INotifyOptions) {
    return new Promise<void>((resolve) => {
      this.notify.init({ ...this.options, ...options });
      resolve();
    });
  }

  success(message: string, options?: INotifyOptions) {
    this.notify.success(message, options);
  }

  warning(message: string, options?: INotifyOptions) {
    this.notify.warning(message, options);
  }
}

export function initializeNotifyService(notifyService: NotifyService): () => Promise<void> {
  return () => notifyService.init();
}
