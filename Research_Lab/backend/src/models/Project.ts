import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
    title: string;
    description: string;
    objectives: string;
    researchQuestion: string;
    status: 'Proposal' | 'Data Collection' | 'Writing' | 'Submitted';
    tags: string[];
    owner: mongoose.Types.ObjectId;
    collaborators: mongoose.Types.ObjectId[];
    progressPercentage: number;
    createdAt: Date;
    updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
    {
        title: {
            type: String,
            required: [true, 'Project title is required'],
            trim: true,
            maxlength: 200,
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            maxlength: 2000,
        },
        objectives: {
            type: String,
            default: '',
            maxlength: 2000,
        },
        researchQuestion: {
            type: String,
            default: '',
            maxlength: 1000,
        },
        status: {
            type: String,
            enum: ['Proposal', 'Data Collection', 'Writing', 'Submitted'],
            default: 'Proposal',
        },
        tags: [{ type: String, trim: true }],
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        collaborators: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        progressPercentage: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
    },
    {
        timestamps: true,
    }
);

projectSchema.index({ owner: 1 });
projectSchema.index({ title: 'text', description: 'text', tags: 'text' });

export default mongoose.model<IProject>('Project', projectSchema);
