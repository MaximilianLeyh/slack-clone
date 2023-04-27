import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-threads',
  templateUrl: './threads.component.html',
  styleUrls: ['./threads.component.scss']
})
export class ThreadsComponent {
  showThreads = true;

  closeThreads(){
    this.showThreads = false;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (window.innerWidth < 600) {
      this.showThreads = false;
    } else {
      this.showThreads = true;
    }
  }

}
