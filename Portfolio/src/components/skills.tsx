"use client";

import { motion } from "framer-motion";
import { Code2, Database, Layout, Terminal, Wrench } from "lucide-react";

const skillCategories = [
    {
        title: "Frontend Development",
        icon: Layout,
        skills: ["Next.js", "React.js", "TypeScript", "Tailwind CSS", "Redux Toolkit"],
        accent: "text-accent",
    },
    {
        title: "Backend & Database",
        icon: Terminal,
        skills: ["Node.js", "Express.js", "MongoDB", "PostgreSQL", "Firebase"],
        accent: "text-accent",
    },
    {
        title: "AI & Machine Learning",
        icon: Code2,
        skills: ["Python", "NLP", "TensorFlow", "PyTorch"],
        accent: "text-accent",
    },
    {
        title: "Tools & DevOps",
        icon: Wrench,
        skills: ["Git/GitHub", "Docker", "AWS"],
        accent: "text-accent",
    },
];

export function Skills() {
    return (
        <section id="skills" className="py-24 px-6 bg-white dark:bg-background-dark/50">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16 text-center"
                >
                    <h2 className="text-4xl font-bold mb-4 tracking-tight text-slate-900 dark:text-slate-100">Technical Skills</h2>
                    <div className="h-1.5 w-20 bg-accent rounded-full mx-auto" />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {skillCategories.map((category, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="flex flex-col gap-6"
                        >
                            <div className="flex items-center gap-3">
                                <category.icon className="text-accent" size={28} />
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{category.title}</h3>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                {category.skills.map((skill, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ y: -2 }}
                                        className="flex h-11 items-center justify-center gap-x-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-5 transition-all duration-200 shadow-sm hover:bg-primary hover:text-white dark:hover:bg-accent group cursor-default"
                                    >
                                        <div className="text-accent group-hover:text-white transition-colors">
                                            <Code2 size={18} />
                                        </div>
                                        <p className="text-sm font-semibold">{skill}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
