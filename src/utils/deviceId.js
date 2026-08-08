// Shared anonymous per-browser id, generated once and kept in
// localStorage. Used both for analytics visit tracking (App.jsx) and as
// the customer's login-free identity (CustomerAuthContext) — same device,
// same customer, no OTP/phone step required.
export function getOrCreateDeviceId() {
  let deviceId = localStorage.getItem("visitorId");

  if (!deviceId) {
    deviceId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `visitor-${Date.now()}-${Math.random().toString(16).slice(2)}`;

    localStorage.setItem("visitorId", deviceId);
  }

  return deviceId;
}
