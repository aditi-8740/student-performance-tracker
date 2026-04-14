import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (role === "student") {
          const res = await API.get("/student-performance");
          setData(res.data);
        } else {
          // temporary classId (replace later)
          const classId = prompt("Enter classId");
          const res = await API.get(`/class-performance/${classId}`);
          setData(res.data);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Dashboard</h1>

      {!data && <p>Loading...</p>}

      {role === "student" && data && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 shadow">Avg: {data.averageMarks}</div>
          <div className="bg-white p-4 shadow">Highest: {data.highest}</div>
          <div className="bg-white p-4 shadow">Lowest: {data.lowest}</div>
        </div>
      )}

      {role === "teacher" && data && (
        <div>
          <h2 className="text-xl mb-3">Class Average: {data.classAverage}</h2>

          {data.students.map((s) => (
            <div key={s.studentId} className="bg-white p-3 mb-2 shadow">
              {s.name} - {s.average}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}