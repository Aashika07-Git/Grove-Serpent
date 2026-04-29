/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AudioWaveform } from 'lucide-react';
import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden font-sans selection:bg-fuchsia-500/30">
      {/* Ambient background glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center py-6 px-4 z-10 gap-8 h-full min-h-0 w-full max-w-5xl mx-auto pb-32">
        
        {/* Header */}
        <header className="flex flex-col items-center justify-center text-center mt-2 mb-2 w-full">
          <div className="flex items-center justify-center space-x-3 mb-2 flex-wrap">
            <AudioWaveform className="w-8 h-8 text-cyan-400 animate-pulse hidden sm:block" />
            <h1 className="text-4xl md:text-5xl font-black font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-purple-400 to-cyan-400 [text-shadow:0_0_30px_rgba(217,70,239,0.3)]">
              GROOVE <span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">SERPENT</span>
            </h1>
            <AudioWaveform className="w-8 h-8 text-fuchsia-400 animate-pulse hidden sm:block" />
          </div>
          <p className="font-mono text-slate-400 text-sm tracking-widest uppercase">
            AI BEATS &bull; RETRO BITES
          </p>
        </header>

        {/* Game Panel */}
        <section className="w-full flex justify-center">
          <SnakeGame />
        </section>
      </main>

      {/* Fixed Player Toolbar at the bottom */}
      <footer className="fixed bottom-0 left-0 w-full p-4 bg-slate-950/80 backdrop-blur-xl border-t border-slate-800 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <MusicPlayer />
      </footer>
    </div>
  );
}
