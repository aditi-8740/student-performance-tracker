import AssignmentTab from "@/components/AssignmentTab";
import SubmissionTab from "@/components/SubmissionTab";
import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";

const TABS = [
  { key: "details", label: "Assignment Details" },
  { key: "submissions", label: "Submissions" },
];

const AllSubmissionsPage = () => {
  const [activeTab, setActiveTab] = useState("details");

  return (
    <div className="px-1.5 sm:px-3">
      
      {/* Tab Header */}
      <div className="flex border-b border-gray-200 mb-6">
        {TABS.map((tab) => (
          <div key={tab.key}
          onClick={()=> setActiveTab(tab.key)}
          className={`text-center py-3 px-4 text-sm font-medium transition duration-200 ease-in-out ${
            activeTab === tab.key ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground "
          }`}
          > {tab.label} </div>
        ))}
      </div>


        {/* Tab Content */}
        {activeTab==="details" && <AssignmentTab />
        }

        {activeTab==="submissions" && <SubmissionTab />  }
    </div>
  );
};

export default AllSubmissionsPage;
