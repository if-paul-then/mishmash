'use strict'

function createApi(projectPublicKey) {
  return new ILovePdfApi(projectPublicKey);
}

/*
 * See here for more information: https://developer.ilovepdf.com/docs/api-reference
 */
class ILovePdfApi {
  constructor(projectPublicKey) {
    this.projectPublicKey = projectPublicKey;
  }
  
  getToken() {
    if (!_isSet(this._token)) {
      Logger.log("INFO: ILovePdfApi - Calling auth");
      var url = "https://api.ilovepdf.com/v1/auth";
      var options = {
        "method": "post",
        "payload": {"public_key": this.projectPublicKey}
      }
      var result = UrlFetchApp.fetch(url, options);
      Logger.log("INFO: Result:" + result);
      result = JSON.parse(result.getContentText());
      this._token = result.token;
      Logger.log("INFO: token=" + this._token);
    }
    return this._token;
  }
  
  createTask(tool) {
    Logger.log("INFO: ILovePdfApi.createTask");
    var url = "https://api.ilovepdf.com/v1/start/unlock";
    var options = {
      "method": "get",
      "headers": {"Authorization": "Bearer " + this.getToken()}
    }
    var result = UrlFetchApp.fetch(url, options);
    Logger.log("INFO: Result:" + result);
    result = JSON.parse(result.getContentText());
    var server = result.server;
    var taskId = result.task;
    Logger.log("INFO: server=" + server);
    Logger.log("INFO: task="   + taskId);
    var task = new Task(server, taskId, tool, this.getToken());
    return task;
  }
}

function _isDefined(value) {
  return typeof value !== 'undefined';
}

function _isSet(value) {
  return _isDefined(value) && value != null;
}
