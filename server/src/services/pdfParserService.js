import { PDFParse } from 'pdf-parse';

/**
 * PDF Text Parser Service
 * Extracts readable plain text from uploaded PDF buffer using pdf-parse.
 * Safely handles malformed files, password protected files, and image-only/empty PDFs.
 */
export const extractTextFromPdf = async (buffer) => {
  if (!buffer || !Buffer.isBuffer(buffer)) {
    throw new Error('Invalid PDF data provided for text extraction.');
  }

  if (buffer.length === 0) {
    throw new Error('The uploaded PDF file is empty.');
  }

  // Verify PDF magic header bytes '%PDF'
  const header = buffer.subarray(0, 5).toString('ascii');
  if (!header.startsWith('%PDF')) {
    throw new Error('Could not extract readable text from this PDF.');
  }

  let parser = null;
  try {
    parser = new PDFParse({ data: buffer });
    const result = await parser.getText();

    if (!result || typeof result.text !== 'string') {
      throw new Error('Could not extract readable text from this PDF.');
    }

    // Clean up extracted text: normalize CRLF to LF, strip null bytes and normalize whitespace
    const cleanedText = result.text
      .replace(/\0/g, '')
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/[ \t]+/g, ' ')
      .trim();

    // Check if the extracted text has sufficient characters or words to be a readable resume
    // Image-only / scanned PDFs typically yield 0 or only minimal boilerplate text
    const wordCount = cleanedText.split(/\s+/).filter((w) => w.length > 0).length;
    if (cleanedText.length < 20 || wordCount < 4) {
      throw new Error('Could not extract readable text from this PDF.');
    }

    return cleanedText;
  } catch (error) {
    if (error.message === 'The uploaded PDF file is empty.' || error.message === 'Could not extract readable text from this PDF.') {
      throw error;
    }
    // Handle password-protected or corrupt PDFs
    if (error.name === 'PasswordException' || /password/i.test(error.message)) {
      throw new Error('The PDF is password protected. Please upload an unprotected PDF.');
    }

    // Fallback friendly message for other parsing exceptions
    throw new Error('Could not extract readable text from this PDF.');
  } finally {
    if (parser && typeof parser.destroy === 'function') {
      try {
        await parser.destroy();
      } catch (cleanupErr) {
        // Suppress cleanup warning
      }
    }
  }
};

export default {
  extractTextFromPdf,
};
