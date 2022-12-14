//  :sparkles: feat: sdad
module.exports = {
  parserOpts: {
    headerPattern:
      /^\s*:(?:sparkles|bug|memo|lipstick|recycle|zap|test|package|ferris_wheel|hammer|rewind):\s*(\w*)((\(\w*\))?)(.*)$/,
    headerCorrespondence: ['type', 'scope', 'subject'],
  },
}
// \s:(?:sparkles|bug|memo|lipstick|recycle|zap|test|package|ferris_wheel|hammer|rewind):
