import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(
  process.cwd(),
  "uploads"
);

// Create uploads directory automatically
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(
      file.originalname
    );

    const baseName = path
      .basename(
        file.originalname,
        ext
      )
      .replace(/[^a-zA-Z0-9]/g, "-")
      .toLowerCase();

    cb(
      null,
      `${baseName}-${Date.now()}${ext}`
    );
  },
});

const fileFilter = (req, file, cb) => {
  /*
  |--------------------------------------------------------------------------
  | PROFILE IMAGE
  |--------------------------------------------------------------------------
  */

  if (file.fieldname === "profileImage") {
    const allowedImages = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
    ];

    if (
      !allowedImages.includes(
        file.mimetype
      )
    ) {
      return cb(
        new Error(
          "Profile picture must be JPG, JPEG, PNG or WEBP."
        )
      );
    }

    return cb(null, true);
  }

  /*
  |--------------------------------------------------------------------------
  | RESUME
  |--------------------------------------------------------------------------
  */

  if (file.fieldname === "resume") {
    const allowedResumeTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (
      !allowedResumeTypes.includes(
        file.mimetype
      )
    ) {
      return cb(
        new Error(
          "Resume must be PDF, DOC or DOCX."
        )
      );
    }

    return cb(null, true);
  }

  cb(
    new Error(
      "Invalid upload field."
    )
  );
};

const upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

export default upload;