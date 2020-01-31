import React, { useState, useEffect } from "react";
import MyFetch from "../../services/apiClient"
import { useAuth0 } from "../../react-auth0-spa";
import './eventAttendance.scss'
import { TabContent, TabPane, Nav, NavItem, NavLink, Button, Row, Col } from 'reactstrap';
import classnames from 'classnames';

const RenderAttendees = ({ attendees }) => (
    <Row>
        {attendees.map((user) => (
            <Col key={user.userId} xs="12" sd="6" md="4" className="attendee">
                <Row>
                    <Col xs="3" className="attendee-avatar">{user.avatar && <img src={user.avatar} />}</Col>
                    <Col xs="9"><div className="attendee-name">{user.name}</div></Col>
                </Row>
            </Col>
        ))}
    </Row>
)

const EventAttendance = ({ eventId }) => {
    if (!eventId) {
        return null;
    }

    const { loading, isAuthenticated, getIdTokenClaims, loginWithPopup } = useAuth0();
    const [eventStats, setEventStats] = useState();
    const [eventAttendance, setEventAttendance] = useState();
    const [activeTab, setActiveTab] = useState('1');

    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab);
    }

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
    }, [loading, getIdTokenClaims, activeTab]);

    if (!eventStats || !eventAttendance) {
        return null;
    }

    async function rsvp(isAttending) {
        var rsvp = isAttending ? "true" : "false";
        await MyFetch(`/attendance/event/${eventId}/rsvp/${rsvp}`, isAuthenticated, getIdTokenClaims);
        fetchAttendees();
        fetchEventStats();
    }

    const showAttendees = eventStats.attendingYes > 0 || eventStats.attendingWaiting > 0 || eventStats.attendingNo > 0;

    return (
        <section>
            <h2 className="mb-4">Attendees</h2>

            {isAuthenticated &&
                <div>
                    <p>
                        <strong>Attending:</strong>&nbsp;
                    {!eventAttendance.loggedInUserAttending && <span>No</span>}
                        {eventAttendance.loggedInUserAttending && eventAttendance.loggedInUserWaiting && <span>On the waitlist</span>}
                        {eventAttendance.loggedInUserAttending && !eventAttendance.loggedInUserWaiting && <span>Yes</span>}
                    </p>

                    {!eventAttendance.loggedInUserAttending &&
                        <Button color="primary" onClick={() => rsvp(true)}>I'll be there!</Button>
                    }
                    {eventAttendance.loggedInUserAttending &&
                        <div>Thanks for signing up! Can you no longer make it? Click here: &nbsp;&nbsp;
                            <Button color="danger" onClick={() => rsvp(false)}>Can't make it :-(</Button>
                        </div>
                    }
                </div>
            }
            {!isAuthenticated &&
                <div>
                    Please <a onClick={() => loginWithPopup()}>log in / sign up</a> to be able to RSVP!
                </div>
            }

            {showAttendees &&
                <div className="attendees">
                    <Nav tabs>
                        {eventStats.attendingYes > 0 &&
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: activeTab === '1' })}
                                    onClick={() => { toggle('1'); }}>
                                    Yes ({eventStats.attendingYes})
                                </NavLink>
                            </NavItem>
                        }
                        {eventStats.attendingWaiting > 0 &&
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: activeTab === '2' })}
                                    onClick={() => { toggle('2'); }}>
                                    Waiting ({eventStats.attendingWaiting})
                                </NavLink>
                            </NavItem>
                        }
                        {eventStats.attendingNo > 0 &&
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: activeTab === '3' })}
                                    onClick={() => { toggle('3'); }}>
                                    No ({eventStats.attendingNo})
                                </NavLink>
                            </NavItem>
                        }
                    </Nav>

                    <TabContent activeTab={activeTab}>
                        {eventStats.attendingYes > 0 &&
                            <TabPane tabId="1">
                                <div className="attendees-list attendees-yes">
                                    <RenderAttendees attendees={eventAttendance.yes} />
                                </div>
                            </TabPane>
                        }
                        {eventStats.attendingWaiting > 0 &&
                            <TabPane tabId="2">
                                <div className="attendees-list attendees-waiting">
                                    <RenderAttendees attendees={eventAttendance.waiting} />
                                </div>
                            </TabPane>
                        }
                        {eventStats.attendingNo > 0 &&
                            <TabPane tabId="3">
                                <div className="attendees-list attendees-no">
                                    <RenderAttendees attendees={eventAttendance.no} />
                                </div>
                            </TabPane>
                        }
                    </TabContent>
                </div>
            }
        </section>
    )
};

export default EventAttendance