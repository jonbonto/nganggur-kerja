import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'csv-parse';
import fs from 'fs';
import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';
import path from 'path';
import { Readable } from 'stream';

const tempDir = 'D:\\sourcecode\\nganggur-kerja\\tmp';

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
  if (!token || token.role !== 'employer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ message: 'No file provided' }, { status: 400 });
  }

  const buffer = await file.arrayBuffer();
  const readableStream = Readable.from(Buffer.from(buffer));

  const tempFilePath = path.join(tempDir, `${Date.now()}-${file.name}`);
  const fileStream = fs.createWriteStream(tempFilePath);

  // Write the file to disk
  await new Promise((resolve, reject) => {
    readableStream.pipe(fileStream);
    fileStream.on("finish", resolve);
    fileStream.on("error", reject);
  });

  const history = await prisma.uploadHistory.create({
    data: {
      filename: file.name,
      creatorId: +(token.id as number),
      status: "in_progress",
    },
  });

   // Process the file asynchronously
   (async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errorRows: any[] = [];
    let total = 0;
    let completed = 0;

    try {
      // First count total rows
      const countParser = fs.createReadStream(tempFilePath).pipe(
        parse({ columns: true, trim: true, skip_empty_lines: true })
      );
      
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for await (const row of countParser) {
        total++;
      }

      // Update history with total rows
      await prisma.uploadHistory.update({
        where: { id: history.id },
        data: { total }
      });

      const parser = fs.createReadStream(tempFilePath).pipe(
        parse({ columns: true, trim: true, skip_empty_lines: true })
      );
      
      for await (const row of parser) {
        
        try {
          if (!row.Title || !row.Company || !row.Location) {
            throw new Error("Missing required fields");
          }

          await prisma.job.create({
            data: {
              title: row.Title,
              company: row.Company,
              category: row.Category || "",
              description: row.Description || "",
              salary: row.Salary || null,
              location: row.Location,
              requirements: row.Requirements ? row.Requirements.split(";") : [],
              benefits: row.Benefits ? row.Benefits.split(";") : [],
              postedById: history.creatorId,
            },
          });
          
          completed++;
        } catch (error) {
          errorRows.push({ ...row, error: (error as Error).message, number: total });
        }

        // Update progress
        // const progress = Math.floor((completed / total) * 100);
        await prisma.uploadHistory.update({
          where: { id: history.id },
          data: { success: completed, errors: errorRows.length },
        });
      }

      // Save error rows to a file
      const errorFilePath = path.join(tempDir, `errors-${history.id}.csv`);
      if (errorRows.length > 0) {
        const errorFileContent =
          "Row,Title,Company,Category,Description,Salary,Location,Requirements,Benefits,Error\n" +
          errorRows
            .map((row) =>
              [
                row.number,
                row.Title,
                row.Company,
                row.Category,
                row.Description,
                row.Salary,
                row.Location,
                row.Requirements,
                row.Benefits,
                row.error,
              ].join(",")
            )
            .join("\n");
        fs.writeFileSync(errorFilePath, errorFileContent);
      }

      // Mark the process as completed
      await prisma.uploadHistory.update({
        where: { id: history.id },
        data: {
          status: "completed",
          errorFile: errorRows.length > 0 ? errorFilePath : null,
        },
      });

    } catch (error) {
      console.error("Error processing the file:", error);
      await prisma.uploadHistory.update({
        where: { id: history.id },
        data: { status: "failed", errorFile: tempFilePath },
      });
    }
    fs.unlinkSync(tempFilePath); // Clean up temp file
  })();

  // Return the response immediately
  return NextResponse.json({
    message: "File uploaded successfully. Processing in progress.",
    historyId: history.id,
  });
}

// Error file download
// export async function handleErrorFile(req: NextRequest) {
//   const url = new URL(req.url);
//   const sessionId = url.searchParams.get('sessionId');
//   const errorFilePath = `/tmp/${sessionId}-errors.csv`;

//   if (!fs.existsSync(errorFilePath)) {
//     return NextResponse.json({ message: 'Error file not found' }, { status: 404 });
//   }

//   const errorFileStream = fs.createReadStream(errorFilePath);
//   return new NextResponse(errorFileStream, {
//     headers: {
//       'Content-Type': 'text/csv',
//       'Content-Disposition': `attachment; filename="${sessionId}-errors.csv"`,
//     },
//   });
// }
