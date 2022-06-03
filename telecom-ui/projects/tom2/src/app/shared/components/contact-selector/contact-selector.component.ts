import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { of, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, startWith, switchMap } from 'rxjs/operators';
import { Contact } from '../../../../../../sirene/src/app/shared/models/contact';
import { ContactService } from '../../../../../../sirene/src/app/shared/services/contact/contact.service';

@Component({
  selector: 'stgo-contact-selector',
  templateUrl: './contact-selector.component.html',
  styleUrls: ['./contact-selector.component.css']
})
export class ContactSelectorComponent implements OnInit, OnChanges, OnDestroy {
  searchContact = false;
  @Input()
  contactCurrent: Contact;
  @Output()
  contactChanged = new EventEmitter<Contact>();
  contacts: Observable<Contact[]>;
  inputContact: Subject<string> = new Subject<string>();

  @Input()
  contactSelector: Contact;

  contactSelectorForm = this.formBuilder.group({
    firstName: [''],
    name: [''],
    fixPhone: [''],
    mobilePhone: [''],
    email: ['']
  });
  private sub$: Subscription = new Subscription();
  constructor(private formBuilder: FormBuilder, private contactService: ContactService) {}

  ngOnInit() {
    this.contacts = this.inputContact.pipe(
      startWith(''),
      filter(value => value && value.length > 3),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((value: string) => {
        return this.contactService.getAllContacts(0, 200, 'firstName', 'asc', value).pipe(
          switchMap(result => {
            return of(result.content.sort((a, b) => a.fullName.localeCompare(b.fullName)));
          })
        );
      })
    );
    if (this.contactCurrent) {
      this.onContactSelected(this.contactCurrent);
    }
    this.sub$.add(
      this.contactSelectorForm.valueChanges.subscribe(val => {
        const contact: Contact = Object.assign(this.contactSelectorForm.value);
        this.contactChanged.emit(contact);
      })
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (propName === 'contactCurrent') {
        this.contactSelectorForm.patchValue(
          {
            firstName: this.contactCurrent.firstName,
            name: this.contactCurrent.name,
            fixPhone: this.contactCurrent.fixPhone,
            mobilePhone: this.contactCurrent.mobilePhone,
            email: this.contactCurrent.email
          },
          { emitEvent: false }
        );
      }
    }
  }

  onContactSelected(contact: Contact): void {
    if (!contact) {
      return;
    }
    this.contactSelectorForm.patchValue({
      firstName: contact.firstName,
      name: contact.name,
      fixPhone: contact.fixPhone,
      mobilePhone: contact.mobilePhone,
      email: contact.email
    });
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }
}
