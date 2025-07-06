const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Employee Schema (for login)
const EmployeeSchema = new Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Leave Schema (including overtime)
const LeaveSchema = new Schema({
  employeeId: {
    type: String,
    required: true,
    ref: 'Employee'
  },
  type: {
    type: String,
    required: true,
    enum: ['annual', 'sick', 'personal', 'overtime']
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  hours: {
    type: Number,
    required: function() { return this.type === 'overtime'; }
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Approval Record Schema
const ApprovalRecordSchema = new Schema({
  leaveId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Leave'
  },
  approverId: {
    type: String,
    required: true,
    ref: 'Employee'
  },
  action: {
    type: String,
    required: true,
    enum: ['approved', 'rejected']
  },
  comments: {
    type: String
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to update the updated_at field
EmployeeSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

LeaveSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

ApprovalRecordSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

// Create models
const Employee = mongoose.model('Employee', EmployeeSchema);
const Leave = mongoose.model('Leave', LeaveSchema);
const ApprovalRecord = mongoose.model('ApprovalRecord', ApprovalRecordSchema);

module.exports = {
  Employee,
  Leave,
  ApprovalRecord
};