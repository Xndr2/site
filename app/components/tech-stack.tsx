import Image from "next/image";

const techStack = [
    { name: "Unreal Engine", src: "/icons/unreal-engine.svg" },
    { name: "Godot", src: "/icons/godot.png" },
    { name: "Unity", src: "/icons/unity.svg" },
    { name: "TypeScript", src: "/icons/typescript.svg" },
    { name: "Next.js", src: "/icons/nextjs.svg" },
    { name: "Tailwind CSS", src: "/icons/tailwind-css.svg" },
];

const TechStack: React.FC = () => {
  return (
    <div className="mt-6 w-max mx-auto">
      <div className="grid grid-flow-col gap-2">
        {techStack.map((tech) => (
          <div key={tech.name} className="flex flex-col items-center group relative">
            <Image
              src={tech.src}
              alt={tech.name}
              width={50}
              height={50}
              className="md:h-10 h-5 w-auto transition-transform transform group-hover:scale-110"
            />
            <span className="absolute bottom-[-1.5rem] text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {tech.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechStack;