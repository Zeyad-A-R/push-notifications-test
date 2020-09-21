import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Component } from '@angular/core';
import { PushNotificationsService } from './core/services/push-notifications.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    private http: HttpClient,
    private pushNotificationsService: PushNotificationsService
  ) {}

  connectToServer(): void {
    this.http
      .get(
        'https://europe-west1-node-push-notifications-test.cloudfunctions.net/app'
        // 'http://localhost:5000/node-push-notifications-test/europe-west1/app'
        // 'http://localhost:5000/'
        // {
        //   headers: new HttpHeaders({
        //     // Connection: 'keep-alive',
        //     // 'Keep-Alive': 'timeout=999, max=999',
        //     // 'Access-Control-Allow-Origin': 'http://localhost:5000/',
        //     // 'Access-Control-Allow-Methods': 'GET, PUT, POST, OPTIONS',
        //     // 'Access-Control-Allow-Headers': '*',
        //   }),
        // }
      )
      .subscribe((res: any) => {
        console.log(res);
        const data: Array<any> = [];
        data.push({
          title: 'Queue Info',
          alertContent: `Position in queue: ${res.positionInQueue}.\nEstimated wait time: ${res.estimatedWaitTime} Minutes.`,
        });
        this.pushNotificationsService.generateNotification(data);
      });
  }

  addNotification(): void {
    const data: Array<any> = [];
    data.push({
      title: 'Queue Info',
      alertContent: `Position in queue: ${5}.\nEstimated wait time: ${150} Minutes.`,
    });
    this.pushNotificationsService.generateNotification(data);
  }
}
