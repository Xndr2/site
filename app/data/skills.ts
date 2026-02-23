export interface Skill {
  name: string;
  src: string;
  level: number;
}

export interface SkillCategory {
  category: string;
  items: Skill[];
}

export const skillCategories: SkillCategory[] = [
  {
    category: 'Programming Languages',
    items: [
      { name: 'Unreal Blueprints', src: '/icons/unreal-engine.svg', level: 5 },
      { name: 'C#', src: '/icons/c-sharp-logo.svg', level: 4 },
      { name: 'C++', src: '/icons/c++.svg', level: 3.5 },
      { name: 'GDScript', src: '/icons/godot.png', level: 3.5 },
      { name: 'Java', src: '/icons/java.svg', level: 3 },
      { name: 'Python', src: '/icons/python.svg', level: 3 },
      { name: 'TypeScript', src: '/icons/typescript.svg', level: 3 },
      { name: 'JavaScript', src: '/icons/javascript.svg', level: 3 },
      { name: 'LUA', src: '/icons/lua-language.svg', level: 2.5 },
      { name: 'C', src: '/icons/c.svg', level: 2 },
      {
        name: 'HLSL/Shader Programming',
        src: '/icons/unreal-engine.svg',
        level: 2,
      },
    ],
  },
  {
    category: 'Tools',
    items: [
      { name: 'Steamworks', src: '/icons/steam.svg', level: 4.5 },
      { name: 'Git & GitHub', src: '/icons/github.svg', level: 4.5 },
      { name: 'Trello & Jira', src: '/icons/trello.svg', level: 4 },
      { name: 'Azure Git', src: '/icons/azure.png', level: 3 },
      { name: 'Blender', src: '/icons/blender.svg', level: 3 },
      { name: 'Linux', src: '/icons/linux.png', level: 3 },
      { name: 'Perforce', src: '/icons/perforce.svg', level: 2 },
    ],
  },
  {
    category: 'Game Engines',
    items: [
      { name: 'Unreal Engine', src: '/icons/unreal-engine.svg', level: 5 },
      { name: 'Godot', src: '/icons/godot.png', level: 3.5 },
      { name: 'Unity', src: '/icons/unity.svg', level: 3.5 },
      { name: 'Roblox Studio', src: '/icons/roblox.svg', level: 2.5 },
      { name: 'Custom OpenGL Engine', src: '/icons/opengl.png', level: 2 },
      { name: 'CryEngine', src: '/icons/cryengine.png', level: 1 },
    ],
  },
  {
    category: 'Web Development',
    items: [
      { name: 'HTML & CSS', src: '/icons/html.svg', level: 4 },
      { name: 'Tailwind CSS', src: '/icons/tailwind-css.svg', level: 4 },
      { name: 'Next.js', src: '/icons/nextjs.svg', level: 3.5 },
      { name: 'React', src: '/icons/react.svg', level: 3.5 },
    ],
  },
];

// Featured skills for homepage
export const featuredSkills = [
  { name: 'Unreal Engine', src: '/icons/unreal-engine.svg' },
  { name: 'Godot', src: '/icons/godot.png' },
  { name: 'Unity', src: '/icons/unity.svg' },
  { name: 'TypeScript', src: '/icons/typescript.svg' },
  { name: 'Next.js', src: '/icons/nextjs.svg' },
  { name: 'Tailwind CSS', src: '/icons/tailwind-css.svg' },
];
