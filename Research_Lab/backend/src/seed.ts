import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User';
import Project from './models/Project';
import Paper from './models/Paper';
import Note from './models/Note';
import Experiment from './models/Experiment';
import ExperimentRun from './models/ExperimentRun';
import Task from './models/Task';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/research_assistant';

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await Promise.all([
            User.deleteMany({}),
            Project.deleteMany({}),
            Paper.deleteMany({}),
            Note.deleteMany({}),
            Experiment.deleteMany({}),
            ExperimentRun.deleteMany({}),
            Task.deleteMany({}),
        ]);
        console.log('Cleared existing data');

        // Create users
        const password = await bcrypt.hash('password123', 10);
        const users = await User.insertMany([
            { name: 'Dr. Sarah Chen', email: 'sarah@research.edu', password, role: 'admin' },
            { name: 'Alex Turner', email: 'alex@research.edu', password, role: 'researcher' },
            { name: 'Maria Garcia', email: 'maria@research.edu', password, role: 'researcher' },
        ]);
        console.log(`Created ${users.length} users`);

        // Create projects
        const projects = await Project.insertMany([
            {
                title: 'Transformer Architecture Optimization',
                description: 'Exploring novel techniques to reduce the computational cost of transformer models while maintaining performance on NLP benchmarks.',
                objectives: 'Reduce FLOPs by 40% without significant accuracy loss.',
                researchQuestion: 'Can sparse attention patterns achieve comparable results to full attention in large language models?',
                status: 'Data Collection',
                tags: ['NLP', 'Transformers', 'Efficiency', 'Deep Learning'],
                owner: users[0]._id,
                collaborators: [users[1]._id],
                progressPercentage: 35,
            },
            {
                title: 'Federated Learning for Healthcare',
                description: 'Implementing privacy-preserving machine learning across multiple hospital datasets without sharing patient data.',
                objectives: 'Achieve 95% accuracy on disease prediction while maintaining differential privacy.',
                researchQuestion: 'How does federated averaging compare to centralized training on heterogeneous medical imaging data?',
                status: 'Writing',
                tags: ['Federated Learning', 'Healthcare', 'Privacy', 'Medical Imaging'],
                owner: users[0]._id,
                collaborators: [users[1]._id, users[2]._id],
                progressPercentage: 70,
            },
            {
                title: 'Graph Neural Networks for Drug Discovery',
                description: 'Leveraging GNNs to predict molecular properties and identify potential drug candidates for rare diseases.',
                objectives: 'Build a GNN pipeline that outperforms traditional QSAR models on molecular property prediction.',
                researchQuestion: 'Do message-passing neural networks capture long-range molecular interactions better than fingerprint-based methods?',
                status: 'Proposal',
                tags: ['GNN', 'Drug Discovery', 'Molecular ML', 'Bioinformatics'],
                owner: users[1]._id,
                collaborators: [users[2]._id],
                progressPercentage: 10,
            },
        ]);
        console.log(`Created ${projects.length} projects`);

        // Create papers
        const papers = await Paper.insertMany([
            {
                projectId: projects[0]._id,
                title: 'Attention Is All You Need',
                authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar', 'Jakob Uszkoreit'],
                year: 2017,
                journal: 'NeurIPS 2017',
                doi: '10.48550/arXiv.1706.03762',
                keywords: ['attention mechanism', 'transformer', 'sequence-to-sequence', 'self-attention'],
                summaryShort: 'Introduces the Transformer architecture, replacing recurrence with multi-head self-attention for sequence transduction tasks.',
                summaryMethodology: 'The model uses stacked self-attention and point-wise, fully connected layers for both encoder and decoder. Multi-head attention allows the model to jointly attend to information from different representation subspaces.',
                keyFindings: 'The Transformer achieves state-of-the-art BLEU scores on WMT 2014 English-to-German (28.4) and English-to-French (41.0) translation tasks, training significantly faster than architectures based on recurrent or convolutional layers.',
                limitations: 'The self-attention mechanism has O(n²) complexity with respect to sequence length, making it computationally expensive for very long sequences.',
            },
            {
                projectId: projects[0]._id,
                title: 'BERT: Pre-training of Deep Bidirectional Transformers',
                authors: ['Jacob Devlin', 'Ming-Wei Chang', 'Kenton Lee', 'Kristina Toutanova'],
                year: 2019,
                journal: 'NAACL 2019',
                doi: '10.48550/arXiv.1810.04805',
                keywords: ['BERT', 'pre-training', 'fine-tuning', 'language representation'],
                summaryShort: 'Proposes BERT, a bidirectional transformer pre-trained using masked language modeling and next sentence prediction.',
                summaryMethodology: 'BERT is pre-trained on BooksCorpus and English Wikipedia using two tasks: Masked Language Model (MLM) and Next Sentence Prediction (NSP). Fine-tuning is done with task-specific layers.',
                keyFindings: 'BERT achieves new state-of-the-art results on eleven NLP tasks, including GLUE, SQuAD, and MultiNLI, demonstrating the effectiveness of bidirectional pre-training.',
                limitations: 'The pre-training process is computationally expensive, requiring significant GPU resources. The MLM objective creates a mismatch between pre-training and fine-tuning.',
            },
            {
                projectId: projects[1]._id,
                title: 'Communication-Efficient Learning of Deep Networks from Decentralized Data',
                authors: ['H. Brendan McMahan', 'Eider Moore', 'Daniel Ramage'],
                year: 2017,
                journal: 'AISTATS 2017',
                keywords: ['federated learning', 'distributed optimization', 'privacy'],
                summaryShort: 'Introduces Federated Averaging (FedAvg), a communication-efficient algorithm for learning deep networks from decentralized data.',
                summaryMethodology: 'FedAvg combines local SGD on each client with periodic model aggregation on a central server. Clients perform multiple local epochs before communicating updates.',
                keyFindings: 'FedAvg reduces communication rounds by 10-100x compared to naive federated SGD while matching or exceeding centralized training accuracy on MNIST and CIFAR-10.',
                limitations: 'Convergence guarantees are limited for non-IID data distributions across clients. Data heterogeneity remains a significant challenge.',
            },
            {
                projectId: projects[2]._id,
                title: 'Neural Message Passing for Quantum Chemistry',
                authors: ['Justin Gilmer', 'Samuel S. Schoenholz', 'Patrick F. Riley'],
                year: 2017,
                journal: 'ICML 2017',
                keywords: ['graph neural networks', 'message passing', 'molecular properties', 'quantum chemistry'],
                summaryShort: 'Proposes Message Passing Neural Networks (MPNNs) as a unified framework for graph neural networks applied to molecular property prediction.',
                summaryMethodology: 'The MPNN framework generalizes existing GNN variants through message, update, and readout functions. Applied to QM9 dataset for predicting 13 molecular properties.',
                keyFindings: 'MPNNs achieve state-of-the-art results on 11 of 13 molecular property prediction tasks on QM9, demonstrating the effectiveness of GNNs for quantum chemistry.',
                limitations: 'Message passing is limited by the number of hops and may not capture long-range interactions in larger molecules. Over-squashing can occur in deep GNNs.',
            },
        ]);
        console.log(`Created ${papers.length} papers`);

        // Create notes
        const notes = await Note.insertMany([
            {
                projectId: projects[0]._id,
                paperId: papers[0]._id,
                sections: {
                    idea: 'The multi-head attention mechanism could be made more efficient using sparse patterns like local-global attention or linear attention approximations.',
                    critique: 'While revolutionary, the O(n²) complexity is a fundamental limitation. The paper does not address this scalability concern in depth.',
                    literatureGap: 'No comparison with recurrent attention mechanisms or hybrid approaches. Limited analysis of attention head redundancy.',
                    futureExtension: 'Explore pruning redundant attention heads and using mixture-of-experts to dynamically route tokens.',
                    quoteReferences: '"Multi-head attention allows the model to jointly attend to information from different representation subspaces at different positions." - Section 3.2',
                },
            },
            {
                projectId: projects[1]._id,
                paperId: papers[2]._id,
                sections: {
                    idea: 'FedAvg could be combined with differential privacy mechanisms to provide formal privacy guarantees.',
                    critique: 'The evaluation is limited to IID data splits. Real-world federated settings have highly heterogeneous data.',
                    literatureGap: 'Missing analysis of communication cost vs. privacy trade-offs. No evaluation on medical imaging datasets.',
                    futureExtension: 'Apply FedAvg with secure aggregation to multi-institutional medical imaging for disease classification.',
                    quoteReferences: '"We show that this approach is robust to unbalanced and non-IID data distributions." - Abstract',
                },
            },
        ]);
        console.log(`Created ${notes.length} notes`);

        // Create experiments
        const experiments = await Experiment.insertMany([
            {
                projectId: projects[0]._id,
                dataset: 'WMT14 EN-DE',
                modelName: 'Sparse Transformer',
                description: 'Testing sparse attention patterns with varying sparsity levels on machine translation.',
            },
            {
                projectId: projects[0]._id,
                dataset: 'GLUE Benchmark',
                modelName: 'Efficient BERT',
                description: 'Comparing pruned BERT variants on the GLUE benchmark tasks.',
            },
            {
                projectId: projects[1]._id,
                dataset: 'ChestX-ray14',
                modelName: 'FedAvg + ResNet-50',
                description: 'Federated training of ResNet-50 for chest X-ray classification across 3 simulated hospitals.',
            },
        ]);
        console.log(`Created ${experiments.length} experiments`);

        // Create experiment runs
        const runs = await ExperimentRun.insertMany([
            {
                experimentId: experiments[0]._id,
                parameters: { sparsity: 0.5, heads: 8, layers: 6, lr: 0.0001 },
                metrics: { accuracy: 0.892, f1: 0.876, loss: 0.32, precision: 0.89, recall: 0.86 },
                resultSummary: 'Moderate sparsity achieves 89.2% accuracy, 3% below full attention but 2x faster training.',
            },
            {
                experimentId: experiments[0]._id,
                parameters: { sparsity: 0.7, heads: 8, layers: 6, lr: 0.0001 },
                metrics: { accuracy: 0.871, f1: 0.855, loss: 0.38, precision: 0.87, recall: 0.84 },
                resultSummary: 'Higher sparsity shows more degradation in translation quality but 3x speedup.',
            },
            {
                experimentId: experiments[0]._id,
                parameters: { sparsity: 0.3, heads: 12, layers: 6, lr: 0.00005 },
                metrics: { accuracy: 0.912, f1: 0.901, loss: 0.27, precision: 0.92, recall: 0.89 },
                resultSummary: 'Low sparsity with more heads nearly matches full attention (91.2% vs 92.1%).',
            },
            {
                experimentId: experiments[1]._id,
                parameters: { pruningRatio: 0.4, epochs: 3, lr: 0.00002 },
                metrics: { accuracy: 0.854, f1: 0.841, loss: 0.41, precision: 0.86, recall: 0.83 },
                resultSummary: 'Pruning 40% of BERT heads maintains 85.4% accuracy on GLUE average.',
            },
            {
                experimentId: experiments[2]._id,
                parameters: { localEpochs: 5, rounds: 50, lr: 0.01, clients: 3 },
                metrics: { accuracy: 0.923, f1: 0.918, loss: 0.21, precision: 0.93, recall: 0.91 },
                resultSummary: 'FedAvg with 5 local epochs achieves 92.3% accuracy on chest X-ray classification after 50 rounds.',
            },
        ]);
        console.log(`Created ${runs.length} experiment runs`);

        // Create tasks
        const now = new Date();
        const tasks = await Task.insertMany([
            { projectId: projects[0]._id, title: 'Review sparse attention literature', description: 'Survey recent papers on efficient attention mechanisms.', status: 'Done', deadline: new Date(now.getTime() - 7 * 86400000), assignedTo: users[0]._id },
            { projectId: projects[0]._id, title: 'Implement linear attention baseline', description: 'Code the Performer-style linear attention for comparison.', status: 'In Progress', deadline: new Date(now.getTime() + 3 * 86400000), assignedTo: users[1]._id },
            { projectId: projects[0]._id, title: 'Run ablation study on attention heads', description: 'Systematically prune attention heads and measure impact.', status: 'To Do', deadline: new Date(now.getTime() + 10 * 86400000), assignedTo: users[1]._id },
            { projectId: projects[0]._id, title: 'Write methodology section', description: 'Draft the methodology chapter for the paper.', status: 'To Do', deadline: new Date(now.getTime() + 14 * 86400000), assignedTo: users[0]._id },
            { projectId: projects[1]._id, title: 'Setup multi-node FL simulation', description: 'Configure the federated learning simulation environment with 3 virtual clients.', status: 'Done', assignedTo: users[0]._id },
            { projectId: projects[1]._id, title: 'Implement differential privacy module', description: 'Add Gaussian noise mechanism for DP-SGD.', status: 'In Progress', deadline: new Date(now.getTime() + 5 * 86400000), assignedTo: users[2]._id },
            { projectId: projects[1]._id, title: 'Draft introduction and related work', description: 'Write the intro and literature review sections.', status: 'Review', deadline: new Date(now.getTime() + 2 * 86400000), assignedTo: users[0]._id },
            { projectId: projects[1]._id, title: 'Run convergence experiments', description: 'Test convergence with varying numbers of local epochs and data heterogeneity.', status: 'Done', assignedTo: users[1]._id },
            { projectId: projects[2]._id, title: 'Collect molecular datasets', description: 'Download QM9, ZINC, and MoleculeNet datasets.', status: 'To Do', deadline: new Date(now.getTime() + 7 * 86400000), assignedTo: users[1]._id },
            { projectId: projects[2]._id, title: 'Draft project proposal', description: 'Write initial research proposal for faculty review.', status: 'In Progress', deadline: new Date(now.getTime() + 4 * 86400000), assignedTo: users[2]._id },
        ]);
        console.log(`Created ${tasks.length} tasks`);

        console.log('\n✅ Seed data created successfully!');
        console.log('\nLogin credentials:');
        console.log('  Admin:      sarah@research.edu / password123');
        console.log('  Researcher: alex@research.edu / password123');
        console.log('  Researcher: maria@research.edu / password123');

        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    }
}

seed();
