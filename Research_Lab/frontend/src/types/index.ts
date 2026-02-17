export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'admin' | 'researcher';
    createdAt: string;
}

export interface AuthResponse {
    success: boolean;
    data: {
        user: User;
        accessToken: string;
    };
}

export interface Project {
    _id: string;
    title: string;
    description: string;
    objectives: string;
    researchQuestion: string;
    status: 'Proposal' | 'Data Collection' | 'Writing' | 'Submitted';
    tags: string[];
    owner: User;
    collaborators: User[];
    progressPercentage: number;
    createdAt: string;
    updatedAt: string;
}

export interface Paper {
    _id: string;
    title: string;
    authors: string[];
    year: number;
    journal: string;
    doi: string;
    keywords: string[];
    projectId: { _id: string; title: string } | string;
    fileUrl: string;
    extractedText: string;
    summaryShort: string;
    summaryMethodology: string;
    keyFindings: string;
    limitations: string;
    embeddingVector: number[];
    createdAt: string;
    updatedAt: string;
}

export interface SimilarPaper {
    paper: {
        _id: string;
        title: string;
        authors: string[];
        year: number;
        journal: string;
        keywords: string[];
    };
    similarity: number;
}

export interface NoteSections {
    idea: string;
    critique: string;
    literatureGap: string;
    futureExtension: string;
    quoteReferences: string;
}

export interface NoteVersion {
    sections: NoteSections;
    updatedAt: string;
}

export interface Note {
    _id: string;
    projectId: { _id: string; title: string } | string;
    paperId: { _id: string; title: string } | string;
    sections: NoteSections;
    versionHistory: NoteVersion[];
    createdAt: string;
    updatedAt: string;
}

export interface Experiment {
    _id: string;
    projectId: { _id: string; title: string } | string;
    dataset: string;
    modelName: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface ExperimentRun {
    _id: string;
    experimentId: string;
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
    createdAt: string;
}

export interface Task {
    _id: string;
    projectId: { _id: string; title: string } | string;
    title: string;
    description: string;
    status: 'To Do' | 'In Progress' | 'Review' | 'Done';
    deadline: string | null;
    assignedTo: User | null;
    createdAt: string;
    updatedAt: string;
}

export interface DashboardStats {
    totalPapers: number;
    totalExperiments: number;
    activeProjects: number;
    totalProjects: number;
    researchProgress: number;
    recentPapers: Paper[];
    upcomingDeadlines: Task[];
    charts: {
        papersPerProject: { name: string; papers: number }[];
        experimentRunsPerProject: { name: string; runs: number }[];
        tasksByStatus: Record<string, number>;
    };
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: {
        total: number;
        page: number;
        pages: number;
    };
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}
