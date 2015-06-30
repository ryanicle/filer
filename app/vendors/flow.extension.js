var self = window.Flow;

function readFile(file) {
    var reader = new FileReader(),
        result = 'empty';

    reader.readAsDataURL(file);
    reader.onloadend = function(e) {
      fileContent = e.target.result.replace(/.*base64,/, '');
      var el = document.createElement('div');
      el.id = 'fileContent';
      document.body.appendChild(el);
      document.getElementById('fileContent').innerHTML = (fileContent);
    };
}

window.Flow.FlowChunk.prototype.getParams = function () {
  console.log('getParams', this);
  readFile(this.fileObj.file);

  var fileContent = '';
  if (document.getElementById('fileContent')) {
    fileContent = document.getElementById('fileContent').innerHTML;
    console.log('fileContent', fileContent);
  }

  return {
    compressionMode: 'NORMAL',
    compressionSize: this.fileObjSize,
    originalSize: this.fileObjSize,
    content: fileContent
  };
};