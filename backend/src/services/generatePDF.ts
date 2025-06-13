import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import ejs from 'ejs';

interface ResumeData {
  name: string;
  experience: string;
  education: string;
  projects: string;
  skills: string;
}

export const generatePDF = async (data: ResumeData): Promise<Buffer> => {
  const templatePath = path.join(__dirname, '../../templates/resume_template.ejs');
  const html = await ejs.renderFile(templatePath, data);

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: 'networkidle0' });

  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '1in', bottom: '1in', left: '1in', right: '1in' },
  });

  await browser.close();
  return Buffer.from(pdfBuffer);
};
