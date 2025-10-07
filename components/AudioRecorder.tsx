"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";

export default function AudioRecorder({
  onUpload,
}: {
  onUpload: (file: File) => void;
}) {
  const [rec, setRec] = useState<MediaRecorder | null>(null);
  const [chunks, setChunks] = useState<Blob[]>([]);
  const [recording, setRecording] = useState(false);
  const [level, setLevel] = useState(0);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => streamRef.current?.getTracks().forEach((t) => t.stop());
  }, []);

  //Will need error handling for situations where the user does not have or denies access to a media source. Maybe good to add aa dropdown as well to select a media source??
  const start = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;
    const mr = new MediaRecorder(stream);
    const _chunks: Blob[] = [];
    mr.ondataavailable = (e) => _chunks.push(e.data);
    mr.onstop = () => setChunks(_chunks);
    //consider adding 1000 to get events every second (so long recordings don't consume too much)
    mr.start();
    setRec(mr);
    setRecording(true);

    // simple level meter
    const ctx = new AudioContext();
    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    source.connect(analyser);
    const data = new Uint8Array(analyser.fftSize);
    const tick = () => {
      analyser.getByteTimeDomainData(data);
      const rms = Math.sqrt(
        data.reduce((s, v) => s + Math.pow((v - 128) / 128, 2), 0) / data.length
      );
      setLevel(Math.min(100, Math.round(rms * 200)));
      if (recording) requestAnimationFrame(tick);
    };
    tick();
  };

  const stop = async () => {
    rec?.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setRecording(false);
  };

  const save = () => {
    const blob = new Blob(chunks, { type: "audio/webm" });
    const file = new File([blob], `meeting-${Date.now()}.webm`, {
      type: "audio/webm",
    });
    onUpload(file);
    setChunks([]);
  };

  return (
    <div className="flex items-center gap-3">
      {!recording ? (
        <Button onClick={start} variant="default">
          Start Recording
        </Button>
      ) : (
        <Button onClick={stop} variant="destructive">
          Stop
        </Button>
      )}
      <div className="w-40">
        <Progress value={level} />
      </div>
      <Button onClick={save} variant="secondary" disabled={!chunks.length}>
        Use Recording
      </Button>
    </div>
  );
}
