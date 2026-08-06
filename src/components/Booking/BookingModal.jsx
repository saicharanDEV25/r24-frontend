import { useState } from "react";
import { FaTimes, FaCalendarCheck } from "react-icons/fa";
import "./BookingModal.css";
import api from "../../services/api";

const bikes = [
  "125 Duke",
  "200 Duke",
  "250 Duke",
  "390 Duke",
  "RC 200",
  "RC 390",
  "250 Adventure",
  "390 Adventure",
  "390 Adventure X",
  "390 Enduro R",
  "790 Duke",
  "890 Duke R",
  "1290 Super Duke R",
];

function BookingModal({ serviceType, price, onClose }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bikeModel, setBikeModel] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const submitBooking = async (e) => {
    e.preventDefault();
    setError("");

    if (name.trim().length < 2) {
      setError("Please enter your name.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Please enter a valid 10 digit mobile number.");
      return;
    }

    if (!bikeModel) {
      setError("Please select your bike.");
      return;
    }

    if (!bookingDate) {
      setError("Please choose a preferred date.");
      return;
    }

    try {
      setSubmitting(true);

      await api.post("/bookings", {
        customerName: name.trim(),
        phoneNumber: phone,
        bikeModel,
        serviceType,
        problemDescription: problemDescription.trim(),
        bookingDate,
        bookingTime,
      });

      const message = encodeURIComponent(
        `Hello R24 Automotive 👋 I've booked "${serviceType}" (${price}).\n\nName: ${name}\nBike: ${bikeModel}\nPreferred Date: ${bookingDate}${
          bookingTime ? `\nPreferred Time: ${bookingTime}` : ""
        }${
          problemDescription
            ? `\nNotes: ${problemDescription}`
            : ""
        }\n\nPlease confirm my slot.`
      );

      window.open(`https://wa.me/918309560622?text=${message}`, "_blank");

      setDone(true);
    } catch (err) {
      console.error("Error submitting booking:", err);
      setError("Couldn't submit your booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="booking-modal-overlay" onClick={onClose}>
      <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
        <button className="booking-modal-close" onClick={onClose}>
          <FaTimes />
        </button>

        {done ? (
          <div className="booking-success">
            <FaCalendarCheck className="booking-success-icon" />
            <h2>Booking Requested!</h2>
            <p>
              We've received your request for "{serviceType}". Our team will
              confirm your slot on WhatsApp shortly.
            </p>
            <button className="booking-submit-btn" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="booking-modal-icon">
              <FaCalendarCheck />
            </div>

            <h2>Book "{serviceType}"</h2>
            <p className="booking-modal-subtext">{price}</p>

            <form onSubmit={submitBooking} className="booking-form">
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                type="tel"
                placeholder="Mobile Number"
                value={phone}
                maxLength={10}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, ""))
                }
              />

              <select
                value={bikeModel}
                onChange={(e) => setBikeModel(e.target.value)}
              >
                <option value="">Select Your Bike</option>
                {bikes.map((bike) => (
                  <option key={bike} value={bike}>
                    {bike}
                  </option>
                ))}
              </select>

              <div className="booking-form-row">
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                />

                <input
                  type="time"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                />
              </div>

              <textarea
                placeholder="Anything we should know? (optional)"
                rows="3"
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
              />

              {error && <p className="booking-error">{error}</p>}

              <button
                type="submit"
                className="booking-submit-btn"
                disabled={submitting}
              >
                {submitting ? "Booking..." : "Confirm Booking"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default BookingModal;
