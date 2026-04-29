// lib/defaultData.ts
import type { InvitationData } from "@/data/types/invitations";

export const defaultInvitationData: InvitationData = {
  couple: {
    groomName: "Ahmad Fathoni",
    brideName: "Sarah Azzahra",
    groomNickname: "Ahmad",
    brideNickname: "Sarah",
    groomParents: "Bapak Budi Santoso & Ibu Dewi Lestari",
    brideParents: "Bapak Rizki Firmansyah & Ibu Nia Ramadhani",
  },
  wedding: {
    date: "2025-06-15", // Format: YYYY-MM-DD
    akadTime: "08:00",
    receptionTime: "10:00",
    location:
      "Gedung Serbaguna Puspita\nJl. Kebon Kacang No. 25\nJakarta Pusat, 10240",
    locationUrl: "https://maps.google.com/?q=Gedung+Serbaguna+Puspita+Jakarta",
    dressCode: "Formal (Kemeja/Batik/Jas) & Kebaya",
  },
  rsvp: {
    whatsappNumber: "+62 812 3456 7890",
    weddingWebsite: "www.ahmadsarah.wedding.id",
  },
};
