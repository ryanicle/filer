window.Flow.FlowChunk.prototype.getParams = function () {
    return {
      kwChunkNumber: this.offset + 1,
      flowChunkSize: this.flowObj.opts.chunkSize,
      flowCurrentChunkSize: this.endByte - this.startByte,
      flowTotalSize: this.fileObjSize,
      flowIdentifier: this.fileObj.uniqueIdentifier,
      flowFilename: this.fileObj.name,
      flowRelativePath: this.fileObj.relativePath,
      flowTotalChunks: this.fileObj.chunks.length
    };
};