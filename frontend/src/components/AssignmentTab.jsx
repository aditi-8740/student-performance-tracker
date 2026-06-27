import API from "@/api/axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const AssignmentTab = () => {
  const { assignmentId } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const res = await API.get(`/assignments/${assignmentId}`);
        setAssignment(res.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to load assignment details");
        setLoading(false);
      }
    };
    fetchAssignment();
  }, [assignmentId]);

  if (loading) return <p className="text-sm text-gray-400">Loading...</p>;
  if (error) return <p className="text-sm text-red-500">{error}</p>;

  const formattedDue = assignment.dueDate
    ? new Date(assignment.dueDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "No due date";

    const formattedCreated = new Date(assignment.createdAt).toLocaleDateString(
    "en-IN",
    { day: "numeric", month: "short", year: "numeric" }
  );

  return (
    <>
      <h1 className="text-lg sm:text-2xl  text-gray-800 mb-1">
        {assignment.title}
      </h1>
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 text-sm text-gray-600 mt-1.5">
        <span>• Assigned: {formattedCreated}</span>
        
        <span>• {assignment.marks} marks</span>
        <span>• Due: {formattedDue}</span>
      </div>
      <p className="text-sm text-gray-600 whitespace-pre-line mt-1.5">
        {assignment.description || "No instructions provided."}
      </p>
    </>
  );
};

export default AssignmentTab;
