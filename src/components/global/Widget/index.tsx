import { useUser } from "@clerk/clerk-react";
import React, { useState } from "react";

const Widget = () => {
  const [userdata, setUserdata] = useState<{
    status: number;
    user:
      | ({
          subscription: {
            plan: "PRO" | "FREE";
          } | null;
          studio: {
            id: string;
            screen: string | null;
            mic: string | null;
            preset: "HD" | "SD";
            camera: string | null;
            userId: string;
            plan: "PRO" | "FREE";
          } | null;
        } & {
          id: string;
          email: string;
          firstName: string | null;
          lastName: string | null;
          createdAt: Date;
          clerkId: string;
        })
      | null;
  } | null>(null);
  const {user}=useUser();
  

  return <div></div>;
};

export default Widget;
