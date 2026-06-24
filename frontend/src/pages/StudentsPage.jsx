import { Separator } from "@/components/ui/separator";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "@/api/axios";

const StudentsPage = () => {
  const { classId } = useParams();
  const [studentsList, setStudentsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!classId) return;

      try {
        setIsLoading(true);
        const response = await API.get(`/classes/${classId}/students`);
        setStudentsList(response.data || []);
      } catch (error) {
        console.error("Failed to load students:", error);
        setStudentsList([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, [classId]);

  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <div className="text-2xl">Students</div>
        <div>{studentsList.length} students</div>
      </div>
      <Separator className="m-0" />
      <div>
        {isLoading ? (
          <div>Loading...</div>
        ) : studentsList.length > 0 ? (
          studentsList.map((student) => (
            <div className="text-base border-b py-3" key={student._id}>
              {student.name}
            </div>
          ))
        ) : (
          <div className="text-sm text-muted-foreground ">
            No students yet
          </div>
        )}
      </div>
    </>
  );
};

export default StudentsPage;
// to comment submissions:
{
  /* <div> */
}
{
  /* { */
}
{
  /* submissions.length > 0 && ( */
}
{
  /* // <div className="mt-6"> */
}
//   <h2 className="text-xl font-semibold mb-2">Submissions</h2>

//   {submissions.map((s) => (
//     <div key={s._id} className="border p-3 mb-2 rounded">
//       <p>
//         <b>Student:</b> {s.studentId?.name}
//       </p>
//       <p>
//         <b>Answer:</b> {s.answer}
//       </p>
//       <p>
//         <b>Marks:</b> {s.marks ?? "Not graded"}
//       </p>

//       {/* Grade button */}
//       <button
//         className="bg-red-600 text-white px-2 py-1 rounded mt-2"
//         onClick={() => handleGrade(s.assignmentId, s._id)}
//       >
//         Grade
//       </button>
//     </div>
//   ))}
// </div>
// )
// }
// </div>
