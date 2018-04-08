import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html'
})
export class ProfileCardComponent implements OnInit {

    @Input('name') name;
    @Input('location') location;
    @Input('connections') connections;
    @Input('imgUrl') imgUrl;

  constructor() { }

    ngOnInit() {
        console.log(this.imgUrl);
  }

}
