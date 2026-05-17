import Notification from '../models/Notification.js';

// ── Create and save a notification ───────────────────────────────────────────
export const createNotification = async ({
      recipient,
      type,
      title,
      message,
      complaint = null,
      channels = { inApp: true, email: false, sms: false },
}) => {
      try {
            const notification = await Notification.create({
                  recipient,
                  type,
                  title,
                  message,
                  complaint,
                  channels,
            });
            return notification;
      } catch (err) {
            console.error('Notification create error:', err.message);
            return null;
      }
};

// ── Mark notification as read ─────────────────────────────────────────────────
export const markAsRead = async (notificationId, userId) => {
      return Notification.findOneAndUpdate(
            { _id: notificationId, recipient: userId },
            { isRead: true, readAt: new Date() },
            { new: true }
      );
};

// ── Mark all as read for a user ───────────────────────────────────────────────
export const markAllAsRead = async (userId) => {
      return Notification.updateMany(
            { recipient: userId, isRead: false },
            { isRead: true, readAt: new Date() }
      );
};

// ── Get unread count ──────────────────────────────────────────────────────────
export const getUnreadCount = async (userId) => {
      return Notification.countDocuments({ recipient: userId, isRead: false });
};

// ── Complaint lifecycle notifications ─────────────────────────────────────────
export const notifyComplaintFiled = async (citizenId, complaintId, complaintTitle) => {
      return createNotification({
            recipient: citizenId,
            type: 'complaint_filed',
            title: 'Complaint Submitted Successfully',
            message: `Your complaint "${complaintTitle}" has been submitted and is being reviewed.`,
            complaint: complaintId,
      });
};

export const notifyComplaintAssigned = async (officerId, complaintId, complaintTitle) => {
      return createNotification({
            recipient: officerId,
            type: 'complaint_assigned',
            title: 'New Complaint Assigned',
            message: `A new complaint "${complaintTitle}" has been assigned to you. Please review and take action.`,
            complaint: complaintId,
      });
};

export const notifyStatusUpdate = async (citizenId, complaintId, complaintTitle, newStatus) => {
      const statusMessages = {
            assigned: 'has been assigned to an officer',
            in_progress: 'is now being worked on',
            resolved: 'has been resolved',
            closed: 'has been closed',
            rejected: 'has been rejected',
      };
      return createNotification({
            recipient: citizenId,
            type: 'status_update',
            title: 'Complaint Status Updated',
            message: `Your complaint "${complaintTitle}" ${statusMessages[newStatus] || 'has been updated'}.`,
            complaint: complaintId,
      });
};

export const notifyEscalation = async (officerId, complaintId, complaintTitle) => {
      return createNotification({
            recipient: officerId,
            type: 'escalation',
            title: '⚠️ Complaint Escalated',
            message: `Complaint "${complaintTitle}" has been escalated due to SLA breach. Immediate action required.`,
            complaint: complaintId,
      });
};
