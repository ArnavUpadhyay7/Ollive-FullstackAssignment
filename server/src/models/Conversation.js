const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: 'New conversation',
      trim: true,
      maxlength: 200,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

conversationSchema.virtual('messages', {
  ref: 'Message',
  localField: '_id',
  foreignField: 'conversationId',
});

module.exports = mongoose.model('Conversation', conversationSchema);
