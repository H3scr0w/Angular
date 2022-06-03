export class Server {
  hostname: string;
  domain: string;
  enable: boolean;
  sshServer: boolean;
  created: Date;
  lastUpdate: Date;
  login: string;

  constructor(hostname: string, domain: string, enable: boolean, login: string, sshServer: boolean) {
    this.hostname = hostname;
    this.domain = domain;
    this.enable = enable;
    this.login = login;
    this.sshServer = sshServer;
  }
}
