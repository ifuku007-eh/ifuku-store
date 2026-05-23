"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    window.location.replace("/shop");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] text-white">
      Loading...
    </div>
  );
}