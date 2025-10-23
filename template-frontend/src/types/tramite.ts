// Shared type for procedures ("Trámites")
export interface Tramite {
  id: string;
  title: string;
  description?: string;
  category?: string;
  iconUrl?: string;
  slug?: string;
  views?: number; // used to sort/filter "most consulted"
  // Optional breakdown of clicks: clicks when shown in the catalogue vs clicks when
  // the user starts the trámite form. These fields are optional so the backend
  // can gradually provide them; frontend should fall back to `views` when absent.
  clicksCatalog?: number;
  clicksStart?: number;
}