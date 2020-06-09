# document-convert

Converts `.ppt` `.pptx` `.odp` and `.key` file to `pdf or/and image(png, jpg, jpeg and etc..)`

## Dependencies

Please install [libreoffice](https://www.libreoffice.org/), [imagemagick](https://www.imagemagick.org/script/index.php) and might required [ghostscript](https://www.ghostscript.com/) for Mac os
**(Note: Please do restart your machine after installed all required software.)**

## LibreOffice test

libreOfficeInstallationPath --headless --convert-to pdf --outdir outputDir sourceFile(test.pdf),

## LibreOffice Installation Path

Windows

```
C:\\Program Files\\LibreOffice\\program\\soffice.exe (or)
C:\\Program Files (x86)\\LibreOffice\\program\\soffice.exe (or)
C:\\Program Files (x86)\\LIBREO~1\\program\\soffice.exe
```

Ubuntu

```
/usr/bin/libreoffice (or)
/usr/bin/soffice
```

Mac OS

```
/Applications/LibreOffice.app/Contents/MacOS/soffice
```

## Imagemagic test

convert -verbose -resize 1200 -density 200 test.pdf test-%d.png(%d inserts the images `scene number`)

## Usage Example

```javascript
// Import convert module
const document = require("./convert");

const options = {
  libreofficeBin: "C:\\Program Files\\LibreOffice\\program\\soffice.exe", // Optional
  sourceFile: "C:\\convert-pdf-img\\sample.pptx", // .ppt, .pptx, .odp, .key and .pdf
  outputDir: "C:\\convert-pdf-img\\output",
  img: false,
  imgExt: "jpg", // Default value png
  reSize: 800, // Default Resize is 1200
  density: 120, // Default density value is 120
};

// Convert document to pdf and/or image
document.convert(options, (err, res) => {
  if (err) console.log(err.message);
  console.log(res);
});
```
