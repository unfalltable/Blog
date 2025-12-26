import { getNotes } from '@/services/notes';
import { getProjects } from '@/services/projects';
import { getDiscussions } from '@/services/discussions';
import {
  BlockchainBackground,
  HeroSection,
  FeaturedNotes,
  FeaturedProjects,
  RecentDiscussions,
  ScrollReveal,
} from '@/components/home';

/**
 * Homepage Component
 * Blockchain-themed homepage with featured content
 * Requirements: 8.1, 8.2, 8.3, 8.4
 */
export default async function Home() {
  // Fetch featured content
  const [notesResult, projects, discussionsResult] = await Promise.all([
    getNotes({ page: 1, pageSize: 3 }),
    getProjects(),
    getDiscussions({ page: 1, pageSize: 5 }),
  ]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <BlockchainBackground />
      
      <main className="relative z-10">
        <HeroSection />
        
        <FeaturedNotes notes={notesResult.data} />
        
        <FeaturedProjects projects={projects.slice(0, 4)} />
        
        <RecentDiscussions discussions={discussionsResult.data} />
        
        {/* Footer CTA Section */}
        <section className="py-20 px-4 text-center">
          <ScrollReveal>
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                准备好开始探索了吗？
              </h2>
              <p className="text-gray-400 mb-8">
                加入我们的社区，一起探索区块链的无限可能
              </p>
              <a
                href="/discussions"
                className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full text-white font-semibold hover:from-emerald-400 hover:to-cyan-400 transition-all duration-300 shadow-lg shadow-emerald-500/25"
              >
                加入讨论
              </a>
            </div>
          </ScrollReveal>
        </section>
      </main>
    </div>
  );
}
