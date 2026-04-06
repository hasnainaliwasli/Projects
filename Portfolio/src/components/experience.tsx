"use client";

import { motion } from "framer-motion";
import { Briefcase, Calendar, MapPin } from "lucide-react";

const experiences = [
    {
        title: "Apprenticeship MERN Stack Developer",
        company: "IT Empire Pvt Ltd",
        location: "Faisalabad",
        period: "Nov 2025 - Present",
        description: [
            "Developing and maintaining web applications using the MERN Stack (MongoDB, Express.js, React.js + Next.js, and Node.js).",
            "Assisting in designing and implementing RESTful APIs and backend services.",
            "Collaborating with the development team to build responsive and user-friendly front-end interfaces.",
            "Participating in debugging, testing, and optimizing applications."
        ],
    },
    {
        title: "Research Collaboration",
        company: "Academic Collaboration",
        location: "Remote/Onsite",
        period: "Jan 2024 - Sep 2025",
        description: [
            "Collaborated with PhD and MS students on AI-focused research projects, gaining exposure to formal research methodologies.",
            "Assisted in drafting research manuscripts and conducted structured literature reviews using EndNote.",
            "Participated in peer-review sessions, emphasizing analytical rigor and scholarly writing."
        ],
    },
    {
        title: "Teacher",
        company: "Bloomfield Academy of Science",
        location: "Faisalabad",
        period: "Jan 2022 - Jan 2023",
        description: [
            "Taught foundational computer science to 60+ intermediate and matric students.",
            "Created lecture materials and assignments.",
            "Conducted quizzes and tests."
        ],
    },
];

export function Experience() {
    return (
        <section id="experience" className="py-24 px-6 relative overflow-hidden bg-white dark:bg-background-dark">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Left Column: Profile & Highlights */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="sticky top-24 flex flex-col gap-10"
                        >
                            <div className="flex flex-col items-center lg:items-start gap-4">
                                <div className="relative">
                                    <div className="h-32 w-32 rounded-full border-4 border-white dark:border-slate-800 shadow-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center overflow-hidden">
                                        <MapPin className="text-white/20" size={60} />
                                    </div>
                                    <div className="absolute bottom-1 right-1 bg-green-500 border-2 border-white dark:border-slate-800 size-5 rounded-full"></div>
                                </div>
                                <div className="text-center lg:text-left">
                                    <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Hasnain Ali</h2>
                                    <p className="text-accent font-semibold text-sm mt-1 uppercase tracking-wider">MERN Stack & AI Engineer</p>
                                    <div className="flex items-center justify-center lg:justify-start gap-1 mt-2 text-slate-500 dark:text-slate-400">
                                        <MapPin size={14} />
                                        <p className="text-sm">Based in Pakistan</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Key Highlights</h3>
                                {[
                                    { icon: Briefcase, title: "3.5 Months MERN Internship", desc: "Full-stack development at IT Empire" },
                                    { icon: Calendar, title: "AI Recommendation System", desc: "Final Year Project focusing on ML" },
                                    { icon: MapPin, title: "AI/NLP Research", desc: "Collaborative research in advanced NLP" }
                                ].map((hl, i) => (
                                    <div key={i} className="relative overflow-hidden rounded-xl bg-primary/5 dark:bg-accent/5 border border-slate-100 dark:border-slate-800 p-4 shadow-sm backdrop-blur-sm">
                                        <div className="flex items-start gap-4">
                                            <div className="bg-primary dark:bg-accent text-white p-2 rounded-lg">
                                                <hl.icon size={18} />
                                            </div>
                                            <div>
                                                <p className="text-slate-900 dark:text-slate-100 text-sm font-bold">{hl.title}</p>
                                                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">{hl.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Timeline */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mb-12"
                        >
                            <h2 className="text-4xl font-bold mb-4 tracking-tight text-slate-900 dark:text-slate-100">Experience Timeline</h2>
                            <div className="h-1.5 w-20 bg-accent rounded-full" />
                        </motion.div>

                        <div className="relative space-y-12 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-accent/20 before:via-accent/20 before:to-transparent">
                            {experiences.map((exp, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="relative flex items-center group"
                                >
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 bg-primary dark:bg-accent text-white shadow shrink-0 z-10">
                                        <Briefcase size={16} />
                                    </div>
                                    <div className="w-full ml-6 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                            <time className="font-bold text-xs text-accent uppercase tracking-wider">{exp.period}</time>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{exp.title}</h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 font-medium">{exp.company} | {exp.location}</p>
                                        <ul className="space-y-3">
                                            {exp.description.map((item, i) => (
                                                <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
