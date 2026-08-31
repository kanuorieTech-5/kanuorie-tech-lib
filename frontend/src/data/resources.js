const resources = [
  {
    id: "1",
    title: "Tech Career Roadmap",
    desc: "A complete roadmap to becoming a modern software developer.",
    category: "General",
    img: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    link: "https://roadmap.sh/",
  },
  {
    id: "2",
    title: "Git & GitHub Basics",
    desc: "Learn version control and collaboration using Git and GitHub.",
    category: "General",
    img: "https://cdn-icons-png.flaticon.com/512/2111/2111288.png",
    link: "https://docs.github.com/en/get-started",
  },
  {
    id: "3",
    title: "Problem Solving for Developers",
    desc: "Improve logical thinking and coding interview skills.",
    category: "General",
    img: "https://cdn-icons-png.flaticon.com/512/2721/2721296.png",
    link: "https://leetcode.com/",
  },
  {
    id: "4",
    title: "Developer Productivity Tools",
    desc: "Tools that boost productivity for modern developers.",
    category: "General",
    img: "https://cdn-icons-png.flaticon.com/512/2920/2920277.png",
    link: "https://code.visualstudio.com/",
  },

  /* ----------- FRONTEND ----------- */

  {
    id: "5",
    title: "HTML Basics",
    desc: "Learn the structure of web pages with HTML.",
    category: "Frontend",
    img: "https://cdn-icons-png.flaticon.com/512/732/732212.png",
    link: "https://developer.mozilla.org/en-US/docs/Web/HTML",
  },
  {
    id: "6",
    title: "CSS Fundamentals",
    desc: "Style your web pages with CSS.",
    category: "Frontend",
    img: "https://cdn-icons-png.flaticon.com/512/732/732190.png",
    link: "https://developer.mozilla.org/en-US/docs/Web/CSS",
  },
  {
    id: "7",
    title: "JavaScript Essentials",
    desc: "Learn JavaScript fundamentals for web development.",
    category: "Frontend",
    img: "https://cdn-icons-png.flaticon.com/512/5968/5968292.png",
    link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
  },
  {
    id: "8",
    title: "React Documentation",
    desc: "Official React documentation and guides.",
    category: "Frontend",
    img: "https://cdn-icons-png.flaticon.com/512/1126/1126012.png",
    link: "https://react.dev/",
  },

  /* ----------- BACKEND ----------- */

  {
    id: "9",
    title: "Node.js Guide",
    desc: "Backend development using Node.js.",
    category: "Backend",
    img: "https://cdn-icons-png.flaticon.com/512/919/919825.png",
    link: "https://nodejs.org/en/docs/",
  },
  {
    id: "10",
    title: "Express.js Tutorial",
    desc: "Build APIs and servers with Express.js.",
    category: "Backend",
    img: "https://cdn-icons-png.flaticon.com/512/919/919836.png",
    link: "https://expressjs.com/",
  },

  /* ----------- DEVOPS ----------- */

  {
    id: "11",
    title: "Docker Tutorial",
    desc: "Learn containerization with Docker.",
    category: "DevOps",
    img: "https://cdn-icons-png.flaticon.com/512/919/919853.png",
    link: "https://docs.docker.com/",
  },
  {
    id: "12",
    title: "Kubernetes Basics",
    desc: "Learn container orchestration with Kubernetes.",
    category: "DevOps",
    img: "https://cdn-icons-png.flaticon.com/512/919/919830.png",
    link: "https://kubernetes.io/docs/home/",
  },

  /* ----------- DATA SCIENCE ----------- */

  {
    id: "13",
    title: "Python for Data Science",
    desc: "Python fundamentals for data analysis.",
    category: "Data Science",
    img: "https://cdn-icons-png.flaticon.com/512/5968/5968350.png",
    link: "https://docs.python.org/3/",
  },

  /* ----------- DESIGN ----------- */

  {
    id: "14",
    title: "UI Design Fundamentals",
    desc: "Learn principles of modern UI design.",
    category: "Design",
    img: "https://cdn-icons-png.flaticon.com/512/5968/5968705.png",
    link: "https://www.figma.com/resources/learn-design/",
  },

  /* ----------- SECURITY ----------- */

  {
    id: "15",
    title: "OWASP Top 10",
    desc: "Top 10 web application security risks.",
    category: "Security",
    img: "https://cdn-icons-png.flaticon.com/512/565/565547.png",
    link: "https://owasp.org/www-project-top-ten/",
  },

  {
    id: "16",
    title: "React Basics",
    desc: "Learn the fundamentals of React.js for building user interfaces.",
    category: "Frontend",
    img: "https://cdn-icons-png.flaticon.com/512/1126/1126012.png",
    link: "https://react.dev/learn",
  },
  {
    id: "17",
    title: "JavaScript Fundamentals",
    desc: "Master the basics of JavaScript programming.",
    category: "Frontend",
    img: "https://cdn-icons-png.flaticon.com/512/5968/5968292.png",
    link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
  },
  {
    id: "18",
    title: "CSS Flexbox & Grid",
    desc: "Learn to create responsive layouts with CSS Flexbox and Grid.",
    category: "Frontend",
    img: "https://cdn-icons-png.flaticon.com/512/732/732190.png",
    link: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/",
  },
  {
    id: "19",
    title: "Tailwind CSS",
    desc: "Learn to build modern UIs with Tailwind CSS.",
    category: "Frontend",
    img: "https://cdn-icons-png.flaticon.com/512/732/732190.png",
    link: "https://tailwindcss.com/docs",
  },
  {
    id: "20",
    title: "TypeScript Basics",
    desc: "Learn the basics of TypeScript for building large-scale applications.",
    category: "Frontend",
    image:
      "https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&w=800&q=60",
    link: "https://www.typescriptlang.org/docs/",
  },
  {
    id: "21",
    title: "Next.js Guide",
    desc: "Learn to build server-side rendered applications with Next.js.",
    category: "Frontend",
    image:
      "https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=800&q=60",
    link: "https://nextjs.org/docs",
  },
  {
    id: "22",
    title: "Node.js Beginner Guide",
    desc: "Learn the fundamentals of Node.js for backend development.",
    category: "Backend",
    img: "https://cdn-icons-png.flaticon.com/512/919/919825.png",
    link: "https://nodejs.org/en/docs/guides/",
  },
  {
    id: "23",
    title: "Express.js API Development",
    desc: "Learn to build RESTful APIs with Express.js.",
    category: "Backend",
    img: "https://cdn-icons-png.flaticon.com/512/919/919836.png",
    link: "https://expressjs.com/",
  },
  {
    id: "24",
    title: "REST API Design",
    desc: "Learn the principles of designing RESTful APIs.",
    category: "Backend",
    image:
      "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=800&q=60",
    link: "https://restfulapi.net/",
  },
  {
    id: "25",
    title: "JWT Authentication",
    desc: "Learn to implement JWT-based authentication.",
    category: "Backend",
    image:
      "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=800&q=60",
    link: "https://jwt.io/introduction",
  },
  {
    id: "26",
    title: "MongoDB Basics",
    desc: "Learn the fundamentals of MongoDB for NoSQL database management.",
    category: "Database",
    image:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=60",
    link: "https://www.mongodb.com/docs/",
  },
  {
    id: "27",
    title: "SQL for Beginners",
    desc: "Learn the basics of SQL for database management.",
    category: "Database",
    img: "https://cdn-icons-png.flaticon.com/512/919/919836.png",
    link: "https://www.w3schools.com/sql/",
  },
  {
    id: "28",
    title: "PostgreSQL Guide",
    desc: "Learn to use PostgreSQL for database management.",
    category: "Database",
    img: "https://cdn-icons-png.flaticon.com/512/919/919836.png",
    link: "https://www.postgresql.org/docs/",
  },
  {
    id: "29",
    title: "Git & GitHub",
    desc: "Learn to use Git and GitHub for version control.",
    category: "Tools",
    img: "https://cdn-icons-png.flaticon.com/512/2111/2111288.png",
    link: "https://git-scm.com/docs",
  },
  {
    id: "30",
    title: "VS Code Tips",
    desc: "Learn productivity tips for VS Code.",
    category: "Tools",
    image:
      "https://images.unsplash.com/photo-1581276879432-15a3d2f0e3e9?auto=format&fit=crop&w=800&q=60",
    link: "https://code.visualstudio.com/docs",
  },
  {
    id: "31",
    title: "Linux Command Line",
    desc: "Learn the Linux command line for system administration.",
    category: "Tools",
    image:
      "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=800&q=60",
    link: "https://linuxcommand.org/",
  },
  {
    id: "32",
    title: "Docker Basics",
    desc: "Learn the basics of Docker for containerization.",
    category: "DevOps",
    image:
      "https://images.unsplash.com/photo-1605902711622-cfb43c44367f?auto=format&fit=crop&w=800&q=60",
    link: "https://docs.docker.com/get-started/",
  },
  {
    id: "33",
    title: "Kubernetes Intro",
    desc: "Learn the basics of Kubernetes for container orchestration.",
    category: "DevOps",
    image:
      "https://images.unsplash.com/photo-1581093588401-22c4c7d2e7d1?auto=format&fit=crop&w=800&q=60",
    link: "https://kubernetes.io/docs/tutorials/",
  },
  {
    id: "34",
    title: "AWS Fundamentals",
    desc: "Learn the fundamentals of AWS cloud services.",
    category: "DevOps",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=60",
    link: "https://aws.amazon.com/getting-started/",
  },
  {
    id: "35",
    title: "System Design Basics",
    desc: "Learn the basics of system design.",
    category: "Architecture",
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=60",
    link: "https://github.com/donnemartin/system-design-primer",
  },
  {
    id: "36",
    title: "Prisma ORM Guide",
    desc: "Learn to use Prisma ORM for database access.",
    category: "Backend",
    image:
      "https://images.unsplash.com/photo-1551986782-d244d7d1d115?w=400&h=300&fit=crop",
    link: "https://www.prisma.io/docs",
  },
  {
    id: "37",
    title: "Firebase Authentication",
    desc: "Learn to implement Firebase authentication.",
    category: "Backend",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd94c3e678a?w=400&h=300&fit=crop",
    link: "https://firebase.google.com/docs/auth",
  },
  {
    id: "38",
    title: "PostgreSQL Deep Dive",
    desc: "Learn the advanced features of PostgreSQL.",
    category: "Database",
    img: "https://cdn-icons-png.flaticon.com/512/919/919836.png",
    link: "https://www.postgresql.org/docs/",
  },
  {
    id: "39",
    title: "Redis Caching Basics",
    desc: "Learn the basics of Redis for caching.",
    category: "Database",
    image:
      "https://images.unsplash.com/photo-1516321334411-a8da9dfc82d7?w=400&h=300&fit=crop",
    link: "https://redis.io/docs/",
  },
  {
    id: "40",
    title: "Linux Command Line",
    desc: "Learn the Linux command line for system administration.",
    category: "Tools",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop",
    link: "https://linuxcommand.org/",
  },
  {
    id: "41",
    title: "VS Code Productivity Tips",
    desc: "Learn productivity tips for VS Code.",
    category: "Tools",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop",
    link: "https://code.visualstudio.com/docs/getstarted/tips-and-tricks",
  },
  {
    id: "42",
    title: "NPM & Yarn Guide",
    desc: "Learn to use NPM and Yarn for package management.",
    category: "Tools",
    image:
      "https://images.unsplash.com/photo-1618356261227-dc4c36b86e64?w=400&h=300&fit=crop",
    link: "https://docs.npmjs.com/",
  },
  {
    id: "43",
    title: "Kubernetes Basics",
    desc: "Learn the basics of Kubernetes for container orchestration.",
    category: "DevOps",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop",
    link: "https://kubernetes.io/docs/tutorials/",
  },
  {
    id: "44",
    title: "AWS Cloud Fundamentals",
    desc: "Learn the fundamentals of AWS cloud services.",
    category: "DevOps",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop",
    link: "https://aws.amazon.com/getting-started/",
  },
  {
    id: "45",
    title: "NGINX Web Server",
    desc: "Learn to use NGINX as a web server and reverse proxy.",
    category: "DevOps",
    image:
      "https://images.unsplash.com/photo-1557821552-17105176677c?w=400&h=300&fit=crop",
    link: "https://nginx.org/en/docs/",
  },
  {
    id: "46",
    title: "Microservices Architecture",
    desc: "Learn about microservices architecture and design principles.",
    category: "Architecture",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
    link: "https://microservices.io/",
  },
  {
    id: "47",
    title: "Design Patterns in JS",
    desc: "Learn design patterns in JavaScript.",
    category: "Architecture",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop",
    link: "https://refactoring.guru/design-patterns/javascript",
  },
  {
    id: "48",
    title: "Clean Code Principles",
    desc: "Learn principles of writing clean code.",
    category: "Architecture",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop",
    link: "https://github.com/ryanmcdermott/clean-code-javascript",
  },
  {
    id: "49",
    title: "Testing with Jest",
    desc: "Learn to use Jest for testing JavaScript applications.",
    category: "Testing",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
    link: "https://jestjs.io/docs/getting-started",
  },
  {
    id: "50",
    title: "End-to-End Testing with Cypress",
    desc: "Learn to use Cypress for end-to-end testing.",
    category: "Testing",
    image:
      "https://images.unsplash.com/photo-1551986782-d244d7d1d115?w=400&h=300&fit=crop",
    link: "https://docs.cypress.io/",
  },
  {
    id: "51",
    title: "Test-Driven Development",
    desc: "Learn the principles of test-driven development (TDD).",
    category: "Testing",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
    link: "https://www.agilealliance.org/glossary/tdd/",
  },
  {
    id: "52",
    title: "Performance Optimization",
    desc: "Learn techniques for optimizing web application performance.",
    category: "Performance",
    image:
      "https://images.unsplash.com/photo-1551986782-d244d7d1d115?w=400&h=300&fit=crop",
    link: "https://web.dev/performance/",
  },
  {
    id: "53",
    title: "Web Accessibility",
    desc: "Learn to make web applications accessible to all users.",
    category: "Accessibility",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
    link: "https://www.w3.org/WAI/fundamentals/accessibility-intro/",
  },
  {
    id: "54",
    title: "Internationalization (i18n)",
    desc: "Learn to internationalize web applications for global audiences.",
    category: "Localization",
    image:
      "https://images.unsplash.com/photo-1551986782-d244d7d1d115?w=400&h=300&fit=crop",
    link: "https://www.i18next.com/",
  },
  {
    id: "55",
    title: "GraphQL Basics",
    desc: "Learn the basics of GraphQL for API development.",
    category: "Backend",
    image:
      "https://images.unsplash.com/photo-1551986782-d244d7d1d115?w=400&h=300&fit=crop",
    link: "https://graphql.org/learn/",
  },
  {
    id: "56",
    title: "Serverless Architecture",
    desc: "Learn about serverless architecture and how to build serverless applications.",
    category: "Architecture",
    image:
      "https://images.unsplash.com/photo-1551986782-d244d7d1d115?w=400&h=300&fit=crop",
    link: "https://aws.amazon.com/serverless/",
  },
  {
    id: "57",
    title: "Progressive Web Apps (PWA)",
    desc: "Learn to build progressive web apps for a native-like experience.",
    category: "Frontend",
    image:
      "https://images.unsplash.com/photo-1551986782-d244d7d1d115?w=400&h=300&fit=crop",
    link: "https://web.dev/progressive-web-apps/",
  },
  {
    id: "58",
    title: "WebAssembly Introduction",
    desc: "Learn about WebAssembly and how to use it in web applications.",
    category: "Frontend",
    image:
      "https://images.unsplash.com/photo-1551986782-d244d7d1d115?w=400&h=300&fit=crop",
    link: "https://webassembly.org/docs/",
  },
  {
    id: "59",
    title: "AI in Web Development",
    desc: "Learn how to integrate AI technologies into web applications.",
    category: "AI",
    image:
      "https://images.unsplash.com/photo-1551986782-d244d7d1d115?w=400&h=300&fit=crop",
    link: "https://www.tensorflow.org/js",
  },
  {
    id: "60",
    title: "Blockchain Development",
    desc: "Learn the basics of blockchain development and smart contracts.",
    category: "Blockchain",
    image:
      "https://images.unsplash.com/photo-1551986782-d244d7d1d115?w=400&h=300&fit=crop",
    link: "https://ethereum.org/en/developers/",
  },
  {
    id: "61",
    title: "Mobile App Development with React Native",
    desc: "Learn to build mobile applications using React Native.",
    category: "Mobile",
    image:
      "https://images.unsplash.com/photo-1551986782-d244d7d1d115?w=400&h=300&fit=crop",
    link: "https://reactnative.dev/docs/getting-started",
  },
  {
    id: "62",
    title: "Flutter for Web",
    desc: "Learn to build web applications using Flutter.",
    category: "Frontend",
    image:
      "https://images.unsplash.com/photo-1551986782-d244d7d1d115?w=400&h=300&fit=crop",
    link: "https://flutter.dev/web",
  },
  {
    id: "63",
    title: "Data Visualization with D3.js",
    desc: "Learn to create interactive data visualizations with D3.js.",
    category: "Data science",
    image:
      "https://images.unsplash.com/photo-1551986782-d244d7d1d115?w=400&h=300&fit=crop",
    link: "https://d3js.org/",
  },
  {
    id: "64",
    title: "Web Security Best Practices",
    desc: "Learn best practices for securing web applications.",
    category: "Security",
    image:
      "https://images.unsplash.com/photo-1551986782-d244d7d1d115?w=400&h=300&fit=crop",
    link: "https://owasp.org/www-project-top-ten/",
  },
  {
    id: "65",
    title: "CI/CD with Jenkins",
    desc: "Learn about continuous integration and deployment with Jenkins.",
    category: "DevOps",
    image:
      "https://images.unsplash.com/photo-1551986782-d244d7d1d115?w=400&h=300&fit=crop",
    link: "https://www.jenkins.io/",
  },
  {
    id: "66",
    title: "Infrastructure as Code with Terraform",
    desc: "Learn to manage infrastructure using Terraform.",
    category: "DevOps",
    image:
      "https://images.unsplash.com/photo-1551986782-d244d7d1d115?w=400&h=300&fit=crop",
    link: "https://www.terraform.io/docs/",
  },
  {
    id: "67",
    title: "Monitoring with Prometheus",
    desc: "Learn to monitor applications and infrastructure with Prometheus.",
    category: "DevOps",
    image:
      "https://images.unsplash.com/photo-1551986782-d244d7d1d115?w=400&h=300&fit=crop",
    link: "https://prometheus.io/docs/introduction/overview/",
  },
  {
    id: "68",
    title: "Log Management with ELK Stack",
    desc: "Learn to manage and analyze logs with the ELK stack.",
    category: "DevOps",
    image:
      "https://images.unsplash.com/photo-1551986782-d244d7d1d115?w=400&h=300&fit=crop",
    link: "https://www.elastic.co/what-is/elk-stack",
  },
  {
    id: "69",
    title: "Serverless Framework",
    desc: "Learn to build serverless applications with the Serverless Framework.",
    category: "DevOps",
    image:
      "https://images.unsplash.com/photo-1551986782-d244d7d1d115?w=400&h=300&fit=crop",
    link: "https://www.serverless.com/framework/docs/",
  },
  {
    id: "70",
    title: "AWS Lambda Guide",
    desc: "Learn to build serverless applications with AWS Lambda.",
    category: "DevOps",
    image:
      "https://images.unsplash.com/photo-1551986782-d244d7d1d115?w=400&h=300&fit=crop",
    link: "https://aws.amazon.com/lambda/getting-started/",
  },
  {
    id: "71",
    title: "Azure Functions",
    desc: "Learn to build serverless applications with Azure Functions.",
    category: "DevOps",
    image:
      "https://images.unsplash.com/photo-1551986782-d244d7d1d115?w=400&h=300&fit=crop",
    link: "https://docs.microsoft.com/en-us/azure/azure-functions/functions-overview",
  },
  {
    id: "72",
    title: "Google Cloud Functions",
    desc: "Learn to build serverless applications with Google Cloud Functions.",
    category: "DevOps",
    image:
      "https://images.unsplash.com/photo-1551986782-d244d7d1d115?w=400&h=300&fit=crop",
    link: "https://cloud.google.com/functions/docs.png",
  },
  {
    id: "73",
    title: "Serverless Security Best Practices",
    desc: "Learn best practices for securing serverless applications.",
    category: "Security",
    image:
      "https://images.unsplash.com/photo-1551986782-d244d7d1d115?w=400&h=300&fit=crop",
    link: "https://owasp.org/www-project-top-ten/",
  },
  {
    id: "74",
    title: "Serverless Performance Optimization",
    desc: "Learn techniques for optimizing the performance of serverless applications.",
    category: "DevOps",
    image:
      "https://images.unsplash.com/photo-1551986782-d244d7d1d115?w=400&h=300&fit=crop",
    link: "https://aws.amazon.com/lambda/getting-started/",
  },
  {
    id: "75",
    title: "Serverless Architecture Patterns",
    desc: "Learn common architecture patterns for serverless applications.",
    category: "DevOps",
    image:
      "https://images.unsplash.com/photo-1551986782-d244d7d1d115?w=400&h=300&fit=crop",
    link: "https://aws.amazon.com/lambda/getting-started/",
  },
];
export default resources;
