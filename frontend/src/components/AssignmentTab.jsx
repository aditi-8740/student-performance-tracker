import React from "react";

const AssignmentTab = ({ assignment }) => {
  if (!assignment) {
    return <div className="text-sm text-gray-600">Loading assignment...</div>;
  }

  const formattedDue = assignment.dueDate
    ? new Date(assignment.dueDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "No due date";

  const formattedCreated = assignment.createdAt
    ? new Date(assignment.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Unknown date";

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
