const mongoose = require('mongoose');

const STATUSES = ['success', 'error', 'cancelled'];

const inferenceLogSchema = new mongoose.Schema(
  {
    provider: { type: String, required: true, index: true },
    model: { type: String, required: true },
    latency: { type: Number, required: true },
    tokenUsage: {
      promptTokens: { type: Number, default: 0 },
      completionTokens: { type: Number, default: 0 },
      totalTokens: { type: Number, default: 0 },
    },
    status: {
      type: String,
      enum: STATUSES,
      required: true,
      index: true,
    },
    requestPreview: { type: String, default: '' },
    responsePreview: { type: String, default: '' },
    errors: [{ type: String }],
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      index: true,
    },
    sessionId: { type: String, index: true },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

inferenceLogSchema.index({ createdAt: 1 });

module.exports = mongoose.model('InferenceLog', inferenceLogSchema);
module.exports.STATUSES = STATUSES;
