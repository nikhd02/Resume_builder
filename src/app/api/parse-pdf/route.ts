import { NextResponse } from 'next/server';
import PDFParser from 'pdf2json';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise<NextResponse>((resolve) => {
      const pdfParser = new PDFParser(null, 1);
      
      pdfParser.on("pdfParser_dataError", (errData: any) => {
        console.error('pdf2json error:', errData.parserError);
        resolve(NextResponse.json({ error: 'Failed to parse PDF file.' }, { status: 500 }));
      });
      
      pdfParser.on("pdfParser_dataReady", () => {
        const text = pdfParser.getRawTextContent();
        resolve(NextResponse.json({ text }));
      });

      pdfParser.parseBuffer(buffer);
    });
  } catch (error: any) {
    console.error('Error handling PDF upload:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during PDF parsing.' },
      { status: 500 }
    );
  }
}
