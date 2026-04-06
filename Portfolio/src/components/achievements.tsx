"use client";

import { motion } from "framer-motion";
import { Award, CheckCircle2, Trophy, Brain, GraduationCap, Send, Mail, Github, Linkedin, MessageSquareText } from "lucide-react";

const achievements = [
    {
        title: "Hackathon Winner",
        issuer: "Global Tech Challenge 2023",
        desc: "Winner of the Global Tech Challenge 2023 for AI-driven sustainability solutions.",
        icon: Trophy,
    },
    {
        title: "AI Research Publication",
        issuer: "IEEE International Journal",
        desc: "Lead author of 'Neural Network Efficiency' published in the IEEE International Journal.",
        icon: Brain,
    },
    {
        title: "Academic Excellence",
        issuer: "University of Technology",
        desc: "Consistent Dean's List honoree with a CGPA of 3.9/4.0 in Computer Science.",
        icon: GraduationCap,
    },
];

export function Achievements() {
    return (
        <div id="achievements">
            {/* Achievements Section */}
            <section className="py-24 px-6 bg-background-light dark:bg-background-dark/30">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-16 text-center"
                    >
                        <h2 className="text-4xl font-bold mb-4 tracking-tight text-slate-900 dark:text-slate-100">Achievements</h2>
                        <div className="h-1.5 w-20 bg-accent rounded-full mx-auto" />
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {achievements.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="flex gap-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-primary/40 p-6 shadow-sm hover:shadow-md transition-shadow group"
                            >
                                <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-accent/10 dark:bg-accent/20 text-accent group-hover:scale-110 transition-transform">
                                    <item.icon size={28} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 leading-tight">{item.title}</h3>
                                    <p className="text-accent text-xs font-bold uppercase tracking-wider">{item.issuer}</p>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-relaxed">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-24 px-6 relative overflow-hidden bg-slate-50 dark:bg-primary/20">
                <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        <div>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-6">Get in Touch</h2>
                                <p className="text-slate-500 dark:text-slate-400 text-lg mb-8 leading-relaxed">
                                    Let's build something amazing together. Reach out for collaborations or just a friendly hello.
                                </p>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
                                        <div className="size-12 rounded-full bg-accent text-white flex items-center justify-center shrink-0">
                                            <Mail size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase tracking-widest font-bold">Email</p>
                                            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">hasnain62712@gmail.com</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
                                        <div className="size-12 rounded-full bg-accent text-white flex items-center justify-center shrink-0">
                                            <MessageSquareText size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase tracking-widest font-bold">Social</p>
                                            <div className="flex gap-4 mt-1">
                                                <a href="https://github.com/hasnain62712" className="text-slate-400 hover:text-accent transition-colors"><Github size={20} /></a>
                                                <a href="https://linkedin.com/in/hasnain-ali" className="text-slate-400 hover:text-accent transition-colors"><Linkedin size={20} /></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        <div>
                            <motion.form
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="space-y-4"
                            >
                                <div className="flex flex-col">
                                    <label className="text-slate-900 dark:text-slate-200 text-sm font-semibold mb-2 ml-1">Full Name</label>
                                    <input className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-primary/60 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-accent focus:border-transparent h-14 px-4 text-base transition-all outline-none" placeholder="John Doe" type="text" />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-slate-900 dark:text-slate-200 text-sm font-semibold mb-2 ml-1">Email Address</label>
                                    <input className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-primary/60 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-accent focus:border-transparent h-14 px-4 text-base transition-all outline-none" placeholder="john@example.com" type="email" />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-slate-900 dark:text-slate-200 text-sm font-semibold mb-2 ml-1">Message</label>
                                    <textarea className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-primary/60 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-accent focus:border-transparent min-h-[120px] p-4 text-base transition-all outline-none" placeholder="How can I help you?"></textarea>
                                </div>
                                <button className="w-full bg-primary dark:bg-accent text-white font-bold h-14 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-accent/10" type="submit">
                                    <span>Send Message</span>
                                    <Send size={18} />
                                </button>
                            </motion.form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
