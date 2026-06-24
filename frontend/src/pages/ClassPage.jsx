import { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import API from "../api/axios";
import ClassHeader from "@/components/ClassHeader";
import ClassTabs from "@/components/ClassTabs";

export default function ClassPage() {
  const { classId } = useParams();
  const [classData, setClassData] = useState(null);

  const [submissions, setSubmissions] = useState([]);
  useEffect(() => {
    try {
      const fetchData = async () => {
        // get class info for classId
        const res1 = await API.get(`/classes/${classId}`);
        setClassData(res1.data);
      };

      fetchData();
    } catch (err) {
      console.error(err);
    }
  }, [classId]);

  const handleSubmit = async (assignmentId) => {
    const answer = prompt("Enter your answer");

    if (!answer) return;

    try {
      await API.post(`/assignments/${assignmentId}/submissions`, {
        answer,
      });

      alert("Submitted");
    } catch (err) {
      alert("Error submitting");
    }
  };

  const fetchSubmissions = async (assignmentId) => {
    try {
      const res = await API.get(`/assignments/${assignmentId}/submissions`);
      setSubmissions(res.data);
      console.log(res);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGrade = async (assignmentId, submissionId) => {
    const marks = prompt("Enter marks");

    if (!marks) return;

    try {
      await API.patch(
        `/assignments/${assignmentId}/submissions/${submissionId}`,
        {
          marks,
        },
      );

      alert("Graded");
    } catch (err) {
      alert("Error grading");
    }
  };

  return (
    <div className="px-2 py-3 sm:px-4 sm:py-4 space-y-6">
      {/* Class Info */}
      <ClassHeader classData={classData} />
      <ClassTabs classId={classId} />

      <Outlet />
    </div>
  );
}
