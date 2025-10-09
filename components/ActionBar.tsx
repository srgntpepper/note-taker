'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Actionbar({ notesId }: { notesId: string }) {
    const [email, setEmail] = useState("");

    //should add some validation here in case of failure (try/catch)
    const download = async (type: "pdf" | "docx") => {
        const r = await fetch(`/api/export/${type}?id=${encodeURIComponent(notesId)}`);
        const blob = await r.blob();
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `meeting-notes.${type === "pdf" ? "pdf" : "docx"}`;
        a.click();
    };

    const send = async () => {
        await fetch(`/api/email`, {
            method: "POST",
            body: JSON.stringify({ id: notesId, email }),
        });
        setEmail("");
        alert("Email sent (check spam if you don't see it)!");
    };

    return (
        <div className="flex flex-col md:flex-row items-center gap-3">
            <Button onClick={() => download("pdf")}>Download PDF</Button>
            <Button variant="secondary" onClick={() => download("docx")}>Download Word Doc</Button>
            <div className="flex items-center gap-2">
                <Input placeholder="someone@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Button onClick={send} disabled={!email}>Email Notes</Button>
            </div>
        </div>

    );
}
