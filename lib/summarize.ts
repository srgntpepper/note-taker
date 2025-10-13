import OpenAI from "openai";
import { format } from "date-fns";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function semmarizeTranscript(transcript: string) {
  const today = format(new Date(), "yyy-MM-dd");
  const sys = `You are a meticulous meeting notes generator.
Return a JSON object with keys:
title, date, participants, agenda, summary, decisions[{item,rationale}], actionItems[{owner,task,due}], risks, nextMeeting{date,goals}, rawMarkdown.
Keep it concise but complete; convert vague references into clear bullets when possible.`;

  const user = `Transcript:\n${transcript}\n\nParticipants appear as names when spoken; infer if obvious.`;

  //Look into other best models
  const chat = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: sys },
      { role: "user", content: user },
    ],
  });

  const json = JSON.parse(chat.choices[0].message.content || "{}");
  // Ensure basic field
  json.date ??= today;
  json.title ??= "Meeting Notes";
  // Create a nice markdown as well
  json.rawMarkdown ??= toMarkdown(json);
  return json;
}

function toMarkdown(n: any) {
  const lines: string[] = [];
  lines.push(`# ${n.title ?? "Meeting Notes"}`);
  if (n.date) lines.push(`**Date:** ${n.date}`);
  if (n.participants?.length)
    lines.push(`**Participants:** ${n.participants.join(", ")}`);
  if (n.agenda?.length) {
    lines.push(`\n## Agenda`);
    n.agenda.forEach((a: string) => lines.push(`- ${a}`));
  }
  if (n.summary) {
    lines.push(`\n## Summary\n${n.summary}`);
  }
  if (n.decisions?.length) {
    lines.push(`\n## Decisions`);
    n.decisions.forEach((d: any) =>
      lines.push(`- ${d.item}${d.rationale ? ` - _${d.rationale}_` : ""}`)
    );
  }
  if (n.actionItems?.length) {
    lines.push(`\n## Action Items`);
    n.actionItems.forEach((a: any) =>
      lines.push(
        ` - ${a.owner ? `**${a.owner}**: ` : ""}${a.task}${
          a.due ? ` _(due ${a.due})_` : ""
        }`
      )
    );
  }
  if (n.risks?.length) {
    lines.push(`\n## Risks`);
    n.risks.forEach((r: string) => lines.push(`- ${r}`));
  }
  if (n.nextMeeting?.date || n.nextMeeting?.goals?.length) {
    lines.push(`\n## Next Meeting`);
    if (n.nextMeeting.date) lines.push(`- Date: ${n.nextMeeting.date}`);
    n.nextMeeting.goals?.forEach((g: string) => lines.push(`- Goal: ${g}`));
  }
  return lines.join("\n");
}
