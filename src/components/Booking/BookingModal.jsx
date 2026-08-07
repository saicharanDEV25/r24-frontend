import { useState } from "react";
import { FaTimes, FaCalendarCheck } from "react-icons/fa";
import "./BookingModal.css";
import api from "../../services/api";
import { BIKE_BRANDS, KTM_FAMILIES } from "../../constants/bikes";
import { useCustomerAuth } from "../../context/CustomerAuthContext";

function BookingModal({ serviceType, onClose }) {
  const { customer } = useCustomerAuth();

  const [name, setName] = useState(customer?.name || "");
  const [phone, setPhone] = useState(customer?.phoneNumber || "");
  const [bikeModel, setBikeModel] = useState(customer?.bikeModel || "");
  const [bikeBrand, setBikeBrand] = useState(null);
  const [bikeFamily, setBikeFamily] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const brandModels = bikeBrand
    ? BIKE_BRANDS.find((b) => b.brand === bikeBrand)?.models || []
    : [];

  const changeBike = () => {
    setBikeModel("");
    setBikeBrand(null);
    setBikeFamily(null);
  };

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
        `Hello R24 Automotive 👋 I've booked "${serviceType}".\n\nName: ${name}\nBike: ${bikeModel}\nPreferred Date: ${bookingDate}${
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
              Our team will contact you within 1 hour.
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

              {bikeModel ? (
                <div className="booking-bike-chosen">
                  <span>
                    Bike: <strong>{bikeBrand ? `${bikeBrand} ` : ""}{bikeModel}</strong>
                  </span>
                  <button
                    type="button"
                    className="booking-bike-change"
                    onClick={changeBike}
                  >
                    Change
                  </button>
                </div>
              ) : !bikeBrand ? (
                <div className="booking-bike-select-grid">
                  <p className="booking-bike-label">Select Your Bike Brand</p>
                  {BIKE_BRANDS.map((b) => (
                    <button
                      type="button"
                      key={b.brand}
                      className="booking-bike-card"
                      onClick={() => setBikeBrand(b.brand)}
                    >
                      {b.brand}
                    </button>
                  ))}
                </div>
              ) : bikeBrand === "KTM" && !bikeFamily ? (
                <div className="booking-bike-select-grid">
                  <button
                    type="button"
                    className="booking-bike-back"
                    onClick={() => setBikeBrand(null)}
                  >
                    ← Back to brands
                  </button>
                  {KTM_FAMILIES.map((f) => (
                    <button
                      type="button"
                      key={f.family}
                      className="booking-bike-card"
                      onClick={() => setBikeFamily(f)}
                    >
                      {f.family}
                    </button>
                  ))}
                </div>
              ) : bikeBrand === "KTM" && bikeFamily ? (
                <div className="booking-bike-select-grid">
                  <button
                    type="button"
                    className="booking-bike-back"
                    onClick={() => setBikeFamily(null)}
                  >
                    ← Back to models
                  </button>
                  {bikeFamily.variants.map((v) => (
                    <button
                      type="button"
                      key={v.model}
                      className="booking-bike-card"
                      onClick={() => setBikeModel(v.model)}
                    >
                      {v.cc} cc
                    </button>
                  ))}
                </div>
              ) : (
                <div className="booking-bike-select-grid">
                  <button
                    type="button"
                    className="booking-bike-back"
                    onClick={() => setBikeBrand(null)}
                  >
                    ← Back to brands
                  </button>
                  {brandModels.map((m) => (
                    <button
                      type="button"
                      key={m}
                      className="booking-bike-card"
                      onClick={() => setBikeModel(m)}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              )}

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
