'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

export type StructuredNotes = {
    title: string;
    date?: string;
    participants?: string[];
    agenda?: string[];
    summary: string;
    decisions?: { item: string; rationale?: string }[];
    actionItems?: { owner: string; task?: string; due?: string }[];
    risks?: string[];
    nextMeeting?: { date?: string; goals?: string[] };
    rawMarkdown?: string; // full pretty version?
};

export default function NotesViewer({ notes }: { notes: StructuredNotes }) {
    return (
        <Tabs defaultValue="structured" className="w-full">
            <TabsList>
                <TabsTrigger value="structured">Structured</TabsTrigger>
                <TabsTrigger value="markdown">Markdown</TabsTrigger>      
            </TabsList>

            <TabsContent value="structured">
                <Card className="p-6 space-y-4">
                    <h2 className="text-lg font-semibold">{notes.title || 'Meeting Notes'}</h2>
                    {notes.date && <p className="text-sm text-neutral-600">Date: {notes.date}</p>}
                    {notes.participants?.length ? (
                        <div><b>Participants:</b> {notes.participants.join(", ")}</div>
                    ) : null}
                    {notes.agenda?.length ? (
                        <div><b>Agenda:</b><ul className="list-disc pl-6">{notes.agenda.map((item, index) => <li key={index}>{item}</li>)}</ul></div>
                    ) : null}
                    {notes.summary && (<div>
                        <b>Summary</b>
                        <p>{notes.summary}</p>
                    </div>)}
                    {notes.decisions?.length ? (
                        <div>
                            <b>Decisions</b>
                            <ul className="list-disc pl-6">
                                {notes.decisions.map((decision, index) => (
                                    <li key={index}>
                                        <span className="font-medium">{decision.item}</span>: {decision.rationale ? ` - ${decision.rationale}` : ''}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : null}
                    {notes.actionItems?.length ? (
                        <div>
                            <b>Action Items</b>
                            <ul className="list-disc pl-6">
                                {notes.actionItems?.map((item, index) => (
                                    <li key={index}>
                                        {item.owner ? `[${item.owner}]` : ''} {item.task} {item.due ? `(Due: ${item.due})` : ''}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : null}
                    {notes.risks?.length ? (
                        <div>
                            <b>Risks</b>
                            <ul className="list-disc pl-6">
                                {notes.risks?.map((risk, index) => (
                                    <li key={index}>{risk}</li>
                                ))}
                            </ul>
                        </div>
                    ) : null}
                    {notes.nextMeeting?.date || notes.nextMeeting?.goals?.length ? (
                        <div>
                            <b>Next Meeting</b>
                            <div>Date: {notes.nextMeeting?.date || 'TBD'}</div>
                            {notes.nextMeeting?.goals?.length ? (
                                <ul className="list-disc pl-6">
                                    {notes.nextMeeting.goals.map((goal, index) => (
                                        <li key={index}>{goal}</li>
                                    ))}
                                </ul>
                            ) : null}
                        </div>
                    ) : null}
                </Card>
            </TabsContent>

            <TabsContent value="markdown">
                <Card className="p-6">
                    <pre className="whitespace-pre-wrap text-sm">{notes.rawMarkdown ?? '-'}</pre>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
