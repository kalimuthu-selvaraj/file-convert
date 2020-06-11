const document = require("./convert");
var path = require("path");
// const options = {
//   libreofficeBin: "C:\\Program Files\\LibreOffice\\program\\soffice.exe",
//   sourceFile: "C:\\node\\document-convert\\source\\Metro_Style.pptx",
//   outputDir: "C:\\node\\document-convert\\files\\",
//   img: true,
//   imgExt: "jpg",
//   reSize: "-resize",
//   density: 120,
// };

// document.convert(options).catch((e) => {
//   console.log("e", e.message);
// });
global.appRoot = path.resolve(__dirname);
console.log(global.appRoot);
//nyc --reporter=html --reporter=text mocha test/*.js --timeout 1500000
