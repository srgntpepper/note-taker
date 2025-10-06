'use client';

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PrettyHero from "@/components/PrettyHero";
import PrettyBento from "@/components/PrettyBento";

type Result = {
  id: string;
  transcript: string;
  //notes: StructuredNotes;
};

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [transcript, setTranscript] = useState<string>("");

  const handleFile = async (file: File) => {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const tr = await fetch("api/transcribe", {method: "POST", body: fd });
      const { transcript } = await tr.json();
      setTranscript(transcript);

      const sr = await fetch("api/summarize", {method: "POST", body: JSON.stringify({ transcript}) });
      const data = await sr.json();
      setResult(data);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <main className="container max-w-6xl mx-auto space-y-10 py-10">
      <PrettyHero/>
      <PrettyBento/>
    </main>
  );
}

