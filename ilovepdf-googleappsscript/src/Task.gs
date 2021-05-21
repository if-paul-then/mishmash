'use strict'

class Task {
  constructor(server, taskId, tool, token) {
    this.server = server;
    this.taskId = taskId;
    this.tool   = tool;
    this.token  = token;
  }
  
  addFile(blob, password) {
    Logger.log("INFO: Task.addFile()");
    var url = "https://" + this.server + "/v1/upload";
    var options = {
      "method": "post",
      "headers": {"Authorization": "Bearer " + this.token},
      "payload": {"task": this.taskId, "file": blob}
    }
    var result = UrlFetchApp.fetch(url, options);
    Logger.log("INFO: Result:" + result);
    result = JSON.parse(result.getContentText());
    var serverFilename = result.server_filename;
    Logger.log("INFO: server_filename=" + serverFilename);
    this.fileServerName = serverFilename;
    this.fileName       = blob.getName();
    this.filePassword   = password;
  }
  
  process() {
    Logger.log("INFO: Task.process()");
    var url = "https://" + this.server + "/v1/process";
    var options = {
      "method": "post",
      "headers": {"Authorization": "Bearer " + this.token},
      "payload": {
        "task": this.taskId, "tool": this.tool,
        "files[0][server_filename]": this.fileServerName,
        "files[0][filename]"       : this.fileName,
        "files[0][password]"       : _isSet(this.filePassword) ? this.filePassword : ""
      },
      "muteHttpExceptions": true
    }
    var result = UrlFetchApp.fetch(url, options);
    Logger.log("INFO: Result Code:" + result.getResponseCode());
//    Logger.log("INFO: Result Headers:" + JSON.stringify(result.getAllHeaders()));
    if (result.getResponseCode() != 200) {
      Logger.log("INFO: Content Text:" + result.getContentText());
      throw new Error("Error processing task [" + result.getResponseCode() + "]");
    }
  }
  
  downloadFile() {
    Logger.log("INFO: Task.downloadFile()");
    var url = "https://" + this.server + "/v1/download/" + this.taskId;
    var options = {
      "method": "get",
      "headers": {"Authorization": "Bearer " + this.token}
    }
    var result = UrlFetchApp.fetch(url, options);
//    Logger.log("INFO: Result:" + result);
    var blob = result.getBlob();
    return blob;
  }
  
  next(tool) {
    Logger.log("INFO: Task.next()");
    var url = "https://api.ilovepdf.com/v1/task/next";
    var options = {
      "method": "post",
      "headers": {"Authorization": "Bearer " + this.token},
      "payload": {"task": this.taskId, "tool": tool}
    }
    var result = UrlFetchApp.fetch(url, options);
    Logger.log("INFO: Result:" + result);
    result = JSON.parse(result.getContentText());
    var server = result.server;
    var taskId = result.task;
    Logger.log("INFO: server=" + server);
    Logger.log("INFO: task="   + taskId);
    var task = new Task(server, taskId, tool, this.token);
    return task;
  }
}
