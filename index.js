const fs = require("fs");
const path = require("path");
const {spawn} = require("child_process");

function parseCommand(librePath, cmd, convert) {
  let _args = [];

  if (process.platform === "win32" && convert === "pdf") {
    _args.push("/c");
    _args.push(librePath);
  }

  _args = _args.concat(cmd);

  return {_args};
}

function fileExist(file) {
  return new Promise((resolve, reject) => {
    fs.access(file, fs.constants.F_OK, (err) => {
      if (err && err.code === "ENOENT") {
        reject(new Error(`${file} does not exist`));
      } else {
        resolve(true);
      }
    });
  });
}

const getFileThatExist = async (...files) => {
  for (const file of files) {
    if (file && await fileExist(file) === true) {
      return file;
    }
  }
  return false;
}

const filesExist = (...files) => {
  return Promise.resolve(!!getFileThatExist(...files));
}

function run(libreOfficeBin, cmd, convert) {
  return new Promise((resolve, reject) => {
    const {_args} = parseCommand(libreOfficeBin, cmd, convert);
    let _cmd = libreOfficeBin;

    if (convert === "img") {
      _cmd = "convert";
    } else if (process.platform === "win32" && convert === "pdf") {
      _cmd = process.env.ComSpec;
    }

    const proc = spawn(_cmd, _args);

    // proc.stdout.on("data", (data) => {
    //   // console.log("stdout", data.toString());
    // });

    proc.stderr.on("error", function (err) {
      reject(err);
    });

    proc.on("close", (code) => {
      const status = code === 0 ? "Success" : "Error";
      resolve(status);
    });
  });
}

exports.convert = async ({
                           libreofficeBin,
                           libreofficeBins,
                           sourceFile,
                           outputDir,
                           img,
                           imgExt,
                           reSize,
                           density,
                           disableExtensionCheck
                         }) => {
  const baseFileName = path.basename(sourceFile);
  const outputFile = baseFileName.replace(/\.[^.]+$/, ".pdf");

  const outputImg = outputFile.replace(/\.pdf$/, `-%d.${imgExt || "png"}`);

  const ext = path.extname(sourceFile.toLowerCase());
  const extensions = [".pdf", ".pptx", ".ppt", ".odp", ".key"];

  const pdf = [
    "--headless",
    "--convert-to",
    "pdf",
    "--outdir",
    outputDir,
    sourceFile,
  ];

  const image = [
    "-verbose",
    "-resize",
    reSize || 1200,
    "-density",
    density || 120,
    `${outputDir}${outputFile}`,
    `${outputDir}${outputImg}`,
  ];

  const pdf2Img = [
    "-verbose",
    "-resize",
    reSize || 1200,
    "-density",
    density || 120,
    sourceFile,
    `${outputDir}${outputImg}`,
  ];
  const libreOfficeBins = [
    libreofficeBin,
    ...(Array.isArray(libreofficeBins) ? libreofficeBins : [])

  ];
  if (!libreofficeBin) {
    libreOfficeBins.push(path.resolve("C:\\\\Program Files\\\\LibreOffice\\\\program\\\\soffice.exe"));
    libreOfficeBins.push(path.resolve("C:\\\\Program Files (x86)\\\\LibreOffice\\\\program\\\\soffice.exe"));
    libreOfficeBins.push(path.resolve("C:\\\\Program Files (x86)\\\\LIBREO~1\\\\program\\\\soffice.exe"));
    libreOfficeBins.push(path.resolve("/usr/bin/libreoffice"));
    libreOfficeBins.push(path.resolve("/usr/bin/soffice"));
    libreOfficeBins.push(path.resolve("/Applications/LibreOffice.app/Contents/MacOS/soffice"));
  }

  return getFileThatExist(...libreOfficeBins).then((libreofficeBin) => {
    if (libreofficeBin) {
      return filesExist(sourceFile).then((srcExist) => {
        if (srcExist) {
          if (ext === ".pdf")
            return run(libreofficeBin, pdf2Img, "img").then((res) => res);

          if (disableExtensionCheck || extensions.includes(ext)) {
            return run(libreofficeBin, pdf, "pdf").then((pdfRes) => {
              if (pdfRes !== "Error") {
                if (!img) {
                  return pdfRes;
                } else {
                  return run(libreofficeBin, image, "img").then((imageRes) => {
                    if (imageRes !== "Error") {
                      return imageRes;
                    } else {
                      throw new Error("Error on image conversion process.");
                    }
                  });
                }
              } else {
                throw new Error("Error on pdf conversion process.");
              }
            });
          } else {
            throw new Error("Invalid extension.");
          }
        }
      });
    }
  });
};
