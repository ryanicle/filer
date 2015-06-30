var self = window.Flow;
window.Flow.FlowChunk.prototype.getParams = function () {
    return {
      // flowChunkNumber: this.offset + 1,
      // flowChunkSize: this.flowObj.opts.chunkSize,
      // flowCurrentChunkSize: this.endByte - this.startByte,
      // flowTotalSize: this.fileObjSize,
      // flowIdentifier: this.fileObj.uniqueIdentifier,
      // flowFilename: this.fileObj.name,
      // flowRelativePath: this.fileObj.relativePath,
      // flowTotalChunks: this.fileObj.chunks.length,
      compressionMode: 'NORMAL',
      compressionSize: 0,
      originalSize: this.fileObjSize,
      content: 'Blah Blah'
    };
};