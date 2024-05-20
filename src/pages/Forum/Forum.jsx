import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { db, auth } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Spinner from "../../components/Spinner";
import eventimage from "../../images/event.jpg";
import "./forum.css";
import LinkSvg from "../../svg/LinkSvg";
import BackArrowSvg from "../../svg/BackArrowSvg";
export default function Forum() {
  const [user, setUser] = useState(null);
  const [moveCarousel, setMoveCarousel] = useState(false);
  const [forumList, setForumList] = useState(null);
  const [eventList, setEventList] = useState(null);
  const navigate = useNavigate();
  const carouselRef = useRef(null);

  useEffect(() => {
    onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        navigate("/register");
      }
    });
  }, []);

  useEffect(() => {
    getForums();
    getEvents();
  }, []);

  async function scrollBack(e) {
    if (carouselRef.current) {
      const carousel = carouselRef.current;
      carousel.scrollTo({
        left: 0,
        behavior: "smooth",
      });
    }
  }

  useEffect(() => {
    // Run a function after 3 seconds
    const timerId = setTimeout(async () => {
      if (carouselRef.current) {
        const carousel = carouselRef.current;
        const slideWidth = carousel.offsetWidth;
        const awayFromLeft = carousel.scrollLeft; // how much it has been scrolled from the leftmost side of the element
        const visible = carousel.clientWidth; // just like offset width but doesnt include paddings and margins
        // Calculate the position to move the carousel to
        const scrollWidth = carousel.scrollWidth; // the complete width including the hidden part, offsetwidth doesnt include hidden part.
        if (awayFromLeft + visible >= scrollWidth) {
          carousel.scrollTo({
            left: 0,
            behavior: "smooth",
          });
        } else {
          carousel.scrollTo({
            left: awayFromLeft + 400,
            behavior: "smooth",
          });
        }
      }
      setMoveCarousel((prev) => !prev);
    }, 10000);

    // Clean up the timer to avoid memory leaks
    return () => clearTimeout(timerId);
  }, [moveCarousel]);
  const getForums = async () => {
    const allForums = await getDocs(collection(db, "forums"));
    const ForumData = allForums.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setForumList(ForumData);
  };
  const getEvents = async () => {
    const allEvents = await getDocs(collection(db, "events"));
    const EventData = allEvents.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setEventList(EventData);
  };
  function returnDay(num) {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[num];
  }
  function returnMonth(num) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[num];
  }
  function returnSuffix(num) {
    if (num >= 11 && num <= 13) {
      return num + "th";
    }
    switch (num % 10) {
      case 1:
        return num + "st";
      case 2:
        return num + "nd";
      case 3:
        return num + "rd";
      default:
        return num + "th";
    }
  }

  if (!user || !forumList) {
    return <Spinner />;
  }

  return (
    <div className="forum-container">
      <Header userId={user?.uid} userPhotoURL={user?.photoURL} />
      <div className="forum-page-heading">
        <h3 className="dp-heading-font-family">Welcom To Our Forum</h3>
      </div>

      <div className="forum-list">
        {forumList?.map((forum) => (
          <div className="forum-card">
            <div>
              <div className="forum-card-image">
                <img src={forum.photoUrl} alt=""></img>
              </div>
            </div>
            <div className="forum-card-sec-two">
              <Link
                to={"/forumchat/" + forum.id}
                className="forum-card-title dp-heading-font-family"
              >
                <h8>{forum.name}</h8>
              </Link>
              <div className="forum-creator-tags dp-heading-font-family">
                <div className="forum-ct-one">
                  <div>Created By:</div>
                  <div> {forum.creatorDisplayName}</div>
                  <div className="forum-tag-img">
                    <img width={"32px"} src={forum.creatorUrl} alt=""></img>
                  </div>
                </div>
                {/* <div className="forum-ct-two">
                  <div>150 Members</div>
                  <button className="forum-card-button">JOIN</button>
                </div> */}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="events-forum">
        <div className="event-header-forum dp-heading-font-family">
          Ongoing Orphanage Releated Events
        </div>
        <div className="ev-li-container">
          <div className="events-list " ref={carouselRef}>
            {eventList?.map((event, index) => {
              return (
                <div className="event-card">
                  <div className="event-card-image">
                    <img
                      height={"200px"}
                      src={event.eventPhotoUrl}
                      alt="no image"
                    ></img>
                  </div>
                  <div className="event-details" tabindex="1">
                    <div className="event-date">
                      {returnDay(new Date(event.date).getDay()) +
                        ", " +
                        returnSuffix(new Date(event.date).getDate()) +
                        " " +
                        returnMonth(new Date(event.date).getMonth()) +
                        " " +
                        new Date(event.date).getFullYear()}
                    </div>
                    <div className="event-info">
                      <p className="eventss-name">{event.name}</p>
                      <div className="event-description">
                        {event.description}
                      </div>
                    </div>
                    <div className="event-location">{event.eventType}</div>
                    <div className="event-notfication-dot"></div>
                    <a
                      className="event-web-link"
                      href={event.websiteURL}
                      target="_blank"
                    >
                      <LinkSvg width={"24px"} height={"24px"} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="back-to-top-el">
            <div className="back-to-top-icon" onClick={scrollBack}>
              <BackArrowSvg width={"18px"} height={"18px"} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
