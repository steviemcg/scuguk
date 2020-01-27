import React, { useState, useEffect } from "react";
import MyFetch from "../../services/apiClient"
import { useAuth0 } from "../../react-auth0-spa";
import './eventAttendance.scss'

const RenderAttendees = ({ attendees }) => (
    <>
        {attendees.map((user) => (
            <div className="attendee" key={user.userId}>
                <div className="attendee-name">{user.name}</div>
                {user.avatar && <img src={user.avatar} className="attendee-avatar" />}
            </div>
        ))}
    </>
)

const EventAttendance = ({ eventId }) => {
    if (!eventId) {
        return null;
    }

    const { loading, isAuthenticated, getIdTokenClaims, loginWithRedirect } = useAuth0();

    const [eventStats, setEventStats] = useState();
    const [eventAttendance, setEventAttendance] = useState();

    async function fetchEventStats() {
        const responseData = await MyFetch(`/event/${eventId}`, isAuthenticated, getIdTokenClaims);
        setEventStats(await responseData.json());
    }

    async function fetchAttendees() {
        const responseData = await MyFetch(`/attendance/event/${eventId}`, isAuthenticated, getIdTokenClaims);
        setEventAttendance(await responseData.json());
    }

    useEffect(() => {
        if (!loading) {
            fetchEventStats();
            fetchAttendees();
        }
    }, [loading, getIdTokenClaims]);

    if (!eventStats || !eventAttendance) {
        return null;
    }

    async function rsvp(isAttending) {
        var rsvp = isAttending ? "true" : "false";
        await MyFetch(`/attendance/event/${eventId}/rsvp/${rsvp}`, isAuthenticated, getIdTokenClaims);
        fetchAttendees();
        fetchEventStats();
    }

    return (
        <section>
            <h2 className="mb-4">Attendees</h2>
            <div className="attendees">
                {eventStats.attendingYes > 0 &&
                    <div className="attendees-list attendees-yes">
                        <h3>Yes ({eventStats.attendingYes})</h3>
                        <RenderAttendees attendees={eventAttendance.yes} />
                    </div>
                }
                {eventStats.attendingWaiting > 0 &&
                    <div className="attendees-list attendees-waiting">
                        <h3>Waiting ({eventStats.attendingWaiting})</h3>
                        <RenderAttendees attendees={eventAttendance.waiting} />
                    </div>
                }
                {eventStats.attendingNo > 0 &&
                    <div className="attendees-list attendees-no">
                        <h3>No ({eventStats.attendingNo})</h3>
                        <RenderAttendees attendees={eventAttendance.no} />
                    </div>
                }
            </div>
            {isAuthenticated &&
                <div>
                    {!eventAttendance.loggedInUserAttending &&
                        <button className="btn btn-primary" onClick={() => rsvp(true)}>Attend!</button>
                    }
                    {eventAttendance.loggedInUserAttending &&
                        <button className="btn btn-primary" onClick={() => rsvp(false)}>Can't make it :-(</button>
                    }
                </div>
            }
            {!isAuthenticated &&
                <div>
                    Please <a onClick={() => loginWithRedirect()}>log in / sign up</a> to be able to RSVP!
                </div>
            }
        </section>
    )
};

export default EventAttendance