import API from "@/api/axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SubmissionTab = () => {
  const { assignmentId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await API.get(`/assignments/${assignmentId}/submissions`);
        setSubmissions(res.data || []);
      } catch (error) {
        setError("Failed to load submissions.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [assignmentId]);

  const filtered = submissions.filter((s) =>
    filter === "all" ? true : filter === s.status,
  );

  if (loading) return <p className="text-sm text-gray-400">Loading...</p>;
  if (error) return <p className="text-sm text-red-500">{error}</p>;

  if (submissions.length === 0)
    return <p className="text-sm text-gray-400">No submissions yet.</p>;

  return (
    <>
      <div className="sm:flex">
        <div className="sm:w-1/3">
          <Select value={filter} onValueChange={(value) => setFilter(value)}>
            <SelectTrigger className="w-full max-w-48">
              <SelectValue placeholder="Filter By" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="submitted">Not Marked yet</SelectItem>
                <SelectItem value="graded">Graded</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Left Side - Students List*/}
          <div className="mt-4">
            {filtered.map((s) => (
              <button
                key={s._id}
                onClick={() => {
                  setSelected(s);
                  setShowOverlay(true);
                }}
                className={`w-full text-left px-4 py-3 border-b  hover:bg-gray-50 transition-colors ${
                  selected?._id === s._id
                    ? "bg-primary/5 border-l-4 border-l-primary"
                    : ""
                }`}
              >
                <p className="text-sm font-medium text-gray-800 hover:underline">
                  {s.studentId.name}
                </p>
                <span
                  className={`text-xs mt-0.5 inline-block px-2 py-0.5 rounded-full ${
                    s.status === "graded"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {s.status}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side- Answer (hidden on mobile) */}
        <div className="hidden sm:block sm:w-2/3 flex-1 overflow-y-auto p-6">
          {selected ? (
            <>
              <h2 className="text-lg font-semibold text-gray-800 mb-1">
                {selected.studentId.name}
              </h2>
              <p className="text-xs text-gray-400 mb-4">
                Submitted:{" "}
                {new Date(selected.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>

              <hr className="mb-4 border-gray-200" />

              <p className="text-sm text-gray-700 whitespace-pre-line">
                {selected.answer}
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-400">
              Select a student to view their answer.
            </p>
          )}
        </div>
      </div>
      {/* Mobile Overlay — visible only on small screens when a student is selected */}
      {showOverlay && selected && (
        <div className="fixed inset-0 z-50 bg-white sm:hidden overflow-y-auto">
   
          <div className="px-4 py-3 border-b border-gray-200">
            <button
              onClick={() => setShowOverlay(false)}
              className="text-gray-500 hover:text-gray-800 text-xl font-bold"
            >
              ✕
            </button>
          </div>

          <div className="p-5">
            <h2 className="text-base font-semibold text-gray-800">
              {selected.studentId.name}
            </h2>
            <p className="text-xs text-gray-400 mb-4">
              Submitted:{" "}
              {new Date(selected.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <hr className="mb-4 border-gray-200" />
            <p className="text-sm text-gray-700 whitespace-pre-line">
              {selected.answer}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default SubmissionTab;
