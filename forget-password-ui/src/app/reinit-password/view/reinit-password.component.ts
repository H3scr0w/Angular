import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';

@Component({
  selector: 'stgo-reinit-password',
  templateUrl: './reinit-password.component.html',
  styleUrls: ['./reinit-password.component.scss']
})
export class ReinitPasswordComponent implements OnInit {
  oauthUrl: string = environment.oauthBaseUrl;

  constructor() {}

  ngOnInit() {}
}
