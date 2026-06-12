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
} from "@/components/ui/select";
import StudentView from "@/components/dashboard/StudentView";
import TeacherView from "@/components/dashboard/TeacherView";
import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { user } = useAuth();
  const role = user?.role;

  //Fetch Classes (for teacher)
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await API.get("/classes");
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
          const res = await API.get("/users/performance");
          setData(res.data);
        } else if (selectedClass) {
          const res = await API.get(`/classes/${selectedClass}/performance`);
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

  return (
    <>
      <div className="p-3 md:p-4 space-y-6">
        {loading ? (
          <div className="flex justify-center p-10 ">Loading...</div>
        ) : error ? (
          <p className="p-4 text-red-500">Error loading data</p>
        ) : (
          <>
            {/*  Class Selector (only teacher) */}
            {role === "teacher" && (
              <div className="max-w-xs">
                <Select onValueChange={setSelectedClass} value={selectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls._id} value={cls._id}>
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
          </>
        )}
      </div>
    </>
  );
}
