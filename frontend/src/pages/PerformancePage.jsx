import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import API from "@/api/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const PerformancePage = () => {
  const { classId } = useParams();
  // const [selectedClass, setSelectedClass] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [performanceData, setPerformanceData] = useState(null);
  const [assignments, setAssignments] = useState(null);
  const [assignmentPerformance, setAssignmentPerformance] = useState(null);

  useEffect(() => {
    async function fetchPerformance() {
      try {
        const res = await API.get(`/classes/${classId}/performance`);
        const res1 = await API.get(`/classes/${classId}/assignments`);

        setPerformanceData(res.data);
        setAssignments(res1.data);
        console.log(assignments);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }
    fetchPerformance();
  }, [classId]);

  const handleViewAssignmentPerformance = async (assignmentId) => {
    try {
      const res = await API.get(`/assignments/${assignmentId}/performance`);
      setAssignmentPerformance(res.data);
      console.log(res.data);
    } catch (error) {
      console.error("Error fetching assignment performance:", error);
    }
  };

  if (loading) return <div className="text-sm">Loading...</div>;
  if (error)
    return <div className="text-red-500">Error loading performance data</div>;
  if (!performanceData) return null;

  return (
    <>
      <div className="mt-4 mx-2">
        <h1 className="text-2xl text-center mb-2">PERFORMANCE</h1>
        <div className="text-center">{performanceData.classTitle}</div>

        <div className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-4 mt-4">
          <Card className="sm:min-h-40 sm:max-w-50">
            <CardContent className="p-4 space-y-2">
              <h2 className="font-semibold sm:font-medium md:text-xl sm:text-lg ">
                Students
              </h2>
              <p className="text-base text-muted-foreground">
                {performanceData.totalStudents}
              </p>
            </CardContent>
          </Card>
          <Card className="sm:min-h-40 sm:max-w-50">
            <CardContent className="p-4 space-y-2">
              <h2 className="font-semibold sm:font-medium md:text-xl sm:text-lg ">
                Assignments
              </h2>
              <p className="text-base text-muted-foreground">
                {performanceData.totalAssignments}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="sm:px-2.5 mb-11">
          {/* Assignmnets Section */}
          <h1 className="text sm:text-2xl mb-2 mt-5">Assignments</h1>
          <hr className="mt-2 mb-0" />
          <div className=" w-full sm:px-2.5">
            {assignments.map((a) => (
              <div
                key={a._id}
                className="flex items-center justify-between gap-5 py-2 sm:py-5 border-b"
              >
                <div className="truncate text-xs  sm:text-base">{a.title}</div>

                <div
                  className="flex items-center gap-1 hover:text-primary transition-transform duration-200 cursor-pointer"
                  onClick={() => {
                    handleViewAssignmentPerformance(a._id);
                  }}
                >
                  <div className="text-sm sm:text-base">View</div>
                  <div>
                    <ArrowRight />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {assignmentPerformance && (
          <>
            <h1 className="mb-3">{assignmentPerformance.title}</h1>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card className="sm:min-h-40 sm:max-w-50 ">
                <CardContent className="p-4 space-y-2">
                  <h2 className="font-semibold sm:font-medium md:text-xl sm:text-lg ">
                    Average Marks
                  </h2>
                  <p className="text-base text-muted-foreground">
                    {assignmentPerformance.averageMarks}
                  </p>
                </CardContent>
              </Card>
              <Card className="sm:min-h-40 sm:max-w-50">
                <CardContent className="p-4 space-y-2">
                  <h2 className="font-semibold sm:font-medium md:text-xl sm:text-lg ">
                    Highest Marks
                  </h2>
                  <p className="text-base text-muted-foreground">
                    {assignmentPerformance.highestMarks}
                  </p>
                </CardContent>
              </Card>
              <Card className="sm:min-h-40 sm:max-w-50">
                <CardContent className="p-4 space-y-2">
                  <h2 className="font-semibold sm:font-medium md:text-xl sm:text-lg ">
                    Lowest Marks
                  </h2>
                  <p className="text-base text-muted-foreground">
                    {assignmentPerformance.lowestMarks}
                  </p>
                </CardContent>
              </Card>
              <Card className="sm:min-h-40 sm:max-w-50">
                <CardContent className="p-4 space-y-2">
                  <h2 className="font-semibold sm:font-medium md:text-xl sm:text-lg ">
                    Total Submissions
                  </h2>
                  <p className="text-base text-muted-foreground">
                    {assignmentPerformance.totalSubmissions} /{" "}
                    {performanceData.totalStudents}
                  </p>
                </CardContent>
              </Card>
            </div>
            <div>
              <h1 className="text sm:text-2xl mb-2 mt-5">
                Student Performance
              </h1>
              <hr className="mt-2 mb-0" />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default PerformancePage;
