import React, { useCallback, useEffect, useRef, useState } from 'react';
import { EventContent } from '@/content.types';
import { useAuth0 } from '@auth0/auth0-react';
import DefaultProfileImage from './default-profile.svg';
import ThumbsUpIcon from './thumbs-up.svg';
import ThumbsDownIcon from './thumbs-down.svg';
import styles from './EventAttendance.module.scss';
import { fetchEvent, fetchEventAttendance, updateEventAttendance } from '@/util/api/api';
import { EventApiAttendance, EventApiItem } from '@/api.types';
import ImageHideOnError from '../ImageHideOnError';
import cn from 'classnames';
import Box from '../Box';
import Link from 'next/link';

type EventAttendanceProps = Pick<EventContent, 'eventId'>;

type EventAttendeesDetailsProps = EventApiAttendance & {
  capacity: number;
  capacityIsLimited: boolean;
};

const EventAttendeesDetails = (eventAttendance: EventAttendeesDetailsProps) => {
  return (
    <>
      <p>
        {eventAttendance.capacityIsLimited && (
          <>
            This event has capacity for <strong>{eventAttendance.capacity}</strong> attendees.
            <br />
          </>
        )}
        There {eventAttendance.yes.length === 1 ? 'is' : 'are'} currently <strong>{eventAttendance.yes.length}</strong>{' '}
        attending:
      </p>
      <div className={styles.eventAttendance__attendees}>
        {eventAttendance.yes.map((user, i) => (
          <div key={i} className={styles.eventAttendance__attendee}>
            <div className={styles.eventAttendance__profileWrapper}>
              <DefaultProfileImage className={styles['eventAttendance__profile-fallback']} />
              <ImageHideOnError
                className={styles['eventAttendance__profile']}
                src={user.avatar}
                alt={`Profile of ${user.name}`}
              />
            </div>
            <span>{user.name}</span>
          </div>
        ))}
      </div>
    </>
  );
};

type EventOnlineDetailsProps = {
  onlineDetails: string;
};

const EventOnlineDetails = ({ onlineDetails }: EventOnlineDetailsProps) => {
  return (
    <Box theme='green' heading='Virtual Meetup Information'>
      <p>
        This is an <strong>online</strong> event. Please refer to the following participation information for
        instructions on how to join:
      </p>
      <div dangerouslySetInnerHTML={{ __html: onlineDetails }}></div>
    </Box>
  );
};
const EventAttendance = ({ eventId }: EventAttendanceProps) => {
  const { isLoading: authIsLoading, isAuthenticated, getIdTokenClaims, loginWithPopup } = useAuth0();
  const [eventAttendance, setEventAttendance] = useState<EventApiAttendance | undefined>(undefined);
  const [eventItem, setEventItem] = useState<EventApiItem | undefined>(undefined);
  const [error, setError] = useState<boolean>(false);

  const fetchAttendees = useCallback(async () => {
    const attendance = await fetchEventAttendance(eventId, await getIdTokenClaims());
    setEventAttendance(attendance);
  }, [eventId, getIdTokenClaims]);

  const fetchEventItem = useCallback(async () => {
    const eventItem = await fetchEvent(eventId);
    setEventItem(eventItem);
  }, [eventId]);

  const updateAttendance = useCallback(
    async (isAttending: boolean, isOnline: boolean) => {
      try {
        await updateEventAttendance(eventId, isAttending, isOnline, await getIdTokenClaims());
        fetchAttendees();
        setError(false);
      } catch {
        setError(true);
      }
    },
    [fetchAttendees, eventId, getIdTokenClaims]
  );

  const registeredForEvent = isAuthenticated && eventAttendance && eventAttendance.loggedInUserAttending;
  const onlineEventWithDetails = eventItem && eventItem.isOnline && eventItem.onlineDetails;

  useEffect(() => {
    if (!authIsLoading && isAuthenticated) {
      fetchEventItem();
      fetchAttendees();
    }
  }, [authIsLoading, fetchEventItem, fetchAttendees, isAuthenticated]);

  return (
    <>
      {registeredForEvent && onlineEventWithDetails && <EventOnlineDetails onlineDetails={eventItem.onlineDetails!} />}
      <Box theme='green' heading='Attendance'>
        <section className={styles.eventAttendance}>
          {isAuthenticated ? (
            eventItem &&
            eventAttendance && (
              <>
                <div className={styles.eventAttendance__actions}>
                  <button
                    className={cn(styles.eventAttendance__actionYes, {
                      [styles['eventAttendance__actionYes--active']]:
                        eventAttendance.loggedInUserResponded && eventAttendance.loggedInUserAttending,
                    })}
                    onClick={() => {
                      if (!eventAttendance.loggedInUserAttending) {
                        updateAttendance(true, false);
                      }
                    }}
                  >
                    <ThumbsUpIcon /> I would like to attend
                  </button>
                  <button
                    className={cn(styles.eventAttendance__actionNo, {
                      [styles['eventAttendance__actionNo--active']]:
                        eventAttendance.loggedInUserResponded && !eventAttendance.loggedInUserAttending,
                    })}
                    onClick={() => {
                      if (eventAttendance.loggedInUserAttending) {
                        updateAttendance(false, false);
                      }
                    }}
                  >
                    I will not attend <ThumbsDownIcon />
                  </button>
                </div>
                {error && (
                  <div className={styles.eventAttendance__error}>
                    Due to an error we cannot update your attendance details at this time. To register your attendance,
                    please{' '}
                    <Link href='/contact'>
                      <span>contact us</span> directly.
                    </Link>
                  </div>
                )}
                <EventAttendeesDetails
                  capacityIsLimited={eventItem.capacityIsLimited}
                  capacity={eventItem.capacity}
                  {...eventAttendance}
                />
              </>
            )
          ) : (
            <div className={styles.eventAttendance__actions}>
              <button className={cn(styles.eventAttendance__actionYes)} onClick={() => loginWithPopup()}>
                Login to manage and view attendance
              </button>
            </div>
          )}
        </section>
      </Box>
    </>
  );
};

export default EventAttendance;
