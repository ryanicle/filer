var self = window.Flow;
var evalOpts = window.Flow.evalOpts;
var extend = window.Flow.extend;
var each = window.Flow.each;
function readFile(file) {
    var reader = new FileReader(),
        result = 'empty';

    if (!document.getElementById('fileContent')) {
      var el = document.createElement('textarea');
      el.id = 'fileContent';
      // el.style.display = 'none';
      document.body.appendChild(el);

      // var mi = document.createElement("input");
      // mi.setAttribute('type', 'text');
      // mi.setAttribute('value', 'default');
    }

    reader.onload = function(e) {
      fileContent = e.target.result.replace(/.*base64,/, '');
      document.getElementById('fileContent').value = fileContent;
    };
    reader.readAsDataURL(file);
}

window.Flow.FlowChunk.prototype.prepareXhrRequest = function(method, isTest, paramsMethod, blob) {
  // Add data from the query options
  var query = evalOpts(this.flowObj.opts.query, this.fileObj, this, isTest);
  query = extend(this.getParams(), query);
  // Inject url
  var target = evalOpts(this.fileObj.target, this.fileObj, this, isTest);
  var data = null;
  if (method === 'GET' || paramsMethod === 'octet') {
    // Add data from the query options
    var params = [];
    each(query, function (v, k) {
      params.push([encodeURIComponent(k), encodeURIComponent(v)].join('='));
    });
    target = this.getTarget(target, params);
    data = blob || null;
  } else {
    // Add data from the query options
    data = new FormData();
    each(query, function (v, k) {
      data.append(k, v);
    });
    data.append(this.flowObj.opts.fileParameterName, blob, this.fileObj.file.name);
  }

  this.xhr.open(method, target, true);
  this.xhr.withCredentials = this.flowObj.opts.withCredentials;

  // Add data from header options
  each(evalOpts(this.flowObj.opts.headers, this.fileObj, this, isTest), function (v, k) {
    this.xhr.setRequestHeader(k, v);
  }, this);

  return data;
}

window.Flow.FlowChunk.prototype.getParams = function () {
  var fileContent = document.getElementById('fileContent').value;
  var data = {
    lastChunk: 0,
    flowChunkNumber: this.offset + 1,
    flowChunkSize: this.flowObj.opts.chunkSize,
    flowCurrentChunkSize: this.endByte - this.startByte,
    flowTotalSize: this.fileObjSize,
    flowIdentifier: this.fileObj.uniqueIdentifier,
    flowFilename: this.fileObj.name,
    flowRelativePath: this.fileObj.relativePath,
    flowTotalChunks: this.fileObj.chunks.length,
    flowStartByte: this.startByte,
    flowEndByte: this.endByte,
    compressionMode: 'NORMAL',
    compressionSize: this.flowObj.opts.chunkSize,
    originalSize: this.flowObj.opts.chunkSize,
    content: fileContent
  };
  if (this.offset + 1 == this.fileObj.chunks.length) {
    data.compressionSize = this.endByte - this.startByte;
    data.originalSize = this.endByte - this.startByte;
  }
  return data;
};

window.Flow.FlowChunk.prototype.send = function () {
  var preprocess = this.flowObj.opts.preprocess;
  if (typeof preprocess === 'function') {
    switch (this.preprocessState) {
      case 0:
        this.preprocessState = 1;
        preprocess(this);
        return;
      case 1:
        return;
    }
  }
  // if (this.flowObj.opts.testChunks && !this.tested) {
  //   this.test();
  //   return;
  // }

  this.loaded = 0;
  this.total = 0;
  this.pendingRetry = false;

  var func = (this.fileObj.file.slice ? 'slice' :
    (this.fileObj.file.mozSlice ? 'mozSlice' :
      (this.fileObj.file.webkitSlice ? 'webkitSlice' :
        'slice')));
  var bytes = this.fileObj.file[func](this.startByte, this.endByte, this.fileObj.file.type);

  // Set up request and listen for event
  this.xhr = new XMLHttpRequest();
  this.xhr.upload.addEventListener('progress', this.progressHandler, false);
  this.xhr.addEventListener("load", this.doneHandler, false);
  this.xhr.addEventListener("error", this.doneHandler, false);

  var uploadMethod = evalOpts(this.flowObj.opts.uploadMethod, this.fileObj, this);
  var data = this.prepareXhrRequest(uploadMethod, false, this.flowObj.opts.method, bytes);
  this.xhr.send(data);
};