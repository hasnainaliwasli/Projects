import mongoose, { Document, Schema } from 'mongoose';

export interface IPaper extends Document {
    title: string;
    authors: string[];
    year: number;
    journal: string;
    doi: string;
    keywords: string[];
    projectId: mongoose.Types.ObjectId;
    fileUrl: string;
    filePublicId: string;
    extractedText: string;
    summaryShort: string;
    summaryMethodology: string;
    keyFindings: string;
    limitations: string;
    embeddingVector: number[];
    createdAt: Date;
    updatedAt: Date;
}

const paperSchema = new Schema<IPaper>(
    {
        title: {
            type: String,
            required: [true, 'Paper title is required'],
            trim: true,
            maxlength: 500,
        },
        authors: [{ type: String, trim: true }],
        year: {
            type: Number,
            min: 1900,
            max: 2100,
        },
        journal: {
            type: String,
            trim: true,
            default: '',
        },
        doi: {
            type: String,
            trim: true,
            default: '',
        },
        keywords: [{ type: String, trim: true }],
        projectId: {
            type: Schema.Types.ObjectId,
            ref: 'Project',
            required: true,
        },
        fileUrl: {
            type: String,
            default: '',
        },
        filePublicId: {
            type: String,
            default: '',
        },
        extractedText: {
            type: String,
            default: '',
        },
        summaryShort: {
            type: String,
            default: '',
        },
        summaryMethodology: {
            type: String,
            default: '',
        },
        keyFindings: {
            type: String,
            default: '',
        },
        limitations: {
            type: String,
            default: '',
        },
        embeddingVector: {
            type: [Number],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

paperSchema.index({ projectId: 1 });
paperSchema.index({ title: 'text', authors: 'text', keywords: 'text', doi: 'text' });

export default mongoose.model<IPaper>('Paper', paperSchema);
