"use strict";
var chai = require("chai").use(require("chai-as-promised"));
var document = require("../index");
var expect = chai.expect;
var path = require("path");
global.appRoot = path.resolve(__dirname);

describe("Convert files to pdf or/and image", function () {
  const options = {
    libreofficeBin: "C:\\Program Files\\LibreOffice\\program\\sooffice.exe",
    sourceFile: `${global.appRoot}/source/file_example.pptx`,
    outputDir: `${global.appRoot}/files/`,
    img: true,
  };

  it("Should return libre office bin does not exist", function (done) {
    document.convert(options).catch((e) => {
      expect(e.message).to.equal(`${options.libreofficeBin} does not exist`);
      done();
    });
  });

  it("should return invalid extesion", function () {
    options.libreofficeBin = "/usr/bin/libreoffice";
    options.sourceFile = `${global.appRoot}/source/sample.txt`;
    document.convert(options).catch((e) => {
      expect(e.message).to.equal("Invalid extension.");
    });
  });

  it("should convert pdf to image", function () {
    options.sourceFile = `${global.appRoot}/source/file_example.pdf`;
    options.outputDir = `${global.appRoot}/files/`;
    options.reSize = 800;
    document.convert(options).then((res) => {
      expect(res).to.equal("Success");
    });
  });

  it("should convert pdf only", function (done) {
    options.sourceFile = `${global.appRoot}/source/file_example.pptx`;
    options.img = false;
    document.convert(options).then((res) => {
      expect(res).to.equal("Success");
      done();
    });
  });

  it("should convert without resize, density and imgExt", function () {
    options.img = true;
    document.convert(options).then((res) => {
      expect(res).to.equal("Success");
    });
  });
});
