var mongoose = require('mongoose');

var DownloadHistorySchema = module.exports =
  new mongoose.Schema({
    project: String,
    month: Number,
    year: Number,
    data: {
      downloads: { type: Number, default: 0 }
    }
  });

DownloadHistorySchema.
  index({ project: 1, year: 1, month: 1 });
DownloadHistorySchema.
  index({ year: 1, month: 1, 'data.downloads': -1 });
