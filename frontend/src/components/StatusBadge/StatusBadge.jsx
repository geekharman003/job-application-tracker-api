import "./StatusBadge.css";

function StatusBadge({ status }) {
  let badgeColor = null;
  let badgeBgColor = null;

  switch (status) {
    case "saved":
      badgeColor = "#3887ff";
      badgeBgColor = "#eff6ff";
      break;
    case "applied":
      badgeColor = "#ff9900";
      badgeBgColor = "#efe3d8";
      break;
    case "interview":
      badgeColor = "#ad46ff";
      badgeBgColor = "#faf5ff";
      break;
    case "offer":
      badgeColor = "#00c950";
      badgeBgColor = "#f0fdf4";
      break;
    default:
      badgeColor = "#ef4444";
      badgeBgColor = "#fef2f2";
  }

  return (
    <span
      className={`inline-flex justify-center items-center gap-2 px-2 rounded-lg text-xs font-semibold`}
      style={{backgroundColor:badgeBgColor,color:badgeColor}}
    >
      <span className="rounded-full w-1 h-1" style={{backgroundColor:badgeColor}}></span>
      {status}
    </span>
  );
}

export default StatusBadge;
