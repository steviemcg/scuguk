export type EventApiItem = {
  eventId: string;
  eventKey: string;
  eventName: string;
  eventDate: Date;
  capacity: number;
  capacityIsLimited: boolean;
  attendingYes: number;
  attendingNo: number;
  attendingWaiting: number;
  capacityRemaining: number;
  isInPerson: boolean;
  isOnline: boolean;
  onlineDetails: boolean;
};

export type EventApiAttendance = {
  loggedInUserResponded: boolean;
  loggedInUserAttending: boolean;
  loggedInUserWaiting: boolean;
  yes: EventApiAttendanceUser[];
  waitlist: EventApiAttendanceUser[];
};

export type EventApiAttendanceUser = {
  name: string;
  isOnline: boolean;
  avatar: string;
};
