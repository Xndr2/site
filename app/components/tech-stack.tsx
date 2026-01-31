import Image from 'next/image';
import { featuredSkills } from '@/app/data/skills';

export default function TechStack() {
  return (
    <div className="mt-8 w-max mx-auto">
      <div className="flex flex-wrap justify-center gap-4 md:gap-6">
        {featuredSkills.map((tech) => (
          <div
            key={tech.name}
            className="flex flex-col items-center group relative"
          >
            <Image
              src={tech.src}
              alt={tech.name}
              width={50}
              height={50}
              className="md:h-10 h-6 w-auto transition-all duration-200 group-hover:scale-110 opacity-70 group-hover:opacity-100 dark:invert"
              style={{ filter: 'brightness(0)' }}
            />
            <span className="absolute -bottom-6 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              {tech.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
