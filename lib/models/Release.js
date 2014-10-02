var mongoose = require('mongoose');
var semver = require('semver');

var releaseSchema = module.exports = mongoose.Schema({
  project: { type: String, required: true },
  version: {
    type: String,
    validate: function(v) { return semver.valid(v); },
    required: true
  },
  releaseNumber: { type: Number },
  download: { type: String },
  createdAt: { type: Date, default: Date.now }
});

releaseSchema.virtual('stringify').get(function() {
  return this.project.replace(/\//g, '-') + '@' + this.version;
});

releaseSchema.index({ project: 1, releaseNumber: -1 },
  { unique: true });