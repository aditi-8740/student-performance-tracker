import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; import { CheckCircle2, Clock, XCircle } from "lucide-react";
import API from "@/api/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const PerformancePage = () => {
  const { classId } = useParams();
  // const [selectedClass, setSelectedClass] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [performanceData, setPerformanceData] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [assignmentPerformance, setAssignmentPerformance] = useState(null);

  useEffect(() => {
    async function fetchPerformance() {
      try {
        const res = await API.get(`/classes/${classId}/performance`);
        const res1 = await API.get(`/classes/${classId}/assignments`);

        setPerformanceData(res.data);
        setAssignments(res1.data);
        console.log(performanceData);
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

  const formatDate = (datestr) => {
    if (!datestr) return "-";
    const date = new Date(datestr);
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  };

  const getStatusBadge = (status) => {
    if (status === "graded") {
      return (
        <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
           Graded
        </Badge>
      );
    } else if (status === "Not submitted") {
      return (
        <Badge className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
          Not Submitted
        </Badge>
      );
    }

    return (
      <Badge className="bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
         Submitted
      </Badge>
    );
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

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 lg:grid-cols-5 mt-4">
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

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:grid-cols-5">
              <Card className="sm:min-h-40 sm:max-w-50 ">
                <CardContent className="p-4 space-y-2">
                  <h2 className="font-semibold sm:font-medium md:text-xl sm:text-lg ">
                    Average Marks
                  </h2>
                  <p className="text-base text-muted-foreground">
                    {assignmentPerformance.averageMarks === null
                      ? "-"
                      : assignmentPerformance.averageMarks}
                  </p>
                </CardContent>
              </Card>
              <Card className="sm:min-h-40 sm:max-w-50">
                <CardContent className="p-4 space-y-2">
                  <h2 className="font-semibold sm:font-medium md:text-xl sm:text-lg ">
                    Highest Marks
                  </h2>
                  <p className="text-base text-muted-foreground">
                    {assignmentPerformance.highestMarks === null
                      ? "-"
                      : assignmentPerformance.highestMarks}
                  </p>
                </CardContent>
              </Card>
              <Card className="sm:min-h-40 sm:max-w-50">
                <CardContent className="p-4 space-y-2">
                  <h2 className="font-semibold sm:font-medium md:text-xl sm:text-lg ">
                    Lowest Marks
                  </h2>
                  <p className="text-base text-muted-foreground">
                    {assignmentPerformance.lowestMarks === null
                      ? "-"
                      : assignmentPerformance.lowestMarks}
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
              <h1 className="text sm:text-2xl mb-2 mt-7">
                Student Performance
              </h1>
              <hr className="mt-2 mb-0" />
              <div>
                {assignmentPerformance?.students.length === 0 ? (
                  <div className="text-sm text-muted-foreground mt-2">
                    No students enrolled in this class.
                  </div>
                ) : (
                  <div className=" overflow-x-auto">
                    <Table>
                      {/* <TableCaption>
                          A list of your recent invoices.
                        </TableCaption> */}
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-25">Students</TableHead>
                          <TableHead className="text-center">Status</TableHead>
                          <TableHead className="text-center">Marks</TableHead>
                          <TableHead className="text-right">Submitted At</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {assignmentPerformance?.students.map((s) => (
                          <TableRow key={s.studentId}>
                            <TableCell className="font-medium">
                              {s.name}
                            </TableCell>
                            <TableCell className="align-middle text-center" >
                              {getStatusBadge(s.status)}
                            </TableCell>
                            <TableCell className="text-center">{s.marks == null ? "-" : s.marks}</TableCell>
                            <TableCell className="text-right">
                              {formatDate(s.submittedAt)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default PerformancePage;
