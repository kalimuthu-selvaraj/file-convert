# convert-pdf-img

Converts `.ppt,` `.pptx`, `.odp` and `.key` file to `pdf or/and image(png, jpg, jpeg, etc)`

## Dependencies

Please install libreoffice, imagemagick and might required ghostscript for Mac os
**(Note: Please do restart after installed all required software.)**

## Usage Example

```javascript
// Import convert module
const document = require("./convert");

const options = {
  libreofficeBin: "C:\\Program Files\\LibreOffice\\program\\soffice.exe", // Optional
  sourceFile: "C:\\convert-pdf-img\\sample.pptx", // `.ppt,` `.pptx`, `.odp`, `.key` and `.pdf`
  outputDir: "C:\\convert-pdf-img\\sample",
  img: true,
  imgExt: "jpg", // Optional and Default image conversion format  is.png
  reSize: 800, // Optional and Default Resize  is 1200
  density: 120, // Optional and Default density value is 120
};

// Convert document to pdf and/or image
document.convert(options, (err, res) => {
  if (err) console.log(err.message);
  console.log(res);
});
```
