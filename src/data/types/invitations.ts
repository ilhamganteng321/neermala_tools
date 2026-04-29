// types/invitation.ts
export interface InvitationData {
  couple: {
    groomName: string;
    brideName: string;
    groomNickname: string;
    brideNickname: string;
    groomParents: string;
    brideParents: string;
  };
  wedding: {
    date: string;
    akadTime: string;
    receptionTime: string;
    location: string;
    locationUrl: string;
    dressCode: string;
  };
  rsvp: {
    whatsappNumber: string;
    weddingWebsite: string;
  };
}

export type ThemeType = "elegant" | "rustic" | "modern";
