import React, { useState, useEffect } from "react";
import MyFetch from "../../services/apiClient";
import { useAuth0 } from "../../react-auth0-spa";
import Online from "../../img/online.svg";
import "./eventAttendance.scss";
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Button,
  Row,
  Col,
} from "reactstrap";
import classnames from "classnames";

const RenderAttendees = ({ attendees }) => (
  <Row>
    {attendees.map((user) => (
      <Col key={user.userId} xs="12" sd="6" md="4" className="attendee">
        <Row>
          <Col xs="3" className="attendee-avatar">
            {user.avatar && <img src={user.avatar} />}
          </Col>
          <Col xs="9" className="attendee-name">
            <div>
              {user.name}&nbsp;
              {user.isOnline && <img src={Online} width="24" height="24" />}
            </div>
          </Col>
        </Row>
      </Col>
    ))}
  </Row>
);

const EventAttendance = ({ eventId }) => {
  if (!eventId) {
    return null;
  }

  const {
    loading,
    isAuthenticated,
    getIdTokenClaims,
    loginWithPopup,
  } = useAuth0();
  const [eventStats, setEventStats] = useState();
  const [eventAttendance, setEventAttendance] = useState();
  const [activeTab, setActiveTab] = useState("1");

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  async function fetchEventStats() {
    const responseData = await MyFetch(
      `/event/${eventId}`,
      isAuthenticated,
      getIdTokenClaims
    );
    setEventStats(await responseData.json());
  }

  async function fetchAttendees() {
    const responseData = await MyFetch(
      `/attendance/event/${eventId}`,
      isAuthenticated,
      getIdTokenClaims
    );
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

  async function rsvp(isAttending, isOnline) {
    var rsvp = isAttending ? "true" : "false";
    await MyFetch(
      `/attendance/event/${eventId}/rsvp/${rsvp}/${
        isOnline ? "true" : "false"
      }`,
      isAuthenticated,
      getIdTokenClaims
    );
    fetchAttendees();
    fetchEventStats();
  }

  const showAttendees =
    eventStats.attendingYes > 0 ||
    eventStats.attendingWaiting > 0 ||
    eventStats.attendingNo > 0;

  return (
    <section>
      <h2 className="mb-4">Attendees</h2>

      {isAuthenticated && (
        <div>
          <p>
            <strong>Attending:</strong>&nbsp;
            {!eventAttendance.loggedInUserAttending && <span>No</span>}
            {eventAttendance.loggedInUserAttending &&
              eventAttendance.loggedInUserWaiting && (
                <span>On the waitlist</span>
              )}
            {eventAttendance.loggedInUserAttending &&
              !eventAttendance.loggedInUserWaiting && <span>Yes</span>}
          </p>

          <p>
            <strong>
              By signing up, you are consenting that SCUG can use your email to
              send you information about this event{" "}
            </strong>
          </p>
          {!eventAttendance.loggedInUserAttending && (
            <>
              <Button color="primary mr-3" onClick={() => rsvp(true, false)}>
                I'll attend in person
              </Button>
              <Button color="info" onClick={() => rsvp(true, true)}>
                I'll watch online
              </Button>
            </>
          )}
          {eventAttendance.loggedInUserAttending && (
            <div>
              <p>Thanks for signing up!</p>
              {eventStats.isOnline && (
                <div className="online-attendance">
                  <div className="online-attendance-header">
                    Online Meeting Details{" "}
                    <img
                      src={Online}
                      width="24"
                      height="24"
                    />
                  </div>
                  <div
                    className="panel-body"
                    dangerouslySetInnerHTML={{
                      __html: eventStats.onlineDetails
                        ? eventStats.onlineDetails
                        : "Details for the online meeting will be published soon",
                    }}
                  />
                </div>
              )}

              <p>
                Can you no longer make it? Click here: &nbsp;&nbsp;
                <Button color="danger" onClick={() => rsvp(false, false)}>
                  Can't make it :-(
                </Button>
              </p>
            </div>
          )}
        </div>
      )}
      {!isAuthenticated && (
        <div>
          Please <a onClick={() => loginWithPopup()}>log in / sign up</a> to be
          able to RSVP!
        </div>
      )}

      {showAttendees && (
        <div className="attendees">
          <Nav tabs>
            {eventStats.attendingYes > 0 && (
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === "1" })}
                  onClick={() => {
                    toggle("1");
                  }}
                >
                  Yes ({eventStats.attendingYes})
                </NavLink>
              </NavItem>
            )}
            {eventStats.attendingWaiting > 0 && (
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === "2" })}
                  onClick={() => {
                    toggle("2");
                  }}
                >
                  Waiting ({eventStats.attendingWaiting})
                </NavLink>
              </NavItem>
            )}
            {eventStats.attendingNo > 0 && (
              <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === "3" })}
                  onClick={() => {
                    toggle("3");
                  }}
                >
                  No ({eventStats.attendingNo})
                </NavLink>
              </NavItem>
            )}
          </Nav>

          <TabContent activeTab={activeTab}>
            {eventStats.attendingYes > 0 && (
              <TabPane tabId="1">
                <div className="attendees-list attendees-yes">
                  <RenderAttendees attendees={eventAttendance.yes} />
                </div>
              </TabPane>
            )}
            {eventStats.attendingWaiting > 0 && (
              <TabPane tabId="2">
                <div className="attendees-list attendees-waiting">
                  <RenderAttendees attendees={eventAttendance.waiting} />
                </div>
              </TabPane>
            )}
            {eventStats.attendingNo > 0 && (
              <TabPane tabId="3">
                <div className="attendees-list attendees-no">
                  <RenderAttendees attendees={eventAttendance.no} />
                </div>
              </TabPane>
            )}
          </TabContent>
        </div>
      )}
    </section>
  );
};

export default EventAttendance;
