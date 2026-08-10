import { useState } from "react";
import { FaTimes, FaCalendarCheck } from "react-icons/fa";
import "../../pages/Products/Product.css";
import "./BookingModal.css";
import api from "../../services/api";
import { REAL_BIKE_BRANDS } from "../../constants/bikes";
import { useCustomerAuth } from "../../context/CustomerAuthContext";

const isRealPhoneNumber = (value) => /^[6-9]\d{9}$/.test(value || "");

function BookingModal({ serviceType, onClose }) {
  const { customer, updateCustomer } = useCustomerAuth();

  const [name, setName] = useState(customer?.name || "");
  const [phone, setPhone] = useState(
    isRealPhoneNumber(customer?.phoneNumber) ? customer.phoneNumber : ""
  );
  const [bikeModel, setBikeModel] = useState(customer?.bikeModel || "");
  const [bikeBrand, setBikeBrand] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const brandModels = bikeBrand
    ? REAL_BIKE_BRANDS.find((b) => b.brand === bikeBrand)?.models || []
    : [];

  const selectBikeBrand = (brand) => {
    setBikeBrand(brand);
    setBikeModel("");
  };

  const changeBike = () => {
    setBikeModel("");
    setBikeBrand(null);
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

      // Sync name/phone/bike to this device's profile (silently) so "My
      // Garage" can find this booking later without ever asking for a
      // login — the phone here is just a data field now, not a credential.
      try {
        const res = await api.put("/customers/me", {
          name: name.trim(),
          phoneNumber: phone,
          bikeModel,
        });
        updateCustomer(res.data);
      } catch (syncError) {
        console.error("Error syncing profile after booking:", syncError);
      }

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
              ) : (
                <div className="booking-bike-picker">
                  <p className="booking-bike-label">Select Your Bike</p>

                  <div className="category-buttons">
                    {REAL_BIKE_BRANDS.map((b) => (
                      <button
                        type="button"
                        key={b.brand}
                        className={bikeBrand === b.brand ? "active" : ""}
                        onClick={() => selectBikeBrand(b.brand)}
                      >
                        {b.brand}
                      </button>
                    ))}
                  </div>

                  {bikeBrand && (
                    <div className="category-buttons">
                      {brandModels.map((m) => (
                        <button
                          type="button"
                          key={m}
                          onClick={() => setBikeModel(m)}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="booking-form-row">
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  // Clicking anywhere on the field opens the calendar
                  // instead of requiring a precise tap on the tiny native
                  // icon. Can't combine this with readOnly — showPicker()
                  // throws on a non-mutable input, which would leave the
                  // field completely dead once readonly blocks typing too.
                  onClick={(e) => e.target.showPicker?.()}
                />

                <input
                  type="time"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  onClick={(e) => e.target.showPicker?.()}
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
