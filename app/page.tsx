import { getTools } from '@/lib/data';
import ToolCard from '@/components/ToolCard';

export default async function HomePage() {
  const tools = await getTools();
  return (
    <div className="animate-fade-in">
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-aurora-gradient animate-aurora" aria-hidden="true" />
        <div className="mx-auto max-w-2xl py-24 sm:py-32 text-center">
          <h1 className="text-4xl font-bold font-heading tracking-tight text-white sm:text-6xl">
            AI Tool Directory
          </h1>
          <p className="mt-6 text-lg leading-8 text-text-secondary">
            {"Discover, compare, and master the world's best AI tools. Your ultimate guide in the age of artificial intelligence."}
          </p>
        </div>
      </div>
      <div className="mt-16">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    </div>
  );
}