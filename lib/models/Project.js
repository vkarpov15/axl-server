var mongoose = require('mongoose');

var projectSchema = module.exports = new mongoose.Schema({
  name: String,
  releases: [String],
  downloadsCount: { type: Number, default: 0 },
  data: {
    maintainers: [{ username: String }],
    readme: String,
    keywords: [String]
  }
});

projectSchema.index({ name: 1 }, { unique: true });
projectSchema.index({ 'data.maintainers.username': 1 });