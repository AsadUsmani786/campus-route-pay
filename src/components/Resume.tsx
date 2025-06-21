
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, MapPin, Globe, Github, Linkedin } from "lucide-react";

interface ContactInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  github?: string;
  linkedin?: string;
}

interface Experience {
  company: string;
  position: string;
  duration: string;
  location: string;
  responsibilities: string[];
}

interface Education {
  institution: string;
  degree: string;
  duration: string;
  location: string;
  gpa?: string;
}

interface Project {
  name: string;
  technologies: string[];
  description: string;
  features: string[];
  link?: string;
}

interface ResumeData {
  contact: ContactInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: {
    technical: string[];
    tools: string[];
    databases: string[];
  };
}

const Resume = () => {
  // Sample resume data - replace with your actual information
  const resumeData: ResumeData = {
    contact: {
      name: "John Doe",
      title: "Full Stack Developer",
      email: "john.doe@email.com",
      phone: "+1 (555) 123-4567",
      location: "New York, NY",
      website: "johndoe.dev",
      github: "github.com/johndoe",
      linkedin: "linkedin.com/in/johndoe"
    },
    summary: "Passionate Full Stack Developer with 3+ years of experience building modern web applications using React, TypeScript, and Node.js. Experienced in creating scalable solutions with clean, maintainable code and strong focus on user experience.",
    experience: [
      {
        company: "Tech Solutions Inc.",
        position: "Frontend Developer",
        duration: "Jan 2022 - Present",
        location: "New York, NY",
        responsibilities: [
          "Developed responsive web applications using React, TypeScript, and Tailwind CSS",
          "Implemented user authentication and authorization systems using Supabase",
          "Collaborated with UI/UX designers to create intuitive user interfaces",
          "Optimized application performance resulting in 40% faster load times"
        ]
      },
      {
        company: "StartupXYZ",
        position: "Junior Web Developer",
        duration: "Jun 2021 - Dec 2021",
        location: "San Francisco, CA",
        responsibilities: [
          "Built RESTful APIs using Node.js and Express.js",
          "Maintained and updated legacy codebases",
          "Participated in code reviews and agile development processes"
        ]
      }
    ],
    education: [
      {
        institution: "University of Technology",
        degree: "Bachelor of Science in Computer Science",
        duration: "2018 - 2022",
        location: "California, CA",
        gpa: "3.8/4.0"
      }
    ],
    projects: [
      {
        name: "RideBIT - College Transport System",
        technologies: ["React", "TypeScript", "Supabase", "Tailwind CSS", "React Router"],
        description: "A comprehensive transport management system for college students",
        features: [
          "Real-time bus tracking with interactive maps",
          "User authentication and profile management",
          "Payment processing and history tracking",
          "Responsive design for mobile and desktop"
        ],
        link: "github.com/johndoe/ridebit"
      },
      {
        name: "Task Management Dashboard",
        technologies: ["React", "Node.js", "MongoDB", "Express.js"],
        description: "Full-stack task management application with team collaboration features",
        features: [
          "Real-time collaboration using WebSockets",
          "Drag-and-drop task organization",
          "User roles and permissions system"
        ]
      }
    ],
    skills: {
      technical: [
        "JavaScript/TypeScript", "React.js", "Node.js", "HTML5/CSS3",
        "Python", "Java", "C++", "RESTful APIs", "GraphQL"
      ],
      tools: [
        "Git/GitHub", "VS Code", "Figma", "Postman", "Docker",
        "Vite", "Webpack", "ESLint", "Prettier"
      ],
      databases: [
        "PostgreSQL", "MongoDB", "MySQL", "Supabase", "Firebase"
      ]
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-background text-foreground">
      {/* Header */}
      <Card className="mb-6">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">{resumeData.contact.name}</CardTitle>
          <p className="text-xl text-muted-foreground">{resumeData.contact.title}</p>
          <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              {resumeData.contact.email}
            </div>
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              {resumeData.contact.phone}
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {resumeData.contact.location}
            </div>
            {resumeData.contact.website && (
              <div className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                {resumeData.contact.website}
              </div>
            )}
            {resumeData.contact.github && (
              <div className="flex items-center gap-1">
                <Github className="h-4 w-4" />
                {resumeData.contact.github}
              </div>
            )}
            {resumeData.contact.linkedin && (
              <div className="flex items-center gap-1">
                <Linkedin className="h-4 w-4" />
                {resumeData.contact.linkedin}
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Professional Summary */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Professional Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{resumeData.summary}</p>
        </CardContent>
      </Card>

      {/* Experience */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Professional Experience</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {resumeData.experience.map((exp, index) => (
            <div key={index}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{exp.position}</h3>
                  <p className="text-primary font-medium">{exp.company}</p>
                </div>
                <div className="text-right text-muted-foreground">
                  <p>{exp.duration}</p>
                  <p>{exp.location}</p>
                </div>
              </div>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {exp.responsibilities.map((resp, idx) => (
                  <li key={idx}>{resp}</li>
                ))}
              </ul>
              {index < resumeData.experience.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Projects */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Key Projects</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {resumeData.projects.map((project, index) => (
            <div key={index}>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{project.name}</h3>
                {project.link && (
                  <a href={project.link} className="text-primary hover:underline text-sm">
                    View Project
                  </a>
                )}
              </div>
              <p className="text-muted-foreground mb-2">{project.description}</p>
              <div className="mb-2">
                <span className="font-medium">Technologies: </span>
                <span className="text-muted-foreground">{project.technologies.join(", ")}</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {project.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
              {index < resumeData.projects.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Education */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Education</CardTitle>
        </CardHeader>
        <CardContent>
          {resumeData.education.map((edu, index) => (
            <div key={index} className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{edu.degree}</h3>
                <p className="text-primary">{edu.institution}</p>
                {edu.gpa && <p className="text-muted-foreground">GPA: {edu.gpa}</p>}
              </div>
              <div className="text-right text-muted-foreground">
                <p>{edu.duration}</p>
                <p>{edu.location}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Skills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Programming Languages & Frameworks:</h4>
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.technical.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Tools & Technologies:</h4>
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.tools.map((tool, index) => (
                <span key={index} className="px-3 py-1 bg-secondary/10 text-secondary-foreground rounded-full text-sm">
                  {tool}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Databases:</h4>
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.databases.map((db, index) => (
                <span key={index} className="px-3 py-1 bg-accent/10 text-accent-foreground rounded-full text-sm">
                  {db}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Resume;
