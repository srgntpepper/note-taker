"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PrettyHero from "@/components/PrettyHero";
import PrettyBento from "@/components/PrettyBento";
import Dropzone from "@/components/Dropzone";
import AudioRecorder from "@/components/AudioRecorder";
import NotesViewer from "@/components/NotesViewer";
import Actionbar from "@/components/ActionBar";

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
      const tr = await fetch("api/transcribe", { method: "POST", body: fd });
      const { transcript } = await tr.json();
      setTranscript(transcript);

      const sr = await fetch("api/summarize", {
        method: "POST",
        body: JSON.stringify({ transcript }),
      });
      const data = await sr.json();
      setResult(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container max-w-6xl mx-auto space-y-10 py-10">
      <PrettyHero />
      <PrettyBento />

      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Transcribe you meeting</h2>
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <Dropzone onFile={handleFile} />
          <AudioRecorder onUpload={handleFile} />
          <Button variant="outline" onClick={() => { setResult(null) }} disabled={loading}>Reset</Button>
        </div>
      </Card>
    </main>
  );
}
