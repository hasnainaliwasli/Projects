import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
    projectId: mongoose.Types.ObjectId;
    title: string;
    description: string;
    status: 'To Do' | 'In Progress' | 'Review' | 'Done';
    deadline: Date | null;
    assignedTo: mongoose.Types.ObjectId | null;
    createdAt: Date;
    updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
    {
        projectId: {
            type: Schema.Types.ObjectId,
            ref: 'Project',
            required: true,
        },
        title: {
            type: String,
            required: [true, 'Task title is required'],
            trim: true,
            maxlength: 200,
        },
        description: {
            type: String,
            default: '',
            maxlength: 2000,
        },
        status: {
            type: String,
            enum: ['To Do', 'In Progress', 'Review', 'Done'],
            default: 'To Do',
        },
        deadline: {
            type: Date,
            default: null,
        },
        assignedTo: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

taskSchema.index({ projectId: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ deadline: 1 });

export default mongoose.model<ITask>('Task', taskSchema);
