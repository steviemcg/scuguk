import { EventApiAttendance } from '@/api.types';
import { IdToken } from '@auth0/auth0-react';
import { boolToString } from '../util';

const apiFetch = async <T = void>(url: string, authToken: IdToken | undefined): Promise<T> => {
  // TODO: Move baseUrl to config
  const baseUrl = `https://scuguk.azurewebsites.net${url}`;

  const response = await fetch(baseUrl, {
    headers: authToken
      ? {
          Authorization: `Bearer ${authToken.__raw}`,
        }
      : undefined,
  });

  const contentType = response.headers.get('content-type');
  return (contentType && contentType.indexOf('application/json') > -1 ? response.json() : response) as T;
};

export const fetchEventAttendance = async (eventId: string, authToken: IdToken | undefined) => {
  const response = await apiFetch<EventApiAttendance>(`/attendance/event/${eventId}`, authToken);

  // Intercept and sort the attendees by name
  response?.yes.sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0));

  return response;
};

export const updateEventAttendance = async (
  eventId: string,
  isAttending: boolean,
  isOnline: boolean,
  authToken: IdToken | undefined
) => {
  await apiFetch<void>(
    `/attendance/event/${eventId}/rsvp/${boolToString(isAttending)}/${boolToString(isOnline)}`,
    authToken
  );
};
