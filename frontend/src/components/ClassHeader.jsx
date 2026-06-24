import { useAuth } from "@/context/AuthContext";
import React, { useEffect, useState } from "react";

const ClassHeader = ({ classData }) => {
  const { user } = useAuth();
  const role = user?.role;
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
