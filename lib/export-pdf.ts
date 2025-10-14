import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function markdownToSimplePDF(md: string) {
  const pdf = await PDFDocument.create();
  //may need a list of pages that get appended each time one is needed
  const page = pdf.addPage();
  const { width, height } = page.getSize();
  const margin = 50;
  const contentWidth = width - margin * 2;

  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);
  let y = height - margin;
  const lineHeight = 14;

  const drawTextBlock = (text: string, bold = false) => {
    const words = text.split(/\s+/);
    let line = "";
    for (const w of words) {
      const test = (line ? line + " " : "") + w;
      const size = 11;
      const tw = (bold ? fontBold : font).widthOfTextAtSize(test, size);
      if (tw > contentWidth) {
        page.drawText(line, {
          x: margin,
          y,
          size,
          font: bold ? fontBold : font,
          color: rgb(0.1, 0.1, 0.1),
        });
        y -= lineHeight;
        line = w;
      } else {
        line = test;
      }
      if (y < margin) {
        /* naive single-page */ break;
      }
    }
    if (line) {
      page.drawText(line, {
        x: margin,
        y,
        size: 11,
        font: bold ? fontBold : font,
        color: rgb(0.1, 0.1, 0.1),
      });
      y -= lineHeight;
    }
  };

  // naive markdown headings -- We need to add functionality to add an additional page if more content is needed.
  md.split("\n").forEach((line) => {
    if (line.startsWith("# ")) {
      y -= 6;
      drawTextBlock(line.replace(/^#\s*/, ""), true);
      y -= 6;
    } else if (line.startsWith("## ")) {
      y -= 4;
      drawTextBlock(line.replace(/^##\s*/, ""), true);
    } else if (line.startsWith("- ")) {
      drawTextBlock("• " + line.slice(2));
    } else if (line.trim().length === 0) {
      y -= lineHeight;
    } else {
      drawTextBlock(line);
    }
  });

  return await pdf.save();
}
