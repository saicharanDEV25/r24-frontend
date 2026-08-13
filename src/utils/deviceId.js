// Shared anonymous per-browser id used for both analytics (App.jsx) and login-free
// customer identity (CustomerAuthContext) — same device, no OTP step required.
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
