import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  const formidable = require("formidable");
  const form = new formidable.IncomingForm();

  form.keepExtensions = true;
  
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: "Error parsing the file" });
    }
    
    const { uploadDir } = fields;

    // Validate the directory (ensure it's safe and exists)
    const safeDir = path.join(process.cwd(), "public", uploadDir);

    // Ensure the directory exists, or create it
    if (!fs.existsSync(safeDir)) {
      fs.mkdirSync(safeDir, { recursive: true });
    }

    const file = files.fileDocument;
    const newFilePath = path.join(safeDir, file.originalFilename);

    // Move the file to the specified directory
    fs.renameSync(file.filepath, newFilePath);

    return res.status(200).json({
      message: "File uploaded successfully",
      filePath: `${uploadDir}/${file.originalFilename}`,
    });
  });
}
