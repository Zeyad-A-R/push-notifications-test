import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PushNotificationsService {
  public permission: Permission;

  constructor() {
    this.permission = this.isSupported() ? 'default' : 'denied';
  }

  public isSupported(): boolean {
    return 'Notification' in window;
  }

  requestPermission(): void {
    const self = this;
    if ('Notification' in window) {
      Notification.requestPermission((status) => {
        return (self.permission = status);
      });
    }
  }

  create(title: string, options?: PushNotification): any {
    const self = this;
    return new Observable((obs) => {
      if (!('Notification' in window)) {
        console.log('Notifications are not available in this environment');
        obs.complete();
      }
      if (self.permission !== 'granted') {
        console.log(
          // tslint:disable-next-line: quotemark
          "The user hasn't granted you permission to send push notifications"
        );
        obs.complete();
      }
      /*const notify = new Notification(title, options);
      // new ServiceWorkerRegistration()
      //   .showNotification(title, options)
      // .then((notify) => {});

      notify.onshow = (e) => {
        return obs.next({
          notification: notify,
          event: e,
        });
      };
      notify.onclick = (e) => {
        return obs.next({
          notification: notify,
          event: e,
        });
      };
      notify.onerror = (e) => {
        return obs.error({
          notification: notify,
          event: e,
        });
      };
      notify.onclose = () => {
        return obs.complete();
      };*/

      Notification.requestPermission((result) => {
        if (result === 'granted') {
          navigator.serviceWorker.ready.then((registration) => {
            registration.showNotification(title, options);
          });
        }
      });
    });
  }

  generateNotification(source: Array<any>): void {
    this.requestPermission();
    const self = this;
    source.forEach((item) => {
      const options = {
        body: item.alertContent,
        icon:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHsAAAB7CAMAAABjGQ9NAAAAY1BMVEX///8AAADNzc1ycnL7+/vQ0ND19fVVVVV7e3tCQkKXl5fDw8Pj4+O0tLTn5+fY2NhJSUlnZ2dbW1uMjIwNDQ2fn588PDwvLy9PT083NzcaGhoVFRVtbW28vLyqqqrt7e0mJiZIy0khAAACa0lEQVRoge2ai3KCMBBFuwqRhwU0WLVq9f+/siJttTWYZO8SpzM5H8CZhM3u5vHyEolEIpFIJDSpznSaPMNcNdSRz5+gbumL8PLFt5pmodXV7scdfOD1VU1pQK+qi31z4873OlVBzGXWkoHpYWxxUhjFPXrMwSerYfGFYjT75M2iJlqX46gLq/ky8WOoF3bvhRFSzcZRTfQmXV5mzurzepeVZx5qor2k+sNLTbSSU8891US1mNvnZ/c0UurSW030KuTe2VX3yKgPHLXQwJcst0h6q1hqmU7KrYTcI1BUEv8F1rPBM6t/XvkGn/RXthuPdL8qcksGu7m/W2CVHbds9/oIumu7YxC0mKWAG90r8cMcD3TbbuARaPeiATeaVaeAG13grjsCEwvQzSvez3cvo5sFv5TgxcR9+3nP5h+7c8Cdg25++SbaYupkDbjXWKeqIDd24jV/B9zvWJeMtExo0zSB3NhBH9IyoU0TdyPYU0BupHVACzgS5udAR9QKUhMhCxwLcyzQke68Awk2pIJ2AEd8CahGfjiWWTo+2G6kUexht2z8Y54r3FLGP2q5wtyTSQybW0f3Im5WTseDvIcR6vMHF59etN6zDjWovzn5JhhkH/aXxqtXTvCscsvMQ64a+/e8yJ2nHWrKzewcA+4gFeG3tE5PEtB+YQj7SZ+SSOJmMttPr8rJWJSVy7RHIj/oqRkd4AXf0PYQPdFyYegmXuq2/RHK/LLohN5IOWG+i+fvArwwNZHLQG9F1f1BJ3wH6C7/21tswzwZ7Pl9BjTKu7Fhjvr0JW51+Pqk6lWWZas65HRHIpFIJBLp+ASRoiBjp6SmQgAAAABJRU5ErkJggg==',
      };
      const notify = self.create(item.title, options).subscribe();
    });
  }
}

export declare type Permission = 'denied' | 'granted' | 'default';
export interface PushNotification {
  body?: string;
  icon?: string;
  tag?: string;
  data?: any;
  renotify?: boolean;
  silent?: boolean;
  sound?: string;
  noscreen?: boolean;
  sticky?: boolean;
  dir?: 'auto' | 'ltr' | 'rtl';
  lang?: string;
  vibrate?: number[];
}
