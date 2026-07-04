import { useEffect, useState } from "react";
import API from "../api/axios";
import StudentView from "@/components/dashboard/StudentView";
import TeacherView from "@/components/dashboard/TeacherView";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [classes, setClasses] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role;

  //Fetch Classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await API.get("/classes");
        setClasses(res.data);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClasses();
  }, [role]);


  return (
    <>
      <div className="p-3 md:p-4 space-y-6">
        {isLoading ? (
          <div className="flex justify-center p-10 ">Loading...</div>
        ) : error ? (
          <p className="p-4 text-red-500">Error loading data</p>
        ) : (
          <>
            <h1 className="font-semibold text-xl sm:text-2xl italic">
              Welcome, {user.name}!
            </h1>

            <h1 className="mt-10 mb-1.5 text-lg ">My Classes</h1>
            {classes.length === 0 ? (
              <p className="text-gray-500">No classes available</p>
            ) : (
              <div className=" w-full max-w-sm border p-2.5 rounded-3xl min-h-50">
                {classes.map((c) => (
                  <div
                    key={c._id}
                    className="flex items-center justify-between gap-5 py-2.5"
                  >
                    <div>{c.title}</div>

                    <div 
                    className="flex items-center gap-1 hover:text-primary transition-transform duration-200 cursor-pointer"
                    onClick={() => {
                      navigate(`/app/performance/${c._id}`);
                    }}
                    >
                      <div>View</div>
                      <div>
                        <ArrowRight />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}



  // //Fetch performance data
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setLoading(true);

  //       if (role === "student") {
  //         const res = await API.get("/users/performance");
  //         setData(res.data);
  //       } else if (selectedClass) {
  //         const res = await API.get(`/classes/${selectedClass}/performance`);
  //         setData(res.data);
  //       }
  //     } catch (err) {
  //       setError(true);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [selectedClass, role]);


// {/* Views */}
// {role === "student" && data && <StudentView data={data} />}

// {role === "teacher" && data && selectedClass && (
//   <TeacherView data={data} />
// )}
