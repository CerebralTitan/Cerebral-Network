import { Button } from "@/components/ui/button";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const About = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Profile Section */}
      <div className="text-center space-y-4">
        <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1499557354967-2b2d8910bcca"
            alt="Profile"
            className="object-cover w-full h-full"
          />
        </div>
        <h1 className="text-3xl font-bold">John Doe</h1>
        <p className="text-muted-foreground">
          Designer & Developer
        </p>
      </div>

      {/* Bio Section */}
      <div className="prose dark:prose-invert mx-auto">
        <p>
          Hello! I'm a passionate designer and developer with over 5 years of experience
          creating digital experiences. I specialize in minimalist design, user
          interface development, and creating engaging web applications.
        </p>
        <p>
          Currently, I'm focused on exploring the intersection of design and
          technology, particularly in areas of user experience and accessibility.
          When I'm not coding or designing, you can find me writing about tech
          on my blog or contributing to open-source projects.
        </p>
      </div>

      {/* Skills Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {["UI/UX Design", "React", "TypeScript", "Node.js", "Figma", "TailwindCSS"]
            .map((skill) => (
              <div
                key={skill}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md"
              >
                {skill}
              </div>
            ))}
        </div>
      </div>

      {/* Connect Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Let's Connect</h2>
        <div className="flex gap-4">
          <Button variant="outline" asChild>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <FaGithub className="h-4 w-4" />
              GitHub
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <FaLinkedin className="h-4 w-4" />
              LinkedIn
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <FaTwitter className="h-4 w-4" />
              Twitter
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default About;
