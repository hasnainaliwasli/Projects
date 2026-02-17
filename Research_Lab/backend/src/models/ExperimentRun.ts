import mongoose, { Document, Schema } from 'mongoose';

export interface IExperimentRun extends Document {
    experimentId: mongoose.Types.ObjectId;
    parameters: Record<string, any>;
    metrics: {
        accuracy?: number;
        f1?: number;
        precision?: number;
        recall?: number;
        loss?: number;
        [key: string]: number | undefined;
    };
    resultSummary: string;
    resultGraphUrl: string;
    resultGraphPublicId: string;
    createdAt: Date;
    updatedAt: Date;
}

const experimentRunSchema = new Schema<IExperimentRun>(
    {
        experimentId: {
            type: Schema.Types.ObjectId,
            ref: 'Experiment',
            required: true,
        },
        parameters: {
            type: Schema.Types.Mixed,
            default: {},
        },
        metrics: {
            type: Schema.Types.Mixed,
            default: {},
        },
        resultSummary: {
            type: String,
            default: '',
        },
        resultGraphUrl: {
            type: String,
            default: '',
        },
        resultGraphPublicId: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

experimentRunSchema.index({ experimentId: 1 });

export default mongoose.model<IExperimentRun>('ExperimentRun', experimentRunSchema);
