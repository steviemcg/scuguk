export type SponsorContent = {
  key: string;
  title: string;
  image: string;
  darkImage: boolean;
  website: string;
  lastSponsorDate: Date;
  description: string;
};

export type EventContent = {
  eventKey: string;
  eventId: string;
  title: string;
  intro: string;
  excerpt: string;
  dateConfirmed: boolean;
  showEventImage: boolean;
  date: Date;
  duration: number;
  sponsors: string[];
  venue: {
    name: string;
    address: string;
  };
  location: string;
  agenda: EventAgendaEntry[];
  meta: {
    title: string;
    description: string;
  };
};

export type EventAgendaEntry = EventAgendaTalk | EventAgendaItem | EventAgendaTbdTalk;

export type EventAgendaTalk = {
  type: 'talk';
  time: string;
  speaker: string;
  title: string;
  description: string;
  youtubeVideoId?: string;
  links?: {
    text: string;
    url: string;
  }[];
};

export type EventAgendaItem = {
  type: 'item';
  time: string;
  description: string;
};

export type EventAgendaTbdTalk = {
  type: 'tbd';
  time: string;
};

export const isTalk = (entry: EventAgendaEntry): entry is EventAgendaTalk => entry.type == 'talk';

export type EventAbstract = {
  eventKey: string;
  title: string;
  intro: string;
  excerpt: string;
  date: Date;
  sponsors: string[];
  venue: {
    name: string;
    address: string;
  };
};

export type SpeakerContent = {
  name: string;
  title: string;
  company: string;
  image?: string;
};
