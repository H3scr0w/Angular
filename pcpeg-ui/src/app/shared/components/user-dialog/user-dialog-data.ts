import { CampaignModel } from './../../models/campaign.model';
export enum UserDialogMode {
  CAMPAIGN,
  AUTHORITY
}

export interface IUserDialogData {
  mode: UserDialogMode;
  campaignData: CampaignModel;
}
