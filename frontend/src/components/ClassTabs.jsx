import React from "react";
import { NavLink } from "react-router-dom";

const tabBaseClasses =
  "flex-1 text-center py-3 px-4 transition duration-200 ease-in-out text-base font-medium no-underline";

const ClassTabs = ({ classId }) => {
  return (
    <div className="flex w-full overflow-hidden bg-card">
      <NavLink
        end
        to={`/app/classes/${classId}/assignments`}
        className={({ isActive }) =>
          `${tabBaseClasses} ${
            isActive
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/20"
          }`
        }
      >
        Assignments
      </NavLink>

      <NavLink
        to={`/app/classes/${classId}/students`}
        className={({ isActive }) =>
          `${tabBaseClasses} ${
            isActive
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/20"
          }`
        }
      >
        Students
      </NavLink>

      <NavLink
        to={`/app/classes/${classId}/materials`}
        className={({ isActive }) =>
          `${tabBaseClasses} ${
            isActive
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/20"
          }`
        }
      >
        Materials
      </NavLink>
    </div>
  );
};

export default ClassTabs;
