import { InlineCode, LetterFx } from "@/once-ui/components";

const person = {
  firstName: "Mr Sharafdin",
  lastName: "",
  get name() {
    return `${this.firstName} ${this.lastName}`;
  },
  role: (
    <>
      {" "}
      <span
        style={{
          fontFamily: "var(--font-family-code)",
        }}
      >
        <LetterFx
          speed="medium"
          trigger="instant"
          charset={[
            "X",
            "@",
            "$",
            "a",
            "H",
            "z",
            "o",
            "0",
            "y",
            "#",
            "?",
            "*",
            "0",
            "1",
            "+",
          ]}
        >
          Open Source Advocate
        </LetterFx>
      </span>
    </>
  ),
  avatar: "https://avatars.githubusercontent.com/u/83120892?v=4",
  location: "Africa/Mogadishu", // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
  languages: ["English", "Somali"], // optional: Leave the array empty if you don't want to display languages
};

const bottomCardContent = {
  display: true,
  title: <>Pushing Boundaries with Innovation</>,
  description: (
    <>
      Committed to open-source innovation, self-taught discovery, and crafting
      tools that empower future technologists.
    </>
  ),
};

const social = [
  // Links are automatically displayed.
  // Import new icons in /once-ui/icons.ts
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/sharafdin",
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/sharafdin",
  },
  {
    name: "X",
    icon: "x",
    link: "https://x.com/isasharafdin",
  },
  {
    name: "Email",
    icon: "email",
    link: "mailto:example@gmail.com",
  },
];

const home = {
  label: "Home",
  title: `${person.name}`,
  description: `An open-source advocate passionate about creating projects that empower developers and simplify complex problems`,
  headline: <>Yow, I'm Sharafdin &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</>,
  subline: (
    <>
      An open-source advocate passionate about creating projects that empower
      developers and simplify complex problems.
    </>
  ),
};

