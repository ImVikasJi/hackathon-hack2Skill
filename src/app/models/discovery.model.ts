export interface Attraction {
  name: string;
  description: string;
  category: string;
}

export interface HiddenGem {
  name: string;
  description: string;
  whyItsSpecial: string;
}

export interface LocalEvent {
  name: string;
  description: string;
  bestTimeToVisit: string;
}

export interface CulturalExperience {
  name: string;
  description: string;
  etiquetteTip: string;
}

export interface DiscoveryResult {
  destination: string;
  heritageSummary: string;
  story: string;
  attractions: Attraction[];
  hiddenGems: HiddenGem[];
  localEvents: LocalEvent[];
  culturalExperiences: CulturalExperience[];
}

export interface DiscoveryRecord {
  id: string;
  userId: string;
  destination: string;
  interests: string;
  result: DiscoveryResult;
  createdAt: string;
}
