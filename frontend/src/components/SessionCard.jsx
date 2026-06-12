import { Badge } from "@/components/ui/badge";

const formatUserAgent = (userAgent) => {
  if (!userAgent) return "Unknown device";
  const parts = userAgent.split(" (");
  return parts.length > 1
    ? `${parts[0]} (${parts[1].split(")")[0]})`
    : userAgent;
};

function formatLastActive(dateString) {
  const diffMs = Date.now() - new Date(dateString).getTime();

  const minutes = Math.floor(diffMs / (1000 * 60));

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }

  const days = Math.floor(hours / 24);

  return `${days} day${days > 1 ? "s" : ""} ago`;
}

export default function SessionCard({ session, label }) {
  return (
    <div className="rounded-3xl bg-slate-50 p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm uppercase tracking-[0.18em] text-slate-500">
            {label}
          </p>
          <h2 className="mt-2 text-lg font-semibold text-slate-900 truncate">
            {formatUserAgent(session?.userAgent)}
          </h2>
          <p className="text-xs leading-6 text-slate-600 line-clamp-2">
            {session?.userAgent || "No user agent details available."}
          </p>

          {label === "Other device" && (
            <p className="mt-4 text-slate-500">
              Last accessed: {formatLastActive(session?.lastUsedAt)}
            </p>
          )}
          <p className="text-slate-600">
            IP: {session?.ipAddress || "Unknown"}
          </p>
        </div>

        {label === "Other device" && (
          <Badge className="bg-emerald-100 text-emerald-800 p-3">ACTIVE</Badge>
        )}
      </div>
    </div>
  );
}
