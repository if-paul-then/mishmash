# iLovePDF API - Google Apps Script

Google Apps Script library for [iLovePDF Api](https://developer.ilovepdf.com).
For more information on possible calls, see the [API Reference](https://developer.ilovepdf.com/docs/api-reference).

## Authentication
The API authentication uses the public key found in the [admin panel](https://developer.ilovepdf.com/user/projects).
For more information see [the authentication documentation](https://developer.ilovepdf.com/docs/api-reference#authentication)
on requesting a signed token from the authentication server.

## Examples
Unlocking (decrypting) a PDF:
```
function pdfUnlock(encryptedPdfBlob, pdfPassword, projectPublicKey) {
  var api = ILovePdfLib.createApi(projectPublicKey);
  var task = api.createTask("unlock");
  task.addFile(encryptedPdfBlob, pdfPassword);
  task.process();
  var unlockedBlob = task.downloadFile();
  unlockedBlob.setName(encryptedPdfBlob.getName());
  return unlockedBlob;
}
```

Extracting text from a PDF:
```
function pdfToTxt(pdfBlob, projectPublicKey) {
  var api = ILovePdfLib.createApi(projectPublicKey);
  var task = api.createTask("extract");
  task.addFile(pdfBlob);
  task.process();
  var textBlob = task.downloadFile();
  var str = textBlob.getDataAsString("UTF-16");
  return str;
}
```

## Official JavaScript versions of iLovePDF libraries
Since the time I developed this library, iLovePDF has created [JavaScript](https://github.com/ilovepdf/ilovepdf-js)
and [node.js](https://github.com/ilovepdf/ilovepdf-nodejs) versions of theirs.
The library here can easily be adapted to have the same structure and call signatures as those.

