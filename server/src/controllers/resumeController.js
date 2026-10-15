import { analyzeResumeText, extractPdfText } from "../services/resumeService.js";

// POST /api/resume/analyze  (PDF file "resume" ya JSON { text })
export const analyzeResume = async (req, res) => {
  try {
    let text = "";

    if (req.file) {
      if (req.file.mimetype !== "application/pdf") {
        return res.status(400).json({ message: "Sirf PDF file upload karo" });
      }
      try {
        text = await extractPdfText(req.file.buffer);
      } catch {
        return res.status(400).json({
          message: "PDF padhi nahi ja saki. Resume ka text copy karke 'Paste text' mein daalo.",
        });
      }
    } else if (req.body?.text) {
      text = String(req.body.text);
    }

    text = text.trim().slice(0, 20000);

    if (text.length < 80) {
      return res.status(400).json({
        message: "Resume se text nahi nikla. PDF scanned image ho to text paste karo.",
      });
    }

    const result = await analyzeResumeText(text, req.user._id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};