# convert-pdf-img

Converts `.ppt,` `.pptx`, `.odp` and `.key` to `pdf or/and image(png, jpg, jpeg)`

## Dependencies

Please install libreoffice, imagemagick and might required ghostscript for Mac os

## Usage Example

// Import convert module
const document = require("./convert");

// `.ppt,` `.pptx`, `.odp` and `.key` to pdf and/or image convert options
const options = {
libreofficeBin: "C:\\Program Files\\LibreOffice\\program\\soffice.exe", // This is optional if it is null it will find default installation path inn your OS
sourceFile: "C:\\convert-pdf-img\\sample.pptx",
outputDir: "C:\\convert-pdf-img\\abc",
img: true,
imgExt: "jpg",
reSize: 800,
density: 120,
};

// Document (`.ppt,` `.pptx`, `.odp` and `.key`) to pdf and/or image convert options

const options = {
libreofficeBin: "C:\\Program Files\\LibreOffice\\program\\soffice.exe", // This is optional if it is null it will find default installation path inn your OS
sourceFile: "C:\\convert-pdf-img\\sample.pdf",
outputDir: "C:\\convert-pdf-img\\",
img: true,
imgExt: "jpg",
reSize: 800,
density: 120,
};

// Convert document to pdf and/or image
document.convert(options, (err, res) => {
if (err) console.log(err.message);
console.log(res);
});
