const fs = require("fs");
const path = require("path");
const async = require("async");
const { spawn } = require("child_process");

function libreOffice(libreofficeBin, callback) {
  if (libreofficeBin) {
    return callback(null, libreofficeBin);
  } else {
    let paths = [];
    switch (process.platform) {
      case "darwin":
        paths = ["/Applications/LibreOffice.app/Contents/MacOS/soffice"];
        break;
      case "linux":
        paths = ["/usr/bin/libreoffice", "/usr/bin/soffice"];
        break;
      case "win32":
        paths = [
          path.join(
            process.env["PROGRAMFILES(X86)"],
            "LIBREO~1/program/soffice.exe"
          ),
          path.join(
            process.env["PROGRAMFILES(X86)"],
            "LibreOffice/program/soffice.exe"
          ),
          path.join(
            process.env.PROGRAMFILES,
            "LibreOffice/program/soffice.exe"
          ),
        ];
        break;
      default:
        return callback(
          new Error(`Operating system not yet supported: ${process.platform}`)
        );
    }

    return async.filter(
      paths,
      (filePath, callback) =>
        fs.access(filePath, (err) => callback(null, !err)),
      (err, res) => {
        if (res.length === 0) {
          return callback(new Error("Could not find soffice binary"));
        }
        return callback(
          null,
          process.platform === "win32" ? `${res[0]}` : res[0]
        );
      }
    );
  }
}

function parseCommand(librePath, cmd, convert) {
  let _args = [];

  if (process.platform === "win32" && convert === "pdf") {
    _args.push("/c");
    _args.push(librePath);
  }

  _args = _args.concat(cmd);

  return { _args };
}

function run(librePath, cmd, convert) {
  return new Promise((resolve, reject) => {
    const { _args } = parseCommand(librePath, cmd, convert);
    let _cmd = null;

    if (convert === "img") {
      _cmd = "convert";
    } else if (process.platform === "win32" && convert === "pdf") {
      _cmd = process.env.ComSpec;
    } else {
      _cmd = librePath;
    }

    const proc = spawn(_cmd, _args);

    proc.stdout.on("data", (data) => {
      // console.log("stdout", data.toString());
    });

    proc.stderr.on("error", function (err) {
      reject(err);
    });

    proc.on("close", (code) => {
      const status = code === 0 ? "Success" : "Error";
      resolve(status);
    });
  });
}

exports.convert = (
  { libreofficeBin, sourceFile, outputDir, img, imgExt, reSize, density },
  callback
) => {
  libreOffice(libreofficeBin, (err, res) => {
    if (err) {
      return err;
    } else {
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

      if (ext === ".pdf")
        return run(res, pdf2Img, "img").then((res) => callback(null, res));

      fs.access(sourceFile, fs.constants.F_OK, (err) => {
        if (err) {
          return callback(new Error("Source file does not exist."));
        } else {
          if (extensions.includes(ext)) {
            run(res, pdf, "pdf").then((pdfRes) => {
              if (pdfRes !== "Error") {
                if (!img) {
                  return callback(null, pdfRes);
                } else {
                  run(res, image, "img").then((imageRes) => {
                    if (imageRes !== "Error") {
                      return callback(null, imageRes);
                    } else {
                      return callback(
                        new Error("Error on image conversion process.")
                      );
                    }
                  });
                }
              } else {
                return callback(new Error("Error on pdf conversion process."));
              }
            });
          } else {
            return callback(new Error("Invalid extension."));
          }
        }
      });
    }
  });
};
