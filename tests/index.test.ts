import getParser from "../src/index";

const fakeResponseData = [
  `{ "results": [ {"id": 1, "name": "todo-1"}, {"id": 2,`,
  `"name": "todo-2"}] }`
];

const stream = require("stream");
const mockedStream = new stream.Readable();
mockedStream.curIndex = 0;
mockedStream._read = function() {
  if (this.curIndex >= fakeResponseData.length) return this.push(null);

  var data = fakeResponseData[this.curIndex++];
  this.push(data);
};

jest.mock("axios", () => {
  return {
    get: url => {
      return {
        data: mockedStream
      };
    }
  };
});

function arrayBufferToString(buffer) {
  return String.fromCharCode.apply(null, new Uint16Array(buffer));
}

describe("getParser", () => {
  it("parses a simple chunked result", async done => {
    const outputStream = await getParser("http://www.fjdklsajflkda.com", {
      itemArrayElementName: "results"
    });

    const outputArrays: Array<Object> = [];

    outputStream.on("data", outputChunk => {
      try {
        const itemsArray = JSON.parse(arrayBufferToString(outputChunk));
        outputArrays.push(...itemsArray);
        //console.log("got output stream chunk", arrayBufferToString(outputChunk));
        //console.log("got output stream chunk", itemsArray);
      } catch (err) {
        console.log("got error parsing chunk");
        //console.log({ outputChunk: arrayBufferToString(outputChunk) });
      }
    });

    outputStream.on("end", () => {
      const completeOutput = outputArrays.flat();

      expect(completeOutput.length).toEqual(2);
      expect(completeOutput).toEqual([
        { id: 1, name: "todo-1" },
        { id: 2, name: "todo-2" }
      ]);

      done();
    });
  });
});
