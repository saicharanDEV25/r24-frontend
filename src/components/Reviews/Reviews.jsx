import { useEffect, useRef, useState } from "react";
import "./Reviews.css";
import { FaStar, FaRegStar, FaTimes } from "react-icons/fa";
import api from "../../services/api";

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const scrollRef = useRef(null);
  const hoveringRef = useRef(false);
  const draggingRef = useRef(false);
  const touchActiveRef = useRef(false);
  const didDragRef = useRef(false);
  const dragStartRef = useRef({ x: 0, scrollLeft: 0 });
  const touchResumeTimeout = useRef(null);

  useEffect(() => {
    loadReviews();
  }, []);

  // same auto-scroll + drag/swipe marquee behavior as Gallery's before/after track
  useEffect(() => {
    const track = scrollRef.current;
    if (!track || reviews.length === 0) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const speed = reduceMotion ? 0 : 0.6;

    let rafId;
    const step = () => {
      if (
        !hoveringRef.current &&
        !draggingRef.current &&
        !touchActiveRef.current
      ) {
        track.scrollLeft += speed;
      }

      const half = track.scrollWidth / 2;
      if (half > 0) {
        if (track.scrollLeft >= half) track.scrollLeft -= half;
        else if (track.scrollLeft < 0) track.scrollLeft += half;
      }

      rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(rafId);
  }, [reviews]);

  const handlePointerDown = (e) => {
    didDragRef.current = false;
    if (e.pointerType === "mouse") {
      draggingRef.current = true;
      dragStartRef.current = {
        x: e.clientX,
        scrollLeft: scrollRef.current.scrollLeft,
      };
    } else {
      touchActiveRef.current = true;
      if (touchResumeTimeout.current) clearTimeout(touchResumeTimeout.current);
    }
  };

  const handlePointerMove = (e) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;

    if (Math.abs(dx) > 5 && !didDragRef.current) {
      didDragRef.current = true;
      // capture only once we know it's a real drag — capturing on every mousedown
      // routes the click to this container instead of whatever's underneath
      e.currentTarget.setPointerCapture(e.pointerId);
    }

    if (didDragRef.current) {
      e.preventDefault();
      scrollRef.current.scrollLeft = dragStartRef.current.scrollLeft - dx;
    }
  };

  const handlePointerEnd = (e) => {
    draggingRef.current = false;
    if (e?.pointerType === "mouse" && e.currentTarget.hasPointerCapture?.(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    if (e?.pointerType && e.pointerType !== "mouse") {
      touchResumeTimeout.current = setTimeout(() => {
        touchActiveRef.current = false;
      }, 800);
    }
  };

  const openReview = (item) => {
    if (didDragRef.current) return;
    setSelectedReview(item);
  };

  const loadReviews = async () => {
    try {
      setLoading(true);
      const res = await api.get("/reviews");
      setReviews(res.data);
    } catch (error) {
      console.error("Error loading reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();

    if (name.trim().length < 2 || message.trim().length < 2) {
      setFeedback({
        type: "error",
        text: "Please enter your name and a short review.",
      });
      return;
    }

    try {
      setSubmitting(true);

      await api.post("/reviews", {
        name: name.trim(),
        rating,
        message: message.trim(),
      });

      setName("");
      setRating(5);
      setMessage("");
      setShowForm(false);
      setFeedback({ type: "success", text: "Thanks! Your review is live." });

      loadReviews();
    } catch (error) {
      console.error("Error submitting review:", error);
      setFeedback({
        type: "error",
        text: "Couldn't submit your review. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="reviews">
      <div className="reviews-heading">
        <h2>Customer Reviews</h2>
        <p>Real feedback from riders who trust R24 Automotive.</p>

        <button
          className="write-review-btn"
          onClick={() => {
            setShowForm((prev) => !prev);
            setFeedback(null);
          }}
        >
          {showForm ? "Cancel" : "Write a Review"}
        </button>
      </div>

      {showForm && (
        <form className="review-form" onSubmit={submitReview}>
          <div className="review-form-row">
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={60}
            />

            <div className="rating-input">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  className="rating-star-btn"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  aria-label={`${star} star`}
                >
                  {(hoverRating || rating) >= star ? (
                    <FaStar />
                  ) : (
                    <FaRegStar />
                  )}
                </button>
              ))}
            </div>
          </div>

          <textarea
            placeholder="Share your experience with R24 Automotive..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="4"
            maxLength={500}
          />

          <button
            type="submit"
            className="submit-review-btn"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}

      {feedback && (
        <p className={`review-feedback ${feedback.type}`}>{feedback.text}</p>
      )}

      {!loading && reviews.length === 0 && (
        <p className="no-reviews-msg">
          No reviews yet — be the first to share your experience!
        </p>
      )}

      {reviews.length > 0 && (
        <div
          className="reviews-marquee"
          ref={scrollRef}
          onMouseEnter={() => (hoveringRef.current = true)}
          onMouseLeave={() => (hoveringRef.current = false)}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
        >
          <div className="reviews-track">
            {[...reviews, ...reviews].map((item, index) => (
              <div
                className="review-card"
                key={`${item.id}-${index}`}
                onClick={() => openReview(item)}
              >
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((star) =>
                    star <= item.rating ? (
                      <FaStar key={star} />
                    ) : (
                      <FaRegStar key={star} />
                    )
                  )}
                </div>

                <p className="review-text">"{item.message}"</p>

                <h3>{item.name}</h3>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedReview && (
        <div
          className="review-popup-overlay"
          onClick={() => setSelectedReview(null)}
        >
          <div className="review-popup" onClick={(e) => e.stopPropagation()}>
            <button
              className="review-popup-close"
              onClick={() => setSelectedReview(null)}
            >
              <FaTimes />
            </button>

            <div className="review-popup-stars">
              {[1, 2, 3, 4, 5].map((star) =>
                star <= selectedReview.rating ? (
                  <FaStar key={star} />
                ) : (
                  <FaRegStar key={star} />
                )
              )}
            </div>

            <p className="review-popup-text">"{selectedReview.message}"</p>

            <h3 className="review-popup-name">{selectedReview.name}</h3>
          </div>
        </div>
      )}
    </section>
  );
}

export default Reviews;
