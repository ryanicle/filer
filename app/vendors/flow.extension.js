var self = window.Flow;

function readFile(file) {
    var reader = new FileReader(),
        result = 'empty';

    if (!document.getElementById('fileContent')) {
      var el = document.createElement('div');
      el.id = 'fileContent';
      el.style.display = 'none';
      document.body.appendChild(el);

      // var mi = document.createElement("input");
      // mi.setAttribute('type', 'text');
      // mi.setAttribute('value', 'default');
    }

    reader.onloadend = function(e) {
      fileContent = e.target.result.replace(/.*base64,/, '');
      document.getElementById('fileContent').innerText = (fileContent);
    };
    reader.readAsDataURL(file);
}

window.Flow.FlowChunk.prototype.getParams = function () {
  console.log('getParams', this);

  var blob = this.fileObj.file.slice(this.startByte, this.endByte);
  readFile(blob);

  var fileContent = '';
  if (document.getElementById('fileContent')) {
    fileContent = document.getElementById('fileContent').innerText;
    console.log('fileContent', fileContent);
  }

  return {
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
};