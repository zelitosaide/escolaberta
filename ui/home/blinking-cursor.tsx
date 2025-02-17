"use client";

import { useEffect, useState } from "react";

export default function BlinkingCursor() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible((v) => !v)
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return <span className={`inline-block w-3 h-5 bg-green-400 ${visible ? "opacity-100" : "opacity-0"}`} />;
}