const about = {
  label: "About",
  title: "About",
  description: `Meet ${person.name}, ${person.role} from ${person.location}`,
  tableOfContent: {
    display: false,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: false,
    link: "https://cal.com",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        <p>
          Mr Sharafdin transcends traditional roles, defining himself as a
          self-taught savant in the vast fields of science and technology.
          Rejecting formal titles and academia, he has charted a unique course
          of independent study fueled by unending curiosity and a deep passion
          for discovery.
        </p>
        <p>
          His significant contributions to open-source software, available on{" "}
          <a href="https://github.com/sharafdin" target="_blank">
            <InlineCode>GitHub</InlineCode>
          </a>
          , mirror his technical prowess and belief in collaborative,
          open-access knowledge. This approach exemplifies his mastery of
          complex technologies outside conventional education.
        </p>
        <p>
          Mr Sharafdin's writings on the{" "}
          <a href="https://culuumta.com/" target="_blank">
            <InlineCode>Culuumta</InlineCode>
          </a>{" "}
          website showcase his enthusiasm for science, breaking down intricate
          topics to inspire and educate a diverse audience. His self-guided
          exploration in <InlineCode>astrophysics</InlineCode>,{" "}
          <InlineCode>gemology</InlineCode>, and the core sciences underscores
          his commitment to lifelong learning and sharing.
        </p>
        <p>
          In <InlineCode>data science</InlineCode> and{" "}
          <InlineCode>machine learning</InlineCode>, he applies his autodidactic
          expertise to develop innovative solutions, aiming to empower
          organizations with tools for insightful decision-making. Mr
          Sharafdin's work embodies his vision of leveraging technology to solve
          real challenges.
        </p>
        <p>
          As a mentor, he is dedicated to fostering growth and enlightenment
          beyond the classroom, proving that <InlineCode>self-study</InlineCode>{" "}
          can lead to remarkable achievements. Mr Sharafdin advocates for{" "}
          <InlineCode>knowledge sharing</InlineCode> and{" "}
          <InlineCode>mentorship</InlineCode> as pillars of personal and
          professional development.
        </p>
        <h2>Core Contributions</h2>
        <ul>
          <li>
            <strong>Open Source Software</strong>: Spearheads OSS initiatives,
            sharing projects openly on{" "}
            <a href="https://github.com/sharafdin" target="_blank">
              <InlineCode>GitHub</InlineCode>
            </a>
            . His projects serve as benchmarks for innovation and collaboration
            in the tech community. Some notable projects include:
            <ul>
              <li>
                <a href="https://github.com/sharafdin/yonode" target="_blank">
                  <InlineCode>Yonode</InlineCode>
                </a>
                : An Open-Source Node.js Toolkit for Rapid Development.
              </li>
              <li>
                <a href="https://github.com/sharafdin/yocode" target="_blank">
                  <InlineCode>Yocode</InlineCode>
                </a>
                : A powerful tool that simplifies building{" "}
                <InlineCode>VS Code extensions</InlineCode>, providing a
                generator to quickly create views, commands, and other
                components essential for extension development.
              </li>
              <li>
                <a
                  href="https://github.com/sharafdin/markdown-master"
                  target="_blank"
                >
                  <InlineCode>Markdown Master</InlineCode>
                </a>
                : A <InlineCode>Markdown</InlineCode> extension for enhanced
                editing with an intuitive interface and instant previews.
              </li>
              <li>
                Explore more projects on{" "}
                <a href="https://github.com/sharafdin" target="_blank">
                  <InlineCode>GitHub</InlineCode>
                </a>
                .
              </li>
            </ul>
          </li>
          <li>
            <strong>Autodidactic Writing</strong>: Enriches the scientific
            community with accessible, engaging articles and books.
          </li>
          <li>
            <strong>Exploration of Science</strong>: Pursues passions in{" "}
            <InlineCode>physics</InlineCode>, <InlineCode>chemistry</InlineCode>
            , <InlineCode>biology</InlineCode>,{" "}
            <InlineCode>astrophysics</InlineCode>, and{" "}
            <InlineCode>gemology</InlineCode> through self-study.
          </li>
          <li>
            <strong>Data Science Innovation</strong>: Creates cutting-edge
            solutions in <InlineCode>data science</InlineCode> and{" "}
            <InlineCode>machine learning</InlineCode> with self-taught skills.
          </li>
          <li>
            <strong>Mentorship</strong>: Champions{" "}
            <InlineCode>mentorship</InlineCode> and{" "}
            <InlineCode>knowledge sharing</InlineCode>, emphasizing the value of
            independent learning paths.
          </li>
        </ul>
        <p>
          Mr Sharafdin's journey underscores the power of{" "}
          <InlineCode>self-education</InlineCode> in driving scientific and
          technological progress. His approach to learning and innovation serves
          as a testament to the impact of pursuing knowledge passionately and
          independently.
        </p>
      </>
    ),
  },
  work: {
    display: false, // set to false to hide this section
    title: "Work Experience",
    experiences: [
      {
        company: "Dugsiiye",
        timeframe: "Mar 2023 - Present",
        role: "Mentorship Director",
        achievements: [
          <>
            Redesigned the UI/UX for the FLY platform, resulting in a 20%
            increase in user engagement and 30% faster load times.
          </>,
          <>
            Spearheaded the integration of AI tools into design workflows,
            enabling designers to iterate 50% faster.
          </>,
        ],
        images: [
          // optional: leave the array empty if you don't want to display images
        ],
      },
      {
        company: "Self-Employed",
        timeframe: "2021 - Present",
        role: "Open Source Developer",
        achievements: [
          <>
            Developed a design system that unified the brand across multiple
            platforms, improving design consistency by 40%.
          </>,
          <>
            Led a cross-functional team to launch a new product line,
            contributing to a 15% increase in overall company revenue.
          </>,
        ],
        images: [],
      },
      {
        company: "Freelance",
        timeframe: "Apr 2021 - Present",
        role: "Software Engineer",
        achievements: [
          <>
            Developed a design system that unified the brand across multiple
            platforms, improving design consistency by 40%.
          </>,
          <>
            Led a cross-functional team to launch a new product line,
            contributing to a 15% increase in overall company revenue.
          </>,
        ],
        images: [],
      },
    ],
  },
  studies: {
    display: false, // set to false to hide this section
    title: "Studies",
    institutions: [],
  },
  technical: {
    display: false, // set to false to hide this section
    title: "Technical skills",
    skills: [],
  },
};

const blog = {
  label: "Blog",
  title: "Writing something... 🖋️",
  description: `Read what ${person.name} has been up to recently`,
  // Create new blog posts by adding a new .mdx file to app/blog/posts
  // All posts will be listed on the /blog route
};

const work = {
  label: "Projects",
  title: "My projects",
  description: `Design and dev projects by ${person.name}`,
  // Create new project pages by adding a new .mdx file to app/blog/posts
  // All projects will be listed on the /home and /work routes
};

const gallery = {
  label: "Gallery",
  title: "My photo gallery",
  description: `A photo collection by ${person.name}`,
  // Images from https://pexels.com
  images: [
    {
      src: "/images/gallery/img-01.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/img-02.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/Snapchat-1708308149.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/img-04.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-05.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-06.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/img-07.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-08.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/img-09.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-10.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-11.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/img-12.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-13.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-14.jpg",
      alt: "image",
      orientation: "horizontal",
    },
  ],
};

export { person, social, bottomCardContent, home, about, blog, work, gallery };
