import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { authClient } from "@/lib/auth-client";
import { trpc } from "@/utils/trpc";

export default function Dashboard() {
  const { data: session, isPending } = authClient.useSession();
  const navigate = useNavigate();

  const privateData = useQuery(trpc.privateData.queryOptions());

  useEffect(() => {
    if (!session && !isPending) {
      navigate("/login");
    }
    if (session && !session.user.emailVerified && !isPending) {
      navigate(`/verify-otp?email=${encodeURIComponent(session.user.email)}`);
    }
  }, [session, isPending, navigate]);

  if (isPending || !session) {
    return <div>Loading...</div>;
  }

  if (!session.user.emailVerified) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome {session.user.name}</p>
      <p>API: {privateData.data?.message}</p>
    </div>
  );
}
