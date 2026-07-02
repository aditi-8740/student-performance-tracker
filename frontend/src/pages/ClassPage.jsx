import { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import API from "../api/axios";
import ClassHeader from "@/components/ClassHeader";
import ClassTabs from "@/components/ClassTabs";

export default function ClassPage() {
  const { classId } = useParams();
  const [classData, setClassData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchClassData = async () => {
      setIsLoading(true);
      setError("");

      try {
        const { data } = await API.get(`/classes/${classId}`);

        if (isMounted) {
          setClassData(data);
        }
      } catch (err) {
        console.error("Failed to fetch class data:", err);

        if (isMounted) {
          setError("Unable to load class information right now.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchClassData();

    return () => {
      isMounted = false;
    };
  }, [classId]);

  return (
    <div className="px-2 py-3 sm:px-4 sm:py-4 space-y-6">
      {isLoading ? (
        <div className="text-sm text-muted-foreground">
          Loading class details...
        </div>
      ) : error ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : (
        <ClassHeader classData={classData} />
      )}
      <ClassTabs classId={classId} />
      <Outlet />
    </div>
  );
}
