import API from "@/api/axios";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Separator } from "@/components/ui/separator";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const AssignmentsPage = () => {
  const { classId } = useParams();
  const [assignments, setAssignments] = useState([]);
  const { user } = useAuth();
  const role = user?.role;
  console.log(role);

  const handleCreateAssignment = async () => {
    const title = prompt("Enter title");
    const description = prompt("Enter description");
    const dueDate = prompt("Enter due date (YYYY-MM-DD)");

    if (!title) return;

    try {
      await API.post("/assignments", {
        title,
        description,
        dueDate,
        classId,
      });

      alert("Created");
      window.location.reload(); // simple refresh
    } catch (err) {
      alert("Error");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      // get assignments for classId
      const res2 = await API.get(`/classes/${classId}/assignments`);
      setAssignments(res2.data);
    };

    fetchData();
  }, [classId]);

  return (
    <>
      {/* Assignments */}
      {role === "teacher" && (
        <button
          className="bg-primary rounded-(--radius) text-white px-3 py-1 "
          onClick={handleCreateAssignment}
        >
          + Create Assignment
        </button>
      )}

      <div>
        <h2 className="text-2xl">Assignments</h2>
        <Separator />

        <div className="grid lg:grid-cols-2 gap-4">
          {assignments.map((a) => (
            <Card key={a._id}>
              <CardContent className="p-4 space-y-2 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="font-semibold mb-3">{a.title}</h3>
                  <Separator />
                  <p className="my-2">{a.description}</p>
                </div>

                <div>
                  <Separator />
                  <p className="text-xs text-red-700 my-2">
                    DueDate :{" "}
                    {a.dueDate ? new Date(a.dueDate).toLocaleDateString() : ""}
                  </p>
                  {role === "student" && (
                    <button
                      className="bg-primary text-white px-3 py-1 rounded"
                      onClick={() => handleSubmit(a._id)}
                    >
                      Submit
                    </button>
                  )}
                  {role === "student" && (
                    <p className="text-sm mt-2">
                      Marks: {a.marks ?? "Not graded"}
                    </p>
                  )}
                  {role === "teacher" && (
                    <button
                      className="bg-primary rounded-(--radius) text-white px-3 py-1 "
                      onClick={() => fetchSubmissions(a._id)}
                    >
                      View Submissions
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default AssignmentsPage;
