import { Injectable } from '@angular/core';
import { INotifyOptions } from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

@Injectable({
  providedIn: 'root',
})
export class NotifyService {
  private readonly notify = Notify;
  private readonly options: INotifyOptions = {
    className: 'idv-notification', // It's important to style the notification
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

  /**
   * @description Show an error notification
   * @param {string} message - The message to show
   * @param {INotifyOptions} options - The options to show
   */
  error(message: string, options?: INotifyOptions) {
    this.notify.failure(message, options);
  }

  /**
   * @description Show an info notification
   * @param {string} message - The message to show
   * @param {INotifyOptions} options - The options to show
   */
  info(message: string, options?: INotifyOptions) {
    this.notify.info(message, options);
  }

  /**
   * @description Initialize the notification service
   * @param {INotifyOptions} options - The options to show
   */
  init(options?: INotifyOptions) {
    return new Promise<void>((resolve) => {
      this.notify.init({ ...this.options, ...options });
      resolve();
    });
  }

  /**
   * @description Show a success notification
   * @param {string} message - The message to show
   * @param {INotifyOptions} options - The options to show
   */
  success(message: string, options?: INotifyOptions) {
    this.notify.success(message, options);
  }

  /**
   * @description Show a warning notification
   * @param {string} message - The message to show
   * @param {INotifyOptions} options - The options to show
   */
  warning(message: string, options?: INotifyOptions) {
    this.notify.warning(message, options);
  }
}

export function initializeNotifyService(notifyService: NotifyService): () => Promise<void> {
  return () => notifyService.init();
}
