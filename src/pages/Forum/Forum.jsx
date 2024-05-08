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
  const navigate = useNavigate();
  const array2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1];
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
                <div className="forum-ct-two">
                  <div>150 Members</div>
                  <button className="forum-card-button">JOIN</button>
                </div>
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
            {array2.map((event, index) => {
              return (
                <div className="event-card">
                  <div className="event-card-image">
                    <img width={"200px"} src={eventimage} alt="no image"></img>
                  </div>
                  <div className="event-details" tabindex="1">
                    <div className="event-date">Monday, 31st July</div>
                    <div className="event-info">
                      <p className="eventss-name">
                        Hope for Orphans: A Seminar on Empowering Futures
                      </p>
                      <div className="event-description">
                        This seminar aims to provide a platform for discussing
                        strategies and initiatives to empower orphaned children,
                        offering them hope for a brighter future. Through
                        insightful discussions and practical workshops,
                        attendees will explore ways to support and nurture the
                        potential of orphaned youth, fostering resilience and
                        opportunities for success.
                      </div>
                    </div>
                    <div className="event-location">31st District Guzape</div>
                    <div className="event-notfication-dot"></div>
                    <a
                      className="event-web-link"
                      href="https://manuarora.in/boxshadows"
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
