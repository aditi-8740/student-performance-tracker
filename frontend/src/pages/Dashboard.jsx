import { useEffect, useState } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import StudentView from "@/components/dashboard/StudentView";
import TeacherView from "@/components/dashboard/TeacherView";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const role = localStorage.getItem("role");

  //Fetch Classes (for teacher)
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await API.get("/my-classes");
        setClasses(res.data);
        
      } catch (error) {
        console.error(error);
      }
    };

    if (role === "teacher") fetchClasses();
  }, [role]);

  //Fetch performance data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        if (role === "student") {
          const res = await API.get("/student-performance");
          setData(res.data);
        } else if (selectedClass) {
          const res = await API.get(`/class-performance/${selectedClass}`);
          setData(res.data);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedClass, role]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">Error loading data</p>;

  return (
    <>
      <div className="p-3 md:p-4 space-y-6">

        {/*  Class Selector (only teacher) */}
        {role === "teacher" && (
          <div className="max-w-xs">
            <Select onValueChange={setSelectedClass} value={selectedClass} > 
              <SelectTrigger>
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls._id} value={cls._id} >
                    {cls.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Views */}
        {role === "student" && data && <StudentView data={data} />}

        {role === "teacher" && data && selectedClass && (
          <TeacherView data={data} />
        )}
      </div>

    </>
  );
}
