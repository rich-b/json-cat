# json-cat-parser

concatenated json parser

Read chunks of json as they become available

## Usage

```
import getParser from 'json-cat';

const outputStream = await getParser("http://www.someLocation.com", {
  itemArrayElementName: "results"
});

const outputArrays = [];
const completeOutput = [];

outputStream.on("data", outputChunk => {
  const itemsArray = JSON.parse(arrayBufferToString(outputChunk));

  // do whatever processing you need to for the entities returned
});

outputStream.on("end", () => {
  // anything you need to do when the request completed
});
```

## config parameter

the config parameter to `getParser` currently only has the `itemArrayElementName` property. This property tells the parser where to locate the array of entities that it should parse.
