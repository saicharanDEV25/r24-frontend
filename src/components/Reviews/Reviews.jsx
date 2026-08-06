import { useEffect, useState } from "react";
import "./Reviews.css";
import { FaStar, FaRegStar } from "react-icons/fa";
import api from "../../services/api";

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    loadReviews();
  }, []);

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

      <div className="reviews-grid">
        {!loading && reviews.length === 0 && (
          <p className="no-reviews-msg">
            No reviews yet — be the first to share your experience!
          </p>
        )}

        {reviews.map((item) => (
          <div className="review-card" key={item.id}>
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
    </section>
  );
}

export default Reviews;
