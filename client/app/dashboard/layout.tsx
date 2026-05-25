"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {

      router.push("/login");

    } else {

      setAuthorized(true);

    }

  }, [router]);

  /* Prevent dashboard render */
  if (!authorized) {
    return null;
  }

  return <>{children}</>;
}