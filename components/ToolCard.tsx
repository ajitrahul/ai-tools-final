import Link from 'next/link';
import Image from 'next/image';

type Tool = {
  id: string; name: string; logo_url: string; tagline: string; category: string[];
};

type ToolCardProps = { tool: Tool; };

const ToolCard = ({ tool }: ToolCardProps) => {
  return (
    <Link href={`/tools/${tool.id}`} className="block group">
      <div className="h-full rounded-2xl bg-glass border border-glass-border p-6 transition-all duration-300 group-hover:border-primary group-hover:shadow-2xl group-hover:shadow-primary/20">
        <div className="flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center mb-4">
              <Image src={tool.logo_url} alt={`${tool.name} logo`} width={48} height={48} className="rounded-md mr-4" />
              <h3 className="text-lg font-bold font-heading text-text-main">{tool.name}</h3>
            </div>
            <p className="text-sm text-text-secondary mb-4">{tool.tagline}</p>
          </div>
          <div className="flex flex-wrap gap-2 mt-auto">
            {tool.category.map((cat) => (
              <span key={cat} className="bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full">
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ToolCard;