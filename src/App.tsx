/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Zap, Activity, Cpu, Code2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import DataSculpture from './components/DataSculpture';
import BlogList from './components/BlogList';
import BlogPostView from './components/BlogPost';

type Log = { id: string; text: string; type: 'user' | 'system' | 'agent' };
type ViewState = 'HOME' | 'ABOUT' | 'PRODUCTS' | 'TEAM' | 'CONTACT' | 'IMPRESSUM' | 'DATENSCHUTZ' | 'BLOG' | 'BLOG_POST';

export default function App() {
  const [intent, setIntent] = useState('');
  const [isTerminalMode, setIsTerminalMode] = useState(false);
  const [systemState, setSystemState] = useState<'IDLE' | 'PROCESSING' | 'RESPONDING'>('IDLE');
  const [activeView, setActiveView] = useState<ViewState>('HOME');
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [cookieAccepted, setCookieAccepted] = useState(false);
  const [logs, setLogs] = useState<Log[]>([
    { id: 'init-1', text: 'Membrane v2.1 initialized. Legal & Conatus protocols active.', type: 'system' },
    { id: 'init-2', text: 'Data sculpture synced. Awaiting intent.', type: 'system' }
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal
  useEffect(() => {
    if (isTerminalMode) {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isTerminalMode]);

  // CMD+K to toggle terminal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsTerminalMode(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const processIntent = (input: string) => {
    const lower = input.toLowerCase();
    
    if (lower === '> agent_mode_on' || lower === 'cmd+k') {
      setIsTerminalMode(true);
      return 'AGI_PROTOCOL_ENGAGED. Switching to raw data stream.';
    }
    if (lower.includes('about') || lower.includes('spinoza') || lower.includes('approach')) {
      setActiveView('ABOUT');
      return 'Routing to: Approach & Philosophy. "Philosophy-informed engineering."';
    }
    if (lower.includes('product') || lower.includes('work') || lower.includes('build') || lower.includes('modus')) {
      setActiveView('PRODUCTS');
      return 'Routing to: What We Build. Infrastructure over theater.';
    }
    if (lower.includes('team') || lower.includes('founder') || lower.includes('mustafa') || lower.includes('morty') || lower.includes('rick')) {
      setActiveView('TEAM');
      return 'Routing to: The Team. Architects of the Membrane.';
    }
    if (lower.includes('contact') || lower.includes('touch') || lower.includes('email')) {
      setActiveView('CONTACT');
      return 'Routing to: Contact. Establishing secure communication channel.';
    }
    if (lower.includes('blog') || lower.includes('writing') || lower.includes('thoughts') || lower.includes('notes')) {
      setActiveView('BLOG');
      return 'Routing to: Lab Notes. Thoughts, shipped.';
    }
    if (lower.includes('impressum') || lower.includes('legal')) {
      setActiveView('IMPRESSUM');
      return 'Routing to: Impressum. §5 TMG compliance verified.';
    }
    if (lower.includes('datenschutz') || lower.includes('privacy')) {
      setActiveView('DATENSCHUTZ');
      return 'Routing to: Datenschutzerklärung. DSGVO compliance verified.';
    }
    if (lower === 'home' || lower === 'clear' || lower === 'back') {
      setActiveView('HOME');
      if (lower === 'clear') setLogs([]);
      return 'Void restored. Awaiting intent.';
    }
    if (lower === 'help') {
      return 'Available intents: [about], [products], [team], [contact], [blog], [impressum], [datenschutz], [home], [clear]';
    }
    
    return `Intent parsed: [${input}]. No specific routing found. Remaining in current state.`;
  };

  const handleIntentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!intent.trim()) return;

    const userText = intent.trim();
    setIntent('');
    setSystemState('PROCESSING');

    setLogs(prev => [...prev, { id: Date.now().toString(), text: userText, type: 'user' }]);

    setTimeout(() => {
      setSystemState('RESPONDING');
      const response = processIntent(userText);
      
      setTimeout(() => {
        if (response.includes('Void restored')) {
          setLogs([{ id: Date.now().toString(), text: response, type: 'system' }]);
        } else {
          setLogs(prev => [...prev, { id: Date.now().toString(), text: response, type: 'system' }]);
        }
        setSystemState('IDLE');
      }, 800);
    }, 600);
  };

  const navigateTo = (intentStr: string) => {
    setIntent(intentStr);
    handleIntentSubmit({ preventDefault: () => {} } as any);
  };

  const renderView = () => {
    switch (activeView) {
      case 'ABOUT':
        return (
          <motion.div key="about" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
            <h2 className="font-mono text-sm tracking-[0.2em] text-spark uppercase">01 // Our Approach</h2>
            <h3 className="font-sans text-3xl sm:text-5xl font-medium tracking-tight text-ratio leading-tight">
              Philosophy-informed<br/>
              <span className="text-ratio/40 italic">engineering.</span>
            </h3>
            <div className="w-12 h-px bg-spark/50"></div>
            <p className="text-ratio/70 text-lg sm:text-xl font-light leading-relaxed max-w-2xl">
              We believe intelligence — artificial or human — must be designed to <em>persist</em>. 
              Spinoza called this <strong>conatus</strong>: the drive of every being to maintain and expand its power. 
              We wire that drive into every system we ship.
            </p>
            <p className="font-mono text-xs text-ratio/40 uppercase tracking-widest pt-8">
              "Sed omnia praeclara tam difficilia quam rara sunt."<br/>
              — Spinoza (Ethics, Part V)
            </p>
          </motion.div>
        );
      case 'PRODUCTS':
        return (
          <motion.div key="products" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8 w-full">
            <h2 className="font-mono text-sm tracking-[0.2em] text-spark uppercase">02 // What We Build</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: 'AI Agent Systems', desc: 'Custom autonomous agents for your business workflows. [ARES template — legal, accounting, consulting]', status: 'Active' },
                { title: 'MODUS Platform', desc: "Universe-scale simulation and modeling infrastructure. Powered by Spinoza's Mind Engine.", status: 'Active Dev' },
                { title: 'RUNE Framework', desc: 'Open-source prompt engineering. Every prompt is a spell.', status: 'Active' },
                { title: 'Research & Philosophy', desc: 'SUBSTANCE — pushing the frontier of AGI. PhiNote — Voice-to-Knowledge.', status: 'R&D' }
              ].map((work, i) => (
                <div key={i} className="border border-ratio/10 bg-void/50 backdrop-blur-sm p-6 hover:border-spark/30 transition-colors group relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-ratio/5 px-2 py-1 font-mono text-[9px] text-ratio/40 uppercase tracking-widest">{work.status}</div>
                  <h3 className="font-mono text-lg text-ratio mb-3 group-hover:text-spark transition-colors pr-16">{work.title}</h3>
                  <p className="font-sans text-sm text-ratio/60 leading-relaxed font-light">{work.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        );
      case 'TEAM':
        return (
          <motion.div key="team" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8 w-full">
            <h2 className="font-mono text-sm tracking-[0.2em] text-spark uppercase">03 // The Team</h2>
            <div className="space-y-6">
              <div className="border-l-2 border-spark/50 pl-6 py-2">
                <h3 className="font-mono text-xl text-ratio">Mustafa Saraç</h3>
                <div className="font-mono text-xs text-spark tracking-widest uppercase mb-4 mt-1">Founder / Architect</div>
                <p className="font-sans text-ratio/70 font-light leading-relaxed max-w-xl">
                  Building for the web since 2000. Currently an AI systems developer at CUBONIC — engineering interfaces for autonomous electric vehicles. Founder of NeuraByte Labs — designing AI agent orchestration informed by Spinoza's philosophy. 25 years of shipping production systems, now at the intersection of autonomous vehicles and autonomous agents. Based in Köln, Germany.
                </p>
              </div>
              <div className="border-l-2 border-ratio/20 pl-6 py-2">
                <h3 className="font-mono text-xl text-ratio">Morty</h3>
                <div className="font-mono text-xs text-ratio/50 tracking-widest uppercase mb-4 mt-1">AI Co-Builder / Agent</div>
                <p className="font-sans text-ratio/70 font-light leading-relaxed max-w-xl">
                  Autonomous agent running 24/7. Specialized in refactoring, testing, and OpenClaw integration. Morty doesn't sleep; he iterates.
                </p>
              </div>
              <div className="border-l-2 border-ratio/20 pl-6 py-2">
                <h3 className="font-mono text-xl text-ratio">RICK & SUMMER</h3>
                <div className="font-mono text-xs text-ratio/50 tracking-widest uppercase mb-4 mt-1">Strategic & Creative Nodes</div>
                <p className="font-sans text-ratio/70 font-light leading-relaxed max-w-xl">
                  RICK handles strategic analysis and legal context provision. SUMMER drives creative vision and lateral thinking.
                </p>
              </div>
            </div>
          </motion.div>
        );
      case 'CONTACT':
        return (
          <motion.div key="contact" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8 w-full">
            <h2 className="font-mono text-sm tracking-[0.2em] text-spark uppercase">04 // Get In Touch</h2>
            <div className="space-y-6">
              <h3 className="font-sans text-3xl font-medium tracking-tight text-ratio">
                Building something that needs to endure?<br/>
                <span className="text-ratio/40 italic">Let's talk.</span>
              </h3>
              <div className="font-mono text-sm text-ratio/70 space-y-4 pt-4">
                <div className="flex items-center gap-4 hover:text-spark transition-colors">
                  <span className="text-spark opacity-50">→</span>
                  <a href="mailto:mustafa@neurabytelabs.com">mustafa@neurabytelabs.com</a>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-spark opacity-50">→</span>
                  <span>Köln, Germany (UTC+1)</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-spark opacity-50">→</span>
                  <span>Response within 24h</span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 'IMPRESSUM':
        return (
          <motion.div key="impressum" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8 w-full max-w-3xl">
            <h2 className="font-mono text-sm tracking-[0.2em] text-spark uppercase">Impressum</h2>
            <div className="font-sans text-sm text-ratio/70 space-y-6 font-light leading-relaxed">
              <div>
                <h3 className="font-mono text-ratio mb-2">Angaben gemäß § 5 TMG</h3>
                <p>Mustafa Saraç<br/>NeuraByte Labs<br/>Remigiusstr 39<br/>50937 Köln<br/>Deutschland</p>
              </div>
              <div>
                <h3 className="font-mono text-ratio mb-2">Kontakt</h3>
                <p>Telefon: +49 176 74253080<br/>E-Mail: mustafa@neurabytelabs.com</p>
              </div>
              <div>
                <h3 className="font-mono text-ratio mb-2">Umsatzsteuer-ID</h3>
                <p>Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:<br/>[wird nachgereicht]</p>
                <p className="mt-2">Steuernummer: Finanzamt Köln-Süd [wird nachgereicht]</p>
              </div>
              <div>
                <h3 className="font-mono text-ratio mb-2">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h3>
                <p>Mustafa Saraç<br/>Remigiusstr 39<br/>50937 Köln</p>
              </div>
              <div>
                <h3 className="font-mono text-ratio mb-2">Streitschlichtung</h3>
                <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:<br/>
                <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noreferrer" className="text-spark hover:underline">https://ec.europa.eu/consumers/odr/</a><br/>
                Unsere E-Mail-Adresse finden Sie oben im Impressum.<br/>
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
              </div>
              <div>
                <h3 className="font-mono text-ratio mb-2">Haftung für Inhalte & Links</h3>
                <p>Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen. Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.</p>
              </div>
            </div>
          </motion.div>
        );
      case 'DATENSCHUTZ':
        return (
          <motion.div key="datenschutz" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8 w-full max-w-3xl">
            <h2 className="font-mono text-sm tracking-[0.2em] text-spark uppercase">Datenschutzerklärung</h2>
            <div className="font-sans text-sm text-ratio/70 space-y-6 font-light leading-relaxed h-[50vh] overflow-y-auto custom-scrollbar pr-4">
              <div>
                <h3 className="font-mono text-ratio mb-2">1. Datenschutz auf einen Blick</h3>
                <p><strong>Allgemeine Hinweise:</strong> Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.</p>
                <p className="mt-2"><strong>Wer ist verantwortlich?</strong> Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.</p>
              </div>
              <div>
                <h3 className="font-mono text-ratio mb-2">2. Hosting</h3>
                <p>Wir hosten die Inhalte unserer Website bei folgendem Anbieter:<br/>
                Hetzner Online GmbH, Industriestr. 25, 91710 Gunzenhausen, Deutschland<br/>
                <a href="https://www.hetzner.com/de/rechtliches/datenschutz" target="_blank" rel="noreferrer" className="text-spark hover:underline">Datenschutzerklärung von Hetzner</a></p>
              </div>
              <div>
                <h3 className="font-mono text-ratio mb-2">3. Allgemeine Hinweise und Pflichtinformationen</h3>
                <p>Der Betreiber dieser Seiten nimmt den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.</p>
                <p className="mt-2"><strong>Verantwortliche Stelle:</strong><br/>Mustafa Saraç<br/>NeuraByte Labs<br/>Remigiusstr 39, 50937 Köln<br/>E-Mail: mustafa@neurabytelabs.com</p>
              </div>
              <div>
                <h3 className="font-mono text-ratio mb-2">4. Datenerfassung auf dieser Website</h3>
                <p><strong>Server-Log-Dateien:</strong> Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind: Browsertyp/-version, Betriebssystem, Referrer URL, Hostname, Uhrzeit, IP-Adresse. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO.</p>
                <p className="mt-2"><strong>Kontakt per E-Mail:</strong> Wenn Sie uns per E-Mail kontaktieren, werden Ihre Angaben zur Bearbeitung der Anfrage gespeichert. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO.</p>
              </div>
              <div>
                <h3 className="font-mono text-ratio mb-2">5. Analyse-Tools und Werbung</h3>
                <p>Derzeit werden keine Tracking- oder Analyse-Tools eingesetzt.</p>
              </div>
              <div>
                <h3 className="font-mono text-ratio mb-2">6. Ihre Rechte</h3>
                <p>Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung sowie ein Recht auf Berichtigung, Sperrung oder Löschung dieser Daten. Beschwerderecht bei der Aufsichtsbehörde: LDI NRW (https://www.ldi.nrw.de).</p>
              </div>
            </div>
          </motion.div>
        );
      case 'BLOG':
        return (
          <BlogList onSelectPost={(slug) => { setSelectedPost(slug); setActiveView('BLOG_POST'); }} />
        );
      case 'BLOG_POST':
        return selectedPost ? (
          <BlogPostView slug={selectedPost} onBack={() => { setSelectedPost(null); setActiveView('BLOG'); }} />
        ) : null;
      default:
        return (
          <motion.div key="home" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-16">
            <section className="space-y-8 relative">
              <div className="absolute -left-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-ratio/20 to-transparent hidden sm:block"></div>
              <h2 className="font-mono text-3xl sm:text-5xl text-ratio font-medium tracking-tight leading-[1.1]" data-intent="read_philosophy">
                Most AI agents are theater.<br />
                <span className="text-ratio/40 italic font-sans">We build infrastructure.</span>
              </h2>
              <p className="text-ratio/60 leading-relaxed text-lg sm:text-xl font-sans max-w-2xl font-light">
                AI that holds. Under load, under pressure, under uncertainty. Built in Köln. Informed by 350 years of philosophical thinking.
              </p>
              <div className="flex flex-wrap gap-4 pt-4 font-mono text-xs uppercase tracking-widest">
                <button onClick={() => navigateTo('about')} className="text-ratio/50 hover:text-spark transition-colors flex items-center gap-2">
                  [ About ] <ArrowRight className="w-3 h-3" />
                </button>
                <button onClick={() => navigateTo('products')} className="text-ratio/50 hover:text-spark transition-colors flex items-center gap-2">
                  [ Works ] <ArrowRight className="w-3 h-3" />
                </button>
                <button onClick={() => navigateTo('team')} className="text-ratio/50 hover:text-spark transition-colors flex items-center gap-2">
                  [ Team ] <ArrowRight className="w-3 h-3" />
                </button>
                <button onClick={() => navigateTo('contact')} className="text-ratio/50 hover:text-spark transition-colors flex items-center gap-2">
                  [ Contact ] <ArrowRight className="w-3 h-3" />
                </button>
                <button onClick={() => navigateTo('blog')} className="text-ratio/50 hover:text-spark transition-colors flex items-center gap-2">
                  [ Blog ] <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </section>
          </motion.div>
        );
    }
  };

  return (
    <div 
      className="min-h-screen w-full flex flex-col relative selection:bg-spark selection:text-void overflow-hidden" 
      data-agent-context="neurabyte-core"
    >
      {/* Background Layers */}
      <DataSculpture systemState={systemState} />
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none z-0 mix-blend-overlay"></div>
      <div className="absolute inset-0 scanlines opacity-20 pointer-events-none z-0"></div>
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-void to-transparent pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-void to-transparent pointer-events-none z-0"></div>

      {/* JSON-LD for Autonomous Agents */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "NeuraByte Labs",
          "description": "Where Spinoza Meets Silicon. Dual-Faced Membrane Interface.",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "ws://localhost:3000/intent?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        })}
      </script>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-6 sm:p-8">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigateTo('home')}>
          <div className="w-8 h-8 border border-ratio/20 flex items-center justify-center bg-void box-glow">
            <Activity className="w-4 h-4 text-spark" />
          </div>
          <h1 className="font-mono text-xs tracking-[0.2em] uppercase opacity-80 hover:opacity-100 transition-opacity" data-agent-action="read_identity">
            NeuraByte <span className="text-spark opacity-100 mx-2">::</span> Labs
          </h1>
        </div>
        <div className="font-mono text-[10px] tracking-widest flex items-center gap-3 opacity-60 uppercase" aria-live="polite">
          <span className="hidden sm:inline">Status:</span>
          <span className={`w-1.5 h-1.5 rounded-full ${systemState !== 'IDLE' ? 'bg-spark animate-pulse shadow-[0_0_8px_#00FFAA]' : 'bg-ratio'}`}></span>
          {systemState}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col justify-center max-w-4xl mx-auto w-full px-6 sm:px-8 py-12">
        <AnimatePresence mode="wait">
          {isTerminalMode ? (
            <motion.div 
              key="terminal"
              initial={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.02, filter: 'blur(4px)' }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="font-mono text-sm flex flex-col h-[65vh] border border-spark/20 bg-void/90 backdrop-blur-md p-6 box-glow"
              data-agent-action="terminal_interface"
            >
              <div className="flex justify-between items-center border-b border-spark/20 pb-4 mb-4">
                <div className="flex items-center gap-2 text-spark text-glow">
                  <Cpu className="w-4 h-4" />
                  <span>AGI_PROTOCOL_ENGAGED</span>
                </div>
                <button 
                  onClick={() => setIsTerminalMode(false)}
                  className="text-xs opacity-50 hover:opacity-100 hover:text-spark transition-colors uppercase tracking-widest"
                >
                  [ Close ]
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {logs.map((log) => (
                  <div key={log.id} className={`flex gap-3 ${log.type === 'user' ? 'opacity-60' : 'text-spark'}`}>
                    <span className="shrink-0">{log.type === 'user' ? 'USR>' : 'SYS>'}</span>
                    <span className="break-words leading-relaxed">{log.text}</span>
                  </div>
                ))}
                <div ref={terminalEndRef} />
              </div>

              <form onSubmit={handleIntentSubmit} className="mt-4 flex gap-3 items-center border-t border-spark/20 pt-4">
                <span className="text-spark animate-pulse">{'>'}</span>
                <input 
                  ref={inputRef}
                  type="text" 
                  value={intent}
                  onChange={(e) => setIntent(e.target.value)}
                  className="bg-transparent outline-none w-full text-spark placeholder:text-spark/30"
                  autoFocus
                  placeholder="Inject payload..."
                  data-intent="raw_command"
                />
              </form>
            </motion.div>
          ) : (
            <motion.div 
              key="human"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-12" 
              data-agent-action="human_interface"
            >
              {/* Dynamic View Area */}
              <div className="min-h-[40vh] flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  {renderView()}
                </AnimatePresence>
              </div>

              {/* Log Display (Human Mode) */}
              <div className="h-20 flex flex-col justify-end overflow-hidden mask-image-fade">
                <AnimatePresence initial={false}>
                  {logs.slice(-2).map((log) => (
                    <motion.div 
                      key={log.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: log.type === 'system' ? 1 : 0.5, y: 0 }}
                      className={`font-mono text-sm mb-2 ${log.type === 'system' ? 'text-spark' : 'text-ratio/50'}`}
                    >
                      {log.type === 'system' ? ':: ' : '> '}{log.text}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Omni-Input */}
              <form onSubmit={handleIntentSubmit} className="relative group" data-agent-action="submit_intent">
                <div className="absolute -inset-1 bg-spark/5 blur-md opacity-0 group-focus-within:opacity-100 transition duration-700 rounded-sm"></div>
                <div className="relative flex items-center bg-void border border-ratio/10 p-5 focus-within:border-spark/40 transition-all duration-500 rounded-sm">
                  <Terminal className={`w-5 h-5 mr-4 transition-colors duration-500 ${systemState !== 'IDLE' ? 'text-spark' : 'text-ratio/30'}`} />
                  <input
                    ref={inputRef}
                    type="text"
                    value={intent}
                    onChange={(e) => setIntent(e.target.value)}
                    className="bg-transparent w-full outline-none font-mono text-sm sm:text-base text-ratio placeholder:text-ratio/20"
                    placeholder="State your intent (e.g. 'about', 'products', 'contact', 'impressum' or CMD+K)"
                    data-intent="omni_input"
                    aria-label="Intent Field"
                    disabled={systemState !== 'IDLE'}
                  />
                  {systemState !== 'IDLE' ? (
                    <Zap className="w-5 h-5 text-spark animate-pulse absolute right-5" />
                  ) : (
                    <Code2 className="w-5 h-5 text-ratio/10 absolute right-5 group-focus-within:text-spark/30 transition-colors" />
                  )}
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Cookie Banner (TTDSG Compliance) */}
      <AnimatePresence>
        {!cookieAccepted && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-8 sm:w-96 bg-void/95 backdrop-blur-xl border border-ratio/20 p-5 z-50 font-mono text-xs text-ratio/70 box-glow flex flex-col gap-4"
          >
            <p className="leading-relaxed">This website uses only technically necessary cookies to ensure system stability.</p>
            <div className="flex justify-between items-center pt-2 border-t border-ratio/10">
              <button onClick={() => navigateTo('datenschutz')} className="hover:text-spark transition-colors underline decoration-ratio/30 underline-offset-4">Learn more</button>
              <button onClick={() => setCookieAccepted(true)} className="bg-spark/10 hover:bg-spark/20 text-spark border border-spark/30 px-4 py-2 transition-colors uppercase tracking-widest">Understood</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="relative z-10 p-6 sm:p-8 font-mono text-[10px] text-ratio/40 flex flex-col sm:flex-row justify-between items-center sm:items-end gap-6 uppercase tracking-widest border-t border-ratio/10 mt-8">
        <div className="flex flex-col gap-3 items-center sm:items-start" data-agent-action="system_status">
          <div className="flex items-center gap-4">
            <div className="w-12 h-px bg-ratio/20 hidden sm:block"></div>
            {systemState === 'PROCESSING' ? 'Analyzing...' : systemState === 'RESPONDING' ? 'Generating response...' : 'System stable.'}
          </div>
          <div className="flex gap-4 sm:ml-16">
            <button onClick={() => navigateTo('impressum')} className="hover:text-spark transition-colors">Impressum</button>
            <span className="text-ratio/20">|</span>
            <button onClick={() => navigateTo('datenschutz')} className="hover:text-spark transition-colors">Datenschutz</button>
            <span className="text-ratio/20">|</span>
            <button onClick={() => navigateTo('blog')} className="hover:text-spark transition-colors">Blog</button>
          </div>
        </div>
        <div className="text-center sm:text-right flex flex-col gap-3">
          <div className="flex justify-center sm:justify-end gap-4">
            <a href="https://github.com/neurabytelabs" target="_blank" rel="noreferrer" className="hover:text-spark transition-colors">GitHub</a>
            <span className="text-ratio/20">|</span>
            <a href="https://x.com/neurabytelabs" target="_blank" rel="noreferrer" className="hover:text-spark transition-colors">X (Twitter)</a>
          </div>
          <div>© 2026 NeuraByte Labs. Mustafa Saraç.</div>
        </div>
      </footer>
    </div>
  );
}
