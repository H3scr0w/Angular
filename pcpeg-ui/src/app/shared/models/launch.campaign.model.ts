export class LaunchCampaignModel {
  constructor(public year: number = new Date().getFullYear(), public copyPrevious: boolean = false) {}
}
