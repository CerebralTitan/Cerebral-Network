import { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import ProjectCard from "@/components/portfolio/ProjectCard";
import { portfolioProjects } from "@/data/portfolio-projects";
import { Code2, Users, Star, Award, ExternalLink } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const Portfolio = () => {
  const allTags = Array.from(
    new Set(portfolioProjects.flatMap((project) => project.tags))
  );

  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);
  const [animatedValues, setAnimatedValues] = useState({
    projects: 0,
    technologies: 0,
    clients: 0,
    awards: 0,
  });

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    // Animate stats when component mounts
    const timer = setTimeout(() => {
      setAnimatedValues({
        projects: portfolioProjects.length,
        technologies: allTags.length,
        clients: 20,
        awards: 5,
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredProjects = selectedTag
    ? portfolioProjects.filter((project) => project.tags.includes(selectedTag))
    : portfolioProjects;

  const stats = [
    { icon: Code2, label: "Projects", value: animatedValues.projects },
    { icon: Star, label: "Technologies", value: animatedValues.technologies },
    { icon: Users, label: "Clients", value: `${animatedValues.clients}+` },
    { icon: Award, label: "Awards", value: `${animatedValues.awards}+` },
  ];

  const skills = [
    { name: "Frontend Development", level: 90 },
    { name: "UI/UX Design", level: 85 },
    { name: "Backend Development", level: 80 },
    { name: "DevOps & Cloud", level: 75 },
  ];

  const timeline = [
    {
      year: "2023",
      title: "Senior Developer",
      company: "Tech Innovations Inc.",
      description: "Leading frontend development team and architecting scalable solutions."
    },
    {
      year: "2021",
      title: "Full Stack Developer",
      company: "Digital Solutions Ltd.",
      description: "Developed and maintained enterprise web applications."
    },
    {
      year: "2019",
      title: "UI/UX Designer",
      company: "Creative Agency",
      description: "Designed user interfaces for various client projects."
    },
  ];

  return (
    <div className="space-y-16">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary/30 transform origin-left z-50"
        style={{ scaleX }}
      />

      {/* Hero Section */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="inline-block p-2.5 rounded-full bg-primary/10 text-primary mb-4"
        >
          <Code2 className="w-6 h-6" />
        </motion.div>
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
          My Portfolio ✨
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Crafting digital experiences with creativity and precision.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(({ icon: Icon, label, value }) => (
          <motion.div
            key={label}
            whileHover={{ scale: 1.05 }}
            className="relative overflow-hidden rounded-lg border bg-card p-4"
          >
            <div className="flex flex-col items-center text-center gap-2">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              >
                <Icon className="h-6 w-6 text-primary" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-primary"
              >
                {value}
              </motion.div>
              <div className="text-sm text-muted-foreground">{label}</div>
            </div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-primary opacity-20" />
          </motion.div>
        ))}
      </div>

      {/* Skills Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="space-y-8"
      >
        <h2 className="text-2xl font-bold text-center">Skills & Expertise</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {skills.map((skill) => (
            <motion.div 
              key={skill.name} 
              className="space-y-2"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{skill.name}</span>
                <span className="text-primary">{skill.level}%</span>
              </div>
              <Progress value={skill.level} className="h-2" />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Timeline Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="space-y-8"
      >
        <h2 className="text-2xl font-bold text-center">Experience</h2>
        <div className="space-y-6">
          {timeline.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              className="flex gap-4 relative"
            >
              <div className="w-24 flex-shrink-0 text-primary font-bold">{item.year}</div>
              <div className="flex-grow space-y-1 pb-8 border-l border-primary/20 pl-6">
                <div className="absolute left-0 w-3 h-3 rounded-full bg-primary mt-1.5" />
                <h3 className="font-bold">{item.title}</h3>
                <p className="text-sm text-primary">{item.company}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Tags Filter */}
      <div className="flex flex-wrap justify-center gap-2">
        <motion.div whileHover={{ scale: 1.05 }}>
          <Badge
            variant={selectedTag === null ? "default" : "outline"}
            className="cursor-pointer transition-all hover:bg-primary/20"
            onClick={() => setSelectedTag(null)}
            onMouseEnter={() => setHoveredTag(null)}
            onMouseLeave={() => setHoveredTag(null)}
          >
            All Projects
          </Badge>
        </motion.div>
        {allTags.map((tag) => (
          <motion.div key={tag} whileHover={{ scale: 1.05 }}>
            <Badge
              variant={selectedTag === tag ? "default" : "outline"}
              className="cursor-pointer transition-all hover:bg-primary/20"
              onClick={() => setSelectedTag(tag)}
              onMouseEnter={() => setHoveredTag(tag)}
              onMouseLeave={() => setHoveredTag(null)}
            >
              {tag}
            </Badge>
          </motion.div>
        ))}
      </div>

      {/* Projects Grid */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredProjects.map((project) => (
          <motion.div
            key={project.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-muted-foreground">No projects found with the selected tag.</p>
        </motion.div>
      )}

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-center border-t pt-12"
      >
        <p className="text-lg text-muted-foreground mb-4">
          Interested in working together? Let's build something amazing! ✨
        </p>
        <a
          href="/about"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
        >
          Get in touch <ExternalLink className="w-4 h-4" />
        </a>
      </motion.div>
    </div>
  );
};

export default Portfolio;