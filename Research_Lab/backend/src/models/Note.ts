import mongoose, { Document, Schema } from 'mongoose';

interface INoteVersion {
    sections: {
        idea: string;
        critique: string;
        literatureGap: string;
        futureExtension: string;
        quoteReferences: string;
    };
    updatedAt: Date;
}

export interface INote extends Document {
    projectId: mongoose.Types.ObjectId;
    paperId: mongoose.Types.ObjectId;
    sections: {
        idea: string;
        critique: string;
        literatureGap: string;
        futureExtension: string;
        quoteReferences: string;
    };
    versionHistory: INoteVersion[];
    createdAt: Date;
    updatedAt: Date;
}

const noteVersionSchema = new Schema(
    {
        sections: {
            idea: { type: String, default: '' },
            critique: { type: String, default: '' },
            literatureGap: { type: String, default: '' },
            futureExtension: { type: String, default: '' },
            quoteReferences: { type: String, default: '' },
        },
        updatedAt: { type: Date, default: Date.now },
    },
    { _id: false }
);

const noteSchema = new Schema<INote>(
    {
        projectId: {
            type: Schema.Types.ObjectId,
            ref: 'Project',
            required: true,
        },
        paperId: {
            type: Schema.Types.ObjectId,
            ref: 'Paper',
            required: true,
        },
        sections: {
            idea: { type: String, default: '' },
            critique: { type: String, default: '' },
            literatureGap: { type: String, default: '' },
            futureExtension: { type: String, default: '' },
            quoteReferences: { type: String, default: '' },
        },
        versionHistory: [noteVersionSchema],
    },
    {
        timestamps: true,
    }
);

noteSchema.index({ projectId: 1, paperId: 1 });

export default mongoose.model<INote>('Note', noteSchema);
