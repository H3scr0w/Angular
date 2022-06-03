import { Component, Input, OnInit } from '@angular/core';
import { Contact } from '../../models/contact';

@Component({
  selector: 'stgo-contact-display',
  templateUrl: './contact-display.component.html',
  styleUrls: ['./contact-display.component.scss']
})
export class ContactDisplayComponent implements OnInit {
  @Input()
  selectedContact: Contact = null;
  @Input()
  showName = true;

  constructor() {}

  ngOnInit() {}
}
