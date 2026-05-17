import mongoose from 'mongoose';

// ── AuditLog collection ───────────────────────────────────────────────────────
// Stored in: esamadhan.auditlogs
// Tracks every important action for accountability
const auditLogSchema = new mongoose.Schema(
      {
            action: {
                  type: String,
                  required: true,
                  enum: [
                        'user_register', 'user_login', 'user_logout',
                        'complaint_create', 'complaint_update', 'complaint_assign',
                        'complaint_resolve', 'complaint_reject', 'complaint_escalate',
                        'department_create', 'department_update',
                        'admin_action',
                  ],
            },
            performedBy: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: 'User',
                  required: true,
            },
            targetModel: {
                  type: String,
                  enum: ['User', 'Complaint', 'Department', null],
                  default: null,
            },
            targetId: {
                  type: mongoose.Schema.Types.ObjectId,
                  default: null,
            },
            details: {
                  type: mongoose.Schema.Types.Mixed, // flexible JSON
                  default: {},
            },
            ipAddress: { type: String },
            userAgent: { type: String },
      },
      { timestamps: true }
);

auditLogSchema.index({ performedBy: 1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ createdAt: -1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
