import { useEffect, useState } from "react";
import { FaTimes, FaPhoneAlt, FaShieldAlt } from "react-icons/fa";
import "./LoginModal.css";
import { useCustomerAuth } from "../../context/CustomerAuthContext";

const RESEND_SECONDS = 30;

function LoginModal({ onClose }) {
  const { requestOtp, verifyOtp } = useCustomerAuth();

  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [devOtp, setDevOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendIn, setResendIn] = useState(0);

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = setInterval(() => setResendIn((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [resendIn]);

  const sendOtp = async (phoneNumber) => {
    setError("");

    if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
      setError("Enter a valid 10 digit mobile number.");
      return;
    }

    try {
      setLoading(true);
      const res = await requestOtp(phoneNumber);
      setDevOtp(res.devOtp || "");
      setStep("otp");
      setResendIn(RESEND_SECONDS);
    } catch (err) {
      console.error(err);
      setError("Couldn't send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const confirmOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (code.trim().length < 4) {
      setError("Enter the OTP sent to your number.");
      return;
    }

    try {
      setLoading(true);
      await verifyOtp(phone, code.trim());
      onClose();
    } catch (err) {
      console.error(err);
      setError("Incorrect or expired OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="login-modal-close" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="login-modal-icon">
          {step === "phone" ? <FaPhoneAlt /> : <FaShieldAlt />}
        </div>

        <div className="login-step-dots">
          <span className={step === "phone" ? "dot active" : "dot done"} />
          <span className={step === "otp" ? "dot active" : "dot"} />
        </div>

        <h2>{step === "phone" ? "Login to R24 Automotive" : "Verify OTP"}</h2>

        {step === "phone" && (
          <>
            <p className="login-modal-subtext">
              Enter your mobile number to continue.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendOtp(phone);
              }}
              className="login-form"
            >
              <input
                type="tel"
                placeholder="10 digit mobile number"
                value={phone}
                maxLength={10}
                autoFocus
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, ""))
                }
              />

              {error && <p className="login-error">{error}</p>}

              <button type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          </>
        )}

        {step === "otp" && (
          <>
            <p className="login-modal-subtext">
              Enter the OTP sent to +91 {phone}.
            </p>

            {devOtp && (
              <p className="login-dev-otp">
                Demo Mode (no SMS provider configured yet) — your OTP is{" "}
                <strong>{devOtp}</strong>
              </p>
            )}

            <form onSubmit={confirmOtp} className="login-form">
              <input
                type="tel"
                placeholder="Enter OTP"
                value={code}
                maxLength={6}
                autoFocus
                onChange={(e) =>
                  setCode(e.target.value.replace(/\D/g, ""))
                }
              />

              {error && <p className="login-error">{error}</p>}

              <button type="submit" disabled={loading}>
                {loading ? "Verifying..." : "Verify & Login"}
              </button>
            </form>

            <div className="login-modal-footer-actions">
              <button
                className="login-modal-back"
                onClick={() => {
                  setStep("phone");
                  setCode("");
                  setError("");
                }}
              >
                Change Number
              </button>

              <button
                className="login-modal-resend"
                disabled={resendIn > 0 || loading}
                onClick={() => sendOtp(phone)}
              >
                {resendIn > 0 ? `Resend OTP in ${resendIn}s` : "Resend OTP"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default LoginModal;
