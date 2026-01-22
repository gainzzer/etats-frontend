function resolvePhotoUrl(input) {
  try {
    const url = String(input || "").trim();
    if (!url) return "";

    if (url.includes("facebook.com")) {
      const match = url.match(/(\d{8,})/);
      if (match?.[1]) return `https://graph.facebook.com/${match[1]}/picture?type=large`;
    }

    return url;
  } catch {
    return "";
  }
}

export default function ProfileCard({ user, me, isManager, employeeId }) {
  const name = me?.name || user?.name || "User";
  const email = me?.email || user?.email || "-";

  const rawPhoto =
    me?.photoUrl ??
    me?.photo_url ??
    user?.photoUrl ??
    user?.photo_url ??
    "";

  const photo = resolvePhotoUrl(rawPhoto) || "/vite.svg";

  function handleImgError(e) {
    try {
      e.currentTarget.src = "/vite.svg";
    } catch {}
  }

  return (
    <div className="dash-card dash-profile">
      <div className="dash-profile-top">
        <img
          className="dash-avatar"
          src={photo}
          alt="profile"
          referrerPolicy="no-referrer"
          onError={handleImgError}
        />

        <div className="dash-profile-info">
          <div className="dash-name">{name}</div>
          <div className="dash-muted">{email}</div>

          <div className="dash-badges">
            <span className="dash-badge">{isManager ? "manager" : "employee"}</span>
            {me?.department ? <span className="dash-badge">{me.department}</span> : null}
            {me?.status ? <span className="dash-badge">{me.status}</span> : null}
          </div>
        </div>
      </div>

      <div className="dash-profile-bottom">
        <div className="dash-kv">
          <span>Employee ID</span>
          <b>{me?.employeeId || me?.employee_id || employeeId || "-"}</b>
        </div>
        <div className="dash-kv">
          <span>Designation</span>
          <b>{me?.designation || "-"}</b>
        </div>
      </div>
    </div>
  );
}
