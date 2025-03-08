import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import type { PortfolioProject } from "@shared/schema";
import { motion } from "framer-motion";

interface ProjectCardProps {
  project: PortfolioProject;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <Card className="overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-48 group">
        <img
          src={project.imageUrl}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <CardHeader className="space-y-1">
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <motion.div
              key={tag}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {tag}
              </Badge>
            </motion.div>
          ))}
        </div>
        <motion.h3 
          className="font-bold text-xl"
          whileHover={{ x: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {project.title}
        </motion.h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground line-clamp-2">
          {project.description}
        </p>
        <div className="flex gap-4">
          {project.githubUrl && (
            <Button variant="outline" size="sm" asChild>
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 group"
              >
                <FaGithub className="h-4 w-4 transition-transform group-hover:rotate-12" />
                <span>GitHub</span>
              </a>
            </Button>
          )}
          {project.liveUrl && (
            <Button variant="outline" size="sm" asChild>
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 group"
              >
                <FaExternalLinkAlt className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                <span>Live Demo</span>
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;