import API from "@/api/axios";
import { useAuth } from "@/context/AuthContext";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ClassHeader = () => {
  const { classId } = useParams();
  const [classData, setClassData] = useState(null);
  const { user } = useAuth();
  const role = user?.role;
  console.log(role);

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

  if (!classData) return <p className="p-4">Loading...</p>;

  return (
    <>
      <div>
        <h1 className="text-2xl font-medium mb-2">{classData.title}</h1>
        <p className="text-muted-foreground">{classData.subject}</p>
      </div>

      {/* Teacher only: join code */}
      {role === "teacher" && (
        <p className="text-md -mt-4">Join Code: &nbsp;{classData.joinCode}</p>
      )}
    </>
  );
};

export default ClassHeader;
