import { TOrganization } from "@/typings/organization";

export interface TGiftRegistry {
    title: string;
    description?: string;
    desiredAmount?: string;
    linkTitle?: string;
    link?: string;
    desiredQuantity?: string;
    giftType: string;
    image: any;
    workspaceAlias: string;
    eventAlias: string;
    registeryAlias: string;
    id: number;
    currency?: string;
    settings: {
      isAddLink?: boolean;
    };
    organization: TOrganization;
  }

  export interface TRecievedGift {
    registryAlias: string;
    giverName: string;
    giverPhone: string;
    giverEmail: string;
    comment: string;
    amount?: number;
    id: number;
    qty: string;
    status: string;
    deliveryType: string;
    paymentReference: string;
    currency:string;
    eventAlias:string;
    fourPercentCharge: number;
    payoutReference: string;
    payoutRequestBy: number;
    payoutRequestTime: string;
  }
  

  export interface TRecievedGiftWithRegistry extends TRecievedGift {
    giftRegistry: TGiftRegistry;
  }