import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function ClassDetail() {
  const { classId } = useParams();

  const [classData, setClassData] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const role = localStorage.getItem("role");

  const handleCreateAssignment = async () => {
    const title = prompt("Enter title");
    const description = prompt("Enter description");
    const dueDate = prompt("Enter due date (YYYY-MM-DD)");

    if (!title) return;

    try {
      await API.post("/create-assignment", {
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

  const handleSubmit = async (assignmentId) => {
    const answer = prompt("Enter your answer");

    if (!answer) return;

    try {
      await API.post("/submit-assignment", {
        assignmentId,
        answer,
      });

      alert("Submitted");
    } catch (err) {
      alert("Error submitting");
    }
  };

  const fetchSubmissions = async (assignmentId) => {
    try {
      const res = await API.get(`/submissions/${assignmentId}`);
      setSubmissions(res.data); console.log(res)
    } catch (err) {
      console.error(err);
    }
  };

  const handleGrade = async (submissionId) => {
    const marks = prompt("Enter marks");

    if (!marks) return;

    try {
      await API.post("/grade-assignment", {
        submissionId,
        marks,
      });

      alert("Graded");
    } catch (err) {
      alert("Error grading");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // get class info for classId
        const res1 = await API.get(`/class/${classId}`);
        setClassData(res1.data);

        // get assignments for classId
        const res2 = await API.get(`/assignments/${classId}`);
        setAssignments(res2.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [classId]);

  if (!classData) return <p className="p-4">Loading</p>;

  return (
    <div className="p-4 space-y-6">
      {/* Class Info */}
      <div>
        <h1 className="text-2xl font-medium mb-2">{classData.title}</h1>
        <p className="text-muted-foreground">{classData.subject}</p>
      </div>

      {/* Teacher only: join code */}
      {role === "teacher" && (
        <p className="text-md -mt-4">Join Code: &nbsp;{classData.joinCode}</p>
      )}
      <Separator />

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
        <h2 className="text-xl font-medium mb-2">Assignments</h2>

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

      <div>
        {submissions.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Submissions</h2>

            {submissions.map((s) => (
              <div key={s._id} className="border p-3 mb-2 rounded">
                <p>
                  <b>Student:</b> {s.studentId?.name}
                </p>
                <p>
                  <b>Answer:</b> {s.answer}
                </p>
                <p>
                  <b>Marks:</b> {s.marks ?? "Not graded"}
                </p>

                {/* Grade button */}
                <button
                  className="bg-red-600 text-white px-2 py-1 rounded mt-2"
                  onClick={() => handleGrade(s._id)}
                >
                  Grade
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}