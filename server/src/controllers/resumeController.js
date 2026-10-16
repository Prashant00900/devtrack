import { analyzeResumeText, extractPdfText } from "../services/resumeService.js";

// POST /api/resume/analyze  (PDF file "resume" ya JSON { text })
export const analyzeResume = async (req, res) => {
  try {
    let text = "";

    if (req.file) {
      if (req.file.mimetype !== "application/pdf") {
        return res.status(400).json({ message: "Please upload a PDF file only" });
      }
      try {
        text = await extractPdfText(req.file.buffer);
      } catch {
        return res.status(400).json({
          message: "Could not read the PDF. Copy your resume text and use 'Paste text' instead.",
        });
      }
    } else if (req.body?.text) {
      text = String(req.body.text);
    }

    text = text.trim().slice(0, 20000);

    if (text.length < 80) {
      return res.status(400).json({
        message: "Could not extract text from the resume. If the PDF is a scanned image, paste the text instead.",
      });
    }

    const result = await analyzeResumeText(text, req.user._id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};