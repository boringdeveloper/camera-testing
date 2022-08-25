import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('video') video: any;
  private stream: MediaStream = new MediaStream();
  track: any;
  cameras: any;
  videoConstraints: MediaStreamConstraints = { video: true, audio: false };

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initVideo();
  }

  ngOnDestroy(): void {
    this.stream.getTracks().forEach(track => {
      track.stop();
    });
  }

  initVideo() {
    this.getMediaStream().then((stream) => {
      this.stream = stream;

      if (!this.cameras) {
        navigator.mediaDevices.enumerateDevices().then((devices) => {
          this.cameras = devices.filter((device) => device.kind == 'videoinput');
          console.log('cameras', this.cameras);
        }).catch((err) => {
          console.log('camera error', err);
        });
      }
    });
  }

  private getMediaStream(): Promise<MediaStream> {
    const _video = this.video.nativeElement;
    return new Promise((resolve, reject) => {
      return navigator.mediaDevices.getUserMedia(this.videoConstraints)
        .then((stream) => {
          (<any>window).stream = stream;
          this.track = stream.getTracks()[0];
          _video.srcObject = stream;
          _video.onloadmetadata = function (e: any) {};
          _video.play();
          return resolve(stream);
        }).catch((err) => reject(err));
    });
  }
}