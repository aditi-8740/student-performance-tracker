import API from "@/api/axios";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Separator } from "@/components/ui/separator";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CreateAssignmentForm from "@/components/CreateAssignmentForm";
import { Button } from "@/components/ui/button";

const AssignmentsPage = () => {
  const { classId } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [isAssignmentFormOpen, setIsAssignmnetFormOpen] = useState(false);
  const { user } = useAuth();
  const role = user?.role;
  console.log(role);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignments = async () => {
      // get assignments for classId
      const res2 = await API.get(`/classes/${classId}/assignments`);
      setAssignments(res2.data);
    };

    fetchAssignments();
  }, [classId]);

  return (
    <>
      {/* Assignments */}
      {role === "teacher" && (
        <button
          className="bg-primary rounded-lg text-white px-3 py-1 cursor-pointer hover:bg-primary/90"
          onClick={() => setIsAssignmnetFormOpen(true)}
        >
          + Create Assignment
        </button>
      )}

      <div>
        <h2 className="text-2xl mb-2">Assignments</h2>
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
                    <Button variant="outline"
                      className=" px-3 py-1 cursor-pointer my-2 hover:text-white hover:bg-primary border-primary transition duration-200 ease-in-out"
                      onClick={() => navigate(`/app/classes/${classId}/assignments/${a._id}`) }
                    >
                      Submit
                    </Button>
                  )}
                  {role === "student" && (
                    <p className="text-sm mt-2">
                      Marks: {a.marks ?? "Not graded"}
                    </p>
                  )}
                  {role === "teacher" && (
                    <Button
                      className="bg-primary rounded-lg text-white px-3 py-1 "
                      onClick={() => fetchSubmissions(a._id)}
                    >
                      View Submissions
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <CreateAssignmentForm
        isOpen={isAssignmentFormOpen}
        isOpenChange={setIsAssignmnetFormOpen}
      />
    </>
  );
};

export default AssignmentsPage;
