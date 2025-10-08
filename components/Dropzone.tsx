'use client';

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "./ui/card";

export default function Dropzone({ onFile }: { onFile: (file: File) => void }) {
  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) onFile(accepted[0]);
  }, [onFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'audio/*': [] } });

  return (
    <Card {...getRootProps()} className={`p-6 border-dashed cursor-pointer ${isDragActive ? 'border-purple-400 bg-purple-50' : ''} `}>
        <input {...getInputProps()} />
        <p className="text-sm text-neutral-600">Drop audio here or click to upload (mp3, m4a, wav, webm)</p>
    </Card>
  );
}
