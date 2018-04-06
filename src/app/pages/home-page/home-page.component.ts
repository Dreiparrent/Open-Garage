import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

    model = {
        left: true,
        middle: false,
        right: false
    };
  constructor() { }

  ngOnInit() {
  }

}
