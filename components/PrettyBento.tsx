'use client';
import { Card } from "@/components/ui/card";

export default function PrettyBento() {
  const items = [
    { title: "Accurate ASR", desc: "High-quality transcription with timestamps.", k: 1 },
    { title: "Smart Summaries", desc: "Agenda, decisions, action items & owners.", k: 2 },
    { title: "One-click Exports", desc: "PDF or DOCX, styled for readability.", k: 3 },
    { title: "Instant Sharing", desc: "Email notes to attendees, right away.", k: 4 },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {items.map(x => (
        <Card key={x.k} className="p-5 hover:shadow-lg transition-shadow">
          <div className="text-lg font-medium">{x.title}</div>
          <div className="mt-2 text-sm text-neutral-600">{x.desc}</div>
        </Card>
      ))}
    </div>
  );
}
