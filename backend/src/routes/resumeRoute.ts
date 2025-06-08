import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { curateResume } from "../services/resumeCurator";


const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/upload-resume', upload.single('resume'), async (req: Request, res: Response): Promise<void> => {
    const file = req.file;
    const jobDescription = req.body.jd;

    if (!file || !jobDescription) {
        res.status(400).json({ message: 'Missing resume or job description' });
        return;
    }

    try {
        let text = '';

        const ext = path.extname(file.originalname).toLowerCase();

        if (ext === '.pdf') {
            const dataBuffer = fs.readFileSync(file.path);
            const data = await pdfParse(dataBuffer);
            text = data.text;
        } else if (ext === '.docx') {
            const data = fs.readFileSync(file.path);
            const result = await mammoth.extractRawText({ buffer: data });
            text = result.value;
        } else if (ext === '.txt') {
            text = fs.readFileSync(file.path, 'utf-8');
        } else {
            res.status(400).json({ message: 'Unsupported file type' });
            return;
        }

        // Clean up uploaded file
        fs.unlinkSync(file.path);

        const tailoredResume = await curateResume(text, jobDescription);

        // Next step: Send this text + JD to OpenAI (or return now for test)
        res.json({
            message: 'Resume parsed successfully',
            resumeText: text.slice(0, 1000), // sample preview
            jd: jobDescription,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to parse resume' });
    }
    
    
});



export default router;
