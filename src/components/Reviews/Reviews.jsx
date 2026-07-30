import "./Reviews.css";
import { FaStar } from "react-icons/fa";

const reviews = [
  {
    name: "Customer 1",
    review: "Customer review will appear here after the website goes live.",
  },
  {
    name: "Customer 2",
    review: "Customer review will appear here after the website goes live.",
  },
  {
    name: "Customer 3",
    review: "Customer review will appear here after the website goes live.",
  },
];

function Reviews() {
  return (
    <section className="reviews">

      <div className="reviews-heading">
        <h2>Customer Reviews</h2>
        <p>Real customer reviews will be displayed here.</p>
      </div>

      <div className="reviews-grid">

        {reviews.map((item, index) => (

          <div className="review-card" key={index}>

            <div className="stars">
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
            </div>

            <p className="review-text">
              "{item.review}"
            </p>

            <h3>{item.name}</h3>

          </div>

        ))}

      </div>

    </section>
  );
}

export default Reviews;