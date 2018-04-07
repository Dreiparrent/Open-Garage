import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss']
})
export class ProfileCardComponent implements OnInit {

    @Input('name') name;
    @Input('location') location;
    @Input('connections') connections;

  constructor() { }

  ngOnInit() {
  }

}
