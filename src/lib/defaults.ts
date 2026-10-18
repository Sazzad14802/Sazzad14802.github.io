import type { SiteContent } from './types'

/* The starting content. The live site uses whatever is saved in Supabase;
   this is only shown before the first save, or if Supabase can't be reached. */

export const defaultContent: SiteContent = {
  version: 1,
  seo: {
    title: 'Sazzad Ahmed — CSE @ KUET',
    description:
      'Portfolio of Sazzad Ahmed — CSE student at KUET, Codeforces Specialist and full-stack developer.',
  },
  profile: {
    name: 'Sazzad Ahmed',
    logo: 'sazzad',
    initials: 'SA',
    role: 'CSE undergrad @ KUET',
    headline:
      'Third-year Computer Science student, competitive programmer and relentless builder. I turn tricky problems into clean systems — from Laravel platforms to Android apps — and I’m **always chasing the next thing to learn**.',
    availability: 'Open to internships & collaborations',
    typedRoles: [
      'build full-stack apps',
      'solve hard problems',
      'write clean code',
      'develop Android apps',
      'compete in IUPC',
    ],
    keywords: [
      'problem solving',
      'algorithms',
      'data structures',
      'web dev',
      'databases',
      'android',
      'clean code',
      'always learning',
    ],
    highlights: ['Codeforces Specialist', '1200+ problems solved', 'IUPC finalist'],
    stats: [
      { value: '1200+', label: 'Problems solved' },
      { value: '1420', label: 'CF peak rating' },
      { value: '5', label: 'Projects built' },
    ],
    photo: '/pfpic.webp',
    cutout: '/pfpic-cutout.webp',
    cutoutFit: 'full',
    resume: '/resume.pdf',
    handle: '@Sazzad14802',
    status: 'learning',
  },
  about: {
    paragraphs: [
      'I’m a 3rd-year Computer Science student at **KUET** with a CGPA of **3.75/4.00**, passionate about building robust software that solves real-world problems.',
      'My work spans full-stack web development with **Laravel** and **ASP.NET**, native **Android** applications, desktop tools with **JavaFX**, and database engineering with **Oracle PL/SQL**.',
      'On the competitive side, I’ve solved over **1,200 problems** and reached **Specialist** rank on Codeforces with a peak rating of **1420**.',
    ],
    facts: [
      { icon: '🏫', title: 'KUET', text: 'B.Sc. CSE · CGPA 3.75/4.00' },
      { icon: '💻', title: 'Full-Stack Dev', text: 'Laravel · ASP.NET · Android' },
      { icon: '🏆', title: 'CF Specialist', text: 'Rating 1420 · 1200+ problems' },
      { icon: '🎯', title: 'IUPC Competitor', text: 'MU IUPC · AUST IUPC 2025' },
    ],
  },
  skills: [
    { group: 'Languages', items: ['C', 'C++', 'C#', 'Java', 'Python', 'PHP', 'JavaScript'] },
    {
      group: 'Frameworks & Tech',
      items: ['Laravel', 'ASP.NET', 'REST API', 'JavaFX', 'Android SDK', 'Firebase', 'Bootstrap', 'Tailwind CSS'],
    },
    { group: 'Databases', items: ['MySQL', 'MSSQL', 'Oracle SQL', 'PL/SQL', 'SQLite'] },
    { group: 'Tools & Platforms', items: ['Git', 'GitHub', 'VS Code', 'Visual Studio', 'Linux', 'Android Studio'] },
  ],
  projects: [
    {
      title: 'Smart eClassroom & Lab Management',
      tag: 'full-stack LMS',
      icon: '📚',
      description:
        'A role-based learning management system covering classroom, attendance, assignment and assessment workflows — with secure auth, automated sessions and a scalable relational schema.',
      stack: ['Laravel', 'PHP', 'MySQL', 'Tailwind CSS'],
      features: ['Role-based access control', 'Automated session management', 'Scalable relational DB architecture'],
      link: '',
      repo: '',
      featured: false,
    },
    {
      title: 'ScholarSync',
      tag: 'scholarship engine',
      icon: '🎓',
      description:
        'A scholarship eligibility & allocation platform with application processing and role-based access. Merit scoring and eligibility checks run on Oracle SQL and PL/SQL procedures.',
      stack: ['Laravel', 'Oracle', 'PL/SQL'],
      features: ['Application processing pipeline', 'Automated eligibility verification', 'Merit score via PL/SQL functions'],
      link: '',
      repo: '',
      featured: false,
    },
    {
      title: 'SGIPC Club Portfolio & Management',
      tag: 'club management',
      icon: '🏛️',
      description:
        'A full-stack management system for KUET’s programming club with authentication, authorization and admin workflows, plus MSSQL-backed content and dashboards.',
      stack: ['ASP.NET', 'C#', 'MSSQL'],
      features: ['Role-based auth & authorization', 'MSSQL content management', 'Admin dashboard & workflows'],
      link: '',
      repo: '',
      featured: false,
    },
    {
      title: 'JobLink — Desktop Portal',
      tag: 'desktop app',
      icon: '💼',
      description:
        'A desktop job portal supporting recruitment, application tracking and user management, architected with clean MVC and DAO patterns for maintainability.',
      stack: ['JavaFX', 'SQLite', 'JDBC'],
      features: ['MVC & DAO architecture', 'Application tracking system', 'Multi-role user management'],
      link: '',
      repo: '',
      featured: false,
    },
    {
      title: 'JobLink — Android',
      tag: 'mobile app',
      icon: '📱',
      description:
        'A native Android job portal for seekers, employers and admins — real-time job posting and recruitment flows on Firebase Realtime Database with the Repository pattern.',
      stack: ['Java', 'Android SDK', 'Firebase', 'XML'],
      features: ['Real-time job postings & updates', 'Role-based access for 3 user types', 'Repository pattern architecture'],
      link: '',
      repo: '',
      featured: true,
    },
  ],
  achievements: {
    rating: {
      enabled: true,
      platform: 'Codeforces',
      handle: 'Sazzad14802',
      url: 'https://codeforces.com/profile/Sazzad14802',
      rating: 1420,
      max: 2000,
      rank: 'Specialist',
    },
    items: [
      { icon: '⚡', metric: '1200+', label: 'Problems solved', detail: 'Codeforces · AtCoder · CodeChef' },
      { icon: '🥇', metric: '26 / 91', label: 'MU IUPC 2025', detail: 'Ranked 26th out of 91 teams' },
      { icon: '🏅', metric: '41 / 130', label: 'AUST IUPC 2025', detail: 'Ranked 41st out of 130 teams' },
    ],
    leadership: [
      {
        role: 'Assistant Contest Manager',
        org: 'SGIPC — KUET’s Competitive Programming Club',
        description: 'Helping organize and run programming contests and technical events.',
      },
    ],
    tags: ['Codeforces', 'AtCoder', 'CodeChef', 'IUPC'],
  },
  education: [
    {
      period: '2024 – Present',
      degree: 'B.Sc. in Computer Science & Engineering',
      institution: 'Khulna University of Engineering & Technology (KUET)',
      score: 'CGPA 3.75/4.00 · 3rd year, 1st semester · Expected 2028',
    },
    {
      period: '2022',
      degree: 'Higher Secondary Certificate (HSC)',
      institution: 'Dhaka College',
      score: 'GPA 5.00 / 5.00',
    },
    {
      period: '2020',
      degree: 'Secondary School Certificate (SSC)',
      institution: 'Ideal School & College',
      score: 'GPA 5.00 / 5.00',
    },
  ],
  contact: {
    message:
      'Open to internships, collaborations and interesting problems. The fastest way to reach me is email — or catch me on the judges.',
    email: 'sazzadkun@gmail.com',
    phone: '+880 1751 716659',
    showPhone: false,
    links: [
      { label: 'GitHub', url: 'https://github.com/Sazzad14802', icon: 'github' },
      { label: 'LinkedIn', url: 'https://linkedin.com/in/sazzad14802', icon: 'linkedin' },
      { label: 'Codeforces', url: 'https://codeforces.com/profile/Sazzad14802', icon: 'codeforces' },
    ],
  },
  footer: 'Built by Sazzad Ahmed',
  sections: [
    { id: 'about', label: 'About', title: 'Building with purpose, solving with passion', visible: true },
    { id: 'skills', label: 'Skills', title: 'Tools I work with', visible: true },
    { id: 'projects', label: 'Projects', title: 'Things I’ve built', visible: true },
    { id: 'achievements', label: 'Achievements', title: 'Competitive programming', visible: true },
    { id: 'education', label: 'Education', title: 'Academic journey', visible: true },
    { id: 'contact', label: 'Contact', title: 'Let’s build something', visible: true },
  ],
  theme: {
    layout: 'terminal',
    palette: 'lime',
    mode: 'dark',
    accent: '',
    accent2: '',
    font: 'sora',
    effects: { background: true, animations: true, cat: true, modeToggle: true },
  },
}
