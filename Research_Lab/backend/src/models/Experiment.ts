import mongoose, { Document, Schema } from 'mongoose';

export interface IExperiment extends Document {
    projectId: mongoose.Types.ObjectId;
    dataset: string;
    modelName: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

const experimentSchema = new Schema<IExperiment>(
    {
        projectId: {
            type: Schema.Types.ObjectId,
            ref: 'Project',
            required: true,
        },
        dataset: {
            type: String,
            required: [true, 'Dataset name is required'],
            trim: true,
        },
        modelName: {
            type: String,
            required: [true, 'Model name is required'],
            trim: true,
        },
        description: {
            type: String,
            default: '',
            maxlength: 2000,
        },
    },
    {
        timestamps: true,
    }
);

experimentSchema.index({ projectId: 1 });

export default mongoose.model<IExperiment>('Experiment', experimentSchema);
