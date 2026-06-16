import React from "react";
import { Spinner } from "./ui/spinner";

const AuthOverlay = ({ type, title, description }) => {
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          {type === "loading" && <Spinner className="size-10" />}
          {type === "success" && <div className="text-4xl text-green-600">✓</div>}

          <h2 className="text-xl font-semibold">{title}</h2>

          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
    </>
  );
};

export default AuthOverlay;
