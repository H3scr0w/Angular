export class WebsiteDeployed {
  websiteVersion: string;
  constructor(websiteVersion?: string) {
    if (websiteVersion) {
      this.websiteVersion = websiteVersion;
    }
  }
}
