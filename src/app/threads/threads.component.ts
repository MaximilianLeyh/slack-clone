import { Component } from '@angular/core';

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

}
