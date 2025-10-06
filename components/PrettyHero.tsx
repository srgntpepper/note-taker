'use client';

export default function PrettyHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-b from-neutral-50 to-white p-8 md:p-16">
      <div className="absolute -top-10 -left-10 h-64 w-64 rounded-full blur-3xl opacity-30 bg-purple-300" />
      <div className="absolute -bottom-10 -right-10 h-72 w-72 rounded-full blur-3xl opacity-30 bg-blue-300" />

      <div className="relative max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
          Turn meetings into <span className="underline decoration-purple-300">actionable</span> notes.
        </h1>
        <p className="mt-4 text-lg text-neutral-600">
          Record or upload audio. Get structured, shareable notes with one click—export to PDF/DOCX or email the team.
        </p>
      </div>
    </section>
  );
}
