import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getTools, type Tool } from '@/lib/data';
import SaveToolButton from '@/components/SaveToolButton';

// Define the props type correctly for a Next.js page
type ToolDetailPageProps = {
  params: { id: string };
};

async function getTool(id: string): Promise<Tool | undefined> {
  const tools = await getTools();
  return tools.find((tool) => tool.id === id);
}

export async function generateStaticParams() {
  const tools = await getTools();
  return tools.map((tool) => ({ id: tool.id }));
}

export default async function ToolDetailPage({ params }: ToolDetailPageProps) {
  const tool = await getTool(params.id);
  if (!tool) notFound();

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <Link href="/" className="text-primary hover:underline mb-6 inline-block">
        &larr; Back to All Tools
      </Link>
      <header className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
         <Image src={tool.logo_url} alt={`${tool.name} logo`} width={100} height={100} className="rounded-xl shadow-lg" />
         <div>
           <h1 className="text-4xl font-bold font-heading text-text-main">{tool.name}</h1>
           <p className="text-lg text-text-secondary mt-2">{tool.tagline}</p>
           <a href={tool.website_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline mt-2 inline-block">
             Visit Website &rarr;
           </a>
         </div>
       </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="rounded-xl bg-glass p-6 border border-glass-border">
            <h2 className="text-2xl font-bold font-heading border-b-2 border-primary/30 pb-2 mb-4">Full Description</h2>
            <p className="text-text-secondary leading-relaxed">{tool.full_description}</p>
          </div>
          <div className="rounded-xl bg-glass p-6 border border-glass-border">
            <h2 className="text-2xl font-bold font-heading border-b-2 border-primary/30 pb-2 mb-4">Key Features</h2>
            <ul className="list-disc list-inside space-y-2 text-text-secondary">
              {tool.features.map((feature, index) => ( <li key={index}>{feature}</li> ))}
            </ul>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="rounded-xl bg-glass p-6 border border-glass-border">
              <h3 className="text-xl font-bold font-heading mb-3 text-green-400">Pros</h3>
              <ul className="space-y-2">
                {tool.pros.map((pro, index) => ( <li key={index} className="flex items-start"><span className="text-green-400 mr-2">&#10003;</span><span className="text-text-secondary">{pro}</span></li> ))}
              </ul>
            </div>
            <div className="rounded-xl bg-glass p-6 border border-glass-border">
              <h3 className="text-xl font-bold font-heading mb-3 text-red-400">Cons</h3>
              <ul className="space-y-2">
                {tool.cons.map((con, index) => ( <li key={index} className="flex items-start"><span className="text-red-400 mr-2">&#10007;</span><span className="text-text-secondary">{con}</span></li> ))}
              </ul>
            </div>
          </div>
        </div>
        <aside className="md:col-span-1 h-fit">
          <div className="rounded-xl bg-glass p-6 border border-glass-border space-y-6">
            <SaveToolButton toolId={tool.id} user={user} />
            <div>
              <h3 className="text-xl font-bold font-heading mb-3">Best For</h3>
              <div className="flex flex-wrap gap-2">
                {tool.best_for.map((item) => ( <span key={item} className="bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full">{item}</span> ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold font-heading mb-2">Pricing</h3>
              <p className="text-text-main font-semibold">{tool.pricing.model}</p>
              <p className="text-text-secondary text-sm">{tool.pricing.details}</p>
            </div>
            <div>
              <h3 className="text-xl font-bold font-heading mb-3">Ratings</h3>
              <div className="space-y-2 text-text-secondary">
                <div className="flex justify-between"><span>Overall:</span> <strong>{tool.rating.overall.toFixed(1)}</strong></div>
                <div className="flex justify-between"><span>Ease of Use:</span> <strong>{tool.rating.ease_of_use.toFixed(1)}</strong></div>
                <div className="flex justify-between"><span>Output Quality:</span> <strong>{tool.rating.output_quality.toFixed(1)}</strong></div>
                <div className="flex justify-between"><span>Value for Money:</span> <strong>{tool.rating.value.toFixed(1)}</strong></div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}