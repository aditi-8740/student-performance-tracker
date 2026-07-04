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
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const SubmissionTab = ({ totalMarks }) => {
  const { assignmentId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [marks, setMarks] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await API.get(`/assignments/${assignmentId}/submissions`);
        setSubmissions(res.data);
      } catch (error) {
        setError("Failed to load submissions.");  
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [assignmentId]);

  const filtered = submissions.filter((s) => {
    return (filter === "all" ? true : filter === s.status)});
   

  const handleGradeSave = async () => {
    if (!selected) return;

    const maxMarks = Number(totalMarks);
    const numMarks = Number(marks);
    const submissionId = selected._id;

    if (
      marks === "" ||
      Number.isNaN(numMarks) ||
      numMarks < 0 ||
      ( maxMarks >= 0 && numMarks > maxMarks)
    ) {
      setSaveMsg(`Marks must be between 0 and ${totalMarks ?? "the assignment max"}`);
      window.setTimeout(() => {
        setSaveMsg("");
      }, 3000);
      return;
    }

    setSaving(true);
    try {
      await API.patch(`/assignments/${assignmentId}/submissions/${submissionId}`, {
        marks: numMarks,
      });

      setSubmissions((prev) =>
        prev.map((s) =>
          s._id === submissionId ? { ...s, marks: numMarks, status: "graded" } : s,
        ),
      );

      setSelected((prev) =>
        prev && prev._id === submissionId
          ? { ...prev, marks: numMarks, status: "graded" }
          : prev,
      );

      setSaveMsg("Grade saved successfully!");
      window.setTimeout(() => {
        setSaveMsg("");
      }, 3000);
    } catch (error) {
      setSaveMsg("Failed to save grade.");
      window.setTimeout(() => {
        setSaveMsg("");
      }, 3000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-gray-400">Loading...</p>;
  if (error) return <p className="text-sm text-red-500">{error}</p>;

  if (submissions.length === 0)
    return <p className="text-sm text-gray-400">No submissions yet.</p>;

  return (
    <>
      <div className="md:flex">
        <div className="md:w-1/3">
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
                  setMarks(s.marks ?? "");
                  setShowOverlay(true);
                }}
                className={`w-full text-left px-4 py-3 border-b border-l-4 hover:bg-gray-50 transition-colors ${
                  selected?._id === s._id
                    ? "bg-primary/5 border-l-primary"
                    : "border-l-transparent"
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
        <div className="hidden md:block md:w-2/3 flex-1 overflow-y-auto p-6">
          {selected ? (
            <>
              <div className="flex justify-between items-center">
                <div>
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
                </div>
                <div>
                  <Input
                    type="number"
                    value={marks}
                    min={0}
                    max={totalMarks}
                    onChange={(e) => setMarks(e.target.value)}
                    className="w-10 sm:w-20 px-3 py-3 sm:text-md text-center rounded-none border-0 border-b-2 border-gray-400 focus-visible:border-primary focus-visible:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="text-md sm:text-xl font-semibold">
                    &nbsp;/ {totalMarks}
                  </span>
                </div>
              </div>

              <hr className="mb-4 border-gray-200" />

              <p className="text-sm text-gray-700 whitespace-pre-line">
                {selected.answer}
              </p>
              <hr className="my-4 border-gray-200" />

              <Button
                variant="outline"
                className=" px-3 py-1 cursor-pointer my-2 hover:text-white hover:bg-primary border-primary transition duration-200 ease-in-out "
                onClick={handleGradeSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Grade"}
              </Button>
              {saveMsg && (
                <span
                  className={`text-sm ml-4 ${
                    saveMsg.includes("success") ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {saveMsg}
                </span>
              )}
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
        <div className="fixed inset-0 z-50 bg-white md:hidden overflow-y-auto">
          <div className="px-4 py-3 border-b border-gray-200 sticky top-0 bg-background">
            <button
              onClick={() => setShowOverlay(false)}
              className="text-gray-500 hover:text-gray-800 text-xl font-bold"
            >
              ✕
            </button>
          </div>

          <div className="p-5">
            <div className="flex justify-between items-center">
              <div>
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
              </div>
              <div>
                <Input
                  type="number"
                  value={marks}
                  min={0}
                  max={totalMarks}
                  onChange={(e) => setMarks(e.target.value)}
                  className="w-10 sm:w-20 px-3 py-3 sm:text-md text-center rounded-none border-0 border-b-2 border-gray-400 focus-visible:border-primary focus-visible:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="text-md sm:text-xl font-semibold">
                  {" "}
                  &nbsp;/ {totalMarks}
                </span>
              </div>
            </div>
            <hr className="mb-4 border-gray-200" />
            <p className="text-sm text-gray-700 whitespace-pre-line">
              {selected.answer}
            </p>
            <hr className="my-4 border-gray-200" />
            <Button
              variant="outline"
              className=" px-3 py-1 cursor-pointer my-2 hover:text-white hover:bg-primary border-primary transition duration-200 ease-in-out "
            onClick={handleGradeSave} disabled={saving}
            >
              {saving ? "Saving..." : "Save Grade"}
            </Button>
            {saveMsg && <span className={`text-sm ml-4 ${saveMsg.includes("success") ? "text-green-600" : "text-red-500" } `}>{saveMsg}</span>}
          </div>
        </div>
      )}
    </>
  );
};

export default SubmissionTab;
