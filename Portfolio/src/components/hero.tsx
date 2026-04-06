"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail, ArrowRight, Download, User } from "lucide-react";

export function Hero() {
    return (
        <section
            id="home"
            className="min-h-screen flex flex-col justify-center pt-24 px-6 relative overflow-hidden bg-background-light dark:bg-background-dark"
        >
            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Content Side */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col gap-8 order-2 lg:order-1"
                >
                    <div className="flex flex-col gap-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-widest w-fit border border-accent/20"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                            </span>
                            Available for work
                        </motion.div>

                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-slate-900 dark:text-slate-100">
                            Hi, I'm{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-400">
                                Hasnain Ali
                            </span>
                        </h1>

                        <h2 className="text-2xl md:text-3xl font-semibold text-slate-700 dark:text-slate-300">
                            Software Engineer | MERN Stack Developer | Aspiring AI Engineer
                        </h2>

                        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
                            Building scalable web applications and exploring the future of artificial intelligence. Specialized in crafting robust backends and dynamic user interfaces.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4 pt-2">
                        <motion.a
                            href="#projects"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 bg-accent hover:bg-accent/90 text-white rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-accent/25"
                        >
                            View Projects <ArrowRight size={20} />
                        </motion.a>
                        <motion.a
                            href="/cv.pdf"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 glass rounded-2xl font-bold flex items-center gap-2 transition-all border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100"
                        >
                            Download Resume <Download size={20} />
                        </motion.a>
                    </div>

                    <div className="flex items-center gap-6 pt-4">
                        {[
                            { icon: Github, href: "https://github.com/hasnain62712" },
                            { icon: Linkedin, href: "https://linkedin.com/in/hasnain-ali" },
                            { icon: Mail, href: "mailto:hasnain62712@gmail.com" },
                        ].map((social, i) => (
                            <motion.a
                                key={i}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ y: -5, color: "#3b82f6" }}
                                className="p-3 glass rounded-xl transition-all"
                            >
                                <social.icon size={24} />
                            </motion.a>
                        ))}
                    </div>
                </motion.div>

                {/* Visual Side */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, type: "spring" }}
                    className="relative order-1 lg:order-2 flex justify-center lg:justify-end"
                >
                    <div className="relative w-full max-w-[420px] aspect-square">
                        {/* Background Decorative Layer */}
                        <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-primary to-accent opacity-20 transform rotate-3 scale-105"></div>

                        {/* Portrait Container */}
                        <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary via-slate-800 to-accent shadow-2xl flex items-center justify-center border-4 border-white dark:border-slate-800">
                            <User size={160} className="text-white/20" />
                        </div>

                        {/* Experience Badge */}
                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="absolute -bottom-6 -right-6 glass p-5 rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 backdrop-blur-xl"
                        >
                            <p className="text-accent font-black text-3xl leading-none">2+</p>
                            <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1 text-center">Years Exp.</p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* Stats Section Bar */}
            <div className="max-w-7xl mx-auto w-full mt-24 pb-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { label: "Completed", value: "20+ Projects" },
                        { label: "Open Source", value: "10+ Libs" },
                        { label: "Uptime", value: "99.9%" },
                        { label: "Commits", value: "1.5k+" }
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="glass p-6 rounded-3xl border border-white/5 dark:border-slate-800/50 flex flex-col gap-1"
                        >
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.label}</p>
                            <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{stat.value}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
