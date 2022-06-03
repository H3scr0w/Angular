import { Contact } from './contact';

export class SupervisorRequest {
  constructor(
    public status: string = '',
    public action: string = '',
    public applicant: Contact = new Contact(),
    public requestDate: Date = null
  ) {}
}

export class SupervisorRequestFilter extends SupervisorRequest {
  constructor(public applicant: Contact = null) {
    super();
  }
}
