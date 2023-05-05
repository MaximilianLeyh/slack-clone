import { Injectable } from '@angular/core';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class DrawerTogglerService {
  isSidenavOpen: boolean = true;
  public type: any = 'side';
  public open: boolean = true;
  public showToggleBtn: boolean = false;

  constructor(
   
  ) { }


  //**toggles open boolean */
  toggleNav() {
    if(this.open) {
      this.open = false;
    } else {
      this.open = true;
    }
  }
}
