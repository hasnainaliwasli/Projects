import { motion } from "framer-motion";
import { Github, ExternalLink, Box, ArrowRight } from "lucide-react";

const projects = [
    {
        title: "Hostel Finder",
        description: "A scalable hostel search platform with real-time chat and 3 separate dashboards for admin, student and owner.",
        tags: ["Next.js", "TypeScript", "REST APIs", "Socket.io"],
        github: "http://github.com/hasnain62712/Hostel-Finder",
        demo: "#",
        image: "https://images.unsplash.com/photo-1555854817-5b2ca60fe2db?auto=format&fit=crop&q=80&w=800",
    },
    {
        title: "Research Lab (AI Assistant)",
        description: "MERN application featuring JWT auth, Cloudinary PDF storage, and optimized performance with TanStack Query.",
        tags: ["Next.js 15", "MERN Stack", "Cloudinary", "TanStack Query"],
        github: "http://github.com/hasnain62712/Research-Lab",
        demo: "#",
        image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800",
    },
    {
        title: "AI Real Estate Recommendation",
        description: "Developed an AI-based recommendation system using cosine similarity and compared ML models for effectiveness.",
        tags: ["Python", "Flask", "Machine Learning", "Cosine Similarity"],
        github: "http://github.com/hasnain62712/AI-Real-Estate",
        demo: "#",
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800",
    },
];

export function Projects() {
    return (
        <section id="projects" className="py-24 px-6 bg-slate-50 dark:bg-background-dark/80 relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16 text-center"
                >
                    <h2 className="text-4xl font-bold mb-4 tracking-tight text-slate-900 dark:text-slate-100 italic">Featured Projects</h2>
                    <div className="h-1.5 w-20 bg-accent rounded-full mx-auto" />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {projects.map((project, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group flex flex-col bg-white dark:bg-primary/40 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
                        >
                            <div className="relative aspect-video overflow-hidden">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                                    <div className="flex gap-4">
                                        <a href={project.github} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-white/20 transition-all"><Github size={20} /></a>
                                        <a href={project.demo} className="p-3 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-white/20 transition-all"><ExternalLink size={20} /></a>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 flex flex-col flex-grow">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.tags.map((tag) => (
                                        <span key={tag} className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-accent bg-accent/10 rounded-full">{tag}</span>
                                    ))}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 group-hover:text-accent transition-colors">{project.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 flex-grow">{project.description}</p>

                                <a
                                    href={project.demo}
                                    className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-accent dark:hover:text-accent transition-all group/link"
                                >
                                    Explore Project <ArrowRight size={16} className="transition-transform group-hover/link:translate-x-1" />
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
