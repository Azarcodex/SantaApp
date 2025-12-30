import mongoose from 'mongoose';

const elfSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        enum: ['Toy Maker', 'QA', 'Logistics', 'Delivery Support'],
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Idle', 'Overloaded', 'Off-Duty', 'Working'],
        default: 'Idle'
    },
    location: {
        type: String,
        default: 'Workshop Floor 1'
    },
    fatigueLevel: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    tasksAssigned: {
        type: Number,
        default: 0
    },
    tasksCompletedToday: {
        type: Number,
        default: 0
    },
    errorRate: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    lastActiveAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Middleware to calculate status based on fatigue and tasks
elfSchema.pre('save', async function () {
    if (this.status !== 'Off-Duty') {
        // Only auto-update if not explicitly setting a status or if in a vulnerable state
        if (this.fatigueLevel > 80 || this.tasksAssigned > 10) {
            this.status = 'Overloaded';
        } else if (this.status === 'Overloaded') {
            // If we are saving and no longer meet overload criteria, move to Active or Idle
            this.status = this.tasksAssigned > 0 ? 'Active' : 'Idle';
        } else if (this.tasksAssigned > 0 && this.status === 'Idle') {
            this.status = 'Active';
        } else if (this.tasksAssigned === 0 && this.status === 'Active') {
            this.status = 'Idle';
        }
    }
    this.lastActiveAt = Date.now();
});

export default mongoose.model('Elf', elfSchema);
