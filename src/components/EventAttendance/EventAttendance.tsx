import React, { useCallback, useEffect, useRef, useState } from 'react';
import { EventContent } from '@/content.types';
import { useAuth0 } from '@auth0/auth0-react';
import DefaultProfileImage from './default-profile.svg';
import ThumbsUpIcon from './thumbs-up.svg';
import ThumbsDownIcon from './thumbs-down.svg';
import styles from './EventAttendance.module.scss';
import { fetchEventAttendance, updateEventAttendance } from '@/util/api/api';
import { EventApiAttendance } from '@/api.types';
import ImageHideOnError from '../ImageHideOnError';
import cn from 'classnames';

type EventAttendanceProps = Pick<EventContent, 'eventId'>;

type EventAttendeesDetailsProps = EventApiAttendance;

const EventAttendeesDetails = (eventAttendance: EventAttendeesDetailsProps) => {
  return (
    <>
      <p>
        This event has capacity for <strong>50</strong> attendees.
        <br />
        There are currently <strong>{eventAttendance.yes.length}</strong> attending:
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

const EventAttendance = ({ eventId }: EventAttendanceProps) => {
  const { isLoading: authIsLoading, isAuthenticated, getIdTokenClaims, loginWithPopup } = useAuth0();
  const [eventAttendance, setEventAttendance] = useState<EventApiAttendance | undefined>(undefined);

  const fetchAttendees = useCallback(async () => {
    const attendance = await fetchEventAttendance(eventId, await getIdTokenClaims());
    setEventAttendance(attendance);
  }, [eventId, getIdTokenClaims]);

  const updateAttendance = useCallback(
    async (isAttending: boolean, isOnline: boolean) => {
      await updateEventAttendance(eventId, isAttending, isOnline, await getIdTokenClaims());
      fetchAttendees();
    },
    [fetchAttendees, eventId, getIdTokenClaims]
  );

  useEffect(() => {
    if (!authIsLoading) {
      fetchAttendees();
    }
  }, [authIsLoading, fetchAttendees]);

  return (
    <section className={styles.eventAttendance}>
      {isAuthenticated ? (
        eventAttendance && (
          <>
            <div className={styles.eventAttendance__actions}>
              <button
                className={cn(styles.eventAttendance__actionYes, {
                  [styles['eventAttendance__actionYes--active']]: eventAttendance.loggedInUserAttending,
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
                  [styles['eventAttendance__actionNo--active']]: !eventAttendance.loggedInUserAttending,
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
            <EventAttendeesDetails {...eventAttendance} />
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
  );
};

export default EventAttendance;
