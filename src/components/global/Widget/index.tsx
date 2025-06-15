import { useMediaResources } from "@/hooks/useMediaResources";
import { fetchUserdata } from "@/lib/utils";
import { ClerkLoading, SignedIn, useUser } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import { Loader } from "../Loader";
import MediaConfiguration from '../Media-configuration/index';

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
  const { state, fetchMediaResources } = useMediaResources();

  useEffect(() => {
    if (user && user.id) {
      fetchUserdata(user.id).then((profile) => {
        setUserdata(profile);
      });
      fetchMediaResources();
    }
  }, [user]);
  return (
    <div className="">
        {/* renders its children while Clerk is loading, */}
      <ClerkLoading>
        <div className="h-full flex justify-center items-center">
          <Loader />
        </div>
      </ClerkLoading>
      <SignedIn>
        {userdata ? (
         
          <MediaConfiguration state={state} user={userdata?.user} />
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <Loader color="#fff" />
          </div>
        )}
      </SignedIn>
    </div>
  )
};

export default Widget;
