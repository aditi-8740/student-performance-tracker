import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [joinCode, setJoinCode] = useState("");
  const navigate = useNavigate();

  const role = localStorage.getItem('role');

  //fetch classes
  const fetchClasses = async()=>{
    const res = await API.get('/my-classes');
    setClasses( res.data);
  };
  useEffect(() => {

    fetchClasses();
  }, []);

  //join class (student)
  const handleJoin = async () =>{
    try {
      await API.post("/join-class", { joinCode });
      setJoinCode("");
      fetchClasses();
    } catch (error) {
      alert("Failed to join");
    }
  }

  //create class (teacher)
  const handleCreate = async ()=>{
    const title = prompt("enter class title");
    const subject = prompt("enter subject");
    if(!title || !subject ) return;

    try {
      await API.post("/create-class", {title, subject});
      fetchClasses();
    } catch (error) {
      alert("Failed to create");
    }
  }

  return (
    <div className="p-3 md:p-4 space-y-6 ">
      <h1 className="text-2xl my-6 font-semibold">My Classes</h1>

      <div className="flex gap-4 mb-8">

        {/* Actions */}
        {role === "student" && (
          <>
            <Input
              placeholder="Enter Join Code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
            />
            <Button onClick={handleJoin}>Join</Button>
          </>
        )}

        {role === "teacher" && (
          <button
          className="bg-primary rounded-(--radius) text-white text-sm md:text-base px-2 py-1.5 md:px-4 md:py-2 rounded"
          onClick={handleCreate}>
            + Create Class
          </button>
        )}

      </div>

      {/* Class Cards */}
      <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

        {classes.map((cls) => (
          <Card key={cls._id} >
            <CardContent className="p-4 space-y-2">
              <h2 
              className="font-medium md:text-xl text-lg hover:underline hover:underline-offset-4 cursor-pointer"
              onClick={()=>{ navigate(`/app/classes/${cls._id}`)}}
              >{cls.title}</h2>
              <p className="text-sm text-muted-foreground">
                {cls.subject}
              </p>

              {role === "teacher" && (
                <p className="text-sm">
                  Code:&nbsp; {cls.joinCode}
                </p>
              )}
            </CardContent>
          </Card>
        ))}

      </div>

    </div>
  );
}