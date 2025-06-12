import { NextResponse } from "next/server";
import { IncomingForm, Fields, Files, File as FormidableFile } from "formidable";
import { IncomingMessage } from "http";
import { Readable } from "stream";
import { updateAdresaPicData } from "../crm_body_insert/crm_account_insert";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

function getFieldValue(field: string | string[] | undefined): string {
  if (!field) return "";
  return Array.isArray(field) ? field[0] : field;
}

// Používáme FormidableFile (nikoli webový File)
type FileOrFiles = FormidableFile | FormidableFile[];

function cleanFiles(files: Files): Record<string, FileOrFiles> {
  const result: Record<string, FileOrFiles> = {};

  for (const key in files) {
    const fileArray = files[key];
    if (!fileArray || fileArray.length === 0) continue;

    if (fileArray.length === 1) {
      result[key] = fileArray[0];
    } else {
      result[key] = fileArray;
    }
  }

  return result;
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    const contentLength = req.headers.get("content-length") || "";

    const buffer = await req.arrayBuffer();

    const nodeReq = new Readable({
      read() {
        this.push(Buffer.from(buffer));
        this.push(null);
      },
    }) as IncomingMessage;

    nodeReq.headers = {
      "content-type": contentType,
      "content-length": contentLength,
    };

    nodeReq.on = nodeReq.addListener.bind(nodeReq);

    const uploadDir = "C:/tmp";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const formData = await new Promise<{ fields: Fields; files: Files }>(
      (resolve, reject) => {
        const form = new IncomingForm({
          uploadDir,
          keepExtensions: true,
          multiples: true,
        });
        form.parse(nodeReq, (err, fields, files) => {
          if (err) reject(err);
          else resolve({ fields, files });
        });
      }
    );

    const action = getFieldValue(formData.fields.action).trim();

    switch (action) {
      case "updateAdresa":
        const cleanedFields: Record<string, string> = {};
        for (const key in formData.fields) {
          cleanedFields[key] = getFieldValue(formData.fields[key]);
        }
        const cleanedFiles = cleanFiles(formData.files);

        // Tady předáváme správné typy formidable.File
        return await updateAdresaPicData({
          fields: cleanedFields,
          files: cleanedFiles,
        });

      default:
        return NextResponse.json(
          { success: false, error: "Unknown action" },
          { status: 400 }
        );
    }
  } catch (err) {
    console.error("Chyba v /api/file_insert_router:", err);
    if (err instanceof Error) {
      return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
    return NextResponse.json({ success: false, error: "Neznámá chyba" }, { status: 500 });
  }
}