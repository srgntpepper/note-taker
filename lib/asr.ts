import OpenAI, { toFile } from "openai";

// Make sure to check that the key was successfully passed.
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

// It might be a good idea to either generate unique filenames or allow the user to name the file
export async function transcribeAudioWebm(buffer: Buffer, filename: string) {
  const file = await toFile(buffer, filename, { type: "audio/webm" }); //check for other audio types, just in case

  // Can switch to 'gpt-4o-mini-transcribe' if enabled.
  const resp = await openai.audio.transcriptions.create({
    file,
    model: "whisper-1",
    // temperature: 0,
    // prompt: "Business meeting with agenda, decisions, action items.",
    // language: "en",
    // response_format: "verbose_json", // includes segments/timestamps if needed
  });

  // resp.text for Whisper; adapt if using a different model API.
  return resp.text;
}
