"use strict";
var expect = require("chai").expect;
var doc = require("../convert");

describe("Convert files to pdf or/and image", function () {
  let options = {
    libreofficeBin: "C:\\Program Files\\LibreOffice\\program\\soffice.exe",
    sourceFile: "C:\\convert-pdf-img\\metro_powerpoint.pptx",
    outputDir: "C:\\convert-pdf-img\\files\\",
    img: true,
    imgExt: "jpg",
    reSize: 800,
    density: 120,
  };
  it("should return source file not exist", function () {
    options.sourceFile = "C:\\convert-pdf-img\\metro_powerpoint.pptex";
    var result = doc.convert(options, function (err) {
      expect(err.message).to.equal("Source file does not exist.");
    });
  });

  it("should return invalid extesion", function () {
    options.sourceFile = "C:\\convert-pdf-img\\sample.txt";
    var result = doc.convert(options, function (err) {
      expect(err.message).to.equal("Invalid extension.");
    });
  });

  it("should return error on image conversion process", function () {
    options.sourceFile = "C:\\convert-pdf-img\\metro_powerpoint.pptx";
    options.outputDir = "abc";
    var result = doc.convert(options, function (err) {
      expect(err.message).to.equal("Error on image conversion process.");
    });
  });
});
