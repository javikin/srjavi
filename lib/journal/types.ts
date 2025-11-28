// Journal Entry Types

export type Mood =
  | 'happy'
  | 'excited'
  | 'calm'
  | 'reflective'
  | 'grateful'
  | 'sad'
  | 'energetic'
  | 'creative';

export interface Location {
  name: string;
  city?: string;
  coords?: {
    lat: number;
    lng: number;
  };
}

export interface Photo {
  id: string;
  url: string;
  caption?: string;
  dataUrl?: string; // For localStorage before upload
}

export interface JournalEntry {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  // Content
  title?: string;
  content: any; // TipTap JSON
  excerpt?: string;

  // Media
  photos: Photo[];
  coverPhoto?: string;

  // Metadata
  mood?: Mood;
  tags: string[];

  // Location
  location?: Location;

  // Stats
  wordCount: number;
  photoCount: number;
}

export interface CreateEntryInput {
  title?: string;
  content: any;
  photos?: Photo[];
  mood?: Mood;
  tags?: string[];
  location?: Location;
}

export interface UpdateEntryInput extends Partial<CreateEntryInput> {
  id: string;
}
