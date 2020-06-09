"use strict";
var expect = require("chai").expect;
var doc = require("../convert");

describe("Convert files to pdf or/and image", function () {
  let options = {
    sourceFile: "C:\\document-convert\\metro_powerpoint.pptx",
    outputDir: "C:\\document-convert\\files\\",
    img: true,
    imgExt: "jpg",
    reSize: 800,
    density: 120,
  };
  it("should return source file not exist", function () {
    options.sourceFile = "C:\\document-convert\\source\\metro_powerpoint.pptex";
    var result = doc.convert(options, function (err) {
      expect(err.message).to.equal("Source file does not exist.");
    });
  });

  it("should return invalid extesion", function () {
    options.sourceFile = "C:\\document-convert\\source\\sample.txt";
    var result = doc.convert(options, function (err) {
      expect(err.message).to.equal("Invalid extension.");
    });
  });

  it("should return success", function () {
    options.sourceFile = "C:\\document-convert\\source\\metro_powerpoint.pptx";
    options.outputDir = "C:\\document-convert\\files\\";
    options.img = true;
    var result = doc.convert(options, function (err, res) {
      expect(res).to.equal("Success");
    });
  });
});
