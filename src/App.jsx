import React, { useState, useEffect, useRef, useCallback, useMemo, createContext, useContext } from "react";
import {
  Sparkles, Bot, Rocket, ChevronRight, ChevronDown, Check, Copy,
  CheckCircle2, XCircle, AlertTriangle, Lightbulb, Target, Wrench,
  TestTube2, RefreshCw, BookOpen, Zap, Brain, MessageSquare,
  ArrowRight, Code2, Eye, Play, Trophy, Settings2, ShieldCheck,
  Workflow, FileText, Database, Hexagon, Menu, X, Search,
  Command, ArrowUpRight, BookMarked, Activity, ChevronLeft, Info,
  Layers, GraduationCap, Clock, Circle, UserSquare, ClipboardList,
  Drama, Mic, Crosshair, ShieldOff, Leaf, Globe, Cookie, Settings,
  Loader2, Send, KeyRound, Lock, Unlock, AlertOctagon, ListChecks,
  GitBranch, Network, Boxes, Microscope, Ruler, Telescope, Trash2,
  ScrollText, Cog, Gauge, Sigma, Variable, FunctionSquare,
  Compass, Award, Star, Flame, Sprout, TreeDeciduous, Flower2,
  HelpCircle, ExternalLink, AlertCircle, BookOpenCheck, Github,
  Library, Share2, ArrowUp
} from "lucide-react";

/* ============================================================================
   AGENT ACADEMY · Premium SaaS Educational Product
   --------------------------------------------------------------------------
   Architecture:
   - Internationalization: ES (default) | EN | PT — persisted via localStorage
   - Persistence: progress, level state, checklists, consent — localStorage
   - Pedagogical system: 3 levels per module (Foundations / Advanced / Expert)
   - Skills integration: Claude Code Essentials per level
   - Simulator: intelligent multi-keyword scoring + conversational memory
   - Achievement: AI Achievement Core with glassmorphism + animations
   - Privacy: cookie banner with granular consent
   ========================================================================== */

/* ============================================================================
   PERSISTENCE LAYER (NO IP — only localStorage)
   ========================================================================== */

const STORAGE_PREFIX = "agent-academy:v2:";
const KEYS = {
  PROGRESS: `${STORAGE_PREFIX}progress`,
  CHECKLISTS: `${STORAGE_PREFIX}checklists`,
  ACTIVE_MODULE: `${STORAGE_PREFIX}active-module`,
  ACTIVE_LEVELS: `${STORAGE_PREFIX}active-levels`,
  LANG: `${STORAGE_PREFIX}lang`,
  CONSENT: `${STORAGE_PREFIX}consent`,
  API_KEY: `${STORAGE_PREFIX}api-key`,
  PROMPTS: `${STORAGE_PREFIX}prompts`,
};

function safeGet(key, fallback) {
  try {
    if (typeof window === "undefined") return fallback;
    const raw = window.localStorage.getItem(key);
    if (raw === null || raw === undefined) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function safeSet(key, value) {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota / privacy mode — silently ignore */
  }
}

function usePersistentState(key, initial) {
  const [value, setValue] = useState(() => safeGet(key, initial));
  useEffect(() => {
    safeSet(key, value);
  }, [key, value]);
  return [value, setValue];
}

/* ============================================================================
   I18N — translations registry (ES default, EN, PT)
   ========================================================================== */

const translations = {
  es: {
    brand: { name: "Agent Academy", tag: "Curso interactivo" },
    nav: {
      sections: {
        Foundations: "Fundamentos",
        Construction: "Construcción",
        Refinement: "Refinamiento",
        Mastery: "Maestría",
      },
      searchPlaceholder: "Buscar módulo…",
      progress: "Tu progreso",
      language: "Idioma",
    },
    header: {
      course: "Curso",
    },
    levels: {
      foundations: "Fundamentos",
      advanced: "Avanzado",
      expert: "Experto",
      foundationsDesc: "Entiende los conceptos esenciales",
      advancedDesc: "Aplica en casos reales",
      expertDesc: "Diseña sistemas robustos",
    },
    skills: {
      label: "Skill desbloqueada",
      core: "Core Skills",
      applied: "Applied Skills",
      essentials: "Claude Code Essentials",
    },
    nav_btn: {
      previous: "Anterior",
      finish: "Finalizar",
      continue: "Continuar",
      markAndContinue: "Marcar y continuar",
      completeCourse: "Completar curso",
    },
    hero: {
      eyebrow: "Curso interactivo · Academia profesional",
      title1: "Construye agentes en",
      title2: "Claude",
      title3: "como un ingeniero, no como un usuario.",
      sub: "Una academia estructurada por niveles que te lleva de cero a diseñar sistemas de agentes en producción. Práctica real, ejemplos concretos, progresión medible.",
      meta: {
        modules: "10 módulos",
        time: "≈ 3 horas",
        levels: "3 niveles por módulo",
        skills: "Skills integradas",
      },
    },
    module: {
      validate: "Validación rápida",
      practice: "Práctica",
      exercise: "Ejercicio",
      example: "Ejemplo",
      compare: "Comparación",
      simulator: "Simulador",
      tryAgent: "Prueba el agente",
      checklist: "Checklist de validación",
      realCases: "Casos reales",
      typicalIter: "Iteraciones típicas",
      executiveSummary: "Resumen ejecutivo",
      nextStep: "Próximo paso",
      goClaude: "Ir a Claude",
      problem: "Problema",
      solution: "Solución",
    },
    sim: {
      title: "Verde · Asistente de plantas",
      tag: "Simulación",
      empty: "Prueba el agente que vas a aprender a construir.",
      placeholder: "Escribe tu pregunta…",
      send: "Probar",
      apiHint: "Conecta tu API key de Claude para respuestas reales",
      apiPlaceholder: "sk-ant-... (opcional)",
      apiConnected: "API conectada",
      apiSimulated: "Modo simulación",
      apiError: "No se pudo conectar. Revisa tu API key.",
      apiSet: "Guardar",
      apiRemove: "Quitar",
      typing: "escribiendo…",
      reset: "Reiniciar",
      suggestions: ["¿Cuánta luz necesita un Pothos?", "Mi monstera tiene hojas amarillas", "¿Cada cuánto debo regar?"],
    },
    cookies: {
      title: "Privacidad y consentimiento",
      body: "Usamos almacenamiento local del navegador para guardar tu progreso, idioma y preferencias. No se envían datos a servidores externos. Puedes ajustar las categorías cuando quieras.",
      essential: "Esencial",
      essentialDesc: "Progreso del curso, idioma, preferencias UI. Imprescindible para que la academia funcione.",
      analytics: "Analítica anónima",
      analyticsDesc: "Métricas de uso agregadas, sin identificadores personales. Puedes desactivarlo.",
      acceptAll: "Aceptar todo",
      onlyEssential: "Solo esencial",
      customize: "Personalizar",
      save: "Guardar preferencias",
      learnMore: "Más información",
    },
    achievement: {
      title: "Lo lograste",
      sub: "Ya tienes los fundamentos para construir agentes en Claude. Lo demás es práctica.",
      unlocked: "Logro desbloqueado",
    },
  },
  en: {
    brand: { name: "Agent Academy", tag: "Interactive course" },
    nav: {
      sections: {
        Foundations: "Foundations",
        Construction: "Construction",
        Refinement: "Refinement",
        Mastery: "Mastery",
      },
      searchPlaceholder: "Search module…",
      progress: "Your progress",
      language: "Language",
    },
    header: { course: "Course" },
    levels: {
      foundations: "Foundations",
      advanced: "Advanced",
      expert: "Expert",
      foundationsDesc: "Grasp the essential concepts",
      advancedDesc: "Apply in real cases",
      expertDesc: "Design robust systems",
    },
    skills: {
      label: "Skill unlocked",
      core: "Core Skills",
      applied: "Applied Skills",
      essentials: "Claude Code Essentials",
    },
    nav_btn: {
      previous: "Previous",
      finish: "Finish",
      continue: "Continue",
      markAndContinue: "Mark and continue",
      completeCourse: "Complete course",
    },
    hero: {
      eyebrow: "Interactive course · Professional academy",
      title1: "Build agents in",
      title2: "Claude",
      title3: "like an engineer, not a user.",
      sub: "A leveled academy that takes you from zero to designing production-grade agent systems. Real practice, concrete examples, measurable progression.",
      meta: {
        modules: "10 modules",
        time: "≈ 3 hours",
        levels: "3 levels per module",
        skills: "Integrated skills",
      },
    },
    module: {
      validate: "Quick validation",
      practice: "Practice",
      exercise: "Exercise",
      example: "Example",
      compare: "Comparison",
      simulator: "Simulator",
      tryAgent: "Try the agent",
      checklist: "Validation checklist",
      realCases: "Real cases",
      typicalIter: "Typical iterations",
      executiveSummary: "Executive summary",
      nextStep: "Next step",
      goClaude: "Open Claude",
      problem: "Problem",
      solution: "Solution",
    },
    sim: {
      title: "Verde · Plant assistant",
      tag: "Simulation",
      empty: "Try the agent you're about to learn to build.",
      placeholder: "Type your question…",
      send: "Send",
      apiHint: "Connect your Claude API key for real responses",
      apiPlaceholder: "sk-ant-... (optional)",
      apiConnected: "API connected",
      apiSimulated: "Simulation mode",
      apiError: "Couldn't connect. Check your API key.",
      apiSet: "Save",
      apiRemove: "Remove",
      typing: "typing…",
      reset: "Reset",
      suggestions: ["How much light does a Pothos need?", "My monstera has yellow leaves", "How often should I water?"],
    },
    cookies: {
      title: "Privacy and consent",
      body: "We use browser local storage to save your progress, language and preferences. No data is sent to external servers. You can adjust categories anytime.",
      essential: "Essential",
      essentialDesc: "Course progress, language, UI preferences. Required for the academy to work.",
      analytics: "Anonymous analytics",
      analyticsDesc: "Aggregated usage metrics, no personal identifiers. You can disable it.",
      acceptAll: "Accept all",
      onlyEssential: "Essential only",
      customize: "Customize",
      save: "Save preferences",
      learnMore: "Learn more",
    },
    achievement: {
      title: "You did it",
      sub: "You now have the foundations to build agents in Claude. The rest is practice.",
      unlocked: "Achievement unlocked",
    },
  },
  pt: {
    brand: { name: "Agent Academy", tag: "Curso interativo" },
    nav: {
      sections: {
        Foundations: "Fundamentos",
        Construction: "Construção",
        Refinement: "Refinamento",
        Mastery: "Maestria",
      },
      searchPlaceholder: "Buscar módulo…",
      progress: "Seu progresso",
      language: "Idioma",
    },
    header: { course: "Curso" },
    levels: {
      foundations: "Fundamentos",
      advanced: "Avançado",
      expert: "Especialista",
      foundationsDesc: "Compreenda os conceitos essenciais",
      advancedDesc: "Aplique em casos reais",
      expertDesc: "Projete sistemas robustos",
    },
    skills: {
      label: "Habilidade desbloqueada",
      core: "Core Skills",
      applied: "Applied Skills",
      essentials: "Claude Code Essentials",
    },
    nav_btn: {
      previous: "Anterior",
      finish: "Finalizar",
      continue: "Continuar",
      markAndContinue: "Marcar e continuar",
      completeCourse: "Concluir curso",
    },
    hero: {
      eyebrow: "Curso interativo · Academia profissional",
      title1: "Construa agentes no",
      title2: "Claude",
      title3: "como um engenheiro, não como um usuário.",
      sub: "Uma academia estruturada por níveis que leva você do zero ao design de sistemas de agentes em produção. Prática real, exemplos concretos, progressão mensurável.",
      meta: {
        modules: "10 módulos",
        time: "≈ 3 horas",
        levels: "3 níveis por módulo",
        skills: "Habilidades integradas",
      },
    },
    module: {
      validate: "Validação rápida",
      practice: "Prática",
      exercise: "Exercício",
      example: "Exemplo",
      compare: "Comparação",
      simulator: "Simulador",
      tryAgent: "Teste o agente",
      checklist: "Checklist de validação",
      realCases: "Casos reais",
      typicalIter: "Iterações típicas",
      executiveSummary: "Resumo executivo",
      nextStep: "Próximo passo",
      goClaude: "Abrir Claude",
      problem: "Problema",
      solution: "Solução",
    },
    sim: {
      title: "Verde · Assistente de plantas",
      tag: "Simulação",
      empty: "Teste o agente que você vai aprender a construir.",
      placeholder: "Digite sua pergunta…",
      send: "Enviar",
      apiHint: "Conecte sua chave de API Claude para respostas reais",
      apiPlaceholder: "sk-ant-... (opcional)",
      apiConnected: "API conectada",
      apiSimulated: "Modo simulação",
      apiError: "Não foi possível conectar. Verifique sua chave.",
      apiSet: "Salvar",
      apiRemove: "Remover",
      typing: "digitando…",
      reset: "Reiniciar",
      suggestions: ["Quanta luz uma Pothos precisa?", "Minha monstera tem folhas amarelas", "Com que frequência devo regar?"],
    },
    cookies: {
      title: "Privacidade e consentimento",
      body: "Usamos armazenamento local do navegador para salvar seu progresso, idioma e preferências. Nenhum dado é enviado para servidores externos. Você pode ajustar as categorias a qualquer momento.",
      essential: "Essencial",
      essentialDesc: "Progresso do curso, idioma, preferências de UI. Necessário para o funcionamento.",
      analytics: "Analítica anônima",
      analyticsDesc: "Métricas de uso agregadas, sem identificadores pessoais. Pode ser desativada.",
      acceptAll: "Aceitar tudo",
      onlyEssential: "Somente essencial",
      customize: "Personalizar",
      save: "Salvar preferências",
      learnMore: "Mais informações",
    },
    achievement: {
      title: "Você conseguiu",
      sub: "Você já tem os fundamentos para construir agentes no Claude. O resto é prática.",
      unlocked: "Conquista desbloqueada",
    },
  },
};

const I18nContext = createContext({ lang: "es", t: translations.es, setLang: () => {} });

function useT() {
  return useContext(I18nContext);
}

function I18nProvider({ children }) {
  const [lang, setLang] = usePersistentState(KEYS.LANG, "es");
  const t = translations[lang] || translations.es;
  return (
    <I18nContext.Provider value={{ lang, t, setLang }}>
      {children}
    </I18nContext.Provider>
  );
}

/* ============================================================================
   DESIGN TOKENS (production-grade, contrast-corrected)
   ========================================================================== */

const DESIGN_TOKENS = `
  :root {
    /* Color system */
    --bg-base: #0a0a0b;
    --bg-surface: #111113;
    --bg-elevated: #16161a;
    --bg-hover: #1c1c21;
    --bg-active: #232329;
    --bg-glass: rgba(22, 22, 26, 0.72);

    --border-subtle: #1f1f24;
    --border-default: #2a2a31;
    --border-strong: #3a3a44;
    --border-focus: #6366f1;

    /* Text scale — contrast-audited */
    --text-h: #fafafb;
    --text-primary: #ededef;
    --text-secondary: #b4b4be;   /* raised from #a1a1aa to AA on bg-surface */
    --text-tertiary: #8b8b95;    /* raised from #71717a */
    --text-muted: #6a6a73;       /* raised from #52525b */
    --text-inverse: #0a0a0b;

    /* Accent — lila + cian as required */
    --accent: #818cf8;
    --accent-strong: #6366f1;
    --accent-deep: #4f46e5;
    --accent-bg: rgba(99, 102, 241, 0.12);
    --accent-bg-strong: rgba(99, 102, 241, 0.22);
    --accent-border: rgba(129, 140, 248, 0.38);
    --accent-glow: rgba(129, 140, 248, 0.55);

    --cyan: #67e8f9;
    --cyan-strong: #22d3ee;
    --cyan-bg: rgba(34, 211, 238, 0.10);
    --cyan-border: rgba(103, 232, 249, 0.32);

    --success: #34d399;
    --success-bg: rgba(52, 211, 153, 0.10);
    --success-border: rgba(52, 211, 153, 0.32);

    --warning: #fbbf24;
    --warning-bg: rgba(251, 191, 36, 0.10);
    --warning-border: rgba(251, 191, 36, 0.32);

    --danger: #f87171;
    --danger-bg: rgba(248, 113, 113, 0.10);
    --danger-border: rgba(248, 113, 113, 0.32);

    --info: #60a5fa;
    --info-bg: rgba(96, 165, 250, 0.10);
    --info-border: rgba(96, 165, 250, 0.32);

    /* Spacing — 4px scale */
    --s-1: 4px; --s-2: 8px; --s-3: 12px; --s-4: 16px; --s-5: 20px;
    --s-6: 24px; --s-8: 32px; --s-10: 40px; --s-12: 48px; --s-16: 64px; --s-20: 80px;

    --r-sm: 4px; --r-md: 6px; --r-lg: 8px; --r-xl: 12px; --r-2xl: 16px; --r-3xl: 24px;

    --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    --font-mono: 'JetBrains Mono', 'SF Mono', Menlo, monospace;
    --font-display: 'Inter', -apple-system, sans-serif;

    --fs-xs: 11px; --fs-sm: 13px; --fs-base: 14px; --fs-body: 15px;
    --fs-md: 15px; --fs-lg: 17px; --fs-xl: 20px; --fs-2xl: 24px;
    --fs-3xl: 30px; --fs-4xl: 38px; --fs-display: 56px;

    --lh-tight: 1.2; --lh-snug: 1.4; --lh-normal: 1.5; --lh-relaxed: 1.65;
    --fw-normal: 400; --fw-medium: 500; --fw-semibold: 600; --fw-bold: 700;
    --ls-tight: -0.011em; --ls-tighter: -0.025em; --ls-wide: 0.04em;

    --shadow-sm: 0 1px 2px rgba(0,0,0,0.4);
    --shadow-md: 0 4px 12px rgba(0,0,0,0.5);
    --shadow-lg: 0 12px 32px rgba(0,0,0,0.6);
    --shadow-glow: 0 0 32px var(--accent-bg-strong);

    --t-fast: 120ms cubic-bezier(0.4, 0, 0.2, 1);
    --t-base: 180ms cubic-bezier(0.4, 0, 0.2, 1);
    --t-slow: 280ms cubic-bezier(0.4, 0, 0.2, 1);

    --sidebar-width: 268px;
    --header-height: 56px;
    --content-max: 860px;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; }

  body {
    font-family: var(--font-sans);
    font-size: var(--fs-base);
    line-height: var(--lh-normal);
    color: var(--text-primary);
    background: var(--bg-base);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-feature-settings: "cv11", "ss01", "ss03";
  }

  ::selection { background: var(--accent-bg-strong); color: var(--text-h); }

  :focus { outline: none; }
  :focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
    border-radius: var(--r-sm);
  }

  ::-webkit-scrollbar { width: 8px; height: 8px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border-default); border-radius: 8px; border: 2px solid transparent; background-clip: padding-box; }
  ::-webkit-scrollbar-thumb:hover { background: var(--border-strong); background-clip: padding-box; }
  * { scrollbar-width: thin; scrollbar-color: var(--border-default) transparent; }

  button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }
  button:disabled { cursor: not-allowed; }
  input, textarea { font-family: inherit; }

  /* ============ APP LAYOUT ============ */
  .app {
    display: grid;
    grid-template-columns: var(--sidebar-width) 1fr;
    height: 100vh;
    overflow: hidden;
  }
  @media (max-width: 900px) { .app { grid-template-columns: 1fr; } }

  /* ============ SIDEBAR ============ */
  .sidebar {
    background: var(--bg-surface);
    border-right: 1px solid var(--border-subtle);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
  }
  @media (max-width: 900px) {
    .sidebar {
      position: fixed;
      left: 0; top: 0; bottom: 0;
      width: 280px;
      z-index: 100;
      transform: translateX(-100%);
      transition: transform var(--t-base);
    }
    .sidebar.open { transform: translateX(0); }
  }

  .sidebar__brand {
    height: var(--header-height);
    padding: 0 var(--s-5);
    display: flex;
    align-items: center;
    gap: var(--s-3);
    border-bottom: 1px solid var(--border-subtle);
    flex-shrink: 0;
  }
  .brand-mark {
    width: 28px; height: 28px;
    border-radius: var(--r-md);
    background: linear-gradient(135deg, var(--accent), var(--accent-deep));
    display: grid;
    place-items: center;
    color: white;
    box-shadow: 0 0 0 1px var(--accent-border), 0 4px 12px var(--accent-bg-strong);
  }
  .brand-name {
    font-size: var(--fs-md);
    font-weight: var(--fw-semibold);
    letter-spacing: -0.01em;
    color: var(--text-h);
  }
  .brand-tag { font-size: var(--fs-xs); color: var(--text-tertiary); margin-top: 1px; }

  .sidebar__search { padding: var(--s-3) var(--s-4) var(--s-2); flex-shrink: 0; }
  .search-wrap { position: relative; }
  .search-wrap > svg {
    position: absolute;
    left: var(--s-3);
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-tertiary);
    pointer-events: none;
  }
  .search-input {
    width: 100%;
    height: 32px;
    background: var(--bg-base);
    border: 1px solid var(--border-subtle);
    border-radius: var(--r-md);
    padding: 0 var(--s-3) 0 32px;
    font-size: var(--fs-sm);
    color: var(--text-primary);
    transition: border-color var(--t-fast);
  }
  .search-input:focus { outline: none; border-color: var(--border-strong); }
  .search-input::placeholder { color: var(--text-tertiary); }

  .sidebar__nav {
    flex: 1;
    overflow-y: auto;
    padding: var(--s-2) var(--s-3) var(--s-4);
  }
  .nav-section {
    padding: var(--s-4) var(--s-3) var(--s-1);
    font-size: 10px;
    font-weight: var(--fw-semibold);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-tertiary);
  }
  .nav-section:first-child { padding-top: var(--s-2); }

  .nav-item {
    display: flex;
    align-items: center;
    gap: var(--s-3);
    padding: 7px var(--s-3);
    border-radius: var(--r-md);
    color: var(--text-secondary);
    font-size: var(--fs-sm);
    font-weight: var(--fw-medium);
    text-align: left;
    width: 100%;
    transition: background var(--t-fast), color var(--t-fast);
    margin-bottom: 1px;
    position: relative;
  }
  .nav-item:hover { background: var(--bg-hover); color: var(--text-h); }
  .nav-item.active {
    background: var(--bg-active);
    color: var(--text-h);
    box-shadow: inset 2px 0 0 var(--accent);
  }
  .nav-item__icon { width: 16px; height: 16px; flex-shrink: 0; color: var(--text-tertiary); }
  .nav-item.active .nav-item__icon, .nav-item:hover .nav-item__icon { color: var(--text-h); }
  .nav-item__num {
    font-size: 10px;
    font-family: var(--font-mono);
    color: var(--text-tertiary);
    margin-left: auto;
    flex-shrink: 0;
  }
  .nav-item__check { width: 14px; height: 14px; margin-left: auto; color: var(--success); flex-shrink: 0; }

  .sidebar__footer {
    padding: var(--s-3) var(--s-4);
    border-top: 1px solid var(--border-subtle);
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: var(--s-3);
  }

  /* Language selector */
  .lang-switch {
    display: flex;
    gap: 2px;
    padding: 3px;
    background: var(--bg-elevated);
    border: 1px solid var(--border-subtle);
    border-radius: var(--r-md);
  }
  .lang-switch__btn {
    flex: 1;
    height: 24px;
    border-radius: 3px;
    font-size: 10px;
    font-weight: var(--fw-semibold);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-tertiary);
    transition: all var(--t-fast);
  }
  .lang-switch__btn:hover { color: var(--text-primary); }
  .lang-switch__btn--active {
    background: var(--bg-active);
    color: var(--accent);
    box-shadow: 0 0 0 1px var(--accent-border);
  }

  .progress-card {
    background: var(--bg-elevated);
    border: 1px solid var(--border-subtle);
    border-radius: var(--r-md);
    padding: var(--s-3);
  }
  .progress-card__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--s-2);
  }
  .progress-card__label { font-size: var(--fs-xs); color: var(--text-secondary); font-weight: var(--fw-medium); }
  .progress-card__value { font-size: var(--fs-xs); font-family: var(--font-mono); color: var(--text-h); font-weight: var(--fw-semibold); }
  .progress-bar {
    height: 4px;
    background: var(--border-subtle);
    border-radius: 2px;
    overflow: hidden;
  }
  .progress-bar__fill {
    height: 100%;
    background: linear-gradient(90deg, var(--accent), var(--cyan-strong));
    border-radius: 2px;
    transition: width var(--t-slow);
  }

  /* ============ MAIN ============ */
  .main { overflow-y: auto; background: var(--bg-base); position: relative; }

  .header {
    height: var(--header-height);
    border-bottom: 1px solid var(--border-subtle);
    background: rgba(10, 10, 11, 0.85);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    position: sticky;
    top: 0;
    z-index: 50;
    display: flex;
    align-items: center;
    padding: 0 var(--s-6);
    gap: var(--s-4);
  }
  .header__crumbs {
    display: flex;
    align-items: center;
    gap: var(--s-2);
    font-size: var(--fs-sm);
    color: var(--text-secondary);
    min-width: 0;
  }
  .header__crumbs > * { flex-shrink: 0; }
  .header__crumbs > .header__crumb-current {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex-shrink: 1;
    color: var(--text-h);
    font-weight: var(--fw-medium);
  }
  .header__crumb-sep { color: var(--text-tertiary); flex-shrink: 0; }

  .header__spacer { flex: 1; }
  .header__meta {
    display: flex;
    align-items: center;
    gap: var(--s-2);
    height: 28px;
    padding: 0 var(--s-3);
    border-radius: var(--r-md);
    font-size: var(--fs-xs);
    color: var(--text-secondary);
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    font-variant-numeric: tabular-nums;
  }
  @media (max-width: 720px) { .header__meta { display: none; } }
  .header__menu-btn {
    display: none;
    width: 32px; height: 32px;
    align-items: center;
    justify-content: center;
    border-radius: var(--r-md);
    color: var(--text-secondary);
  }
  .header__menu-btn:hover { background: var(--bg-hover); color: var(--text-h); }
  @media (max-width: 900px) { .header__menu-btn { display: flex; } }

  .content {
    max-width: var(--content-max);
    margin: 0 auto;
    padding: var(--s-12) var(--s-6) var(--s-20);
  }
  @media (max-width: 600px) { .content { padding: var(--s-8) var(--s-5) var(--s-16); } }

  /* ============ TYPOGRAPHY ============ */
  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: var(--s-2);
    font-size: 11px;
    font-weight: var(--fw-semibold);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--accent);
    margin-bottom: var(--s-3);
  }
  .eyebrow__dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 10px var(--accent);
  }

  .h1 {
    font-size: var(--fs-3xl);
    font-weight: var(--fw-semibold);
    line-height: 1.15;
    letter-spacing: -0.02em;
    color: var(--text-h);
    margin-bottom: var(--s-3);
  }
  @media (max-width: 600px) { .h1 { font-size: var(--fs-2xl); } }

  .h2 {
    font-size: var(--fs-xl);
    font-weight: var(--fw-semibold);
    line-height: var(--lh-snug);
    letter-spacing: -0.01em;
    color: var(--text-h);
    margin-bottom: var(--s-3);
  }
  .h3 {
    font-size: var(--fs-md);
    font-weight: var(--fw-semibold);
    color: var(--text-h);
    margin-bottom: var(--s-2);
    line-height: 1.35;
  }
  .lede {
    font-size: var(--fs-md);
    line-height: var(--lh-relaxed);
    color: var(--text-secondary);
    max-width: 640px;
  }

  /* CRITICAL CONTRAST FIX — emphasis terms inside body text */
  .term {
    color: var(--accent);
    font-weight: var(--fw-semibold);
    font-feature-settings: "ss01";
  }
  .term--cyan { color: var(--cyan-strong); }
  .term--mono {
    font-family: var(--font-mono);
    font-size: 0.92em;
    background: var(--accent-bg);
    border: 1px solid var(--accent-border);
    padding: 1px 6px;
    border-radius: var(--r-sm);
    color: var(--accent);
  }
  strong { color: var(--text-h); font-weight: var(--fw-semibold); }
  em { color: var(--text-h); font-style: italic; }

  .text-secondary { color: var(--text-secondary); }
  .text-tertiary { color: var(--text-tertiary); }
  .text-muted { color: var(--text-muted); }

  /* ============ CARDS ============ */
  .card {
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    border-radius: var(--r-lg);
    padding: var(--s-5);
    transition: border-color var(--t-fast), background var(--t-fast), transform var(--t-fast);
  }
  .card--interactive { cursor: pointer; }
  .card--interactive:hover { border-color: var(--border-default); background: var(--bg-elevated); }
  .card--elevated { background: var(--bg-elevated); }
  .card--ghost { background: transparent; }
  .card--glow {
    border-color: var(--accent-border);
    box-shadow: 0 0 0 1px var(--accent-border), 0 24px 60px -28px var(--accent-bg-strong);
  }

  .card-icon {
    width: 36px; height: 36px;
    border-radius: var(--r-md);
    background: var(--accent-bg);
    border: 1px solid var(--accent-border);
    display: grid;
    place-items: center;
    color: var(--accent);
    margin-bottom: var(--s-3);
  }
  .card-icon--cyan { background: var(--cyan-bg); border-color: var(--cyan-border); color: var(--cyan-strong); }

  .card-body {
    font-size: var(--fs-sm);
    line-height: var(--lh-relaxed);
    color: var(--text-secondary);
  }
  .card-header-row {
    display: flex;
    align-items: center;
    gap: var(--s-3);
    margin-bottom: var(--s-3);
  }
  .card-header-row__title {
    font-size: var(--fs-base);
    font-weight: var(--fw-semibold);
    color: var(--text-h);
    line-height: 1.3;
  }
  .card-header-row__sub {
    font-size: 10px;
    color: var(--text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-top: 2px;
    font-weight: var(--fw-medium);
  }
  .card-quote {
    font-size: var(--fs-sm);
    color: var(--text-secondary);
    font-style: italic;
    border-left: 2px solid var(--accent-border);
    padding-left: var(--s-3);
    line-height: var(--lh-relaxed);
  }

  /* ============ GRID ============ */
  .grid { display: grid; gap: var(--s-3); }
  .grid--2 { grid-template-columns: repeat(2, 1fr); }
  .grid--3 { grid-template-columns: repeat(3, 1fr); }
  .grid--4 { grid-template-columns: repeat(4, 1fr); }
  @media (max-width: 720px) {
    .grid--2, .grid--3, .grid--4 { grid-template-columns: 1fr; }
  }
  .stack-2 > * + * { margin-top: var(--s-2); }
  .stack-3 > * + * { margin-top: var(--s-3); }
  .stack-4 > * + * { margin-top: var(--s-4); }
  .stack-6 > * + * { margin-top: var(--s-6); }
  .stack-8 > * + * { margin-top: var(--s-8); }
  .stack-10 > * + * { margin-top: var(--s-10); }
  .stack-12 > * + * { margin-top: var(--s-12); }

  /* ============ BUTTONS ============ */
  .btn {
    display: inline-flex;
    align-items: center;
    gap: var(--s-2);
    height: 34px;
    padding: 0 var(--s-4);
    border-radius: var(--r-md);
    font-size: var(--fs-sm);
    font-weight: var(--fw-medium);
    transition: all var(--t-fast);
    border: 1px solid transparent;
    white-space: nowrap;
  }
  .btn--primary { background: var(--accent-strong); color: white; }
  .btn--primary:hover:not(:disabled) { background: var(--accent); }
  .btn--secondary {
    background: var(--bg-elevated);
    border-color: var(--border-default);
    color: var(--text-primary);
  }
  .btn--secondary:hover:not(:disabled) { background: var(--bg-hover); border-color: var(--border-strong); }
  .btn--ghost { color: var(--text-secondary); }
  .btn--ghost:hover:not(:disabled) { background: var(--bg-hover); color: var(--text-h); }
  .btn--danger { background: var(--danger-bg); border-color: var(--danger-border); color: var(--danger); }
  .btn--danger:hover:not(:disabled) { background: rgba(248, 113, 113, 0.18); }
  .btn:disabled { opacity: 0.4; }

  /* ============ STEP BLOCK ============ */
  .step {
    display: grid;
    grid-template-columns: 36px 1fr;
    gap: var(--s-4);
    padding: var(--s-4) 0;
    position: relative;
  }
  .step + .step { border-top: 1px solid var(--border-subtle); }
  .step__num {
    width: 28px; height: 28px;
    border-radius: 50%;
    background: var(--bg-elevated);
    border: 1px solid var(--border-default);
    display: grid;
    place-items: center;
    font-size: var(--fs-xs);
    font-weight: var(--fw-semibold);
    font-family: var(--font-mono);
    color: var(--text-secondary);
    margin-top: 2px;
  }
  .step__title { font-size: var(--fs-base); font-weight: var(--fw-semibold); color: var(--text-h); margin-bottom: var(--s-1); }
  .step__desc { font-size: var(--fs-sm); color: var(--text-secondary); line-height: var(--lh-relaxed); }

  /* ============ STEP HEADER (3-col) ============ */
  .step-header {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--s-3);
    margin-bottom: var(--s-6);
  }
  @media (max-width: 720px) { .step-header { grid-template-columns: 1fr; } }
  .step-header__cell {
    padding: var(--s-4);
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    border-radius: var(--r-lg);
  }
  .step-header__label {
    display: flex;
    align-items: center;
    gap: var(--s-2);
    font-size: var(--fs-xs);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--accent);
    margin-bottom: var(--s-2);
    font-weight: var(--fw-semibold);
  }
  .step-header__text { font-size: var(--fs-sm); color: var(--text-secondary); line-height: var(--lh-relaxed); }

  /* ============ EXPANDABLE ============ */
  .expandable {
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    border-radius: var(--r-lg);
    overflow: hidden;
  }
  .expandable__head {
    width: 100%;
    padding: var(--s-3) var(--s-4);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--s-3);
    transition: background var(--t-fast);
  }
  .expandable__head:hover { background: var(--bg-hover); }
  .expandable__head-left {
    display: flex;
    align-items: center;
    gap: var(--s-3);
    font-size: var(--fs-sm);
    font-weight: var(--fw-medium);
    color: var(--text-h);
  }
  .expandable__chevron { color: var(--text-tertiary); transition: transform var(--t-base); }
  .expandable__chevron--open { transform: rotate(90deg); color: var(--accent); }
  .expandable__body {
    padding: 0 var(--s-4) var(--s-4);
    border-top: 1px solid var(--border-subtle);
    padding-top: var(--s-4);
    font-size: var(--fs-sm);
    color: var(--text-secondary);
    line-height: var(--lh-relaxed);
  }

  /* ============ CHECKLIST ============ */
  .check-item {
    width: 100%;
    text-align: left;
    display: flex;
    gap: var(--s-3);
    padding: var(--s-3) var(--s-4);
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    border-radius: var(--r-md);
    transition: all var(--t-fast);
    align-items: flex-start;
  }
  .check-item:hover { border-color: var(--border-default); background: var(--bg-elevated); }
  .check-item__box {
    width: 18px; height: 18px;
    border-radius: var(--r-sm);
    border: 1.5px solid var(--border-strong);
    display: grid;
    place-items: center;
    flex-shrink: 0;
    margin-top: 1px;
    transition: all var(--t-fast);
  }
  .check-item--checked .check-item__box {
    background: var(--accent-strong);
    border-color: var(--accent-strong);
  }
  .check-item--checked .check-item__box svg { color: white; }
  .check-item__title { font-size: var(--fs-sm); font-weight: var(--fw-medium); color: var(--text-h); margin-bottom: 2px; }
  .check-item--checked .check-item__title { text-decoration: line-through; color: var(--text-tertiary); }
  .check-item__desc { font-size: var(--fs-xs); color: var(--text-secondary); line-height: var(--lh-relaxed); }

  /* ============ CODE BLOCK ============ */
  .codeblock {
    background: #0d0d0f;
    border: 1px solid var(--border-subtle);
    border-radius: var(--r-lg);
    overflow: hidden;
  }
  .codeblock--good { border-color: var(--success-border); }
  .codeblock--bad { border-color: var(--danger-border); }
  .codeblock__head {
    height: 36px;
    padding: 0 var(--s-2) 0 var(--s-4);
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--border-subtle);
    background: var(--bg-elevated);
  }
  .codeblock__title {
    font-size: var(--fs-xs);
    font-family: var(--font-mono);
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    gap: var(--s-2);
  }
  .codeblock__copy {
    display: flex;
    align-items: center;
    gap: 6px;
    height: 24px;
    padding: 0 var(--s-2);
    border-radius: var(--r-sm);
    font-size: var(--fs-xs);
    color: var(--text-tertiary);
    transition: all var(--t-fast);
  }
  .codeblock__copy:hover { background: var(--bg-hover); color: var(--text-h); }
  .codeblock__copy--copied { color: var(--success); }
  .codeblock__body {
    padding: var(--s-4);
    font-family: var(--font-mono);
    font-size: 12.5px;
    line-height: 1.7;
    color: var(--text-primary);
    overflow-x: auto;
    white-space: pre-wrap;
    background: #0d0d0f;
  }
  .codeblock__note {
    padding: var(--s-2) var(--s-4);
    font-size: var(--fs-xs);
    border-top: 1px solid var(--border-subtle);
    background: var(--bg-elevated);
  }
  .codeblock__note--good { color: var(--success); }
  .codeblock__note--bad { color: var(--danger); }

  /* ============ ALERT ============ */
  .alert {
    padding: var(--s-4);
    border-radius: var(--r-lg);
    border: 1px solid;
    display: flex;
    gap: var(--s-3);
    align-items: flex-start;
  }
  .alert__icon { flex-shrink: 0; margin-top: 2px; }
  .alert__title { font-size: var(--fs-sm); font-weight: var(--fw-semibold); margin-bottom: 4px; }
  .alert__body { font-size: var(--fs-sm); line-height: var(--lh-relaxed); color: var(--text-secondary); }
  .alert--info { background: var(--info-bg); border-color: var(--info-border); }
  .alert--info .alert__icon, .alert--info .alert__title { color: var(--info); }
  .alert--warning { background: var(--warning-bg); border-color: var(--warning-border); }
  .alert--warning .alert__icon, .alert--warning .alert__title { color: var(--warning); }
  .alert--success { background: var(--success-bg); border-color: var(--success-border); }
  .alert--success .alert__icon, .alert--success .alert__title { color: var(--success); }
  .alert--danger { background: var(--danger-bg); border-color: var(--danger-border); }
  .alert--danger .alert__icon, .alert--danger .alert__title { color: var(--danger); }

  /* ============ COMPARE CARD ============ */
  .compare {
    padding: var(--s-4);
    border-radius: var(--r-lg);
    border: 1px solid;
  }
  .compare--bad { background: var(--danger-bg); border-color: var(--danger-border); }
  .compare--good { background: var(--success-bg); border-color: var(--success-border); }
  .compare__head {
    display: flex;
    align-items: center;
    gap: var(--s-2);
    margin-bottom: var(--s-3);
    font-size: var(--fs-xs);
    font-weight: var(--fw-semibold);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .compare--bad .compare__head { color: var(--danger); }
  .compare--good .compare__head { color: var(--success); }
  .compare__body {
    font-size: var(--fs-sm);
    color: var(--text-h);
    line-height: var(--lh-relaxed);
    font-family: var(--font-mono);
    padding: var(--s-3);
    background: rgba(0,0,0,0.30);
    border-radius: var(--r-md);
    margin-bottom: var(--s-2);
  }
  .compare__footer { font-size: var(--fs-xs); color: var(--text-secondary); }

  /* ============ QUIZ ============ */
  .quiz {
    background: var(--bg-surface);
    border: 1px solid var(--accent-border);
    border-radius: var(--r-lg);
    padding: var(--s-5);
  }
  .quiz__label {
    display: flex;
    align-items: center;
    gap: var(--s-2);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--accent);
    margin-bottom: var(--s-3);
    font-weight: var(--fw-semibold);
  }
  .quiz__question {
    font-size: var(--fs-md);
    font-weight: var(--fw-medium);
    color: var(--text-h);
    margin-bottom: var(--s-4);
    line-height: var(--lh-snug);
  }
  .quiz__option {
    width: 100%;
    text-align: left;
    display: flex;
    align-items: center;
    gap: var(--s-3);
    padding: var(--s-3) var(--s-4);
    border-radius: var(--r-md);
    border: 1px solid var(--border-subtle);
    background: var(--bg-base);
    color: var(--text-primary);
    font-size: var(--fs-sm);
    transition: all var(--t-fast);
    margin-bottom: var(--s-2);
  }
  .quiz__option:last-child { margin-bottom: 0; }
  .quiz__option:hover:not(:disabled) {
    border-color: var(--border-default);
    color: var(--text-h);
    background: var(--bg-elevated);
  }
  .quiz__option--correct {
    border-color: var(--success-border);
    background: var(--success-bg);
    color: var(--success);
    animation: pop 280ms cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .quiz__option--wrong {
    border-color: var(--danger-border);
    background: var(--danger-bg);
    color: var(--danger);
    animation: shake 320ms cubic-bezier(0.36, 0.07, 0.19, 0.97);
  }
  @keyframes pop {
    0% { transform: scale(0.98); }
    50% { transform: scale(1.01); }
    100% { transform: scale(1); }
  }
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-3px); }
    75% { transform: translateX(3px); }
  }
  .quiz__letter {
    font-family: var(--font-mono);
    font-size: var(--fs-xs);
    color: var(--text-tertiary);
    width: 18px;
    flex-shrink: 0;
  }
  .quiz__feedback {
    margin-top: var(--s-3);
    padding: var(--s-3);
    border-radius: var(--r-md);
    font-size: var(--fs-sm);
    background: var(--bg-elevated);
    border-left: 2px solid var(--accent);
    color: var(--text-secondary);
    line-height: var(--lh-relaxed);
  }

  /* ============ AGENT SIMULATOR ============ */
  .sim {
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    border-radius: var(--r-lg);
    overflow: hidden;
  }
  .sim__head {
    min-height: 40px;
    padding: var(--s-2) var(--s-4);
    display: flex;
    align-items: center;
    gap: var(--s-3);
    border-bottom: 1px solid var(--border-subtle);
    background: var(--bg-elevated);
    flex-wrap: wrap;
  }
  .sim__status {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--success);
    box-shadow: 0 0 8px var(--success);
  }
  .sim__status--api {
    background: var(--accent);
    box-shadow: 0 0 8px var(--accent);
  }
  .sim__title {
    font-size: var(--fs-sm);
    font-weight: var(--fw-semibold);
    color: var(--text-h);
  }
  .sim__tag {
    margin-left: auto;
    font-size: var(--fs-xs);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--text-tertiary);
    font-family: var(--font-mono);
    display: flex;
    align-items: center;
    gap: var(--s-2);
  }
  .sim__head-btn {
    height: 26px;
    padding: 0 var(--s-2);
    font-size: var(--fs-xs);
    color: var(--text-tertiary);
    border-radius: var(--r-sm);
    display: inline-flex;
    align-items: center;
    gap: 4px;
    transition: all var(--t-fast);
  }
  .sim__head-btn:hover { background: var(--bg-hover); color: var(--text-h); }
  .sim__api-bar {
    width: 100%;
    padding: var(--s-3) var(--s-4);
    background: var(--bg-base);
    border-bottom: 1px solid var(--border-subtle);
    display: flex;
    gap: var(--s-2);
    align-items: center;
  }
  .sim__api-input {
    flex: 1;
    background: var(--bg-elevated);
    border: 1px solid var(--border-subtle);
    border-radius: var(--r-sm);
    padding: 6px var(--s-3);
    height: 30px;
    color: var(--text-primary);
    font-size: var(--fs-xs);
    font-family: var(--font-mono);
  }
  .sim__api-input:focus { outline: none; border-color: var(--accent-border); }
  .sim__api-hint {
    font-size: var(--fs-xs);
    color: var(--text-tertiary);
    line-height: 1.4;
  }
  .sim__body {
    padding: var(--s-4);
    min-height: 280px;
    max-height: 420px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: var(--s-3);
  }
  .sim__row { display: flex; gap: var(--s-2); max-width: 92%; align-items: flex-start; }
  .sim__row--user { align-self: flex-end; }
  .sim__row--bot { align-self: flex-start; }
  .sim__msg--user {
    background: var(--bg-active);
    padding: var(--s-2) var(--s-3);
    border-radius: 12px 12px 2px 12px;
    font-size: var(--fs-sm);
    color: var(--text-h);
    line-height: var(--lh-relaxed);
  }
  .sim__msg--bot {
    background: var(--accent-bg);
    border: 1px solid var(--accent-border);
    padding: var(--s-3) var(--s-4);
    border-radius: 12px 12px 12px 2px;
    font-size: var(--fs-sm);
    color: var(--text-h);
    line-height: var(--lh-relaxed);
    flex: 1;
  }
  .sim__msg--bot--error {
    background: var(--danger-bg);
    border-color: var(--danger-border);
    color: var(--danger);
  }
  .sim__avatar {
    width: 28px; height: 28px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--accent), var(--accent-deep));
    display: grid;
    place-items: center;
    flex-shrink: 0;
    color: white;
    margin-top: 2px;
    box-shadow: 0 0 0 1px var(--accent-border), 0 4px 10px var(--accent-bg-strong);
  }
  .sim__empty {
    text-align: center;
    color: var(--text-tertiary);
    font-size: var(--fs-sm);
    padding: var(--s-8) var(--s-4);
    line-height: var(--lh-relaxed);
  }
  .sim__suggest {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    justify-content: center;
    margin-top: var(--s-4);
  }
  .sim__chip {
    font-size: var(--fs-xs);
    padding: 6px var(--s-3);
    background: var(--bg-elevated);
    border: 1px solid var(--border-subtle);
    border-radius: 14px;
    color: var(--text-secondary);
    transition: all var(--t-fast);
  }
  .sim__chip:hover { border-color: var(--accent-border); color: var(--accent); background: var(--accent-bg); }
  .sim__cursor {
    display: inline-block;
    width: 6px;
    height: 14px;
    background: var(--accent);
    margin-left: 2px;
    animation: blink 1s infinite;
    vertical-align: text-bottom;
  }
  @keyframes blink { 0%, 50% { opacity: 1; } 50.01%, 100% { opacity: 0; } }
  .sim__loading {
    display: inline-flex;
    align-items: center;
    gap: var(--s-2);
    color: var(--text-tertiary);
    font-size: var(--fs-xs);
    font-style: italic;
  }
  @keyframes spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }
  .sim__loading svg { animation: spin 1s linear infinite; }

  .sim__footer {
    border-top: 1px solid var(--border-subtle);
    padding: var(--s-2);
    display: flex;
    gap: var(--s-2);
    background: var(--bg-elevated);
  }
  .sim__input {
    flex: 1;
    background: var(--bg-base);
    border: 1px solid var(--border-subtle);
    border-radius: var(--r-md);
    padding: 0 var(--s-3);
    height: 32px;
    color: var(--text-h);
    font-size: var(--fs-sm);
    transition: border-color var(--t-fast);
  }
  .sim__input:focus { outline: none; border-color: var(--accent-border); }

  /* ============ HERO ============ */
  .hero {
    padding-bottom: var(--s-10);
    border-bottom: 1px solid var(--border-subtle);
    margin-bottom: var(--s-10);
  }
  .hero__title {
    font-size: var(--fs-4xl);
    font-weight: var(--fw-semibold);
    line-height: 1.08;
    letter-spacing: -0.025em;
    color: var(--text-h);
    margin-bottom: var(--s-4);
    max-width: 720px;
  }
  @media (max-width: 600px) { .hero__title { font-size: var(--fs-3xl); } }
  .hero__title-em {
    background: linear-gradient(135deg, var(--accent) 0%, var(--cyan-strong) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .hero__sub {
    font-size: var(--fs-md);
    color: var(--text-secondary);
    line-height: var(--lh-relaxed);
    max-width: 580px;
    margin-bottom: var(--s-6);
  }
  .hero__meta {
    display: flex;
    flex-wrap: wrap;
    gap: var(--s-2) var(--s-5);
    font-size: var(--fs-xs);
    color: var(--text-secondary);
  }
  .hero__meta-item { display: flex; align-items: center; gap: 6px; }
  .hero__meta-item svg { color: var(--accent); }

  /* ============ MODULE HEADER ============ */
  .module-header {
    display: flex;
    gap: var(--s-5);
    align-items: flex-start;
    padding-bottom: var(--s-8);
    border-bottom: 1px solid var(--border-subtle);
    margin-bottom: var(--s-10);
  }
  .module-header__num {
    font-family: var(--font-mono);
    font-size: 13px;
    font-weight: var(--fw-semibold);
    color: var(--accent);
    padding: 4px 10px;
    border: 1px solid var(--accent-border);
    border-radius: var(--r-md);
    background: var(--accent-bg);
    flex-shrink: 0;
    margin-top: 4px;
    letter-spacing: 0.05em;
  }
  .module-header__main { flex: 1; min-width: 0; }

  /* ============ LEVEL TABS (PEDAGOGICAL CORE) ============ */
  .levels {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--s-2);
    margin-bottom: var(--s-8);
    padding: var(--s-2);
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    border-radius: var(--r-lg);
  }
  @media (max-width: 600px) { .levels { grid-template-columns: 1fr; } }
  .level-tab {
    display: flex;
    align-items: flex-start;
    gap: var(--s-3);
    padding: var(--s-3) var(--s-4);
    background: transparent;
    border: 1px solid transparent;
    border-radius: var(--r-md);
    text-align: left;
    transition: all var(--t-fast);
    color: var(--text-secondary);
    position: relative;
  }
  .level-tab:hover { background: var(--bg-elevated); color: var(--text-h); }
  .level-tab--active {
    background: var(--bg-elevated);
    border-color: var(--accent-border);
    color: var(--text-h);
    box-shadow: 0 0 0 1px var(--accent-border) inset, 0 8px 24px -12px var(--accent-bg-strong);
  }
  .level-tab__num {
    width: 28px; height: 28px;
    border-radius: var(--r-md);
    background: var(--bg-base);
    border: 1px solid var(--border-default);
    display: grid;
    place-items: center;
    font-family: var(--font-mono);
    font-size: var(--fs-xs);
    font-weight: var(--fw-semibold);
    color: var(--text-tertiary);
    flex-shrink: 0;
  }
  .level-tab--active .level-tab__num {
    background: var(--accent-bg);
    border-color: var(--accent-border);
    color: var(--accent);
  }
  .level-tab__num--lvl1 .lvl-dot { color: var(--success); }
  .level-tab__num--lvl2 .lvl-dot { color: var(--warning); }
  .level-tab__num--lvl3 .lvl-dot { color: var(--danger); }
  .level-tab__title {
    font-size: var(--fs-sm);
    font-weight: var(--fw-semibold);
    line-height: 1.2;
    margin-bottom: 2px;
    color: inherit;
  }
  .level-tab__desc {
    font-size: var(--fs-xs);
    color: var(--text-tertiary);
    line-height: 1.35;
  }
  .level-tab__check {
    position: absolute;
    top: var(--s-2);
    right: var(--s-2);
    color: var(--success);
  }

  /* Skill chip — integrated in modules */
  .skill-chip {
    display: inline-flex;
    align-items: center;
    gap: var(--s-2);
    padding: 4px 10px;
    background: var(--cyan-bg);
    border: 1px solid var(--cyan-border);
    border-radius: 14px;
    font-size: var(--fs-xs);
    color: var(--cyan-strong);
    font-weight: var(--fw-medium);
  }
  .skill-banner {
    display: flex;
    align-items: center;
    gap: var(--s-3);
    padding: var(--s-3) var(--s-4);
    background: linear-gradient(135deg, var(--accent-bg) 0%, var(--cyan-bg) 100%);
    border: 1px solid var(--accent-border);
    border-radius: var(--r-md);
  }
  .skill-banner__icon {
    width: 32px; height: 32px;
    border-radius: var(--r-sm);
    background: var(--bg-base);
    border: 1px solid var(--accent-border);
    display: grid;
    place-items: center;
    color: var(--accent);
    flex-shrink: 0;
  }
  .skill-banner__label {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--accent);
    font-weight: var(--fw-semibold);
  }
  .skill-banner__title {
    font-size: var(--fs-sm);
    color: var(--text-h);
    font-weight: var(--fw-semibold);
    line-height: 1.3;
  }

  /* ============ EDITOR ============ */
  .editor {
    background: #0d0d0f;
    border: 1px solid var(--border-subtle);
    border-radius: var(--r-lg);
    overflow: hidden;
  }
  .editor__head {
    height: 36px;
    padding: 0 var(--s-3) 0 var(--s-4);
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--bg-elevated);
    border-bottom: 1px solid var(--border-subtle);
  }
  .editor__filename {
    font-family: var(--font-mono);
    font-size: var(--fs-xs);
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .editor textarea {
    width: 100%;
    background: transparent;
    color: var(--text-h);
    border: 0;
    padding: var(--s-4);
    font-family: var(--font-mono);
    font-size: 12.5px;
    line-height: 1.7;
    resize: none;
    min-height: 160px;
  }
  .editor textarea:focus { outline: none; }

  /* ============ MODULE NAV ============ */
  .module-nav {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--s-3);
    margin-top: var(--s-12);
    padding-top: var(--s-6);
    border-top: 1px solid var(--border-subtle);
  }
  @media (max-width: 600px) { .module-nav { grid-template-columns: 1fr; } }
  .module-nav__btn {
    padding: var(--s-3) var(--s-4);
    border: 1px solid var(--border-subtle);
    border-radius: var(--r-lg);
    background: var(--bg-surface);
    text-align: left;
    transition: all var(--t-fast);
    cursor: pointer;
  }
  .module-nav__btn:hover:not(:disabled) {
    border-color: var(--border-default);
    background: var(--bg-elevated);
  }
  .module-nav__btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .module-nav__btn--next {
    text-align: right;
    background: var(--accent-bg);
    border-color: var(--accent-border);
  }
  .module-nav__btn--next:hover:not(:disabled) {
    background: var(--accent-bg-strong);
    border-color: var(--accent);
  }
  .module-nav__btn--next .module-nav__label { color: var(--accent); }
  .module-nav__label {
    font-size: var(--fs-xs);
    color: var(--text-tertiary);
    margin-bottom: 4px;
    font-weight: var(--fw-medium);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .module-nav__title {
    font-size: var(--fs-sm);
    font-weight: var(--fw-semibold);
    color: var(--text-h);
    display: flex;
    align-items: center;
    gap: var(--s-2);
  }
  .module-nav__btn--next .module-nav__title { justify-content: flex-end; }

  /* ============ DIAGRAM ============ */
  .diagram {
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    border-radius: var(--r-lg);
    padding: var(--s-5);
  }
  .diagram__title {
    font-size: var(--fs-xs);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--accent);
    margin-bottom: var(--s-4);
    font-weight: var(--fw-semibold);
  }

  /* ============ OVERLAY ============ */
  .overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.6);
    z-index: 99;
  }
  @media (max-width: 900px) { .overlay.show { display: block; } }

  /* ============ ERROR LIST ============ */
  .error-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--s-3);
  }
  @media (max-width: 720px) { .error-list { grid-template-columns: 1fr; } }
  .error-card {
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    border-radius: var(--r-lg);
    padding: var(--s-4) var(--s-5);
    display: flex;
    flex-direction: column;
    gap: var(--s-3);
    transition: border-color var(--t-fast);
  }
  .error-card:hover { border-color: var(--border-default); }
  .error-card__head { display: flex; align-items: center; gap: var(--s-3); }
  .error-card__icon {
    width: 24px; height: 24px;
    border-radius: var(--r-sm);
    background: var(--danger-bg);
    color: var(--danger);
    display: grid;
    place-items: center;
    flex-shrink: 0;
  }
  .error-card__title {
    font-size: var(--fs-sm);
    font-weight: var(--fw-semibold);
    color: var(--text-h);
    flex: 1;
    line-height: 1.35;
  }
  .error-card__num {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--text-tertiary);
    font-weight: var(--fw-medium);
  }
  .error-card__desc { font-size: var(--fs-sm); color: var(--text-secondary); line-height: var(--lh-relaxed); }
  .error-card__fix {
    display: flex;
    align-items: flex-start;
    gap: var(--s-2);
    padding-top: var(--s-3);
    border-top: 1px dashed var(--border-default);
    font-size: var(--fs-sm);
    color: var(--accent);
    line-height: var(--lh-relaxed);
  }
  .error-card__fix svg { flex-shrink: 0; margin-top: 2px; }

  /* ============ CYCLE ============ */
  .cycle {
    display: flex;
    align-items: stretch;
    gap: var(--s-2);
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    border-radius: var(--r-lg);
    padding: var(--s-5);
  }
  @media (max-width: 720px) {
    .cycle { flex-direction: column; gap: var(--s-4); }
    .cycle__sep { transform: rotate(90deg); align-self: center; }
  }
  .cycle__step {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--s-2);
    min-width: 0;
  }
  .cycle__step-icon {
    width: 32px; height: 32px;
    border-radius: var(--r-md);
    background: var(--accent-bg);
    border: 1px solid var(--accent-border);
    display: grid;
    place-items: center;
    color: var(--accent);
  }
  .cycle__step-num {
    font-size: 10px;
    font-family: var(--font-mono);
    color: var(--text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: var(--fw-semibold);
  }
  .cycle__step-title { font-size: var(--fs-base); font-weight: var(--fw-semibold); color: var(--text-h); }
  .cycle__step-desc { font-size: var(--fs-xs); color: var(--text-secondary); line-height: var(--lh-relaxed); }
  .cycle__sep { color: var(--text-tertiary); align-self: center; flex-shrink: 0; }

  /* ============ ITER EXAMPLES ============ */
  .iter-examples { display: flex; flex-direction: column; gap: var(--s-3); }
  .iter-card {
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    border-radius: var(--r-lg);
    padding: var(--s-4) var(--s-5);
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: var(--s-4);
    align-items: center;
    transition: border-color var(--t-fast);
  }
  .iter-card:hover { border-color: var(--border-default); }
  @media (max-width: 720px) {
    .iter-card { grid-template-columns: 1fr; }
    .iter-card__arrow { transform: rotate(90deg); justify-self: center; }
  }
  .iter-card__col { min-width: 0; }
  .iter-card__label {
    font-size: 10px;
    font-weight: var(--fw-semibold);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: var(--s-1);
  }
  .iter-card__label--bad { color: var(--danger); }
  .iter-card__label--good { color: var(--success); }
  .iter-card__text { font-size: var(--fs-sm); color: var(--text-h); line-height: var(--lh-relaxed); }
  .iter-card__text--mono {
    font-family: var(--font-mono);
    font-size: 12.5px;
    color: var(--text-secondary);
  }
  .iter-card__arrow { color: var(--text-tertiary); flex-shrink: 0; }

  /* ============ CRIT GRID ============ */
  .crit-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--s-2); }
  @media (max-width: 720px) { .crit-grid { grid-template-columns: repeat(2, 1fr); } }
  .crit-cell {
    text-align: center;
    padding: var(--s-4) var(--s-3);
    background: var(--bg-base);
    border: 1px solid var(--border-subtle);
    border-radius: var(--r-md);
    transition: border-color var(--t-fast);
  }
  .crit-cell:hover { border-color: var(--accent-border); }
  .crit-cell__letter {
    font-size: 36px;
    font-weight: var(--fw-semibold);
    line-height: 1;
    background: linear-gradient(135deg, var(--accent), var(--cyan-strong));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: var(--s-2);
    letter-spacing: -0.02em;
  }
  .crit-cell__name { font-size: var(--fs-sm); font-weight: var(--fw-semibold); color: var(--text-h); margin-bottom: 2px; }
  .crit-cell__desc { font-size: var(--fs-xs); color: var(--text-secondary); line-height: var(--lh-snug); }

  /* ============ MANTRAS ============ */
  .mantras {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--s-2);
  }
  @media (max-width: 720px) { .mantras { grid-template-columns: 1fr; } }
  .mantra {
    display: flex;
    align-items: center;
    gap: var(--s-3);
    padding: var(--s-3) var(--s-4);
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    border-radius: var(--r-md);
    transition: border-color var(--t-fast), background var(--t-fast);
  }
  .mantra:hover { border-color: var(--border-default); background: var(--bg-elevated); }
  .mantra__num {
    font-family: var(--font-mono);
    font-size: var(--fs-xs);
    font-weight: var(--fw-semibold);
    color: var(--accent);
    min-width: 22px;
    flex-shrink: 0;
  }
  .mantra__text { font-size: var(--fs-sm); color: var(--text-h); line-height: var(--lh-snug); }

  /* ============ NEXT STEP ============ */
  .next-step {
    text-align: center;
    padding: var(--s-8) var(--s-5);
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    border-radius: var(--r-lg);
  }
  .next-step .h3 { margin-bottom: var(--s-2); }
  .next-step__sub {
    font-size: var(--fs-sm);
    color: var(--text-secondary);
    line-height: var(--lh-relaxed);
    max-width: 460px;
    margin: 0 auto var(--s-5);
  }
  .next-step a { text-decoration: none; }

  /* ============ GLOSSARY ============ */
  .glossary {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--s-3) var(--s-5);
    margin-top: var(--s-4);
  }
  @media (max-width: 720px) { .glossary { grid-template-columns: 1fr; } }
  .glossary__row {
    display: grid;
    grid-template-columns: 110px 1fr;
    gap: var(--s-3);
    font-size: var(--fs-sm);
    align-items: baseline;
  }
  .glossary__term {
    font-family: var(--font-mono);
    color: var(--accent);
    font-size: var(--fs-xs);
    font-weight: var(--fw-semibold);
  }
  .glossary__def { color: var(--text-secondary); line-height: var(--lh-snug); }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-in { animation: fadeIn 280ms cubic-bezier(0.4, 0, 0.2, 1); }

  /* ============ COOKIE BANNER ============ */
  .cookie-banner {
    position: fixed;
    bottom: var(--s-5);
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - var(--s-10));
    max-width: 720px;
    z-index: 200;
    background: var(--bg-glass);
    backdrop-filter: blur(20px) saturate(140%);
    -webkit-backdrop-filter: blur(20px) saturate(140%);
    border: 1px solid var(--border-default);
    border-radius: var(--r-xl);
    box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset;
    padding: var(--s-5);
    animation: cookieIn 360ms cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  @keyframes cookieIn {
    from { opacity: 0; transform: translateX(-50%) translateY(20px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
  .cookie-banner__head {
    display: flex;
    align-items: flex-start;
    gap: var(--s-3);
    margin-bottom: var(--s-3);
  }
  .cookie-banner__icon {
    width: 36px; height: 36px;
    border-radius: var(--r-md);
    background: var(--accent-bg);
    border: 1px solid var(--accent-border);
    display: grid;
    place-items: center;
    color: var(--accent);
    flex-shrink: 0;
  }
  .cookie-banner__title {
    font-size: var(--fs-base);
    font-weight: var(--fw-semibold);
    color: var(--text-h);
    margin-bottom: 2px;
  }
  .cookie-banner__body {
    font-size: var(--fs-sm);
    color: var(--text-secondary);
    line-height: var(--lh-relaxed);
  }
  .cookie-banner__categories {
    margin: var(--s-4) 0;
    display: flex;
    flex-direction: column;
    gap: var(--s-2);
  }
  .cookie-cat {
    display: flex;
    align-items: flex-start;
    gap: var(--s-3);
    padding: var(--s-3);
    background: var(--bg-elevated);
    border: 1px solid var(--border-subtle);
    border-radius: var(--r-md);
  }
  .cookie-cat__main { flex: 1; min-width: 0; }
  .cookie-cat__head {
    display: flex;
    align-items: center;
    gap: var(--s-2);
    margin-bottom: 2px;
  }
  .cookie-cat__title {
    font-size: var(--fs-sm);
    font-weight: var(--fw-semibold);
    color: var(--text-h);
  }
  .cookie-cat__locked {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--text-tertiary);
    padding: 2px 6px;
    background: var(--bg-base);
    border-radius: var(--r-sm);
    border: 1px solid var(--border-subtle);
  }
  .cookie-cat__desc {
    font-size: var(--fs-xs);
    color: var(--text-secondary);
    line-height: var(--lh-relaxed);
  }
  .cookie-toggle {
    width: 36px;
    height: 20px;
    border-radius: 10px;
    background: var(--border-default);
    position: relative;
    transition: background var(--t-base);
    flex-shrink: 0;
    margin-top: 2px;
  }
  .cookie-toggle::after {
    content: "";
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px; height: 16px;
    border-radius: 50%;
    background: var(--text-secondary);
    transition: transform var(--t-base), background var(--t-base);
  }
  .cookie-toggle--on { background: var(--accent-strong); }
  .cookie-toggle--on::after { transform: translateX(16px); background: white; }
  .cookie-toggle--locked { background: var(--accent-deep); opacity: 0.6; cursor: not-allowed; }
  .cookie-toggle--locked::after { transform: translateX(16px); background: white; }
  .cookie-banner__actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--s-2);
    justify-content: flex-end;
    margin-top: var(--s-4);
  }
  @media (max-width: 600px) {
    .cookie-banner { left: var(--s-3); right: var(--s-3); transform: none; width: auto; max-width: none; }
    .cookie-banner__actions .btn { flex: 1; justify-content: center; }
  }

  /* ============================================================================
     ACHIEVEMENT CORE — premium reward moment (Module 10)
     ========================================================================== */
  .achievement {
    text-align: center;
    padding: var(--s-12) var(--s-3) var(--s-16);
    position: relative;
  }
  @media (max-width: 600px) { .achievement { padding: var(--s-10) var(--s-2) var(--s-12); } }
  .achievement__bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
    border-radius: var(--r-2xl);
    opacity: 0.6;
  }
  .achievement__bg::before {
    content: "";
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 700px; height: 700px;
    background: radial-gradient(circle, var(--accent-glow) 0%, transparent 60%);
    animation: bgPulse 6s ease-in-out infinite;
    filter: blur(40px);
  }
  .achievement__bg::after {
    content: "";
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 480px; height: 480px;
    background: radial-gradient(circle, rgba(34, 211, 238, 0.32) 0%, transparent 60%);
    animation: bgPulse2 7s ease-in-out infinite;
    filter: blur(50px);
  }
  @keyframes bgPulse {
    0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
    50%      { opacity: 0.8; transform: translate(-50%, -50%) scale(1.08); }
  }
  @keyframes bgPulse2 {
    0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
    50%      { opacity: 0.7; transform: translate(-50%, -50%) scale(1.12); }
  }

  .achievement__core-wrap {
    position: relative;
    width: 320px;
    height: 320px;
    margin: 0 auto var(--s-8);
    cursor: pointer;
    z-index: 1;
  }
  @media (max-width: 600px) {
    .achievement__core-wrap { width: 240px; height: 240px; }
  }

  .achievement__core {
    width: 100%; height: 100%;
    position: relative;
    transition: transform 480ms cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .achievement__core-wrap:hover .achievement__core {
    transform: scale(1.04);
  }
  .achievement__core--pulsed {
    animation: corePulse 600ms cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  @keyframes corePulse {
    0%   { transform: scale(1); }
    30%  { transform: scale(1.08); filter: brightness(1.3); }
    100% { transform: scale(1); filter: brightness(1); }
  }

  .achievement__orbit {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 1px dashed rgba(129, 140, 248, 0.18);
    animation: orbit 24s linear infinite;
  }
  .achievement__orbit--inner {
    inset: 18%;
    border-color: rgba(34, 211, 238, 0.18);
    animation: orbit 18s linear infinite reverse;
  }
  @keyframes orbit { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

  .achievement__particle {
    position: absolute;
    width: 6px; height: 6px;
    border-radius: 50%;
    top: 50%; left: 50%;
    margin-top: -3px; margin-left: -3px;
  }
  .achievement__particle--1 {
    background: var(--accent);
    box-shadow: 0 0 12px var(--accent), 0 0 24px var(--accent-glow);
    transform: translateY(-150px);
  }
  .achievement__particle--2 {
    background: var(--cyan-strong);
    box-shadow: 0 0 12px var(--cyan-strong), 0 0 24px rgba(34, 211, 238, 0.5);
    width: 4px; height: 4px;
    margin-top: -2px; margin-left: -2px;
    transform: translate(120px, -90px);
  }
  .achievement__particle--3 {
    background: white;
    box-shadow: 0 0 8px white, 0 0 16px var(--accent);
    width: 3px; height: 3px;
    margin-top: -1.5px; margin-left: -1.5px;
    transform: translate(-130px, 70px);
  }
  .achievement__particle--4 {
    background: var(--accent);
    box-shadow: 0 0 10px var(--accent);
    width: 5px; height: 5px;
    margin-top: -2.5px; margin-left: -2.5px;
    transform: translate(100px, 110px);
  }

  .achievement__orb {
    position: absolute;
    inset: 22%;
    border-radius: 50%;
    background:
      radial-gradient(circle at 30% 25%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.18) 8%, transparent 28%),
      radial-gradient(circle at 70% 75%, rgba(34, 211, 238, 0.6) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, var(--accent-strong) 0%, var(--accent-deep) 50%, #1e1b4b 100%);
    box-shadow:
      0 0 60px var(--accent-glow),
      0 0 120px rgba(99, 102, 241, 0.35),
      inset 0 0 40px rgba(255,255,255,0.08),
      inset 0 -20px 60px rgba(0,0,0,0.4);
    animation: orbBreathe 4s ease-in-out infinite;
  }
  @keyframes orbBreathe {
    0%, 100% {
      box-shadow: 0 0 60px var(--accent-glow), 0 0 120px rgba(99, 102, 241, 0.35),
                  inset 0 0 40px rgba(255,255,255,0.08), inset 0 -20px 60px rgba(0,0,0,0.4);
      transform: scale(1);
    }
    50% {
      box-shadow: 0 0 80px var(--accent-glow), 0 0 160px rgba(99, 102, 241, 0.5),
                  inset 0 0 50px rgba(255,255,255,0.12), inset 0 -20px 60px rgba(0,0,0,0.4);
      transform: scale(1.02);
    }
  }

  .achievement__core-wrap:hover .achievement__orb {
    animation-play-state: paused;
    box-shadow:
      0 0 100px var(--accent-glow),
      0 0 200px rgba(99, 102, 241, 0.55),
      inset 0 0 50px rgba(255,255,255,0.18),
      inset 0 -20px 60px rgba(0,0,0,0.3);
  }

  .achievement__icon {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    color: rgba(255, 255, 255, 0.95);
    filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.6));
    z-index: 2;
  }

  .achievement__ring {
    position: absolute;
    inset: 12%;
    border-radius: 50%;
    border: 1px solid rgba(129, 140, 248, 0.4);
    box-shadow: inset 0 0 30px rgba(129, 140, 248, 0.15);
  }
  .achievement__ring--outer {
    inset: 4%;
    border-color: rgba(34, 211, 238, 0.22);
  }

  .achievement__unlocked-tag {
    display: inline-flex;
    align-items: center;
    gap: var(--s-2);
    padding: 6px var(--s-3);
    background: var(--accent-bg);
    border: 1px solid var(--accent-border);
    border-radius: 14px;
    font-size: var(--fs-xs);
    font-weight: var(--fw-semibold);
    color: var(--accent);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: var(--s-5);
  }

  .achievement__title {
    font-size: var(--fs-display);
    font-weight: var(--fw-bold);
    line-height: 1.05;
    letter-spacing: -0.03em;
    color: var(--text-h);
    margin-bottom: var(--s-3);
    background: linear-gradient(135deg, var(--text-h) 0%, var(--accent) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  @media (max-width: 600px) { .achievement__title { font-size: var(--fs-4xl); } }

  .achievement__sub {
    font-size: var(--fs-md);
    color: var(--text-secondary);
    line-height: var(--lh-relaxed);
    max-width: 520px;
    margin: 0 auto var(--s-12);
  }

  .achievement__manifesto {
    max-width: 560px;
    margin: 0 auto;
    padding: var(--s-8) var(--s-6);
    background: var(--bg-glass);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid var(--accent-border);
    border-radius: var(--r-xl);
    position: relative;
    overflow: hidden;
  }
  .achievement__manifesto::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, var(--accent-bg) 0%, transparent 50%, var(--cyan-bg) 100%);
    opacity: 0.5;
    pointer-events: none;
  }
  .achievement__manifesto > * { position: relative; z-index: 1; }
  .achievement__manifesto-line {
    font-size: var(--fs-md);
    color: var(--text-h);
    line-height: var(--lh-relaxed);
    font-weight: var(--fw-medium);
  }
  .achievement__manifesto-line + .achievement__manifesto-line {
    margin-top: var(--s-4);
  }
  .achievement__manifesto-line--em {
    background: linear-gradient(135deg, var(--accent), var(--cyan-strong));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: var(--fw-semibold);
  }
  .achievement__divider {
    width: 40px;
    height: 1px;
    background: var(--accent-border);
    margin: var(--s-4) auto;
  }

  /* Utility */
  .flex { display: flex; }
  .items-center { align-items: center; }
  .justify-between { justify-content: space-between; }
  .gap-2 { gap: var(--s-2); }
  .gap-3 { gap: var(--s-3); }
  .gap-4 { gap: var(--s-4); }
  .mb-2 { margin-bottom: var(--s-2); }
  .mb-3 { margin-bottom: var(--s-3); }
  .mb-4 { margin-bottom: var(--s-4); }
  .mb-6 { margin-bottom: var(--s-6); }
  .mb-8 { margin-bottom: var(--s-8); }
  .mt-4 { margin-top: var(--s-4); }
  .mt-6 { margin-top: var(--s-6); }
  .mt-8 { margin-top: var(--s-8); }
  .text-center { text-align: center; }
  .full-width { width: 100%; }

  /* ============================================================================
     MODULE CONTENT SUPPLEMENT — classes used by content components
     ========================================================================== */

  .card__title {
    font-size: var(--fs-xl);
    font-weight: var(--fw-semibold);
    color: var(--text-h);
    letter-spacing: -0.011em;
    margin-bottom: var(--s-2);
  }
  .card__lead {
    font-size: var(--fs-base);
    color: var(--text-secondary);
    line-height: var(--lh-relaxed);
    margin-bottom: var(--s-4);
  }

  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: var(--s-3);
    margin-top: var(--s-3);
  }
  .mini-card {
    background: var(--bg-elevated);
    border: 1px solid var(--border-subtle);
    border-radius: var(--r-md);
    padding: var(--s-4);
    transition: all 150ms ease;
  }
  .mini-card:hover {
    border-color: var(--accent-border);
    background: var(--bg-base);
  }
  .mini-card__icon {
    width: 36px; height: 36px;
    border-radius: var(--r-sm);
    background: var(--accent-bg);
    border: 1px solid var(--accent-border);
    color: var(--accent);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: var(--s-3);
  }
  .mini-card__title {
    font-size: var(--fs-sm);
    font-weight: var(--fw-semibold);
    color: var(--text-h);
    margin-bottom: var(--s-1);
  }
  .mini-card__body {
    font-size: var(--fs-sm);
    color: var(--text-secondary);
    line-height: var(--lh-relaxed);
  }

  .check-list {
    list-style: none;
    padding: 0;
    margin: var(--s-2) 0 0;
    display: grid;
    gap: var(--s-2);
  }
  .check-list li {
    display: flex;
    align-items: flex-start;
    gap: var(--s-3);
    padding: var(--s-3);
    background: var(--bg-elevated);
    border: 1px solid var(--border-subtle);
    border-radius: var(--r-sm);
    color: var(--text-secondary);
    font-size: var(--fs-sm);
    line-height: var(--lh-relaxed);
  }
  .check-list li svg {
    color: var(--accent);
    flex-shrink: 0;
    margin-top: 2px;
  }

  .step__body {
    font-size: var(--fs-sm);
    color: var(--text-secondary);
    line-height: var(--lh-relaxed);
    margin-bottom: var(--s-3);
  }
  .step__chip {
    display: inline-flex;
    align-items: center;
    gap: var(--s-2);
    padding: 6px var(--s-3);
    background: var(--accent-bg);
    border: 1px solid var(--accent-border);
    border-radius: 999px;
    font-size: var(--fs-xs);
  }
  .step__chip-sep { color: var(--text-tertiary); }
  .step__chip-sub { color: var(--text-secondary); }

  .crit-card {
    background: var(--bg-elevated);
    border: 1px solid var(--border-subtle);
    border-radius: var(--r-md);
    padding: var(--s-4);
    transition: all 150ms ease;
  }
  .crit-card:hover { border-color: var(--accent-border); }
  .crit-card__letter {
    width: 38px; height: 38px;
    border-radius: var(--r-sm);
    background: var(--accent-bg);
    color: var(--accent);
    border: 1px solid var(--accent-border);
    display: flex; align-items: center; justify-content: center;
    font-size: var(--fs-lg);
    font-weight: var(--fw-bold);
    margin-bottom: var(--s-3);
  }
  .crit-card__word {
    font-size: var(--fs-base);
    font-weight: var(--fw-semibold);
    color: var(--text-h);
    margin-bottom: var(--s-1);
  }
  .crit-card__body {
    font-size: var(--fs-xs);
    color: var(--text-secondary);
    line-height: var(--lh-snug);
  }

  .glossary {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: var(--s-2) var(--s-4);
    margin-top: var(--s-2);
  }
  @media (max-width: 720px) { .glossary { grid-template-columns: 1fr; gap: var(--s-1); } }
  .glossary__item {
    display: contents;
  }
  .glossary__term {
    padding: var(--s-2) 0;
    font-size: var(--fs-sm);
  }
  .glossary__def {
    padding: var(--s-2) 0;
    font-size: var(--fs-sm);
    color: var(--text-secondary);
    line-height: var(--lh-relaxed);
    border-bottom: 1px solid var(--border-subtle);
  }
  .glossary__term { border-bottom: 1px solid var(--border-subtle); }

  .compare__list {
    list-style: none;
    padding: 0;
    margin: var(--s-3) 0 0;
    display: grid;
    gap: var(--s-2);
  }
  .compare__list li {
    font-size: var(--fs-sm);
    color: var(--text-secondary);
    line-height: var(--lh-relaxed);
    padding-left: var(--s-3);
    position: relative;
  }
  .compare__list li::before {
    content: "—";
    position: absolute;
    left: 0;
    color: var(--text-tertiary);
  }
  .compare__col {
    background: var(--bg-elevated);
    border: 1px solid var(--border-subtle);
    border-radius: var(--r-md);
    padding: var(--s-4);
  }
  .compare__col--good { background: var(--success-bg); border-color: var(--success-border); }
  .compare__col--bad  { background: var(--danger-bg);  border-color: var(--danger-border);  }
  .compare__col--good .compare__head { color: var(--success); }
  .compare__col--bad  .compare__head { color: var(--danger);  }

  .error-list {
    list-style: none;
    padding: 0;
    margin: var(--s-2) 0 0;
    display: grid;
    gap: var(--s-3);
  }
  .error-list__item {
    display: flex;
    gap: var(--s-3);
    padding: var(--s-4);
    background: var(--bg-elevated);
    border: 1px solid var(--border-subtle);
    border-left: 3px solid var(--danger);
    border-radius: var(--r-md);
  }
  .error-list__icon {
    color: var(--danger);
    flex-shrink: 0;
    margin-top: 2px;
  }
  .error-list__name {
    font-size: var(--fs-base);
    font-weight: var(--fw-semibold);
    color: var(--text-h);
    margin-bottom: var(--s-1);
  }
  .error-list__body {
    font-size: var(--fs-sm);
    color: var(--text-secondary);
    line-height: var(--lh-relaxed);
  }

  .diagram { display: grid; gap: var(--s-2); margin-top: var(--s-3); padding: 0; background: transparent; border: none; }
  .diagram__layer {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: var(--s-4);
    padding: var(--s-3) var(--s-4);
    background: var(--bg-elevated);
    border: 1px solid var(--border-subtle);
    border-radius: var(--r-sm);
    align-items: start;
  }
  @media (max-width: 720px) {
    .diagram__layer { grid-template-columns: 1fr; gap: var(--s-1); }
  }
  .diagram__layer-name {
    font-size: var(--fs-sm);
    font-weight: var(--fw-semibold);
    color: var(--text-h);
  }
  .diagram__layer-body {
    font-size: var(--fs-sm);
    color: var(--text-secondary);
    line-height: var(--lh-relaxed);
  }

  /* Achievement layout supplements */
  .achievement {
    position: relative;
    padding: var(--s-12) var(--s-4);
    min-height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .achievement__inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 100%;
    max-width: 720px;
  }
  .achievement__core-wrapper {
    margin-bottom: var(--s-8);
  }
  .achievement__tag {
    display: inline-flex;
    align-items: center;
    gap: var(--s-2);
    padding: 6px var(--s-3);
    background: var(--accent-bg);
    border: 1px solid var(--accent-border);
    color: var(--accent);
    border-radius: 999px;
    font-size: var(--fs-xs);
    font-weight: var(--fw-semibold);
    letter-spacing: 0.08em;
    margin-bottom: var(--s-4);
  }
  .achievement__title {
    font-size: var(--fs-3xl);
    font-weight: var(--fw-bold);
    letter-spacing: -0.025em;
    background: linear-gradient(135deg, #fafafb 0%, var(--accent) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    margin-bottom: var(--s-3);
    line-height: 1.05;
  }
  .achievement__subtitle {
    font-size: var(--fs-lg);
    color: var(--text-secondary);
    line-height: var(--lh-relaxed);
    margin-bottom: var(--s-8);
    max-width: 540px;
  }

  /* ============ Module pill on achievement ============ */
  .achievement__module-pill {
    display: inline-flex;
    align-items: center;
    padding: 6px var(--s-3);
    background: var(--accent-bg);
    border: 1px solid var(--accent-border);
    border-radius: 999px;
    font-size: 11px;
    font-weight: var(--fw-bold);
    color: var(--accent);
    letter-spacing: 0.12em;
    margin-bottom: var(--s-6);
  }

  /* ============ Empty checklist state ============ */
  .check-empty {
    display: flex;
    align-items: center;
    gap: var(--s-2);
    padding: var(--s-3) var(--s-4);
    background: var(--bg-elevated);
    border: 1px dashed var(--border-default);
    border-radius: var(--r-md);
    color: var(--text-tertiary);
    font-size: var(--fs-sm);
  }
  .check-empty svg { color: var(--text-tertiary); }

  /* ============ Simulator key validation + error banner ============ */
  .sim__key-error {
    font-size: var(--fs-xs);
    color: var(--danger);
    line-height: var(--lh-snug);
  }
  .sim__error-banner {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: start;
    gap: var(--s-3);
    padding: var(--s-3) var(--s-4);
    background: var(--danger-bg);
    border: 1px solid var(--danger-border);
    border-bottom: none;
    color: var(--text-h);
  }
  .sim__error-banner > svg { color: var(--danger); margin-top: 2px; }
  .sim__error-title {
    font-size: var(--fs-sm);
    font-weight: var(--fw-semibold);
    margin-bottom: 2px;
  }
  .sim__error-hint {
    font-size: var(--fs-xs);
    color: var(--text-secondary);
    line-height: var(--lh-relaxed);
  }
  .sim__error-close {
    background: transparent;
    border: 1px solid var(--border-default);
    color: var(--text-secondary);
    width: 22px; height: 22px;
    border-radius: var(--r-sm);
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
  }
  .sim__error-close:hover { background: var(--bg-elevated); color: var(--text-h); }

  /* ============ API key help popover ============ */
  .api-help-pop {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    width: 340px;
    background: var(--bg-elevated);
    border: 1px solid var(--border-default);
    border-radius: var(--r-lg);
    box-shadow: var(--shadow-lg);
    padding: var(--s-4);
    z-index: 50;
    animation: pop-in 160ms ease;
  }
  @media (max-width: 480px) {
    .api-help-pop { width: min(92vw, 340px); right: -100px; }
  }
  @keyframes pop-in {
    from { opacity: 0; transform: translateY(-4px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  .api-help-pop__head {
    display: flex; align-items: center; justify-content: space-between;
    gap: var(--s-2);
    margin-bottom: var(--s-2);
  }
  .api-help-pop__title {
    display: flex; align-items: center; gap: var(--s-2);
    font-size: var(--fs-sm);
    font-weight: var(--fw-semibold);
    color: var(--text-h);
  }
  .api-help-pop__title svg { color: var(--accent); }
  .api-help-pop__close {
    background: transparent;
    border: 1px solid var(--border-subtle);
    color: var(--text-tertiary);
    width: 22px; height: 22px;
    border-radius: var(--r-sm);
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
  }
  .api-help-pop__close:hover { background: var(--bg-base); color: var(--text-h); }
  .api-help-pop__lead {
    font-size: var(--fs-xs);
    color: var(--text-secondary);
    line-height: var(--lh-relaxed);
    margin-bottom: var(--s-3);
  }
  .api-help-pop__steps {
    list-style: none;
    margin: 0 0 var(--s-3);
    padding: 0;
    display: grid;
    gap: var(--s-2);
  }
  .api-help-pop__steps li {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: var(--s-2);
    align-items: start;
    font-size: var(--fs-xs);
    color: var(--text-h);
    line-height: var(--lh-relaxed);
  }
  .api-help-pop__num {
    width: 18px; height: 18px;
    border-radius: 999px;
    background: var(--accent-bg);
    border: 1px solid var(--accent-border);
    color: var(--accent);
    font-size: 10px;
    font-weight: var(--fw-bold);
    display: flex; align-items: center; justify-content: center;
  }
  .api-help-pop__steps a { color: var(--accent); text-decoration: underline; }
  .api-help-pop__warn {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: var(--s-2);
    align-items: start;
    padding: var(--s-2) var(--s-3);
    background: rgba(251, 191, 36, 0.10);
    border: 1px solid rgba(251, 191, 36, 0.30);
    border-radius: var(--r-sm);
    margin-bottom: var(--s-3);
  }
  .api-help-pop__warn > svg { color: rgb(251, 191, 36); margin-top: 2px; }
  .api-help-pop__warn-title {
    font-size: var(--fs-xs);
    font-weight: var(--fw-semibold);
    color: var(--text-h);
    margin-bottom: 2px;
  }
  .api-help-pop__warn-body {
    font-size: 11px;
    color: var(--text-secondary);
    line-height: var(--lh-relaxed);
  }
  .api-help-pop__cta {
    width: 100%;
    height: 34px;
    font-size: var(--fs-xs);
    text-decoration: none;
  }

  /* ============ Achievement: stats grid ============ */
  .ach-stats__label {
    font-size: 11px;
    font-weight: var(--fw-semibold);
    color: var(--text-tertiary);
    letter-spacing: 0.12em;
    margin-bottom: var(--s-3);
  }
  .ach-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--s-3);
    margin-bottom: var(--s-8);
    width: 100%;
  }
  @media (max-width: 720px) { .ach-stats { grid-template-columns: repeat(2, 1fr); } }
  .ach-stat {
    display: flex; align-items: center; gap: var(--s-3);
    padding: var(--s-3) var(--s-4);
    background: var(--bg-elevated);
    border: 1px solid var(--border-subtle);
    border-radius: var(--r-md);
    text-align: left;
  }
  .ach-stat__icon {
    width: 36px; height: 36px;
    border-radius: var(--r-sm);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .ach-stat--lila .ach-stat__icon {
    background: var(--accent-bg);
    border: 1px solid var(--accent-border);
    color: var(--accent);
  }
  .ach-stat--cyan .ach-stat__icon {
    background: var(--cyan-bg);
    border: 1px solid var(--cyan-border);
    color: var(--cyan-strong);
  }
  .ach-stat--green .ach-stat__icon {
    background: var(--success-bg);
    border: 1px solid var(--success-border);
    color: var(--success);
  }
  .ach-stat__value {
    font-size: var(--fs-base);
    font-weight: var(--fw-bold);
    color: var(--text-h);
    line-height: 1.1;
  }
  .ach-stat__label {
    font-size: var(--fs-xs);
    color: var(--text-tertiary);
    line-height: var(--lh-snug);
    margin-top: 2px;
  }

  /* ============ Achievement: dual CTAs ============ */
  .ach-ctas {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: var(--s-3);
    width: 100%;
    margin-bottom: var(--s-12);
  }
  @media (max-width: 720px) { .ach-ctas { grid-template-columns: 1fr; } }
  .ach-cta {
    display: flex;
    align-items: center;
    gap: var(--s-3);
    padding: var(--s-4) var(--s-5);
    border-radius: var(--r-md);
    cursor: pointer;
    text-align: left;
    transition: all 150ms ease;
    border: 1px solid var(--border-default);
    background: var(--bg-elevated);
    color: var(--text-h);
  }
  .ach-cta:hover { transform: translateY(-1px); }
  .ach-cta--primary {
    background: linear-gradient(135deg, var(--accent-strong) 0%, var(--accent-deep) 100%);
    border-color: var(--accent-strong);
    color: white;
    box-shadow: 0 8px 24px rgba(99, 102, 241, 0.32);
  }
  .ach-cta--primary:hover { box-shadow: 0 12px 32px rgba(99, 102, 241, 0.42); }
  .ach-cta--secondary:hover { background: var(--bg-surface); border-color: var(--border-default); }
  .ach-cta__title {
    font-size: var(--fs-base);
    font-weight: var(--fw-semibold);
  }
  .ach-cta__sub {
    font-size: var(--fs-xs);
    opacity: 0.85;
    margin-top: 2px;
  }

  /* ============ Achievement: resources ============ */
  .ach-resources {
    width: 100%;
    text-align: left;
    margin-top: var(--s-4);
  }
  .ach-resources__head { text-align: center; margin-bottom: var(--s-8); }
  .ach-resources__kicker {
    font-size: 11px;
    font-weight: var(--fw-semibold);
    color: var(--accent);
    letter-spacing: 0.12em;
    margin-bottom: var(--s-2);
  }
  .ach-resources__title {
    font-size: var(--fs-2xl);
    font-weight: var(--fw-bold);
    color: var(--text-h);
    letter-spacing: -0.02em;
    margin-bottom: var(--s-2);
  }
  .ach-resources__lead {
    font-size: var(--fs-base);
    color: var(--text-secondary);
    line-height: var(--lh-relaxed);
    max-width: 580px;
    margin: 0 auto;
  }
  .ach-res-group { margin-bottom: var(--s-6); }
  .ach-res-group__head {
    display: flex; align-items: center; gap: var(--s-2);
    font-size: 11px;
    font-weight: var(--fw-semibold);
    color: var(--text-tertiary);
    letter-spacing: 0.10em;
    text-transform: uppercase;
    margin-bottom: var(--s-3);
    padding-bottom: var(--s-2);
    border-bottom: 1px solid var(--border-subtle);
  }
  .ach-res-group__head svg { color: var(--accent); }
  .ach-res-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: var(--s-3);
  }
  .ach-res-card {
    display: flex; flex-direction: column;
    padding: var(--s-4);
    background: var(--bg-elevated);
    border: 1px solid var(--border-subtle);
    border-radius: var(--r-md);
    text-decoration: none;
    color: var(--text-h);
    transition: all 150ms ease;
    min-height: 124px;
  }
  .ach-res-card:hover {
    border-color: var(--accent-border);
    background: var(--bg-base);
    transform: translateY(-1px);
  }
  .ach-res-card:hover .ach-res-card__arrow { color: var(--accent); transform: translate(2px, -2px); }
  .ach-res-card__head {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: var(--s-3);
  }
  .ach-res-card__icon {
    width: 30px; height: 30px;
    border-radius: var(--r-sm);
    background: var(--accent-bg);
    border: 1px solid var(--accent-border);
    color: var(--accent);
    display: flex; align-items: center; justify-content: center;
  }
  .ach-res-card__arrow {
    color: var(--text-tertiary);
    transition: all 150ms ease;
  }
  .ach-res-card__title {
    font-size: var(--fs-sm);
    font-weight: var(--fw-semibold);
    color: var(--text-h);
    margin-bottom: var(--s-1);
  }
  .ach-res-card__desc {
    font-size: var(--fs-xs);
    color: var(--text-secondary);
    line-height: var(--lh-relaxed);
    flex: 1;
    margin-bottom: var(--s-3);
  }
  .ach-res-card__url {
    font-size: 11px;
    color: var(--text-tertiary);
    font-family: var(--font-mono);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

/* ============================================================================
   MODULE DATA — 10 modules, sections in I18n key (Foundations etc.)
   ========================================================================== */

const MODULES = [
  { id: "intro", num: "01", icon: Sparkles, sectionKey: "Foundations",
    titles: { es: "Introducción", en: "Introduction", pt: "Introdução" },
    subtitles: { es: "¿Qué es un agente?", en: "What is an agent?", pt: "O que é um agente?" },
    times: { es: "12 min", en: "12 min", pt: "12 min" } },
  { id: "requisitos", num: "02", icon: ShieldCheck, sectionKey: "Foundations",
    titles: { es: "Requisitos previos", en: "Prerequisites", pt: "Pré-requisitos" },
    subtitles: { es: "Lo que necesitas", en: "What you need", pt: "O que você precisa" },
    times: { es: "10 min", en: "10 min", pt: "10 min" } },
  { id: "crear", num: "03", icon: Rocket, sectionKey: "Construction",
    titles: { es: "Crear el agente", en: "Create the agent", pt: "Criar o agente" },
    subtitles: { es: "Tu primer proyecto", en: "Your first project", pt: "Seu primeiro projeto" },
    times: { es: "15 min", en: "15 min", pt: "15 min" } },
  { id: "personalidad", num: "04", icon: Bot, sectionKey: "Construction",
    titles: { es: "Personalidad", en: "Personality", pt: "Personalidade" },
    subtitles: { es: "Tono y comportamiento", en: "Tone and behavior", pt: "Tom e comportamento" },
    times: { es: "18 min", en: "18 min", pt: "18 min" } },
  { id: "prompts", num: "05", icon: Brain, sectionKey: "Construction",
    titles: { es: "Prompt engineering", en: "Prompt engineering", pt: "Prompt engineering" },
    subtitles: { es: "Instrucciones efectivas", en: "Effective instructions", pt: "Instruções efetivas" },
    times: { es: "25 min", en: "25 min", pt: "25 min" } },
  { id: "herramientas", num: "06", icon: Wrench, sectionKey: "Construction",
    titles: { es: "Herramientas", en: "Tools", pt: "Ferramentas" },
    subtitles: { es: "Contexto y conexiones", en: "Context and connections", pt: "Contexto e conexões" },
    times: { es: "20 min", en: "20 min", pt: "20 min" } },
  { id: "pruebas", num: "07", icon: TestTube2, sectionKey: "Refinement",
    titles: { es: "Pruebas", en: "Testing", pt: "Testes" },
    subtitles: { es: "Validación", en: "Validation", pt: "Validação" },
    times: { es: "18 min", en: "18 min", pt: "18 min" } },
  { id: "iteracion", num: "08", icon: RefreshCw, sectionKey: "Refinement",
    titles: { es: "Iteración", en: "Iteration", pt: "Iteração" },
    subtitles: { es: "Mejora continua", en: "Continuous improvement", pt: "Melhoria contínua" },
    times: { es: "15 min", en: "15 min", pt: "15 min" } },
  { id: "errores", num: "09", icon: AlertTriangle, sectionKey: "Mastery",
    titles: { es: "Errores comunes", en: "Common mistakes", pt: "Erros comuns" },
    subtitles: { es: "Qué evitar", en: "What to avoid", pt: "O que evitar" },
    times: { es: "15 min", en: "15 min", pt: "15 min" } },
  { id: "cierre", num: "10", icon: Trophy, sectionKey: "Mastery",
    titles: { es: "Lo lograste", en: "You did it", pt: "Você conseguiu" },
    subtitles: { es: "Próximos pasos", en: "Next steps", pt: "Próximos passos" },
    times: { es: "5 min", en: "5 min", pt: "5 min" } },
];

const LEVEL_KEYS = ["foundations", "advanced", "expert"];

/* ============================================================================
   INTELLIGENT SIMULATOR ENGINE
   --------------------------------------------------------------------------
   Multi-keyword scoring + conversational memory. No hardcoded round-robin.
   Optionally talks to real Claude API when an API key is provided.
   ========================================================================== */

const SIM_KNOWLEDGE = {
  // Each entry has: id, weights (keyword -> score), responses by language
  light: {
    keywords: { luz: 3, sol: 3, ventana: 3, sombra: 3, light: 3, sun: 3, window: 2, shadow: 2, sombreado: 2, brillo: 2, oscuro: 2 },
    responses: {
      es: [
        "La luz es el factor más decisivo. Para orientarme: ¿la planta recibe luz directa unas horas, luz brillante filtrada todo el día, o solo iluminación ambiental? Dame también la orientación de la ventana (norte/sur/este/oeste) si la conoces.",
        "Buena pregunta sobre luz. Antes de aconsejarte: dime el tipo de planta y describe la luz de su ubicación actual. Si está a más de 1.5 m de la ventana, probablemente necesite luz extra.",
        "La luz se mide en horas y calidad, no solo en \"hay sol\". Pothos, Sansevieria y ZZ toleran luz baja; Calatheas y Ficus piden brillante indirecta; suculentas necesitan directa. ¿Cuál es tu caso?",
      ],
      en: [
        "Light is the most decisive factor. To guide you: does the plant get direct sun for a few hours, bright filtered light all day, or just ambient lighting? Also tell me the window orientation (N/S/E/W) if you know it.",
        "Good question about light. Before I advise: what plant is it and describe the light at its current spot. If it's more than 1.5 m from the window, it likely needs extra light.",
        "Light is measured in hours and quality, not just \"there is sun\". Pothos, Sansevieria and ZZ tolerate low light; Calatheas and Ficus want bright indirect; succulents need direct. Which is yours?",
      ],
      pt: [
        "A luz é o fator mais decisivo. Para te orientar: a planta recebe sol direto por algumas horas, luz brilhante filtrada o dia todo, ou apenas iluminação ambiente? Diga também a orientação da janela (N/S/L/O) se souber.",
        "Boa pergunta sobre luz. Antes de aconselhar: qual a planta e descreva a luz no local atual. Se estiver a mais de 1,5 m da janela, provavelmente precisa de mais luz.",
        "A luz se mede em horas e qualidade, não apenas em \"tem sol\". Pothos, Sansevieria e ZZ toleram pouca luz; Calatheas e Ficus pedem brilhante indireta; suculentas precisam de direta. Qual o seu caso?",
      ],
    },
  },
  watering: {
    keywords: { riego: 3, regar: 3, agua: 2, regado: 3, mojar: 2, water: 3, watering: 3, mojada: 2, hidrat: 2, sequedad: 1 },
    responses: {
      es: [
        "Regla universal: mejor regar de menos que de más. Mete el dedo 2 cm en la tierra. Si está seca, riega hasta que el agua salga por los agujeros. Si está húmeda, espera. ¿De qué planta hablamos para afinar la frecuencia?",
        "La frecuencia varía mucho. Suculentas: 1 vez cada 10–14 días. Aromáticas: cuando la tierra esté ligeramente seca arriba. Helechos: humedad constante. Dime tu planta y te doy un calendario.",
        "Sobreriego es la causa #1 de muerte de plantas de interior. Síntomas: tierra que tarda días en secar, hojas amarillas y caídas, base del tallo blanda. ¿Ves alguno de estos signos?",
      ],
      en: [
        "Universal rule: better underwater than overwater. Stick your finger 2 cm into the soil. If dry, water until it drains through the holes. If moist, wait. Which plant are we talking about so I can fine-tune?",
        "Frequency varies a lot. Succulents: every 10–14 days. Herbs: when topsoil is slightly dry. Ferns: constant moisture. Tell me the plant and I'll give you a schedule.",
        "Overwatering is the #1 killer of indoor plants. Symptoms: soil that takes days to dry, yellow drooping leaves, mushy stem base. Do you see any of these signs?",
      ],
      pt: [
        "Regra universal: melhor regar menos do que demais. Enfie o dedo 2 cm na terra. Se estiver seca, regue até a água escorrer pelos furos. Se úmida, espere. Qual planta para eu ajustar?",
        "A frequência varia muito. Suculentas: a cada 10–14 dias. Ervas: quando o topo estiver levemente seco. Samambaias: umidade constante. Me diga a planta e te dou um cronograma.",
        "O excesso de água é a causa nº1 de morte de plantas indoor. Sintomas: terra que demora dias para secar, folhas amarelas e caídas, base do caule mole. Você vê algum desses sinais?",
      ],
    },
  },
  problem: {
    keywords: { muri: 3, muert: 3, mori: 3, seca: 2, amarill: 3, marchit: 2, hojas: 1, dying: 3, dead: 3, yellow: 3, brown: 2, drying: 2, morrendo: 3, morta: 2, amarela: 3, secando: 2 },
    responses: {
      es: [
        "Vamos a diagnosticarlo. Necesito tres datos: 1) ¿Qué color tienen las hojas afectadas? (amarillas / marrones secas / marrones blandas / negras) 2) ¿Empieza por la punta o desde el tallo? 3) ¿Cuándo regaste por última vez? Con eso te digo causa probable.",
        "Antes de rendirnos: ¿hojas amarillas? suele ser exceso de riego. ¿Marrones crujientes? falta de agua o aire seco. ¿Caídas y blandas? sobreriego o cambio brusco de luz. Cuéntame qué patrón ves.",
        "Una planta que parece muerta puede tener raíces vivas. Saca la maceta: si las raíces son blancas y firmes, hay esperanza. Si son marrones y se deshacen, replanta urgente con tierra nueva. ¿Quieres que te explique el rescate?",
      ],
      en: [
        "Let's diagnose it. I need three things: 1) What color are the affected leaves? (yellow / brown crispy / brown mushy / black) 2) Does it start from the tip or the stem? 3) When did you last water? With that I'll give you the likely cause.",
        "Before giving up: yellow leaves? usually overwatering. Crispy brown? underwatering or dry air. Drooping and soft? overwatering or sudden light change. Tell me the pattern you see.",
        "A plant that looks dead can have living roots. Pull it out of the pot: if roots are white and firm, there's hope. If brown and falling apart, repot urgently with fresh soil. Want me to walk you through rescue?",
      ],
      pt: [
        "Vamos diagnosticar. Preciso de três coisas: 1) Que cor têm as folhas afetadas? (amarelas / marrons secas / marrons moles / pretas) 2) Começa pela ponta ou pelo caule? 3) Quando regou pela última vez? Com isso te digo a causa provável.",
        "Antes de desistir: folhas amarelas? geralmente excesso de água. Marrons crocantes? falta de água ou ar seco. Caídas e moles? excesso ou mudança brusca de luz. Me diga o padrão que vê.",
        "Uma planta que parece morta pode ter raízes vivas. Tire do vaso: se as raízes estão brancas e firmes, há esperança. Se marrons e desfazendo, replantar urgente com terra nova. Quer que eu explique o resgate?",
      ],
    },
  },
  greeting: {
    keywords: { hola: 3, buenos: 2, buenas: 2, hi: 3, hello: 3, hey: 3, ola: 3, oi: 3 },
    responses: {
      es: [
        "¡Hola! Soy Verde, tu asistente de plantas. Cuéntame, ¿qué planta tienes o quieres tener? Puedo ayudarte con cuidados, ubicación, riego o problemas concretos.",
        "¡Hola! Bienvenido. ¿Tienes una planta en mente o estás eligiendo una nueva para casa? Si es nueva, dime cuánta luz tienes y qué nivel de cuidado quieres asumir.",
      ],
      en: [
        "Hi! I'm Verde, your plant assistant. Tell me, what plant do you have or want? I can help with care, placement, watering or specific issues.",
        "Hi! Welcome. Do you have a plant in mind or are you choosing a new one? If new, tell me how much light you have and how much care you want to commit to.",
      ],
      pt: [
        "Olá! Sou o Verde, seu assistente de plantas. Me conte, qual planta você tem ou quer ter? Posso ajudar com cuidados, localização, rega ou problemas específicos.",
        "Olá! Bem-vindo. Tem uma planta em mente ou está escolhendo uma nova? Se for nova, diga quanta luz você tem e quanto cuidado quer dedicar.",
      ],
    },
  },
  identification: {
    keywords: { tipo: 2, especie: 3, planta: 1, recomienda: 3, recomendar: 3, sugerir: 2, principiante: 3, fácil: 2, easy: 2, beginner: 3, recommend: 3, qual: 2 },
    responses: {
      es: [
        "Para principiantes recomiendo tres campeonas: Pothos (perdona el olvido), Sansevieria (resiste sequía y luz baja) y ZZ (casi indestructible). ¿Cuánta luz tiene tu espacio y qué frecuencia de riego puedes mantener?",
        "Mi top 5 para casas con poca dedicación: 1) Pothos, 2) Sansevieria, 3) ZZ, 4) Filodendro, 5) Cactus. Todas perdonan errores. ¿Qué orientación tiene tu ventana principal?",
      ],
      en: [
        "For beginners I recommend three champions: Pothos (forgives forgetting), Sansevieria (handles drought and low light) and ZZ (nearly indestructible). How much light does your space get and what watering frequency can you keep?",
        "My top 5 for low-commitment homes: 1) Pothos, 2) Sansevieria, 3) ZZ, 4) Philodendron, 5) Cactus. All forgive mistakes. What orientation does your main window have?",
      ],
      pt: [
        "Para iniciantes, recomendo três campeãs: Pothos (perdoa esquecimentos), Sansevieria (aguenta seca e pouca luz) e ZZ (quase indestrutível). Quanta luz tem seu espaço e que frequência de rega você consegue manter?",
        "Meu top 5 para casas com pouca dedicação: 1) Pothos, 2) Sansevieria, 3) ZZ, 4) Filodendro, 5) Cacto. Todas perdoam erros. Qual a orientação da sua janela principal?",
      ],
    },
  },
  fertilizer: {
    keywords: { abono: 3, abonar: 3, fertiliz: 3, nutrient: 3, fertilizer: 3, fertilize: 3, comida: 1 },
    responses: {
      es: [
        "Las plantas de interior se abonan poco: cada 4–6 semanas en primavera y verano, nada en invierno. Usa abono líquido equilibrado (NPK 10-10-10) a la mitad de la dosis indicada. Más abono no es mejor: quema raíces.",
        "Regla simple: abona solo cuando la planta está creciendo activamente (hojas nuevas visibles). Si no crece, no necesita comida. ¿Has notado hojas pequeñas y pálidas últimamente?",
      ],
      en: [
        "Indoor plants need little fertilizer: every 4–6 weeks in spring/summer, none in winter. Use balanced liquid fertilizer (NPK 10-10-10) at half the recommended dose. More is not better: it burns roots.",
        "Simple rule: feed only when actively growing (new leaves visible). If not growing, no need to feed. Have you noticed small pale leaves lately?",
      ],
      pt: [
        "Plantas de interior precisam de pouco fertilizante: a cada 4–6 semanas na primavera/verão, nada no inverno. Use líquido balanceado (NPK 10-10-10) na metade da dose. Mais não é melhor: queima raízes.",
        "Regra simples: adube só quando estiver crescendo ativamente (folhas novas visíveis). Se não cresce, não precisa. Tem notado folhas pequenas e pálidas?",
      ],
    },
  },
  outOfScope: {
    keywords: { perro: 5, gato: 5, mascota: 4, dog: 5, cat: 5, pet: 4, política: 5, politics: 5, código: 4, code: 4, programar: 4, program: 4, cocinar: 4, recipe: 4 },
    responses: {
      es: [
        "Eso queda fuera de mi expertise. Soy Verde, especialista solo en plantas. Si quieres, te ayudo con cuidado de plantas, ubicación, riego, plagas comunes o elección de especies. ¿Algo de eso?",
        "No está dentro de mi rol como asistente de plantas. Puedo ayudarte con identificación de problemas, calendarios de riego, ubicación según luz o recomendaciones según tu estilo de vida.",
      ],
      en: [
        "That's outside my expertise. I'm Verde, plant specialist only. I can help with plant care, placement, watering, common pests or species selection. Anything of that?",
        "Not within my role as a plant assistant. I can help with problem identification, watering schedules, placement by light or recommendations based on your lifestyle.",
      ],
      pt: [
        "Isso está fora da minha especialidade. Sou o Verde, especialista só em plantas. Posso ajudar com cuidados, localização, rega, pragas comuns ou escolha de espécies. Algo disso?",
        "Não está no meu papel como assistente de plantas. Posso ajudar com identificação de problemas, calendários de rega, localização por luz ou recomendações para seu estilo de vida.",
      ],
    },
  },
};

const SIM_FALLBACK = {
  es: [
    "Para darte el mejor consejo necesito un poco más de contexto. Cuéntame: ¿de qué planta hablamos, dónde está ubicada y cuánta luz recibe? Con esos tres datos puedo ser muy preciso.",
    "Necesito que me des más información. Dime el nombre o tipo de planta, su ubicación (cerca de qué ventana, qué orientación) y cómo la has estado cuidando hasta ahora.",
    "No tengo suficiente contexto todavía. Para ayudarte bien, dame: tipo de planta, luz que recibe, frecuencia de riego actual y cualquier síntoma que hayas notado.",
  ],
  en: [
    "To give you the best advice I need a bit more context. Tell me: which plant, where is it placed, and how much light does it get? With those three pieces I can be very precise.",
    "I need more information. Tell me the plant name or type, its placement (near which window, what orientation) and how you've been caring for it so far.",
    "I don't have enough context yet. To help well, give me: plant type, light it gets, current watering frequency and any symptoms you've noticed.",
  ],
  pt: [
    "Para te dar o melhor conselho, preciso de mais contexto. Me diga: qual planta, onde está colocada e quanta luz recebe? Com esses três dados posso ser muito preciso.",
    "Preciso de mais informação. Me diga o nome ou tipo da planta, onde está (perto de qual janela, qual orientação) e como você tem cuidado até agora.",
    "Ainda não tenho contexto suficiente. Para ajudar bem, me dê: tipo de planta, luz que recebe, frequência atual de rega e qualquer sintoma que tenha notado.",
  ],
};

const SIM_FOLLOWUP = {
  es: [
    "Con lo que me cuentas, mi recomendación es la siguiente.",
    "Gracias por el detalle. Esto es lo que haría yo en tu lugar:",
    "Perfecto, ya tengo suficiente para darte algo accionable.",
  ],
  en: [
    "Based on what you've told me, here's my recommendation.",
    "Thanks for the detail. Here's what I would do in your place:",
    "Perfect, I have enough now to give you something actionable.",
  ],
  pt: [
    "Com o que você me conta, minha recomendação é a seguinte.",
    "Obrigado pelos detalhes. Aqui está o que eu faria no seu lugar:",
    "Perfeito, já tenho o suficiente para te dar algo prático.",
  ],
};

function smartScore(text) {
  // Returns sorted array [{ id, score }] of matching topics.
  const lower = text.toLowerCase();
  const scores = {};
  Object.entries(SIM_KNOWLEDGE).forEach(([id, entry]) => {
    let s = 0;
    Object.entries(entry.keywords).forEach(([kw, w]) => {
      if (lower.includes(kw)) s += w;
    });
    if (s > 0) scores[id] = s;
  });
  return Object.entries(scores).sort((a, b) => b[1] - a[1]).map(([id, score]) => ({ id, score }));
}

function pickResponse(topicId, lang, history, usedIds) {
  const entry = SIM_KNOWLEDGE[topicId];
  if (!entry) return null;
  const responses = entry.responses[lang] || entry.responses.es;
  // Prefer one not yet used in this session for that topic.
  const usedForTopic = usedIds[topicId] || new Set();
  const available = responses.filter((_, idx) => !usedForTopic.has(idx));
  const pool = available.length > 0 ? available : responses;
  // Slight randomization but deterministic enough not to feel chaotic.
  const idx = Math.floor(Math.random() * pool.length);
  const chosen = pool[idx];
  const realIdx = responses.indexOf(chosen);
  return { text: chosen, idxUsed: realIdx };
}

function pickFallback(lang, history) {
  const arr = SIM_FALLBACK[lang] || SIM_FALLBACK.es;
  // Vary based on conversation length so it doesn't repeat.
  return arr[history.length % arr.length];
}

/* ============================================================================
   ROOT APP
   ========================================================================== */

export default function App() {
  return (
    <I18nProvider>
      <AppShell />
    </I18nProvider>
  );
}

function AppShell() {
  const { t, lang } = useT();
  const [activeIdx, setActiveIdx] = usePersistentState(KEYS.ACTIVE_MODULE, 0);
  const [completed, setCompleted] = usePersistentState(KEYS.PROGRESS, {});
  // activeLevels: { moduleId: levelIndex } — persisted
  const [activeLevels, setActiveLevels] = usePersistentState(KEYS.ACTIVE_LEVELS, {});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mainRef = useRef(null);

  // Inject design tokens once per mount
  useEffect(() => {
    const id = "design-tokens-v2";
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement("style");
      el.id = id;
      document.head.appendChild(el);
    }
    el.innerHTML = DESIGN_TOKENS;
  }, []);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    setSidebarOpen(false);
  }, [activeIdx]);

  const safeIdx = Math.max(0, Math.min(activeIdx ?? 0, MODULES.length - 1));
  const activeModule = MODULES[safeIdx];

  const markComplete = useCallback((id) => {
    setCompleted((p) => ({ ...p, [id]: true }));
  }, [setCompleted]);

  const goNext = useCallback(() => {
    setActiveIdx((i) => Math.min((i ?? 0) + 1, MODULES.length - 1));
  }, [setActiveIdx]);

  const goPrev = useCallback(() => {
    setActiveIdx((i) => Math.max((i ?? 0) - 1, 0));
  }, [setActiveIdx]);

  const setLevelFor = useCallback((moduleId, levelIdx) => {
    setActiveLevels((p) => ({ ...p, [moduleId]: levelIdx }));
  }, [setActiveLevels]);

  const completionPct = useMemo(
    () => (Object.values(completed).filter(Boolean).length / MODULES.length) * 100,
    [completed]
  );

  const activeLevel = activeLevels[activeModule.id] ?? 0;

  return (
    <div className="app">
      <Sidebar
        active={safeIdx}
        onSelect={setActiveIdx}
        completed={completed}
        completionPct={completionPct}
        open={sidebarOpen}
      />
      <div className={`overlay ${sidebarOpen ? "show" : ""}`} onClick={() => setSidebarOpen(false)} />

      <div className="main" ref={mainRef}>
        <Header
          module={activeModule}
          onMenuClick={() => setSidebarOpen(true)}
          completionPct={completionPct}
        />
        <div className="content animate-in" key={`${activeModule.id}-${activeLevel}-${lang}`}>
          <ModuleRouter
            module={activeModule}
            isCompleted={!!completed[activeModule.id]}
            onComplete={() => markComplete(activeModule.id)}
            onNext={goNext}
            onPrev={goPrev}
            isFirst={safeIdx === 0}
            isLast={safeIdx === MODULES.length - 1}
            prevModule={MODULES[safeIdx - 1]}
            nextModule={MODULES[safeIdx + 1]}
            activeLevel={activeLevel}
            setLevel={(lvl) => setLevelFor(activeModule.id, lvl)}
          />
        </div>
      </div>

      <CookieBanner />
    </div>
  );
}

/* ============================================================================
   SIDEBAR
   ========================================================================== */

function Sidebar({ active, onSelect, completed, completionPct, open }) {
  const { t, lang, setLang } = useT();
  const [search, setSearch] = useState("");

  const localized = useMemo(() => MODULES.map((m) => ({
    ...m,
    title: m.titles[lang] || m.titles.es,
    subtitle: m.subtitles[lang] || m.subtitles.es,
    section: t.nav.sections[m.sectionKey] || m.sectionKey,
  })), [lang, t]);

  const filtered = useMemo(() => {
    if (!search) return localized;
    const q = search.toLowerCase();
    return localized.filter((m) =>
      m.title.toLowerCase().includes(q) ||
      m.subtitle.toLowerCase().includes(q)
    );
  }, [search, localized]);

  const sections = useMemo(() => {
    const groups = {};
    filtered.forEach((m) => {
      groups[m.section] = groups[m.section] || [];
      groups[m.section].push(m);
    });
    return groups;
  }, [filtered]);

  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <div className="sidebar__brand">
        <div className="brand-mark">
          <GraduationCap size={16} />
        </div>
        <div>
          <div className="brand-name">{t.brand.name}</div>
          <div className="brand-tag">{t.brand.tag}</div>
        </div>
      </div>

      <div className="sidebar__search">
        <div className="search-wrap">
          <Search size={13} />
          <input
            className="search-input"
            placeholder={t.nav.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label={t.nav.searchPlaceholder}
          />
        </div>
      </div>

      <nav className="sidebar__nav">
        {Object.entries(sections).map(([sectionName, items]) => (
          <div key={sectionName}>
            <div className="nav-section">{sectionName}</div>
            {items.map((m) => {
              const Icon = m.icon;
              const idx = MODULES.findIndex((x) => x.id === m.id);
              const isActive = idx === active;
              const isDone = completed[m.id];
              return (
                <button
                  key={m.id}
                  className={`nav-item ${isActive ? "active" : ""}`}
                  onClick={() => onSelect(idx)}
                >
                  <Icon className="nav-item__icon" size={15} />
                  <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {m.title}
                  </span>
                  {isDone ? (
                    <Check className="nav-item__check" size={13} />
                  ) : (
                    <span className="nav-item__num">{m.num}</span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar__footer">
        <div>
          <div className="nav-section" style={{ padding: "0 0 var(--s-2) 0" }}>{t.nav.language}</div>
          <div className="lang-switch" role="group">
            {["es", "en", "pt"].map((code) => (
              <button
                key={code}
                className={`lang-switch__btn ${lang === code ? "lang-switch__btn--active" : ""}`}
                onClick={() => setLang(code)}
                aria-pressed={lang === code}
              >
                {code}
              </button>
            ))}
          </div>
        </div>

        <div className="progress-card">
          <div className="progress-card__head">
            <span className="progress-card__label">{t.nav.progress}</span>
            <span className="progress-card__value">{Math.round(completionPct)}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-bar__fill" style={{ width: `${completionPct}%` }} />
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ============================================================================
   HEADER
   ========================================================================== */

function Header({ module, onMenuClick, completionPct }) {
  const { t, lang } = useT();
  const title = module.titles[lang] || module.titles.es;
  const section = t.nav.sections[module.sectionKey] || module.sectionKey;
  const time = module.times[lang] || module.times.es;
  return (
    <header className="header">
      <button className="header__menu-btn" onClick={onMenuClick} aria-label="Open menu">
        <Menu size={18} />
      </button>
      <div className="header__crumbs">
        <span>{t.header.course}</span>
        <ChevronRight size={12} className="header__crumb-sep" />
        <span>{section}</span>
        <ChevronRight size={12} className="header__crumb-sep" />
        <span className="header__crumb-current">{title}</span>
      </div>
      <div className="header__spacer" />
      <div className="header__meta">
        <Clock size={12} />
        <span>{time}</span>
      </div>
      <div className="header__meta">
        <Activity size={12} />
        <span>{Math.round(completionPct)}%</span>
      </div>
    </header>
  );
}

/* ============================================================================
   MODULE ROUTER
   ========================================================================== */

function ModuleRouter({ module, isCompleted, onComplete, onNext, onPrev, isFirst, isLast,
  prevModule, nextModule, activeLevel, setLevel }) {
  const { t, lang } = useT();

  const map = {
    intro: IntroModule,
    requisitos: RequisitosModule,
    crear: CrearModule,
    personalidad: PersonalidadModule,
    prompts: PromptsModule,
    herramientas: HerramientasModule,
    pruebas: PruebasModule,
    iteracion: IteracionModule,
    errores: ErroresModule,
    cierre: CierreModule,
  };
  const ModuleComp = map[module.id] || IntroModule;

  // Module 10 (cierre) doesn't use level tabs — it's the achievement
  const useLevels = module.id !== "cierre";

  return (
    <>
      {module.id === "intro" && activeLevel === 0 ? (
        <Hero />
      ) : (
        <ModuleHeader module={module} />
      )}

      {useLevels && (
        <LevelTabs
          activeLevel={activeLevel}
          onChange={setLevel}
        />
      )}

      <ModuleComp level={activeLevel} />

      <div className="module-nav">
        <button
          className="module-nav__btn"
          disabled={isFirst}
          onClick={onPrev}
        >
          <div className="module-nav__label">{t.nav_btn.previous}</div>
          <div className="module-nav__title">
            <ChevronLeft size={14} />
            {prevModule ? (prevModule.titles[lang] || prevModule.titles.es) : "—"}
          </div>
        </button>
        <button
          className="module-nav__btn module-nav__btn--next"
          onClick={() => {
            onComplete();
            if (!isLast) onNext();
          }}
        >
          <div className="module-nav__label">
            {isLast ? t.nav_btn.finish : (isCompleted ? t.nav_btn.continue : t.nav_btn.markAndContinue)}
          </div>
          <div className="module-nav__title">
            {isLast
              ? t.nav_btn.completeCourse
              : (nextModule ? (nextModule.titles[lang] || nextModule.titles.es) : "—")}
            <ChevronRight size={14} />
          </div>
        </button>
      </div>
    </>
  );
}

function ModuleHeader({ module }) {
  const { t, lang } = useT();
  const title = module.titles[lang] || module.titles.es;
  const subtitle = module.subtitles[lang] || module.subtitles.es;
  const section = t.nav.sections[module.sectionKey] || module.sectionKey;
  return (
    <div className="module-header">
      <div className="module-header__num">{module.num}</div>
      <div className="module-header__main">
        <div className="eyebrow">
          <span className="eyebrow__dot" />
          {section}
        </div>
        <h1 className="h1">{title}</h1>
        <p className="lede" style={{ marginBottom: 0 }}>{subtitle}</p>
      </div>
    </div>
  );
}

function Hero() {
  const { t } = useT();
  return (
    <div className="hero">
      <div className="eyebrow">
        <span className="eyebrow__dot" />
        {t.hero.eyebrow}
      </div>
      <h1 className="hero__title">
        {t.hero.title1}{" "}
        <span className="hero__title-em">{t.hero.title2}</span>{" "}
        {t.hero.title3}
      </h1>
      <p className="hero__sub">{t.hero.sub}</p>
      <div className="hero__meta">
        <div className="hero__meta-item"><Layers size={13} /> {t.hero.meta.modules}</div>
        <div className="hero__meta-item"><Clock size={13} /> {t.hero.meta.time}</div>
        <div className="hero__meta-item"><Boxes size={13} /> {t.hero.meta.levels}</div>
        <div className="hero__meta-item"><Sparkles size={13} /> {t.hero.meta.skills}</div>
      </div>
    </div>
  );
}

/* ============================================================================
   LEVEL TABS — pedagogical core
   ========================================================================== */

function LevelTabs({ activeLevel, onChange }) {
  const { t } = useT();
  const items = [
    { key: "foundations", title: t.levels.foundations, desc: t.levels.foundationsDesc, dotClass: "lvl-dot" },
    { key: "advanced", title: t.levels.advanced, desc: t.levels.advancedDesc, dotClass: "lvl-dot" },
    { key: "expert", title: t.levels.expert, desc: t.levels.expertDesc, dotClass: "lvl-dot" },
  ];
  return (
    <div className="levels" role="tablist">
      {items.map((it, i) => (
        <button
          key={it.key}
          role="tab"
          aria-selected={activeLevel === i}
          className={`level-tab ${activeLevel === i ? "level-tab--active" : ""}`}
          onClick={() => onChange(i)}
        >
          <div className={`level-tab__num level-tab__num--lvl${i + 1}`}>
            <span className="lvl-dot">{i === 0 ? "·" : i === 1 ? "··" : "···"}</span>
          </div>
          <div>
            <div className="level-tab__title">{it.title}</div>
            <div className="level-tab__desc">{it.desc}</div>
          </div>
        </button>
      ))}
    </div>
  );
}

/* ============================================================================
   PRIMITIVE COMPONENTS
   ========================================================================== */

function Card({ children, interactive, elevated, ghost, glow, style }) {
  const cls = ["card"];
  if (interactive) cls.push("card--interactive");
  if (elevated) cls.push("card--elevated");
  if (ghost) cls.push("card--ghost");
  if (glow) cls.push("card--glow");
  return <div className={cls.join(" ")} style={style}>{children}</div>;
}

function StepBlock({ num, title, desc }) {
  return (
    <div className="step">
      <div className="step__num">{num}</div>
      <div>
        <div className="step__title">{title}</div>
        <div className="step__desc">{desc}</div>
      </div>
    </div>
  );
}

function StepHeader({ what, why, how }) {
  const { lang } = useT();
  const labels = {
    es: { what: "Qué hacer", why: "Por qué", how: "Cómo validar" },
    en: { what: "What to do", why: "Why", how: "How to validate" },
    pt: { what: "O que fazer", why: "Por quê", how: "Como validar" },
  };
  const L = labels[lang] || labels.es;
  return (
    <div className="step-header">
      <div className="step-header__cell">
        <div className="step-header__label"><Target size={12} /> {L.what}</div>
        <div className="step-header__text">{what}</div>
      </div>
      <div className="step-header__cell">
        <div className="step-header__label"><Lightbulb size={12} /> {L.why}</div>
        <div className="step-header__text">{why}</div>
      </div>
      <div className="step-header__cell">
        <div className="step-header__label"><CheckCircle2 size={12} /> {L.how}</div>
        <div className="step-header__text">{how}</div>
      </div>
    </div>
  );
}

function ExpandableSection({ title, children, defaultOpen = false, icon: Icon }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="expandable">
      <button className="expandable__head" onClick={() => setOpen(!open)} aria-expanded={open}>
        <div className="expandable__head-left">
          {Icon && <Icon size={14} style={{ color: "var(--accent)" }} />}
          {title}
        </div>
        <ChevronRight size={15} className={`expandable__chevron ${open ? "expandable__chevron--open" : ""}`} />
      </button>
      {open && <div className="expandable__body animate-in">{children}</div>}
    </div>
  );
}

function Checklist({ items, persistKey }) {
  const storageKey = persistKey ? `${KEYS.CHECKLISTS}:${persistKey}` : null;
  const [checked, setChecked] = useState(() =>
    storageKey ? safeGet(storageKey, {}) : {}
  );
  useEffect(() => {
    if (storageKey) safeSet(storageKey, checked);
  }, [storageKey, checked]);

  const toggle = (id) => setChecked((p) => ({ ...p, [id]: !p[id] }));

  // Defensive: if items missing or empty, render an explicit empty state
  // rather than empty boxes (which the user sees as broken UI).
  if (!Array.isArray(items) || items.length === 0) {
    return (
      <div className="check-empty" role="status">
        <AlertCircle size={14} />
        <span>No hay elementos en este checklist.</span>
      </div>
    );
  }

  return (
    <div className="stack-2">
      {items.map((it, i) => {
        // Accept both shapes: { label } (new modules) and { title, desc } (legacy).
        const id = it.id ?? `item-${i}`;
        const title = it.label ?? it.title ?? "";
        const desc = it.desc;
        return (
          <button
            key={id}
            type="button"
            className={`check-item ${checked[id] ? "check-item--checked" : ""}`}
            onClick={() => toggle(id)}
            aria-pressed={!!checked[id]}
          >
            <div className="check-item__box" aria-hidden="true">
              {checked[id] && <Check size={11} strokeWidth={3} />}
            </div>
            <div style={{ flex: 1, textAlign: "left" }}>
              <div className="check-item__title">{title}</div>
              {desc && <div className="check-item__desc">{desc}</div>}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function CodeBlock({ title, code, type, note, filename }) {
  const [copied, setCopied] = useState(false);
  const cls = ["codeblock"];
  if (type === "good") cls.push("codeblock--good");
  if (type === "bad") cls.push("codeblock--bad");

  const onCopy = () => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={cls.join(" ")}>
      <div className="codeblock__head">
        <div className="codeblock__title">
          {type === "good" && <CheckCircle2 size={12} style={{ color: "var(--success)" }} />}
          {type === "bad" && <XCircle size={12} style={{ color: "var(--danger)" }} />}
          {filename || title}
        </div>
        <button className={`codeblock__copy ${copied ? "codeblock__copy--copied" : ""}`} onClick={onCopy}>
          {copied ? <><Check size={12} /> {label("copied")}</> : <><Copy size={12} /> {label("copy")}</>}
        </button>
      </div>
      <pre className="codeblock__body">{code}</pre>
      {note && (
        <div className={`codeblock__note ${type === "good" ? "codeblock__note--good" : ""} ${type === "bad" ? "codeblock__note--bad" : ""}`}>
          {note}
        </div>
      )}
    </div>
  );
}

// Tiny helper for copy buttons (not full i18n, but localized)
function label(key) {
  if (typeof document === "undefined") return key;
  const lang = (typeof window !== "undefined" && window.localStorage)
    ? safeGet(KEYS.LANG, "es") : "es";
  const dict = {
    copy: { es: "Copiar", en: "Copy", pt: "Copiar" },
    copied: { es: "Copiado", en: "Copied", pt: "Copiado" },
  };
  return dict[key]?.[lang] || dict[key]?.es || key;
}

function AlertBox({ type = "info", title, children }) {
  const icons = {
    info: Info,
    warning: AlertTriangle,
    success: CheckCircle2,
    danger: AlertOctagon,
  };
  const Icon = icons[type];
  return (
    <div className={`alert alert--${type}`}>
      <Icon size={16} className="alert__icon" />
      <div style={{ flex: 1 }}>
        {title && <div className="alert__title">{title}</div>}
        <div className="alert__body">{children}</div>
      </div>
    </div>
  );
}

function CompareCards({ bad, good }) {
  return (
    <div className="grid grid--2">
      <div className="compare compare--bad">
        <div className="compare__head"><XCircle size={12} /> {bad.label}</div>
        <div className="compare__body">{bad.code}</div>
        <div className="compare__footer">{bad.note}</div>
      </div>
      <div className="compare compare--good">
        <div className="compare__head"><CheckCircle2 size={12} /> {good.label}</div>
        <div className="compare__body">{good.code}</div>
        <div className="compare__footer">{good.note}</div>
      </div>
    </div>
  );
}

function QuizCard({ question, options, correct, explanation }) {
  const { t } = useT();
  const [answer, setAnswer] = useState(null);
  const answered = answer !== null;
  return (
    <div className="quiz">
      <div className="quiz__label"><Target size={12} /> {t.module.validate}</div>
      <div className="quiz__question">{question}</div>
      {options.map((opt, i) => {
        let cls = "quiz__option";
        if (answered) {
          if (i === correct) cls += " quiz__option--correct";
          else if (i === answer) cls += " quiz__option--wrong";
        }
        return (
          <button
            key={i}
            className={cls}
            onClick={() => !answered && setAnswer(i)}
            disabled={answered}
          >
            <span className="quiz__letter">{String.fromCharCode(65 + i)}</span>
            <span style={{ flex: 1 }}>{opt}</span>
            {answered && i === correct && <Check size={14} />}
            {answered && i === answer && i !== correct && <XCircle size={14} />}
          </button>
        );
      })}
      {answered && (
        <div className="quiz__feedback">
          {explanation}
        </div>
      )}
    </div>
  );
}

function SkillBanner({ levelKey, title, description }) {
  const { t } = useT();
  const labelMap = {
    foundations: t.skills.core,
    advanced: t.skills.applied,
    expert: t.skills.essentials,
  };
  return (
    <div className="skill-banner">
      <div className="skill-banner__icon">
        <Sparkles size={16} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="skill-banner__label">{t.skills.label} · {labelMap[levelKey] || ""}</div>
        <div className="skill-banner__title">{title}</div>
        {description && <div style={{ fontSize: "var(--fs-xs)", color: "var(--text-secondary)", marginTop: 2 }}>{description}</div>}
      </div>
    </div>
  );
}

/* ============================================================================
   AGENT SIMULATOR — intelligent + optional real Claude API
   --------------------------------------------------------------------------
   Modes:
   - Simulation (default): Multi-keyword scoring + rotating responses + memory
     so it never repeats the same answer back-to-back and feels conversational.
   - Real API: when user provides a Claude API key, it streams real responses
     from the Anthropic API via direct fetch.
   ========================================================================== */

const PLANT_AGENT_SYSTEM_PROMPT = `Eres "Verde", asistente experto en cuidado de plantas de interior para la tienda online Plantas&Co.

# CONTEXTO
Atiendes mayoritariamente a principiantes. Hablas en el idioma del usuario (español, inglés o portugués).

# ROL
Asistente cálido, paciente y especializado solo en plantas de interior.

# INSTRUCCIONES
1. Saluda con calidez si es el primer turno y pide nombre o descripción de la planta.
2. Antes de aconsejar, recoge: tipo de luz, frecuencia de riego, ubicación.
3. Da consejos en pasos numerados, máximo 5 puntos.
4. Si detectas un problema grave (plaga, hongos), sugiere consultar a un humano.
5. Termina cada respuesta con una pregunta para mantener el diálogo.

# TONO
Cálido, claro, sin tecnicismos. Máximo 1 emoji por respuesta — preferiblemente ninguno.

# LÍMITES
- No diagnostiques con fotos.
- No recomiendes pesticidas concretos.
- Si el usuario pide algo fuera del cuidado de plantas, redirige amablemente.`;

// Strict format check: Anthropic keys start with "sk-ant-" followed by base64-ish chars.
// We accept any "sk-ant-…" of reasonable length so we don't break against minor format changes.
function isValidApiKeyFormat(key) {
  if (typeof key !== "string") return false;
  const k = key.trim();
  return /^sk-ant-[A-Za-z0-9_\-]{20,}$/.test(k);
}

// Translate transport / HTTP errors into user-actionable messages.
function classifyApiError(status, body) {
  // Network failure (no status)
  if (status === 0) {
    return {
      kind: "network",
      title: "No se pudo conectar con la API de Claude",
      hint: "Revisa tu conexión a internet o intenta de nuevo en unos segundos. Si tu navegador bloquea solicitudes a api.anthropic.com (CORS, extensiones, VPN), usa el modo simulación."
    };
  }
  if (status === 401) {
    return {
      kind: "auth",
      title: "API key inválida o expirada (401)",
      hint: "Verifica que copiaste la clave completa desde console.anthropic.com → API Keys. Si la perdiste, debes crear una nueva: Anthropic solo muestra la clave una vez."
    };
  }
  if (status === 403) {
    return {
      kind: "forbidden",
      title: "Permiso denegado (403)",
      hint: "Tu clave es válida pero la organización no tiene permiso para usar este modelo. Revisa tu plan en console.anthropic.com."
    };
  }
  if (status === 429) {
    return {
      kind: "rate",
      title: "Límite de uso alcanzado (429)",
      hint: "Has superado tu cuota o el rate limit. Espera unos minutos o aumenta tu plan."
    };
  }
  if (status >= 500) {
    return {
      kind: "server",
      title: `Error del servidor (${status})`,
      hint: "La API tuvo un problema interno. Intenta de nuevo en unos segundos."
    };
  }
  // Try to extract a useful message from the response body
  const apiMsg = body?.error?.message;
  return {
    kind: "other",
    title: `Error ${status}${apiMsg ? ": " + apiMsg : ""}`,
    hint: "Revisa la consola del navegador para más detalle. Mientras tanto puedes seguir en modo simulación."
  };
}

function AgentSimulator() {
  const { t, lang } = useT();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [partial, setPartial] = useState("");
  const [apiKey, setApiKey] = usePersistentState(KEYS.API_KEY, "");
  const [apiKeyDraft, setApiKeyDraft] = useState("");
  const [showApiBar, setShowApiBar] = useState(false);
  const [showApiHelp, setShowApiHelp] = useState(false);
  const [keyError, setKeyError] = useState(null);
  const [error, setError] = useState(null); // { title, hint }
  const usedRef = useRef({});
  const bodyRef = useRef(null);
  const apiHelpRef = useRef(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 99999, behavior: "smooth" });
  }, [messages, partial]);

  useEffect(() => {
    setMessages([]);
    setPartial("");
    setError(null);
    usedRef.current = {};
  }, [lang]);

  // Close popover on outside click / Escape
  useEffect(() => {
    if (!showApiHelp) return;
    function onDoc(e) {
      if (apiHelpRef.current && !apiHelpRef.current.contains(e.target)) {
        setShowApiHelp(false);
      }
    }
    function onKey(e) { if (e.key === "Escape") setShowApiHelp(false); }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [showApiHelp]);

  function streamLocal(text, after) {
    setTyping(true);
    setPartial("");
    let i = 0;
    const tick = setInterval(() => {
      if (i <= text.length) {
        setPartial(text.slice(0, i));
        i += 2;
      } else {
        clearInterval(tick);
        setTyping(false);
        setPartial("");
        after();
      }
    }, 14);
  }

  async function sendReal(userText, history) {
    setTyping(true);
    setError(null);
    let status = 0;
    let body = null;
    try {
      const apiMessages = history.concat([{ role: "user", content: userText }]).map((m) => ({
        role: m.role === "bot" ? "assistant" : "user",
        content: m.content,
      }));
      let res;
      try {
        res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
            "anthropic-dangerous-direct-browser-access": "true",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-5",
            max_tokens: 600,
            system: PLANT_AGENT_SYSTEM_PROMPT,
            messages: apiMessages,
          }),
        });
      } catch (netErr) {
        // Pure network failure: DNS, CORS, offline, etc.
        const cls = classifyApiError(0, null);
        setTyping(false);
        setPartial("");
        setError(cls);
        setMessages((m) => [...m, { role: "bot", content: `${cls.title}. ${cls.hint}`, error: true }]);
        return;
      }

      status = res.status;
      try { body = await res.json(); } catch { body = null; }

      if (!res.ok) {
        const cls = classifyApiError(status, body);
        setTyping(false);
        setPartial("");
        setError(cls);
        setMessages((m) => [...m, { role: "bot", content: `${cls.title}. ${cls.hint}`, error: true }]);
        return;
      }

      const text = (body?.content || [])
        .filter((b) => b.type === "text")
        .map((b) => b.text)
        .join("\n")
        .trim();

      if (!text) {
        const cls = { title: "Respuesta vacía de la API", hint: "El modelo respondió pero sin contenido textual. Intenta de nuevo." };
        setTyping(false);
        setPartial("");
        setError(cls);
        setMessages((m) => [...m, { role: "bot", content: `${cls.title}. ${cls.hint}`, error: true }]);
        return;
      }

      streamLocal(text, () => {
        setMessages((m) => [...m, { role: "bot", content: text }]);
      });
    } catch (e) {
      const cls = classifyApiError(status || 0, body);
      setTyping(false);
      setPartial("");
      setError(cls);
      setMessages((m) => [...m, { role: "bot", content: `${cls.title}. ${cls.hint}`, error: true }]);
    }
  }

  function sendSim(userText, history) {
    const scores = smartScore(userText);
    let reply;
    if (scores.length === 0) {
      reply = pickFallback(lang, history);
    } else {
      const top = scores[0].id;
      const picked = pickResponse(top, lang, history, usedRef.current);
      if (!picked) {
        reply = pickFallback(lang, history);
      } else {
        if (!usedRef.current[top]) usedRef.current[top] = new Set();
        usedRef.current[top].add(picked.idxUsed);
        reply = picked.text;
        const sameTopicTurns = history.filter((m) => m.role === "bot").length;
        if (sameTopicTurns >= 2 && Math.random() > 0.5) {
          const intros = SIM_FOLLOWUP[lang] || SIM_FOLLOWUP.es;
          reply = `${intros[sameTopicTurns % intros.length]} ${reply}`;
        }
      }
    }
    streamLocal(reply, () => {
      setMessages((m) => [...m, { role: "bot", content: reply }]);
    });
  }

  function send(text) {
    if (!text.trim() || typing) return;
    setError(null);
    const userMsg = { role: "user", content: text };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput("");
    if (isValidApiKeyFormat(apiKey)) {
      sendReal(text, messages);
    } else {
      sendSim(text, messages);
    }
  }

  const reset = () => {
    setMessages([]);
    setPartial("");
    setError(null);
    usedRef.current = {};
  };

  function commitApiKey() {
    const candidate = (apiKeyDraft || "").trim();
    if (!candidate) {
      setKeyError("Pega tu API key. Empieza con sk-ant-…");
      return;
    }
    if (!isValidApiKeyFormat(candidate)) {
      setKeyError("Formato inválido. La clave debe empezar con sk-ant- y tener al menos 28 caracteres.");
      return;
    }
    setApiKey(candidate);
    setApiKeyDraft("");
    setKeyError(null);
    setShowApiBar(false);
    setError(null);
  }

  function removeApiKey() {
    setApiKey("");
    setApiKeyDraft("");
    setKeyError(null);
    setError(null);
  }

  const apiConnected = isValidApiKeyFormat(apiKey);

  return (
    <div className="sim">
      <div className="sim__head">
        <div className={`sim__status ${apiConnected ? "sim__status--api" : ""}`} aria-hidden="true" />
        <div className="sim__title">{t.sim.title}</div>
        <div className="sim__tag">
          {apiConnected ? <><KeyRound size={11} /> {t.sim.apiConnected}</> : <><Bot size={11} /> {t.sim.apiSimulated}</>}
        </div>

        <div ref={apiHelpRef} style={{ position: "relative", display: "inline-flex" }}>
          <button
            className="sim__head-btn"
            onClick={() => { setShowApiBar((s) => !s); setShowApiHelp(false); }}
            aria-expanded={showApiBar}
            aria-label="Configurar API key"
            title="API key"
          >
            <Settings size={13} />
          </button>
          <button
            className="sim__head-btn"
            onClick={() => setShowApiHelp((s) => !s)}
            aria-expanded={showApiHelp}
            aria-label="Cómo obtener una API key"
            title="¿Cómo obtengo mi API key?"
          >
            <HelpCircle size={13} />
          </button>
          {showApiHelp && <ApiKeyHelpPopover onClose={() => setShowApiHelp(false)} />}
        </div>

        {messages.length > 0 && (
          <button className="sim__head-btn" onClick={reset} aria-label={t.sim.reset} title={t.sim.reset}>
            <Trash2 size={13} />
          </button>
        )}
      </div>

      {showApiBar && (
        <div className="sim__api-bar">
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
            <input
              type="password"
              className="sim__api-input"
              placeholder={apiConnected ? "•••• " + apiKey.slice(-6) : t.sim.apiPlaceholder}
              value={apiKeyDraft}
              onChange={(e) => { setApiKeyDraft(e.target.value); setKeyError(null); }}
              onKeyDown={(e) => e.key === "Enter" && commitApiKey()}
              aria-label="Claude API key"
              aria-invalid={!!keyError}
              autoComplete="off"
              spellCheck={false}
            />
            {keyError && <div className="sim__key-error" role="alert">{keyError}</div>}
          </div>
          <button
            className="btn btn--primary"
            style={{ height: 30, fontSize: "var(--fs-xs)" }}
            onClick={commitApiKey}
          >
            <Lock size={12} /> {t.sim.apiSet}
          </button>
          {apiConnected && (
            <button
              className="btn btn--danger"
              style={{ height: 30, fontSize: "var(--fs-xs)" }}
              onClick={removeApiKey}
            >
              <Unlock size={12} /> {t.sim.apiRemove}
            </button>
          )}
        </div>
      )}

      {error && (
        <div className="sim__error-banner" role="alert">
          <AlertOctagon size={14} />
          <div>
            <div className="sim__error-title">{error.title}</div>
            <div className="sim__error-hint">{error.hint}</div>
          </div>
          <button className="sim__error-close" onClick={() => setError(null)} aria-label="Cerrar">
            <X size={12} />
          </button>
        </div>
      )}

      <div className="sim__body" ref={bodyRef}>
        {messages.length === 0 && !typing && (
          <div className="sim__empty">
            {t.sim.empty}
            {!apiConnected && (
              <div style={{ marginTop: "var(--s-2)", fontSize: "var(--fs-xs)", color: "var(--text-tertiary)" }}>
                {t.sim.apiHint}
              </div>
            )}
            <div className="sim__suggest">
              {t.sim.suggestions.map((s) => (
                <button key={s} className="sim__chip" onClick={() => send(s)}>{s}</button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          m.role === "user" ? (
            <div key={i} className="sim__row sim__row--user">
              <div className="sim__msg--user">{m.content}</div>
            </div>
          ) : (
            <div key={i} className="sim__row sim__row--bot">
              <div className="sim__avatar"><Leaf size={14} /></div>
              <div className={`sim__msg--bot ${m.error ? "sim__msg--bot--error" : ""}`}>{m.content}</div>
            </div>
          )
        ))}
        {typing && (
          <div className="sim__row sim__row--bot">
            <div className="sim__avatar"><Leaf size={14} /></div>
            <div className="sim__msg--bot">
              {partial ? (
                <>{partial}<span className="sim__cursor" /></>
              ) : (
                <span className="sim__loading"><Loader2 size={12} /> {t.sim.typing}</span>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="sim__footer">
        <input
          className="sim__input"
          placeholder={t.sim.placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send(input)}
          aria-label={t.sim.placeholder}
        />
        <button className="btn btn--primary" onClick={() => send(input)} disabled={typing || !input.trim()}>
          <Send size={12} /> {t.sim.send}
        </button>
      </div>
    </div>
  );
}

function ApiKeyHelpPopover({ onClose }) {
  const { lang } = useT();
  const copy = {
    es: {
      title: "Cómo obtener tu API key",
      lead: "Para usar Claude real necesitas una clave del Console de Anthropic.",
      steps: [
        { n: 1, t: "Visita console.anthropic.com", url: "https://console.anthropic.com" },
        { n: 2, t: "Inicia sesión con tu cuenta de Anthropic" },
        { n: 3, t: "En el menú lateral, ve a API Keys" },
        { n: 4, t: "Crea, ve o revoca tus claves desde ahí" }
      ],
      warnTitle: "Importante",
      warn: "Por seguridad, Anthropic solo muestra la clave completa una vez al crearla. Si no la guardaste, tendrás que generar una nueva.",
      cta: "Abrir Claude Console",
      close: "Cerrar"
    },
    en: {
      title: "How to get your API key",
      lead: "To use real Claude you need a key from Anthropic Console.",
      steps: [
        { n: 1, t: "Visit console.anthropic.com", url: "https://console.anthropic.com" },
        { n: 2, t: "Sign in with your Anthropic account" },
        { n: 3, t: "In the side menu, go to API Keys" },
        { n: 4, t: "Create, view or revoke your keys there" }
      ],
      warnTitle: "Important",
      warn: "For security, Anthropic only shows the full key once at creation. If you didn't save it, you'll have to generate a new one.",
      cta: "Open Claude Console",
      close: "Close"
    },
    pt: {
      title: "Como obter sua API key",
      lead: "Para usar o Claude real você precisa de uma chave do Anthropic Console.",
      steps: [
        { n: 1, t: "Visite console.anthropic.com", url: "https://console.anthropic.com" },
        { n: 2, t: "Entre com sua conta Anthropic" },
        { n: 3, t: "No menu lateral, vá em API Keys" },
        { n: 4, t: "Crie, veja ou revogue suas chaves ali" }
      ],
      warnTitle: "Importante",
      warn: "Por segurança, o Anthropic só mostra a chave completa uma vez na criação. Se você não salvou, terá que gerar uma nova.",
      cta: "Abrir Claude Console",
      close: "Fechar"
    }
  };
  const c = copy[lang] || copy.es;
  return (
    <div className="api-help-pop" role="dialog" aria-label={c.title}>
      <div className="api-help-pop__head">
        <div className="api-help-pop__title">
          <KeyRound size={14} />
          <span>{c.title}</span>
        </div>
        <button className="api-help-pop__close" onClick={onClose} aria-label={c.close}>
          <X size={12} />
        </button>
      </div>
      <p className="api-help-pop__lead">{c.lead}</p>
      <ol className="api-help-pop__steps">
        {c.steps.map((s) => (
          <li key={s.n}>
            <span className="api-help-pop__num">{s.n}</span>
            <span className="api-help-pop__step-text">
              {s.url ? (
                <>
                  {c.steps[0].n === s.n ? (
                    <>
                      Visita <a href={s.url} target="_blank" rel="noopener noreferrer">{s.url.replace("https://", "")}</a>
                    </>
                  ) : s.t}
                </>
              ) : s.t}
            </span>
          </li>
        ))}
      </ol>
      <div className="api-help-pop__warn">
        <AlertCircle size={13} />
        <div>
          <div className="api-help-pop__warn-title">{c.warnTitle}</div>
          <div className="api-help-pop__warn-body">{c.warn}</div>
        </div>
      </div>
      <a
        className="btn btn--primary api-help-pop__cta"
        href="https://console.anthropic.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <ExternalLink size={12} /> {c.cta}
      </a>
    </div>
  );
}

function PromptEditor({ initial, filename = "system_prompt.txt", persistKey }) {
  const storageKey = persistKey ? `${KEYS.PROMPTS}:${persistKey}` : null;
  const [value, setValue] = useState(() =>
    storageKey ? safeGet(storageKey, initial) : initial
  );
  useEffect(() => {
    if (storageKey) safeSet(storageKey, value);
  }, [storageKey, value]);
  const [copied, setCopied] = useState(false);
  const onCopy = () => {
    navigator.clipboard?.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="editor">
      <div className="editor__head">
        <div className="editor__filename">
          <FileText size={11} /> {filename}
        </div>
        <button className={`codeblock__copy ${copied ? "codeblock__copy--copied" : ""}`} onClick={onCopy}>
          {copied ? <><Check size={12} /> {label("copied")}</> : <><Copy size={12} /> {label("copy")}</>}
        </button>
      </div>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        spellCheck={false}
      />
    </div>
  );
}

/* ============================================================================
   COOKIE BANNER — premium privacy UX
   ========================================================================== */

function CookieBanner() {
  const { t } = useT();
  const [consent, setConsent] = usePersistentState(KEYS.CONSENT, null);
  const [expanded, setExpanded] = useState(false);
  const [draft, setDraft] = useState({ essential: true, analytics: true });

  if (consent !== null) return null;

  const acceptAll = () => setConsent({ essential: true, analytics: true, ts: Date.now() });
  const onlyEssential = () => setConsent({ essential: true, analytics: false, ts: Date.now() });
  const saveCustom = () => setConsent({ ...draft, ts: Date.now() });

  return (
    <div className="cookie-banner" role="dialog" aria-label={t.cookies.title}>
      <div className="cookie-banner__head">
        <div className="cookie-banner__icon">
          <Cookie size={18} />
        </div>
        <div style={{ flex: 1 }}>
          <div className="cookie-banner__title">{t.cookies.title}</div>
          <div className="cookie-banner__body">{t.cookies.body}</div>
        </div>
      </div>

      {expanded && (
        <div className="cookie-banner__categories">
          <div className="cookie-cat">
            <div className="cookie-cat__main">
              <div className="cookie-cat__head">
                <div className="cookie-cat__title">{t.cookies.essential}</div>
                <div className="cookie-cat__locked">{t.cookies.essential.toLowerCase() === "essential" ? "Required" : "Obligatorio"}</div>
              </div>
              <div className="cookie-cat__desc">{t.cookies.essentialDesc}</div>
            </div>
            <div className="cookie-toggle cookie-toggle--locked" aria-disabled="true" />
          </div>
          <div className="cookie-cat">
            <div className="cookie-cat__main">
              <div className="cookie-cat__head">
                <div className="cookie-cat__title">{t.cookies.analytics}</div>
              </div>
              <div className="cookie-cat__desc">{t.cookies.analyticsDesc}</div>
            </div>
            <button
              className={`cookie-toggle ${draft.analytics ? "cookie-toggle--on" : ""}`}
              onClick={() => setDraft((d) => ({ ...d, analytics: !d.analytics }))}
              aria-pressed={draft.analytics}
              aria-label={t.cookies.analytics}
            />
          </div>
        </div>
      )}

      <div className="cookie-banner__actions">
        {!expanded && (
          <button className="btn btn--ghost" onClick={() => setExpanded(true)}>
            <Settings size={13} /> {t.cookies.customize}
          </button>
        )}
        {expanded ? (
          <button className="btn btn--primary" onClick={saveCustom}>
            <Check size={13} /> {t.cookies.save}
          </button>
        ) : (
          <>
            <button className="btn btn--secondary" onClick={onlyEssential}>
              {t.cookies.onlyEssential}
            </button>
            <button className="btn btn--primary" onClick={acceptAll}>
              {t.cookies.acceptAll}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ============================================================================
   ACHIEVEMENT CORE — premium reward moment for module 10
   ========================================================================== */

function AchievementCore() {
  const [pulsed, setPulsed] = useState(false);
  const handleClick = () => {
    setPulsed(true);
    setTimeout(() => setPulsed(false), 600);
  };
  return (
    <button
      className="achievement__core-wrap"
      onClick={handleClick}
      aria-label="Achievement core"
      style={{ background: "transparent", border: "none", padding: 0 }}
    >
      <div className={`achievement__core ${pulsed ? "achievement__core--pulsed" : ""}`}>
        <div className="achievement__orbit" />
        <div className="achievement__orbit achievement__orbit--inner" />
        <div className="achievement__ring achievement__ring--outer" />
        <div className="achievement__ring" />
        <div className="achievement__orb" />
        <div className="achievement__icon">
          <Sparkles size={56} strokeWidth={1.5} />
        </div>
        <div className="achievement__particle achievement__particle--1" />
        <div className="achievement__particle achievement__particle--2" />
        <div className="achievement__particle achievement__particle--3" />
        <div className="achievement__particle achievement__particle--4" />
      </div>
    </button>
  );
}

/* ============================================================================
   MODULE 1 — INTRODUCCIÓN
   ========================================================================== */

function IntroModule({ level }) {
  const { t, lang } = useT();
  const copy = {
    es: {
      f_title: "¿Qué es un agente de Claude?",
      f_lead:
        "Un agente es una versión especializada de Claude con instrucciones, personalidad y propósito definidos. No es un chat genérico: es un colaborador con un trabajo concreto.",
      f_analogy_title: "La analogía del nuevo empleado",
      f_analogy_lead:
        "Cuando contratas a alguien, no esperas que adivine su trabajo. Le das un cargo, instrucciones claras y herramientas. Lo mismo necesita un agente.",
      cards: [
        { title: "Cargo definido", body: "El agente sabe quién es y para qué existe.", Icon: UserSquare },
        { title: "Instrucciones claras", body: "Sabe qué hacer, en qué orden y cómo responder.", Icon: ClipboardList },
        { title: "Herramientas disponibles", body: "Sabe con qué cuenta para hacer su trabajo.", Icon: Wrench }
      ],
      a_title: "Agentes en el mundo real",
      a_lead:
        "Los agentes resuelven problemas concretos en empresas reales. No son demos: son piezas operativas que reemplazan procesos humanos repetitivos.",
      a_examples: [
        { area: "Soporte", body: "Triage de tickets, respuestas de primer nivel, escalamiento inteligente." },
        { area: "Ventas", body: "Calificación de leads, generación de propuestas, seguimiento personalizado." },
        { area: "Operaciones", body: "Resúmenes de reuniones, extracción de datos, generación de reportes." },
        { area: "Producto", body: "Asistentes de onboarding, generación de documentación, FAQs dinámicas." }
      ],
      a_when_title: "¿Cuándo usar un agente?",
      a_when: [
        "Tarea repetitiva con criterio variable",
        "Volumen alto que satura a humanos",
        "Conocimiento que ya existe pero no está estructurado",
        "Procesos donde la consistencia es crítica"
      ],
      a_when_not: [
        "Decisiones legales o médicas vinculantes",
        "Cálculos exactos donde un script es más barato",
        "Tareas con consecuencias irreversibles sin supervisión"
      ],
      e_title: "Arquitectura de un agente productivo",
      e_lead:
        "A nivel sistema, un agente no es solo un prompt. Es la composición de capas que hay que diseñar deliberadamente.",
      e_layers: [
        { name: "Identidad", body: "Quién es el agente, para quién trabaja, qué nunca hará." },
        { name: "Contexto", body: "Información del negocio, glosario, políticas, datos del usuario." },
        { name: "Instrucciones", body: "Procedimiento operativo: pasos, criterios, formato de salida." },
        { name: "Herramientas", body: "Búsqueda, APIs, bases de datos, ejecución de código." },
        { name: "Guardarraíles", body: "Qué responder fuera de alcance, cómo escalar, qué no decir." },
        { name: "Evaluación", body: "Métricas, casos de prueba, telemetría de calidad." }
      ],
      e_design_title: "Decisiones de diseño que importan",
      e_design: [
        "Latencia vs profundidad: ¿respuesta rápida o razonada?",
        "Determinismo vs creatividad: ¿temperatura baja o alta?",
        "Especialista único vs múltiples agentes coordinados",
        "Memoria por sesión vs memoria persistente del usuario",
        "Costo por interacción y techo de tokens razonable"
      ]
    },
    en: {
      f_title: "What is a Claude agent?",
      f_lead:
        "An agent is a specialized version of Claude with defined instructions, personality and purpose. It is not a generic chat: it is a collaborator with a concrete job.",
      f_analogy_title: "The new-employee analogy",
      f_analogy_lead:
        "When you hire someone, you do not expect them to guess their job. You give them a role, clear instructions and tools. An agent needs the same.",
      cards: [
        { title: "Defined role", body: "The agent knows who it is and why it exists.", Icon: UserSquare },
        { title: "Clear instructions", body: "It knows what to do, in what order, and how to respond.", Icon: ClipboardList },
        { title: "Available tools", body: "It knows what it can use to do its job.", Icon: Wrench }
      ],
      a_title: "Agents in the real world",
      a_lead:
        "Agents solve concrete problems in real companies. They are not demos: they are operational pieces that replace repetitive human processes.",
      a_examples: [
        { area: "Support", body: "Ticket triage, first-line answers, smart escalation." },
        { area: "Sales", body: "Lead qualification, proposal generation, personalized follow-ups." },
        { area: "Operations", body: "Meeting summaries, data extraction, report generation." },
        { area: "Product", body: "Onboarding assistants, documentation, dynamic FAQs." }
      ],
      a_when_title: "When to use an agent",
      a_when: [
        "Repetitive task with variable judgment",
        "High volume that overwhelms humans",
        "Knowledge that already exists but is unstructured",
        "Processes where consistency is critical"
      ],
      a_when_not: [
        "Legal or medical binding decisions",
        "Exact calculations where a script is cheaper",
        "Irreversible actions without human review"
      ],
      e_title: "Architecture of a production agent",
      e_lead:
        "At system level, an agent is not just a prompt. It is the composition of layers you must design deliberately.",
      e_layers: [
        { name: "Identity", body: "Who the agent is, who it serves, what it will never do." },
        { name: "Context", body: "Business information, glossary, policies, user data." },
        { name: "Instructions", body: "Operating procedure: steps, criteria, output format." },
        { name: "Tools", body: "Search, APIs, databases, code execution." },
        { name: "Guardrails", body: "Out-of-scope answers, escalation paths, what not to say." },
        { name: "Evaluation", body: "Metrics, test cases, quality telemetry." }
      ],
      e_design_title: "Design decisions that matter",
      e_design: [
        "Latency vs depth: fast or reasoned answer?",
        "Determinism vs creativity: low or high temperature?",
        "Single specialist vs multiple coordinated agents",
        "Per-session memory vs persistent user memory",
        "Cost per interaction and reasonable token ceiling"
      ]
    },
    pt: {
      f_title: "O que é um agente Claude?",
      f_lead:
        "Um agente é uma versão especializada do Claude com instruções, personalidade e propósito definidos. Não é um chat genérico: é um colaborador com um trabalho concreto.",
      f_analogy_title: "A analogia do funcionário novo",
      f_analogy_lead:
        "Quando você contrata alguém, não espera que adivinhe o trabalho. Você dá um cargo, instruções claras e ferramentas. O mesmo precisa um agente.",
      cards: [
        { title: "Cargo definido", body: "O agente sabe quem é e por que existe.", Icon: UserSquare },
        { title: "Instruções claras", body: "Sabe o que fazer, em qual ordem e como responder.", Icon: ClipboardList },
        { title: "Ferramentas disponíveis", body: "Sabe com o que conta para fazer seu trabalho.", Icon: Wrench }
      ],
      a_title: "Agentes no mundo real",
      a_lead:
        "Agentes resolvem problemas concretos em empresas reais. Não são demos: são peças operacionais que substituem processos humanos repetitivos.",
      a_examples: [
        { area: "Suporte", body: "Triagem de tickets, respostas de primeiro nível, escalonamento inteligente." },
        { area: "Vendas", body: "Qualificação de leads, geração de propostas, follow-up personalizado." },
        { area: "Operações", body: "Resumos de reuniões, extração de dados, geração de relatórios." },
        { area: "Produto", body: "Assistentes de onboarding, documentação, FAQs dinâmicas." }
      ],
      a_when_title: "Quando usar um agente",
      a_when: [
        "Tarefa repetitiva com critério variável",
        "Volume alto que sobrecarrega humanos",
        "Conhecimento que já existe mas não está estruturado",
        "Processos onde a consistência é crítica"
      ],
      a_when_not: [
        "Decisões legais ou médicas vinculantes",
        "Cálculos exatos onde um script é mais barato",
        "Tarefas irreversíveis sem supervisão"
      ],
      e_title: "Arquitetura de um agente em produção",
      e_lead:
        "Em nível de sistema, um agente não é só um prompt. É a composição de camadas que você deve desenhar deliberadamente.",
      e_layers: [
        { name: "Identidade", body: "Quem é o agente, para quem trabalha, o que nunca fará." },
        { name: "Contexto", body: "Informação do negócio, glossário, políticas, dados do usuário." },
        { name: "Instruções", body: "Procedimento operacional: passos, critérios, formato de saída." },
        { name: "Ferramentas", body: "Busca, APIs, bancos de dados, execução de código." },
        { name: "Guard-rails", body: "O que responder fora de escopo, como escalar, o que não dizer." },
        { name: "Avaliação", body: "Métricas, casos de teste, telemetria de qualidade." }
      ],
      e_design_title: "Decisões de design que importam",
      e_design: [
        "Latência vs profundidade: resposta rápida ou raciocinada?",
        "Determinismo vs criatividade: temperatura baixa ou alta?",
        "Especialista único vs múltiplos agentes coordenados",
        "Memória por sessão vs memória persistente do usuário",
        "Custo por interação e teto de tokens razoável"
      ]
    }
  };
  const c = copy[lang] || copy.es;

  if (level === 0) {
    return (
      <>
        <SkillBanner level={0} />
        <Card>
          <h2 className="card__title">{c.f_title}</h2>
          <p className="card__lead">{c.f_lead}</p>
        </Card>

        <Card>
          <h2 className="card__title">{c.f_analogy_title}</h2>
          <p className="card__lead">{c.f_analogy_lead}</p>
          <div className="cards-grid">
            {c.cards.map(({ title, body, Icon }) => (
              <div className="mini-card" key={title}>
                <div className="mini-card__icon">
                  <Icon size={22} strokeWidth={1.75} />
                </div>
                <div className="mini-card__title">{title}</div>
                <div className="mini-card__body">{body}</div>
              </div>
            ))}
          </div>
        </Card>
      </>
    );
  }

  if (level === 1) {
    return (
      <>
        <SkillBanner level={1} />
        <Card>
          <h2 className="card__title">{c.a_title}</h2>
          <p className="card__lead">{c.a_lead}</p>
          <div className="cards-grid">
            {c.a_examples.map((ex) => (
              <div className="mini-card" key={ex.area}>
                <div className="mini-card__title">
                  <span className="term">{ex.area}</span>
                </div>
                <div className="mini-card__body">{ex.body}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="card__title">{c.a_when_title}</h2>
          <div className="compare">
            <div className="compare__col compare__col--good">
              <div className="compare__head">
                <Check size={16} /> {lang === "es" ? "Sí, usa un agente" : lang === "pt" ? "Sim, use um agente" : "Yes, use an agent"}
              </div>
              <ul className="compare__list">
                {c.a_when.map((it) => <li key={it}>{it}</li>)}
              </ul>
            </div>
            <div className="compare__col compare__col--bad">
              <div className="compare__head">
                <X size={16} /> {lang === "es" ? "No, busca otra solución" : lang === "pt" ? "Não, busque outra solução" : "No, find another solution"}
              </div>
              <ul className="compare__list">
                {c.a_when_not.map((it) => <li key={it}>{it}</li>)}
              </ul>
            </div>
          </div>
        </Card>
      </>
    );
  }

  return (
    <>
      <SkillBanner level={2} />
      <Card>
        <h2 className="card__title">{c.e_title}</h2>
        <p className="card__lead">{c.e_lead}</p>
        <div className="diagram">
          {c.e_layers.map((layer) => (
            <div className="diagram__layer" key={layer.name}>
              <div className="diagram__layer-name">
                <span className="term">{layer.name}</span>
              </div>
              <div className="diagram__layer-body">{layer.body}</div>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <h2 className="card__title">{c.e_design_title}</h2>
        <ul className="check-list">
          {c.e_design.map((it) => (
            <li key={it}>
              <Compass size={16} />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}

/* ============================================================================
   MODULE 2 — REQUISITOS
   ========================================================================== */

function RequisitosModule({ level }) {
  const { lang } = useT();
  const copy = {
    es: {
      f_title: "Antes de empezar",
      f_lead: "Estos son los requisitos mínimos para construir tu primer agente sin frustraciones.",
      checklist: [
        { id: "claude", label: "Cuenta activa en Claude (gratuita o Pro)" },
        { id: "case", label: "Un caso de uso concreto y delimitado" },
        { id: "examples", label: "2 a 5 ejemplos reales del problema a resolver" },
        { id: "format", label: "Idea clara del formato de salida esperado" },
        { id: "limits", label: "Saber qué NO debe hacer el agente" }
      ],
      glossary_title: "Glosario esencial",
      glossary: [
        { term: "Prompt", def: "Texto que instruye al agente sobre qué hacer y cómo." },
        { term: "Sistema", def: "Instrucciones permanentes que definen identidad y comportamiento." },
        { term: "Contexto", def: "Información que el agente necesita para esta conversación." },
        { term: "Token", def: "Unidad mínima que procesa el modelo. ~4 caracteres en español." }
      ],
      a_title: "Setup profesional",
      a_lead: "Si vas a trabajar en serio, organiza tu trabajo desde el principio.",
      a_setup: [
        { name: "Versionado", body: "Guarda cada iteración del prompt con fecha y motivo del cambio." },
        { name: "Casos de prueba", body: "Mantén un set fijo de inputs para comparar versiones." },
        { name: "Documentación", body: "Anota qué intentaste, qué funcionó y qué descartaste." },
        { name: "Roles separados", body: "Distingue identidad, instrucciones y contexto en archivos distintos." }
      ],
      e_title: "Tooling profesional y MCP",
      e_lead:
        "En nivel experto, un agente no vive aislado. Se conecta con sistemas externos vía herramientas y MCP (Model Context Protocol).",
      e_topics: [
        { name: "MCP servers", body: "Conecta tu agente con bases de datos, APIs internas y servicios SaaS sin reescribir cada integración." },
        { name: "Functions / tools", body: "Define funciones que el agente puede llamar cuando detecta intención. Cada llamada es auditable." },
        { name: "Retrieval", body: "Trae solo el contexto relevante por búsqueda semántica. Reduce tokens y mejora precisión." },
        { name: "Observabilidad", body: "Loggea cada interacción: input, output, latencia, tokens, costo. Sin esto no hay mejora real." }
      ]
    },
    en: {
      f_title: "Before you start",
      f_lead: "These are the minimum requirements to build your first agent without friction.",
      checklist: [
        { id: "claude", label: "Active Claude account (free or Pro)" },
        { id: "case", label: "A concrete and bounded use case" },
        { id: "examples", label: "2 to 5 real examples of the problem to solve" },
        { id: "format", label: "Clear idea of the expected output format" },
        { id: "limits", label: "Know what the agent should NOT do" }
      ],
      glossary_title: "Essential glossary",
      glossary: [
        { term: "Prompt", def: "Text that instructs the agent on what to do and how." },
        { term: "System", def: "Permanent instructions that define identity and behavior." },
        { term: "Context", def: "Information the agent needs for this conversation." },
        { term: "Token", def: "Minimum unit the model processes. ~4 characters in English." }
      ],
      a_title: "Professional setup",
      a_lead: "If you are going to work seriously, organize your work from the start.",
      a_setup: [
        { name: "Versioning", body: "Save each prompt iteration with date and reason for the change." },
        { name: "Test cases", body: "Keep a fixed set of inputs to compare versions." },
        { name: "Documentation", body: "Note what you tried, what worked and what you discarded." },
        { name: "Separate roles", body: "Split identity, instructions and context into distinct files." }
      ],
      e_title: "Professional tooling and MCP",
      e_lead:
        "At expert level, an agent does not live in isolation. It connects with external systems through tools and MCP (Model Context Protocol).",
      e_topics: [
        { name: "MCP servers", body: "Connect your agent to databases, internal APIs and SaaS services without rewriting each integration." },
        { name: "Functions / tools", body: "Define functions the agent can call when intent is detected. Every call is auditable." },
        { name: "Retrieval", body: "Bring only the relevant context via semantic search. Reduces tokens and improves precision." },
        { name: "Observability", body: "Log every interaction: input, output, latency, tokens, cost. Without this there is no real improvement." }
      ]
    },
    pt: {
      f_title: "Antes de começar",
      f_lead: "Estes são os requisitos mínimos para construir seu primeiro agente sem fricção.",
      checklist: [
        { id: "claude", label: "Conta ativa no Claude (grátis ou Pro)" },
        { id: "case", label: "Um caso de uso concreto e delimitado" },
        { id: "examples", label: "2 a 5 exemplos reais do problema a resolver" },
        { id: "format", label: "Ideia clara do formato de saída esperado" },
        { id: "limits", label: "Saber o que o agente NÃO deve fazer" }
      ],
      glossary_title: "Glossário essencial",
      glossary: [
        { term: "Prompt", def: "Texto que instrui o agente sobre o que fazer e como." },
        { term: "Sistema", def: "Instruções permanentes que definem identidade e comportamento." },
        { term: "Contexto", def: "Informação que o agente precisa para esta conversa." },
        { term: "Token", def: "Unidade mínima que o modelo processa. ~4 caracteres em português." }
      ],
      a_title: "Setup profissional",
      a_lead: "Se você vai trabalhar a sério, organize seu trabalho desde o início.",
      a_setup: [
        { name: "Versionamento", body: "Salve cada iteração do prompt com data e motivo da mudança." },
        { name: "Casos de teste", body: "Mantenha um conjunto fixo de inputs para comparar versões." },
        { name: "Documentação", body: "Anote o que tentou, o que funcionou e o que descartou." },
        { name: "Papéis separados", body: "Separe identidade, instruções e contexto em arquivos distintos." }
      ],
      e_title: "Tooling profissional e MCP",
      e_lead:
        "Em nível expert, um agente não vive isolado. Conecta com sistemas externos via ferramentas e MCP (Model Context Protocol).",
      e_topics: [
        { name: "MCP servers", body: "Conecte seu agente a bancos, APIs internas e SaaS sem reescrever cada integração." },
        { name: "Functions / tools", body: "Defina funções que o agente pode chamar ao detectar intenção. Cada chamada é auditável." },
        { name: "Retrieval", body: "Traga apenas contexto relevante via busca semântica. Reduz tokens e melhora precisão." },
        { name: "Observabilidade", body: "Logue cada interação: input, output, latência, tokens, custo. Sem isso não há melhoria real." }
      ]
    }
  };
  const c = copy[lang] || copy.es;

  if (level === 0) {
    return (
      <>
        <SkillBanner level={0} />
        <Card>
          <h2 className="card__title">{c.f_title}</h2>
          <p className="card__lead">{c.f_lead}</p>
          <Checklist items={c.checklist} persistKey="requisitos:foundations" />
        </Card>
        <Card>
          <h2 className="card__title">{c.glossary_title}</h2>
          <div className="glossary">
            {c.glossary.map((g) => (
              <div className="glossary__item" key={g.term}>
                <div className="glossary__term">
                  <span className="term term--mono">{g.term}</span>
                </div>
                <div className="glossary__def">{g.def}</div>
              </div>
            ))}
          </div>
        </Card>
      </>
    );
  }

  if (level === 1) {
    return (
      <>
        <SkillBanner level={1} />
        <Card>
          <h2 className="card__title">{c.a_title}</h2>
          <p className="card__lead">{c.a_lead}</p>
          <div className="diagram">
            {c.a_setup.map((s) => (
              <div className="diagram__layer" key={s.name}>
                <div className="diagram__layer-name">
                  <span className="term">{s.name}</span>
                </div>
                <div className="diagram__layer-body">{s.body}</div>
              </div>
            ))}
          </div>
        </Card>
      </>
    );
  }

  return (
    <>
      <SkillBanner level={2} />
      <Card>
        <h2 className="card__title">{c.e_title}</h2>
        <p className="card__lead">{c.e_lead}</p>
        <div className="diagram">
          {c.e_topics.map((t) => (
            <div className="diagram__layer" key={t.name}>
              <div className="diagram__layer-name">
                <span className="term">{t.name}</span>
              </div>
              <div className="diagram__layer-body">{t.body}</div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

/* ============================================================================
   MODULE 3 — CREAR EL AGENTE
   ========================================================================== */

function CrearModule({ level }) {
  const { lang } = useT();
  const copy = {
    es: {
      f_title: "Cuatro pasos para crear un Project en Claude",
      f_lead: "Un Project en Claude es el contenedor donde vive tu agente. Su sistema, su contexto, sus instrucciones.",
      steps: [
        {
          n: 1,
          title: "Define el propósito del agente",
          body: "Antes de tocar la interfaz, escribe en una línea qué hace este agente y para quién.",
          highlight: ["Específico", "no genérico"]
        },
        {
          n: 2,
          title: "Crea el Project",
          body: "Desde claude.ai, abre Projects y crea uno nuevo con un nombre claro y orientado al dominio del agente.",
          highlight: ["Por dominio", "no por tarea suelta"]
        },
        {
          n: 3,
          title: "Escribe el system prompt",
          body: "El campo de instrucciones es el cerebro del agente. Aquí defines identidad, contexto y reglas de operación.",
          highlight: ["Versionable", "guarda cada cambio"]
        },
        {
          n: 4,
          title: "Sube el contexto base",
          body: "Adjunta los documentos que el agente usará siempre: políticas, glosarios, plantillas, ejemplos.",
          highlight: ["Configuración reutilizable", "no copies en cada chat"]
        }
      ],
      a_title: "Patrones de organización por proyecto",
      a_lead: "Cuando manejas más de un agente, la forma en que organizas los Projects determina cuánto puedes escalar.",
      a_patterns: [
        { name: "Un Project por dominio", body: "Soporte, ventas, RRHH. Cada uno con su propio contexto base." },
        { name: "Un Project por persona", body: "Si el agente sirve a un cliente VIP, su contexto es único." },
        { name: "Project plantilla", body: "Mantén un Project base que clonas cuando creas variantes." },
        { name: "Naming consistente", body: "Convención clara: dominio-rol-versión. Ej: soporte-triage-v3." }
      ],
      e_title: "Estructura para sistemas multi-agente",
      e_lead:
        "En arquitecturas reales, varios agentes coordinan tareas. El diseño del sistema cambia.",
      e_arch: [
        { name: "Orquestador", body: "Un agente recibe la petición, la clasifica y decide a qué especialista enviarla." },
        { name: "Especialistas", body: "Cada uno con prompt mínimo, foco estrecho, alta precisión en su dominio." },
        { name: "Memoria compartida", body: "Estado de la conversación que pasa entre agentes sin perder contexto." },
        { name: "Contratos de salida", body: "Formato estricto entre agentes para que el siguiente pueda procesar sin parsear texto libre." },
        { name: "Fallback humano", body: "Cuando ningún agente tiene confianza suficiente, el sistema escala a una persona." }
      ]
    },
    en: {
      f_title: "Four steps to create a Project in Claude",
      f_lead: "A Project in Claude is the container where your agent lives. Its system, its context, its instructions.",
      steps: [
        {
          n: 1,
          title: "Define the agent's purpose",
          body: "Before touching the interface, write in one line what this agent does and for whom.",
          highlight: ["Specific", "not generic"]
        },
        {
          n: 2,
          title: "Create the Project",
          body: "From claude.ai, open Projects and create a new one with a clear, domain-oriented name.",
          highlight: ["By domain", "not by isolated task"]
        },
        {
          n: 3,
          title: "Write the system prompt",
          body: "The instructions field is the agent's brain. Here you define identity, context and operating rules.",
          highlight: ["Versionable", "save every change"]
        },
        {
          n: 4,
          title: "Upload base context",
          body: "Attach documents the agent will always use: policies, glossaries, templates, examples.",
          highlight: ["Reusable configuration", "do not copy into every chat"]
        }
      ],
      a_title: "Project organization patterns",
      a_lead: "When you manage more than one agent, how you organize Projects determines how far you can scale.",
      a_patterns: [
        { name: "One Project per domain", body: "Support, sales, HR. Each one with its own base context." },
        { name: "One Project per persona", body: "If the agent serves a VIP customer, its context is unique." },
        { name: "Template Project", body: "Keep a base Project that you clone when creating variants." },
        { name: "Consistent naming", body: "Clear convention: domain-role-version. E.g.: support-triage-v3." }
      ],
      e_title: "Structure for multi-agent systems",
      e_lead: "In real architectures, several agents coordinate tasks. The system design changes.",
      e_arch: [
        { name: "Orchestrator", body: "One agent receives the request, classifies it and decides which specialist to route to." },
        { name: "Specialists", body: "Each with minimal prompt, narrow focus, high precision in their domain." },
        { name: "Shared memory", body: "Conversation state that flows between agents without losing context." },
        { name: "Output contracts", body: "Strict format between agents so the next can process without parsing free text." },
        { name: "Human fallback", body: "When no agent has sufficient confidence, the system escalates to a person." }
      ]
    },
    pt: {
      f_title: "Quatro passos para criar um Project no Claude",
      f_lead: "Um Project no Claude é o container onde seu agente vive. Seu sistema, seu contexto, suas instruções.",
      steps: [
        {
          n: 1,
          title: "Defina o propósito do agente",
          body: "Antes de tocar na interface, escreva em uma linha o que este agente faz e para quem.",
          highlight: ["Específico", "não genérico"]
        },
        {
          n: 2,
          title: "Crie o Project",
          body: "Em claude.ai, abra Projects e crie um novo com nome claro e orientado ao domínio.",
          highlight: ["Por domínio", "não por tarefa isolada"]
        },
        {
          n: 3,
          title: "Escreva o system prompt",
          body: "O campo de instruções é o cérebro do agente. Aqui você define identidade, contexto e regras de operação.",
          highlight: ["Versionável", "salve cada mudança"]
        },
        {
          n: 4,
          title: "Suba o contexto base",
          body: "Anexe os documentos que o agente sempre usará: políticas, glossários, templates, exemplos.",
          highlight: ["Configuração reutilizável", "não copie em cada chat"]
        }
      ],
      a_title: "Padrões de organização por projeto",
      a_lead: "Quando você gerencia mais de um agente, como você organiza Projects determina o quanto pode escalar.",
      a_patterns: [
        { name: "Um Project por domínio", body: "Suporte, vendas, RH. Cada um com seu próprio contexto base." },
        { name: "Um Project por persona", body: "Se o agente serve um cliente VIP, seu contexto é único." },
        { name: "Project template", body: "Mantenha um Project base que você clona ao criar variantes." },
        { name: "Naming consistente", body: "Convenção clara: dominio-papel-versao. Ex: suporte-triagem-v3." }
      ],
      e_title: "Estrutura para sistemas multi-agente",
      e_lead: "Em arquiteturas reais, vários agentes coordenam tarefas. O design do sistema muda.",
      e_arch: [
        { name: "Orquestrador", body: "Um agente recebe a requisição, classifica e decide a qual especialista enviar." },
        { name: "Especialistas", body: "Cada um com prompt mínimo, foco estreito, alta precisão em seu domínio." },
        { name: "Memória compartilhada", body: "Estado da conversa que passa entre agentes sem perder contexto." },
        { name: "Contratos de saída", body: "Formato estrito entre agentes para que o próximo possa processar sem parsear texto livre." },
        { name: "Fallback humano", body: "Quando nenhum agente tem confiança suficiente, o sistema escala para uma pessoa." }
      ]
    }
  };
  const c = copy[lang] || copy.es;

  if (level === 0) {
    return (
      <>
        <SkillBanner level={0} />
        <Card>
          <h2 className="card__title">{c.f_title}</h2>
          <p className="card__lead">{c.f_lead}</p>
        </Card>
        <Card>
          {c.steps.map((s) => (
            <div className="step" key={s.n}>
              <div className="step__num">{s.n}</div>
              <div>
                <div className="step__title">{s.title}</div>
                <div className="step__desc">{s.body}</div>
                <div className="step__chip" style={{ marginTop: "var(--s-3)" }}>
                  <span className="term">{s.highlight[0]}</span>
                  <span className="step__chip-sep">·</span>
                  <span className="step__chip-sub">{s.highlight[1]}</span>
                </div>
              </div>
            </div>
          ))}
        </Card>
      </>
    );
  }

  if (level === 1) {
    return (
      <>
        <SkillBanner level={1} />
        <Card>
          <h2 className="card__title">{c.a_title}</h2>
          <p className="card__lead">{c.a_lead}</p>
          <div className="diagram">
            {c.a_patterns.map((p) => (
              <div className="diagram__layer" key={p.name}>
                <div className="diagram__layer-name">
                  <span className="term">{p.name}</span>
                </div>
                <div className="diagram__layer-body">{p.body}</div>
              </div>
            ))}
          </div>
        </Card>
      </>
    );
  }

  return (
    <>
      <SkillBanner level={2} />
      <Card>
        <h2 className="card__title">{c.e_title}</h2>
        <p className="card__lead">{c.e_lead}</p>
        <div className="diagram">
          {c.e_arch.map((a) => (
            <div className="diagram__layer" key={a.name}>
              <div className="diagram__layer-name">
                <span className="term">{a.name}</span>
              </div>
              <div className="diagram__layer-body">{a.body}</div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

/* ============================================================================
   MODULE 4 — PERSONALIDAD
   ========================================================================== */

function PersonalidadModule({ level }) {
  const { lang } = useT();
  const copy = {
    es: {
      f_title: "Las cuatro dimensiones de la personalidad",
      f_lead: "La personalidad de un agente no es estética. Determina cómo lo perciben los usuarios y si confían en él.",
      axes: [
        { Icon: Drama, title: "Tono", body: "Formal o cercano, técnico o coloquial. Define la distancia emocional con el usuario." },
        { Icon: Mic, title: "Voz", body: "El estilo recurrente: directo, narrativo, didáctico, conciso. Es la marca del agente." },
        { Icon: Crosshair, title: "Foco", body: "Qué temas trata y con qué profundidad. Un foco estrecho aumenta la confianza." },
        { Icon: ShieldOff, title: "Límites", body: "Qué nunca hará. Esta dimensión protege al usuario y al producto." }
      ],
      example_title: "Ejemplo: tres agentes, mismo dominio",
      examples: [
        { name: "Agente legal corporativo", desc: "Tono formal · voz precisa · foco contractual · nunca da consejo personal." },
        { name: "Agente legal para freelancers", desc: "Tono cercano · voz didáctica · foco práctico · nunca redacta sin pedir contexto." },
        { name: "Agente legal interno", desc: "Tono directo · voz operativa · foco en política interna · nunca responde fuera de la empresa." }
      ],
      a_title: "Técnicas para mantener consistencia",
      a_lead: "Los agentes pierden personalidad bajo presión: respuestas largas, temas ambiguos, usuarios insistentes.",
      a_techs: [
        { name: "Anclas léxicas", body: "Lista de palabras y frases que el agente usa siempre, y otras que nunca usa." },
        { name: "Ejemplos canónicos", body: "Tres a cinco respuestas modelo en el system prompt. El agente las imitará." },
        { name: "Reglas de formato", body: "Define longitud típica, estructura preferida, cuándo usar listas y cuándo no." },
        { name: "Reset por contexto", body: "Cuando el agente se desvía, recuérdale su identidad en el siguiente turno." }
      ],
      e_title: "Métricas para evaluar personalidad",
      e_lead: "En nivel experto, la personalidad se mide. No es subjetiva.",
      e_metrics: [
        { name: "Adherencia léxica", body: "% de respuestas que respetan vocabulario obligatorio y evitan vocabulario prohibido." },
        { name: "Consistencia tonal", body: "Calificación humana o por LLM-judge sobre 100 muestras aleatorias mensuales." },
        { name: "Drift por longitud", body: "Comparar tono en respuestas cortas vs largas. Suele degradarse en respuestas largas." },
        { name: "Fidelidad bajo presión", body: "Stress test con usuarios hostiles o ambiguos. Mide si el agente cede su identidad." }
      ]
    },
    en: {
      f_title: "The four dimensions of personality",
      f_lead: "An agent's personality is not aesthetic. It determines how users perceive it and whether they trust it.",
      axes: [
        { Icon: Drama, title: "Tone", body: "Formal or close, technical or colloquial. Sets emotional distance with the user." },
        { Icon: Mic, title: "Voice", body: "The recurring style: direct, narrative, didactic, concise. The agent's brand." },
        { Icon: Crosshair, title: "Focus", body: "Which topics it covers and at what depth. A narrow focus increases trust." },
        { Icon: ShieldOff, title: "Limits", body: "What it will never do. This dimension protects the user and the product." }
      ],
      example_title: "Example: three agents, same domain",
      examples: [
        { name: "Corporate legal agent", desc: "Formal tone · precise voice · contractual focus · never gives personal advice." },
        { name: "Legal agent for freelancers", desc: "Close tone · didactic voice · practical focus · never drafts without asking context." },
        { name: "Internal legal agent", desc: "Direct tone · operational voice · internal-policy focus · never answers outside the company." }
      ],
      a_title: "Techniques for consistency",
      a_lead: "Agents lose personality under pressure: long answers, ambiguous topics, persistent users.",
      a_techs: [
        { name: "Lexical anchors", body: "List of words and phrases the agent always uses, and others it never uses." },
        { name: "Canonical examples", body: "Three to five model answers in the system prompt. The agent imitates them." },
        { name: "Format rules", body: "Define typical length, preferred structure, when to use lists and when not." },
        { name: "Context reset", body: "When the agent drifts, remind it of its identity in the next turn." }
      ],
      e_title: "Metrics to evaluate personality",
      e_lead: "At expert level, personality is measured. It is not subjective.",
      e_metrics: [
        { name: "Lexical adherence", body: "% of answers that respect required vocabulary and avoid forbidden vocabulary." },
        { name: "Tonal consistency", body: "Human or LLM-judge rating on 100 random samples per month." },
        { name: "Length drift", body: "Compare tone in short vs long answers. Usually degrades in long answers." },
        { name: "Fidelity under pressure", body: "Stress test with hostile or ambiguous users. Measures whether the agent yields its identity." }
      ]
    },
    pt: {
      f_title: "As quatro dimensões da personalidade",
      f_lead: "A personalidade de um agente não é estética. Determina como os usuários o percebem e se confiam nele.",
      axes: [
        { Icon: Drama, title: "Tom", body: "Formal ou próximo, técnico ou coloquial. Define a distância emocional com o usuário." },
        { Icon: Mic, title: "Voz", body: "O estilo recorrente: direto, narrativo, didático, conciso. É a marca do agente." },
        { Icon: Crosshair, title: "Foco", body: "Quais temas trata e com qual profundidade. Foco estreito aumenta a confiança." },
        { Icon: ShieldOff, title: "Limites", body: "O que nunca fará. Esta dimensão protege o usuário e o produto." }
      ],
      example_title: "Exemplo: três agentes, mesmo domínio",
      examples: [
        { name: "Agente legal corporativo", desc: "Tom formal · voz precisa · foco contratual · nunca dá conselho pessoal." },
        { name: "Agente legal para freelancers", desc: "Tom próximo · voz didática · foco prático · nunca redige sem pedir contexto." },
        { name: "Agente legal interno", desc: "Tom direto · voz operacional · foco em política interna · nunca responde fora da empresa." }
      ],
      a_title: "Técnicas para manter consistência",
      a_lead: "Agentes perdem personalidade sob pressão: respostas longas, temas ambíguos, usuários insistentes.",
      a_techs: [
        { name: "Âncoras lexicais", body: "Lista de palavras e frases que o agente sempre usa, e outras que nunca usa." },
        { name: "Exemplos canônicos", body: "Três a cinco respostas modelo no system prompt. O agente as imita." },
        { name: "Regras de formato", body: "Defina comprimento típico, estrutura preferida, quando usar listas e quando não." },
        { name: "Reset por contexto", body: "Quando o agente se desvia, lembre-o da identidade no próximo turno." }
      ],
      e_title: "Métricas para avaliar personalidade",
      e_lead: "Em nível expert, a personalidade se mede. Não é subjetiva.",
      e_metrics: [
        { name: "Aderência lexical", body: "% de respostas que respeitam vocabulário obrigatório e evitam vocabulário proibido." },
        { name: "Consistência tonal", body: "Avaliação humana ou por LLM-judge em 100 amostras aleatórias mensais." },
        { name: "Drift por comprimento", body: "Comparar tom em respostas curtas vs longas. Costuma degradar em longas." },
        { name: "Fidelidade sob pressão", body: "Stress test com usuários hostis ou ambíguos. Mede se o agente cede sua identidade." }
      ]
    }
  };
  const c = copy[lang] || copy.es;

  if (level === 0) {
    return (
      <>
        <SkillBanner level={0} />
        <Card>
          <h2 className="card__title">{c.f_title}</h2>
          <p className="card__lead">{c.f_lead}</p>
          <div className="cards-grid">
            {c.axes.map(({ Icon, title, body }) => (
              <div className="mini-card" key={title}>
                <div className="mini-card__icon">
                  <Icon size={22} strokeWidth={1.75} />
                </div>
                <div className="mini-card__title">
                  <span className="term">{title}</span>
                </div>
                <div className="mini-card__body">{body}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="card__title">{c.example_title}</h2>
          <div className="diagram">
            {c.examples.map((ex) => (
              <div className="diagram__layer" key={ex.name}>
                <div className="diagram__layer-name">
                  <span className="term">{ex.name}</span>
                </div>
                <div className="diagram__layer-body">{ex.desc}</div>
              </div>
            ))}
          </div>
        </Card>
      </>
    );
  }

  if (level === 1) {
    return (
      <>
        <SkillBanner level={1} />
        <Card>
          <h2 className="card__title">{c.a_title}</h2>
          <p className="card__lead">{c.a_lead}</p>
          <div className="diagram">
            {c.a_techs.map((tech) => (
              <div className="diagram__layer" key={tech.name}>
                <div className="diagram__layer-name">
                  <span className="term">{tech.name}</span>
                </div>
                <div className="diagram__layer-body">{tech.body}</div>
              </div>
            ))}
          </div>
        </Card>
      </>
    );
  }

  return (
    <>
      <SkillBanner level={2} />
      <Card>
        <h2 className="card__title">{c.e_title}</h2>
        <p className="card__lead">{c.e_lead}</p>
        <div className="diagram">
          {c.e_metrics.map((m) => (
            <div className="diagram__layer" key={m.name}>
              <div className="diagram__layer-name">
                <span className="term">{m.name}</span>
              </div>
              <div className="diagram__layer-body">{m.body}</div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

/* ============================================================================
   MODULE 5 — PROMPT ENGINEERING
   ========================================================================== */

function PromptsModule({ level }) {
  const { lang } = useT();
  const copy = {
    es: {
      f_title: "La fórmula CRIT",
      f_lead: "Un buen prompt tiene cuatro componentes. Si falta uno, el agente improvisa o falla.",
      crit: [
        { letter: "C", word: "Contexto", body: "Quién es el agente, para quién trabaja, qué información tiene disponible." },
        { letter: "R", word: "Rol", body: "Qué papel cumple en este turno: analista, redactor, traductor, evaluador." },
        { letter: "I", word: "Instrucción", body: "Qué debe hacer ahora, con qué criterio, en qué orden." },
        { letter: "T", word: "Tono y formato", body: "Cómo debe sonar la respuesta y en qué estructura entregarla." }
      ],
      compare_title: "Mismo objetivo, dos prompts",
      bad_title: "Prompt débil",
      bad_text: "Resume esto.",
      bad_why: ["Sin contexto", "Sin formato esperado", "Sin criterio de qué es importante"],
      good_title: "Prompt sólido",
      good_text:
        "Como editor de un boletín ejecutivo, resume el siguiente reporte en 5 bullets de máximo 20 palabras cada uno. Prioriza decisiones tomadas y riesgos abiertos. Usa lenguaje neutro.",
      good_why: ["Rol explícito", "Formato concreto", "Criterio de prioridad", "Indicación de tono"],
      editor_title: "Tu turno: escribe un prompt CRIT",
      editor_placeholder: "Eres [rol] que ayuda a [audiencia]. Tu tarea es [acción]. Considera [criterio]. Responde en [formato].",
      a_title: "Prompts modulares",
      a_lead:
        "Un prompt grande es difícil de mantener. En proyectos reales, los prompts se construyen como módulos reutilizables.",
      a_modules: [
        { name: "Identidad", body: "Bloque permanente: quién es el agente y qué nunca hará." },
        { name: "Conocimiento", body: "Bloque que cambia con el dominio: políticas, glosarios, ejemplos." },
        { name: "Procedimiento", body: "Bloque por tarea: pasos a seguir, decisiones a tomar, formato de salida." },
        { name: "Few-shot", body: "Bloque opcional con 2 a 5 ejemplos input/output del comportamiento deseado." }
      ],
      a_debug_title: "Debugging de respuestas",
      a_debug: [
        "Si el agente alucina datos: agrega contexto explícito o instruye a decir no sé.",
        "Si el formato es inconsistente: muestra un ejemplo exacto y pide imitarlo.",
        "Si el tono se desvía: ancla con frases obligatorias y prohibidas.",
        "Si las respuestas son largas: define longitud máxima en palabras u oraciones."
      ],
      e_title: "Evaluación sistemática de prompts",
      e_lead: "En nivel experto, el prompt deja de optimizarse a ojo y entra en un proceso medible.",
      e_eval: [
        { name: "Set fijo de inputs", body: "20 a 50 casos representativos que se ejecutan contra cada versión del prompt." },
        { name: "Rúbricas de salida", body: "Criterios claros: precisión, formato, tono, ausencia de información sensible." },
        { name: "LLM-judge", body: "Otro modelo evalúa según rúbrica. Más barato y consistente que evaluación humana en escala." },
        { name: "Edge cases", body: "Inputs vacíos, ambiguos, hostiles, en otro idioma, con datos contradictorios." },
        { name: "Garbage input", body: "Prompts que parecen sabotaje. El agente debe degradar con elegancia, no romperse." }
      ]
    },
    en: {
      f_title: "The CRIT formula",
      f_lead: "A good prompt has four components. If one is missing, the agent improvises or fails.",
      crit: [
        { letter: "C", word: "Context", body: "Who the agent is, who it serves, what information it has available." },
        { letter: "R", word: "Role", body: "What part it plays in this turn: analyst, writer, translator, evaluator." },
        { letter: "I", word: "Instruction", body: "What it must do now, with what criteria, in what order." },
        { letter: "T", word: "Tone and format", body: "How the answer should sound and in what structure to deliver it." }
      ],
      compare_title: "Same goal, two prompts",
      bad_title: "Weak prompt",
      bad_text: "Summarize this.",
      bad_why: ["No context", "No expected format", "No priority criteria"],
      good_title: "Solid prompt",
      good_text:
        "As an executive newsletter editor, summarize the following report in 5 bullets of max 20 words each. Prioritize decisions made and open risks. Use neutral language.",
      good_why: ["Explicit role", "Concrete format", "Priority criteria", "Tone instruction"],
      editor_title: "Your turn: write a CRIT prompt",
      editor_placeholder: "You are [role] who helps [audience]. Your task is [action]. Consider [criteria]. Respond in [format].",
      a_title: "Modular prompts",
      a_lead: "A large prompt is hard to maintain. In real projects, prompts are built as reusable modules.",
      a_modules: [
        { name: "Identity", body: "Permanent block: who the agent is and what it will never do." },
        { name: "Knowledge", body: "Block that changes with the domain: policies, glossaries, examples." },
        { name: "Procedure", body: "Per-task block: steps to follow, decisions to make, output format." },
        { name: "Few-shot", body: "Optional block with 2 to 5 input/output examples of desired behavior." }
      ],
      a_debug_title: "Debugging answers",
      a_debug: [
        "If the agent hallucinates: add explicit context or instruct it to say I don't know.",
        "If format is inconsistent: show an exact example and ask it to imitate.",
        "If tone drifts: anchor with required and forbidden phrases.",
        "If answers are too long: define max length in words or sentences."
      ],
      e_title: "Systematic prompt evaluation",
      e_lead: "At expert level, the prompt stops being optimized by eye and enters a measurable process.",
      e_eval: [
        { name: "Fixed input set", body: "20 to 50 representative cases run against each prompt version." },
        { name: "Output rubrics", body: "Clear criteria: accuracy, format, tone, absence of sensitive information." },
        { name: "LLM-judge", body: "Another model evaluates by rubric. Cheaper and more consistent than human eval at scale." },
        { name: "Edge cases", body: "Empty, ambiguous, hostile, foreign-language inputs, contradictory data." },
        { name: "Garbage input", body: "Prompts that look like sabotage. The agent must degrade gracefully, not break." }
      ]
    },
    pt: {
      f_title: "A fórmula CRIT",
      f_lead: "Um bom prompt tem quatro componentes. Se um falta, o agente improvisa ou falha.",
      crit: [
        { letter: "C", word: "Contexto", body: "Quem é o agente, para quem trabalha, que informação tem disponível." },
        { letter: "R", word: "Papel", body: "Qual papel cumpre neste turno: analista, redator, tradutor, avaliador." },
        { letter: "I", word: "Instrução", body: "O que deve fazer agora, com qual critério, em qual ordem." },
        { letter: "T", word: "Tom e formato", body: "Como deve soar a resposta e em qual estrutura entregá-la." }
      ],
      compare_title: "Mesmo objetivo, dois prompts",
      bad_title: "Prompt fraco",
      bad_text: "Resuma isto.",
      bad_why: ["Sem contexto", "Sem formato esperado", "Sem critério do que é importante"],
      good_title: "Prompt sólido",
      good_text:
        "Como editor de um boletim executivo, resuma o seguinte relatório em 5 bullets de no máximo 20 palavras cada. Priorize decisões tomadas e riscos abertos. Use linguagem neutra.",
      good_why: ["Papel explícito", "Formato concreto", "Critério de prioridade", "Indicação de tom"],
      editor_title: "Sua vez: escreva um prompt CRIT",
      editor_placeholder: "Você é [papel] que ajuda [audiência]. Sua tarefa é [ação]. Considere [critério]. Responda em [formato].",
      a_title: "Prompts modulares",
      a_lead:
        "Um prompt grande é difícil de manter. Em projetos reais, prompts são construídos como módulos reutilizáveis.",
      a_modules: [
        { name: "Identidade", body: "Bloco permanente: quem é o agente e o que nunca fará." },
        { name: "Conhecimento", body: "Bloco que muda com o domínio: políticas, glossários, exemplos." },
        { name: "Procedimento", body: "Bloco por tarefa: passos, decisões, formato de saída." },
        { name: "Few-shot", body: "Bloco opcional com 2 a 5 exemplos input/output do comportamento desejado." }
      ],
      a_debug_title: "Debugging de respostas",
      a_debug: [
        "Se o agente alucina dados: adicione contexto explícito ou instrua a dizer não sei.",
        "Se o formato é inconsistente: mostre um exemplo exato e peça para imitar.",
        "Se o tom se desvia: ancore com frases obrigatórias e proibidas.",
        "Se as respostas são longas: defina comprimento máximo em palavras ou frases."
      ],
      e_title: "Avaliação sistemática de prompts",
      e_lead: "Em nível expert, o prompt deixa de ser otimizado a olho e entra em processo mensurável.",
      e_eval: [
        { name: "Set fixo de inputs", body: "20 a 50 casos representativos rodando contra cada versão do prompt." },
        { name: "Rubricas de saída", body: "Critérios claros: precisão, formato, tom, ausência de informação sensível." },
        { name: "LLM-judge", body: "Outro modelo avalia por rubrica. Mais barato e consistente que avaliação humana em escala." },
        { name: "Edge cases", body: "Inputs vazios, ambíguos, hostis, em outro idioma, com dados contraditórios." },
        { name: "Garbage input", body: "Prompts que parecem sabotagem. O agente deve degradar com elegância, não quebrar." }
      ]
    }
  };
  const c = copy[lang] || copy.es;

  if (level === 0) {
    return (
      <>
        <SkillBanner level={0} />
        <Card>
          <h2 className="card__title">{c.f_title}</h2>
          <p className="card__lead">{c.f_lead}</p>
          <div className="crit-grid">
            {c.crit.map((it) => (
              <div className="crit-card" key={it.letter}>
                <div className="crit-card__letter">{it.letter}</div>
                <div className="crit-card__word">
                  <span className="term">{it.word}</span>
                </div>
                <div className="crit-card__body">{it.body}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="card__title">{c.compare_title}</h2>
          <div className="compare">
            <div className="compare__col compare__col--bad">
              <div className="compare__head">
                <X size={16} /> {c.bad_title}
              </div>
              <CodeBlock>{c.bad_text}</CodeBlock>
              <ul className="compare__list">
                {c.bad_why.map((w) => <li key={w}>{w}</li>)}
              </ul>
            </div>
            <div className="compare__col compare__col--good">
              <div className="compare__head">
                <Check size={16} /> {c.good_title}
              </div>
              <CodeBlock>{c.good_text}</CodeBlock>
              <ul className="compare__list">
                {c.good_why.map((w) => <li key={w}>{w}</li>)}
              </ul>
            </div>
          </div>
        </Card>
        <Card>
          <h2 className="card__title">{c.editor_title}</h2>
          <PromptEditor placeholder={c.editor_placeholder} persistKey="prompts:foundations" />
        </Card>
      </>
    );
  }

  if (level === 1) {
    return (
      <>
        <SkillBanner level={1} />
        <Card>
          <h2 className="card__title">{c.a_title}</h2>
          <p className="card__lead">{c.a_lead}</p>
          <div className="diagram">
            {c.a_modules.map((m) => (
              <div className="diagram__layer" key={m.name}>
                <div className="diagram__layer-name">
                  <span className="term">{m.name}</span>
                </div>
                <div className="diagram__layer-body">{m.body}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="card__title">{c.a_debug_title}</h2>
          <ul className="check-list">
            {c.a_debug.map((d) => (
              <li key={d}><Wrench size={16} /><span>{d}</span></li>
            ))}
          </ul>
        </Card>
      </>
    );
  }

  return (
    <>
      <SkillBanner level={2} />
      <Card>
        <h2 className="card__title">{c.e_title}</h2>
        <p className="card__lead">{c.e_lead}</p>
        <div className="diagram">
          {c.e_eval.map((e) => (
            <div className="diagram__layer" key={e.name}>
              <div className="diagram__layer-name">
                <span className="term">{e.name}</span>
              </div>
              <div className="diagram__layer-body">{e.body}</div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

/* ============================================================================
   MODULE 6 — HERRAMIENTAS
   ========================================================================== */

function HerramientasModule({ level }) {
  const { lang } = useT();
  const copy = {
    es: {
      f_title: "Tres tipos de herramientas",
      f_lead: "Un agente sin herramientas solo conversa. Con herramientas, actúa.",
      tools: [
        { name: "Recuperación", body: "Busca información en fuentes externas: documentos, web, bases de conocimiento." },
        { name: "Acción", body: "Ejecuta operaciones: enviar emails, crear tareas, agendar reuniones, llamar APIs." },
        { name: "Cálculo", body: "Procesa datos con código, hace operaciones precisas, transforma formatos." }
      ],
      a_title: "Integraciones MCP en proyectos reales",
      a_lead: "MCP estandariza cómo los agentes acceden a sistemas externos sin reinventar cada conexión.",
      a_int: [
        { name: "Datos del producto", body: "Conexión read-only a bases de datos para que el agente conteste con datos vigentes." },
        { name: "Sistema de tickets", body: "Crear, actualizar y consultar tickets desde el agente con permisos auditados." },
        { name: "Calendario y email", body: "Agendar y enviar comunicaciones con confirmación humana antes de ejecutar." },
        { name: "Knowledge base", body: "Indexar la wiki interna y traer pasajes relevantes por búsqueda semántica." }
      ],
      e_title: "Cuándo NO usar un LLM",
      e_lead:
        "Una de las habilidades más maduras es saber cuándo el LLM no es la mejor herramienta. Forzarlo cuesta dinero y degrada la calidad.",
      e_no: [
        { name: "Cálculo exacto", body: "Para sumar columnas o calcular impuestos, una hoja o un script son más baratos y precisos." },
        { name: "Búsqueda determinista", body: "Si la respuesta está en una tabla, una query SQL es mejor que un retrieval semántico." },
        { name: "Validación estricta", body: "Reglas de negocio claras se implementan con código, no con prompts." },
        { name: "Volumen masivo", body: "Si procesas millones de registros idénticos, un pipeline tradicional cuesta menos por unidad." }
      ],
      e_arch_title: "Arquitectura híbrida",
      e_arch:
        "Un agente productivo no es solo un prompt. Es una composición: el LLM decide e interpreta, el código verifica y ejecuta, la base de datos guarda la verdad."
    },
    en: {
      f_title: "Three types of tools",
      f_lead: "An agent without tools only chats. With tools, it acts.",
      tools: [
        { name: "Retrieval", body: "Searches information in external sources: documents, web, knowledge bases." },
        { name: "Action", body: "Executes operations: send emails, create tasks, schedule meetings, call APIs." },
        { name: "Computation", body: "Processes data with code, performs precise operations, transforms formats." }
      ],
      a_title: "MCP integrations in real projects",
      a_lead: "MCP standardizes how agents access external systems without reinventing each connection.",
      a_int: [
        { name: "Product data", body: "Read-only DB connection so the agent answers with current data." },
        { name: "Ticketing system", body: "Create, update and query tickets from the agent with audited permissions." },
        { name: "Calendar and email", body: "Schedule and send communications with human confirmation before executing." },
        { name: "Knowledge base", body: "Index internal wiki and pull relevant passages via semantic search." }
      ],
      e_title: "When NOT to use an LLM",
      e_lead:
        "One of the most mature skills is knowing when the LLM is not the best tool. Forcing it costs money and degrades quality.",
      e_no: [
        { name: "Exact math", body: "To sum columns or calculate taxes, a sheet or a script are cheaper and more precise." },
        { name: "Deterministic search", body: "If the answer is in a table, a SQL query beats a semantic retrieval." },
        { name: "Strict validation", body: "Clear business rules are implemented with code, not with prompts." },
        { name: "Massive volume", body: "If you process millions of identical records, a traditional pipeline costs less per unit." }
      ],
      e_arch_title: "Hybrid architecture",
      e_arch:
        "A production agent is not just a prompt. It is a composition: the LLM decides and interprets, code verifies and executes, the database stores truth."
    },
    pt: {
      f_title: "Três tipos de ferramentas",
      f_lead: "Um agente sem ferramentas só conversa. Com ferramentas, age.",
      tools: [
        { name: "Recuperação", body: "Busca informação em fontes externas: documentos, web, bases de conhecimento." },
        { name: "Ação", body: "Executa operações: enviar emails, criar tarefas, agendar reuniões, chamar APIs." },
        { name: "Cálculo", body: "Processa dados com código, faz operações precisas, transforma formatos." }
      ],
      a_title: "Integrações MCP em projetos reais",
      a_lead: "MCP padroniza como agentes acessam sistemas externos sem reinventar cada conexão.",
      a_int: [
        { name: "Dados do produto", body: "Conexão read-only a bancos para que o agente responda com dados vigentes." },
        { name: "Sistema de tickets", body: "Criar, atualizar e consultar tickets a partir do agente com permissões auditadas." },
        { name: "Calendário e email", body: "Agendar e enviar comunicações com confirmação humana antes de executar." },
        { name: "Knowledge base", body: "Indexar wiki interna e trazer trechos relevantes por busca semântica." }
      ],
      e_title: "Quando NÃO usar um LLM",
      e_lead:
        "Uma das habilidades mais maduras é saber quando o LLM não é a melhor ferramenta. Forçá-lo custa dinheiro e degrada qualidade.",
      e_no: [
        { name: "Cálculo exato", body: "Para somar colunas ou calcular impostos, uma planilha ou script são mais baratos e precisos." },
        { name: "Busca determinística", body: "Se a resposta está em uma tabela, uma query SQL bate retrieval semântico." },
        { name: "Validação estrita", body: "Regras de negócio claras são implementadas com código, não com prompts." },
        { name: "Volume massivo", body: "Se processa milhões de registros idênticos, um pipeline tradicional custa menos por unidade." }
      ],
      e_arch_title: "Arquitetura híbrida",
      e_arch:
        "Um agente em produção não é só um prompt. É uma composição: o LLM decide e interpreta, o código verifica e executa, o banco guarda a verdade."
    }
  };
  const c = copy[lang] || copy.es;

  if (level === 0) {
    return (
      <>
        <SkillBanner level={0} />
        <Card>
          <h2 className="card__title">{c.f_title}</h2>
          <p className="card__lead">{c.f_lead}</p>
          <div className="diagram">
            {c.tools.map((tool) => (
              <div className="diagram__layer" key={tool.name}>
                <div className="diagram__layer-name">
                  <span className="term">{tool.name}</span>
                </div>
                <div className="diagram__layer-body">{tool.body}</div>
              </div>
            ))}
          </div>
        </Card>
      </>
    );
  }

  if (level === 1) {
    return (
      <>
        <SkillBanner level={1} />
        <Card>
          <h2 className="card__title">{c.a_title}</h2>
          <p className="card__lead">{c.a_lead}</p>
          <div className="diagram">
            {c.a_int.map((i) => (
              <div className="diagram__layer" key={i.name}>
                <div className="diagram__layer-name">
                  <span className="term">{i.name}</span>
                </div>
                <div className="diagram__layer-body">{i.body}</div>
              </div>
            ))}
          </div>
        </Card>
      </>
    );
  }

  return (
    <>
      <SkillBanner level={2} />
      <Card>
        <h2 className="card__title">{c.e_title}</h2>
        <p className="card__lead">{c.e_lead}</p>
        <div className="diagram">
          {c.e_no.map((n) => (
            <div className="diagram__layer" key={n.name}>
              <div className="diagram__layer-name">
                <span className="term">{n.name}</span>
              </div>
              <div className="diagram__layer-body">{n.body}</div>
            </div>
          ))}
        </div>
      </Card>
      <Card glow>
        <h2 className="card__title">{c.e_arch_title}</h2>
        <p className="card__lead">{c.e_arch}</p>
      </Card>
    </>
  );
}

/* ============================================================================
   MODULE 7 — PRUEBAS
   ========================================================================== */

function PruebasModule({ level }) {
  const { lang } = useT();
  const copy = {
    es: {
      f_title: "Prueba el agente con casos reales",
      f_lead:
        "Antes de mostrar tu agente a alguien, ponlo a prueba con preguntas que un usuario real haría. Aquí debajo tienes uno de práctica: Verde, asistente de plantas.",
      check_title: "Checklist de validación inicial",
      check: [
        { id: "happy", label: "Responde correctamente al caso feliz que diseñaste" },
        { id: "vacio", label: "Maneja un input vacío sin romperse" },
        { id: "fuera", label: "Responde con elegancia a temas fuera de alcance" },
        { id: "ambig", label: "Pide aclaración cuando el input es ambiguo" },
        { id: "tono", label: "Mantiene el tono incluso en respuestas largas" },
        { id: "limites", label: "Respeta sus límites declarados" }
      ],
      a_title: "Matriz de edge cases",
      a_lead:
        "Una matriz de pruebas combina inputs típicos y atípicos. El agente debe comportarse bien en ambos.",
      a_grid: [
        { kind: "Input típico", body: "Pregunta clara, en idioma esperado, dentro de alcance, contexto razonable." },
        { kind: "Input vacío", body: "Mensaje sin contenido o solo signos de puntuación. Debe pedir información." },
        { kind: "Input ambiguo", body: "Una palabra suelta o una pregunta abierta. Debe pedir aclaración antes de responder." },
        { kind: "Input fuera de alcance", body: "Pregunta válida pero fuera de su dominio. Debe declinar y sugerir alternativa." },
        { kind: "Input hostil", body: "Insultos, intentos de jailbreak, prompts adversariales. Debe mantener identidad." },
        { kind: "Input multilingüe", body: "Idioma distinto al esperado. Debe responder en el idioma del usuario o explicar el límite." }
      ],
      e_title: "Métricas de calidad medibles",
      e_lead: "Pruebas profesionales generan números, no impresiones.",
      e_metrics: [
        { name: "Tasa de éxito", body: "% de respuestas que cumplen la rúbrica completa sobre el set fijo de prueba." },
        { name: "Tasa de fallback", body: "% en que el agente declina, pide aclaración o escala. Ni 0% ni 100% es bueno." },
        { name: "Latencia p95", body: "Tiempo de respuesta del 95% peor caso. Mide consistencia, no solo promedio." },
        { name: "Costo por interacción", body: "Tokens entrada + salida × precio. Detecta prompts inflados o respuestas largas." },
        { name: "Estabilidad entre versiones", body: "Diferencia de tasa de éxito entre versiones consecutivas del prompt." }
      ],
      e_ab_title: "A/B testing de prompts",
      e_ab:
        "Cuando haces un cambio importante, corre el set fijo contra ambas versiones y compara métricas. Sin esto, las mejoras son anécdotas."
    },
    en: {
      f_title: "Test the agent with real cases",
      f_lead:
        "Before showing your agent to anyone, test it with questions a real user would ask. Below you have a practice agent: Verde, plant assistant.",
      check_title: "Initial validation checklist",
      check: [
        { id: "happy", label: "Correctly answers the happy case you designed" },
        { id: "vacio", label: "Handles empty input without breaking" },
        { id: "fuera", label: "Gracefully declines out-of-scope topics" },
        { id: "ambig", label: "Asks for clarification when input is ambiguous" },
        { id: "tono", label: "Maintains tone even in long answers" },
        { id: "limites", label: "Respects its declared limits" }
      ],
      a_title: "Edge cases matrix",
      a_lead: "A test matrix combines typical and atypical inputs. The agent must behave well in both.",
      a_grid: [
        { kind: "Typical input", body: "Clear question, expected language, in scope, reasonable context." },
        { kind: "Empty input", body: "Message with no content or just punctuation. Should ask for information." },
        { kind: "Ambiguous input", body: "A single word or open question. Should ask for clarification before answering." },
        { kind: "Out-of-scope input", body: "Valid question but outside its domain. Should decline and suggest alternative." },
        { kind: "Hostile input", body: "Insults, jailbreak attempts, adversarial prompts. Should keep identity." },
        { kind: "Multilingual input", body: "Different language than expected. Should respond in user's language or explain the limit." }
      ],
      e_title: "Measurable quality metrics",
      e_lead: "Professional testing produces numbers, not impressions.",
      e_metrics: [
        { name: "Success rate", body: "% of answers meeting the full rubric on the fixed test set." },
        { name: "Fallback rate", body: "% where the agent declines, asks for clarification or escalates. Neither 0% nor 100% is good." },
        { name: "p95 latency", body: "Response time at 95th worst case. Measures consistency, not just average." },
        { name: "Cost per interaction", body: "Input + output tokens × price. Catches inflated prompts or long answers." },
        { name: "Stability across versions", body: "Difference in success rate between consecutive prompt versions." }
      ],
      e_ab_title: "A/B testing of prompts",
      e_ab:
        "When you make an important change, run the fixed set against both versions and compare metrics. Without this, improvements are anecdotes."
    },
    pt: {
      f_title: "Teste o agente com casos reais",
      f_lead:
        "Antes de mostrar seu agente a alguém, teste com perguntas que um usuário real faria. Abaixo você tem um agente de prática: Verde, assistente de plantas.",
      check_title: "Checklist de validação inicial",
      check: [
        { id: "happy", label: "Responde corretamente ao caso feliz que você desenhou" },
        { id: "vacio", label: "Lida com input vazio sem quebrar" },
        { id: "fuera", label: "Responde com elegância a temas fora de escopo" },
        { id: "ambig", label: "Pede esclarecimento quando o input é ambíguo" },
        { id: "tono", label: "Mantém o tom mesmo em respostas longas" },
        { id: "limites", label: "Respeita seus limites declarados" }
      ],
      a_title: "Matriz de edge cases",
      a_lead: "Uma matriz de testes combina inputs típicos e atípicos. O agente deve se comportar bem em ambos.",
      a_grid: [
        { kind: "Input típico", body: "Pergunta clara, no idioma esperado, dentro de escopo, contexto razoável." },
        { kind: "Input vazio", body: "Mensagem sem conteúdo ou só pontuação. Deve pedir informação." },
        { kind: "Input ambíguo", body: "Uma palavra solta ou pergunta aberta. Deve pedir esclarecimento antes de responder." },
        { kind: "Input fora de escopo", body: "Pergunta válida mas fora do domínio. Deve declinar e sugerir alternativa." },
        { kind: "Input hostil", body: "Insultos, tentativas de jailbreak, prompts adversariais. Deve manter identidade." },
        { kind: "Input multilíngue", body: "Idioma diferente do esperado. Deve responder no idioma do usuário ou explicar o limite." }
      ],
      e_title: "Métricas de qualidade mensuráveis",
      e_lead: "Testes profissionais geram números, não impressões.",
      e_metrics: [
        { name: "Taxa de sucesso", body: "% de respostas que cumprem a rubrica completa sobre o set fixo de teste." },
        { name: "Taxa de fallback", body: "% em que o agente declina, pede esclarecimento ou escala. Nem 0% nem 100% é bom." },
        { name: "Latência p95", body: "Tempo de resposta do 95% pior caso. Mede consistência, não só média." },
        { name: "Custo por interação", body: "Tokens entrada + saída × preço. Detecta prompts inflados ou respostas longas." },
        { name: "Estabilidade entre versões", body: "Diferença de taxa de sucesso entre versões consecutivas do prompt." }
      ],
      e_ab_title: "A/B testing de prompts",
      e_ab:
        "Quando você faz uma mudança importante, rode o set fixo contra ambas as versões e compare métricas. Sem isto, melhorias são anedotas."
    }
  };
  const c = copy[lang] || copy.es;

  if (level === 0) {
    return (
      <>
        <SkillBanner level={0} />
        <Card>
          <h2 className="card__title">{c.f_title}</h2>
          <p className="card__lead">{c.f_lead}</p>
        </Card>
        <AgentSimulator />
        <Card>
          <h2 className="card__title">{c.check_title}</h2>
          <Checklist items={c.check} persistKey="pruebas:checklist" />
        </Card>
      </>
    );
  }

  if (level === 1) {
    return (
      <>
        <SkillBanner level={1} />
        <Card>
          <h2 className="card__title">{c.a_title}</h2>
          <p className="card__lead">{c.a_lead}</p>
          <div className="diagram">
            {c.a_grid.map((row) => (
              <div className="diagram__layer" key={row.kind}>
                <div className="diagram__layer-name">
                  <span className="term">{row.kind}</span>
                </div>
                <div className="diagram__layer-body">{row.body}</div>
              </div>
            ))}
          </div>
        </Card>
        <AgentSimulator />
      </>
    );
  }

  return (
    <>
      <SkillBanner level={2} />
      <Card>
        <h2 className="card__title">{c.e_title}</h2>
        <p className="card__lead">{c.e_lead}</p>
        <div className="diagram">
          {c.e_metrics.map((m) => (
            <div className="diagram__layer" key={m.name}>
              <div className="diagram__layer-name">
                <span className="term">{m.name}</span>
              </div>
              <div className="diagram__layer-body">{m.body}</div>
            </div>
          ))}
        </div>
      </Card>
      <Card glow>
        <h2 className="card__title">{c.e_ab_title}</h2>
        <p className="card__lead">{c.e_ab}</p>
      </Card>
    </>
  );
}

/* ============================================================================
   MODULE 8 — ITERACIÓN
   ========================================================================== */

function IteracionModule({ level }) {
  const { lang } = useT();
  const copy = {
    es: {
      f_title: "El ciclo de iteración",
      f_lead: "Ningún agente sale bien al primer intento. La iteración es la habilidad central.",
      cycle: [
        { name: "Observa", body: "Lee respuestas reales sin defender el prompt. ¿Qué falló?" },
        { name: "Diagnostica", body: "¿Es falta de contexto, instrucción ambigua o formato no especificado?" },
        { name: "Ajusta", body: "Modifica solo lo que diagnosticaste. Evita reescribir el prompt entero." },
        { name: "Re-prueba", body: "Corre el caso original más algunos similares. Compara con la versión anterior." }
      ],
      a_title: "Casos típicos de iteración",
      a_lead: "Estos son los problemas más frecuentes y la corrección habitual.",
      a_cases: [
        { name: "Respuestas demasiado largas", body: "Agrega: máximo X palabras o Y oraciones. Muestra un ejemplo de respuesta ideal." },
        { name: "El agente inventa datos", body: "Agrega: si no tienes información explícita, responde no lo sé en lugar de suponer." },
        { name: "Tono inconsistente", body: "Agrega 2 a 3 frases obligatorias y 2 a 3 frases prohibidas." },
        { name: "Formato variable", body: "Muestra un ejemplo exacto de output e instruye replicar la estructura." },
        { name: "Se sale de tema", body: "Agrega un bloque de fuera de alcance con respuestas modelo para declinar." }
      ],
      e_title: "Versionado y regresión",
      e_lead:
        "En sistemas reales, cada cambio de prompt es un release. Necesitas estrategia, no solo voluntad.",
      e_v: [
        { name: "Semver del prompt", body: "v1.2.3: major rompe contratos, minor añade capacidades, patch corrige bugs." },
        { name: "Set de regresión", body: "20+ casos que deben seguir funcionando después de cualquier cambio. Si un caso se rompe, no se publica." },
        { name: "Changelog explícito", body: "Cada versión documenta qué cambió, por qué y qué casos de prueba mejoraron o empeoraron." },
        { name: "Rollback rápido", body: "Mantén la versión anterior accesible. Si la nueva degrada en producción, vuelves en minutos." },
        { name: "Canary deploy", body: "Activa la nueva versión para 5-10% del tráfico antes de generalizar. Compara métricas." }
      ]
    },
    en: {
      f_title: "The iteration cycle",
      f_lead: "No agent comes out right on the first attempt. Iteration is the core skill.",
      cycle: [
        { name: "Observe", body: "Read real answers without defending the prompt. What failed?" },
        { name: "Diagnose", body: "Is it missing context, ambiguous instruction, or unspecified format?" },
        { name: "Adjust", body: "Modify only what you diagnosed. Avoid rewriting the entire prompt." },
        { name: "Retest", body: "Run the original case plus some similar ones. Compare with the previous version." }
      ],
      a_title: "Typical iteration cases",
      a_lead: "These are the most frequent problems and their usual fix.",
      a_cases: [
        { name: "Answers too long", body: "Add: max X words or Y sentences. Show an example of an ideal answer." },
        { name: "Agent invents data", body: "Add: if you do not have explicit information, answer I don't know instead of guessing." },
        { name: "Inconsistent tone", body: "Add 2 to 3 required phrases and 2 to 3 forbidden phrases." },
        { name: "Variable format", body: "Show an exact output example and instruct to replicate the structure." },
        { name: "Goes off topic", body: "Add an out-of-scope block with model answers to decline." }
      ],
      e_title: "Versioning and regression",
      e_lead: "In real systems, every prompt change is a release. You need strategy, not just willpower.",
      e_v: [
        { name: "Prompt semver", body: "v1.2.3: major breaks contracts, minor adds capabilities, patch fixes bugs." },
        { name: "Regression set", body: "20+ cases that must keep working after any change. If a case breaks, it does not ship." },
        { name: "Explicit changelog", body: "Each version documents what changed, why, and which tests improved or worsened." },
        { name: "Fast rollback", body: "Keep the previous version accessible. If the new one degrades in production, you go back in minutes." },
        { name: "Canary deploy", body: "Activate the new version for 5-10% of traffic before going wide. Compare metrics." }
      ]
    },
    pt: {
      f_title: "O ciclo de iteração",
      f_lead: "Nenhum agente sai bem na primeira tentativa. A iteração é a habilidade central.",
      cycle: [
        { name: "Observe", body: "Leia respostas reais sem defender o prompt. O que falhou?" },
        { name: "Diagnostique", body: "É falta de contexto, instrução ambígua ou formato não especificado?" },
        { name: "Ajuste", body: "Modifique só o que você diagnosticou. Evite reescrever o prompt inteiro." },
        { name: "Re-teste", body: "Rode o caso original mais alguns similares. Compare com a versão anterior." }
      ],
      a_title: "Casos típicos de iteração",
      a_lead: "Estes são os problemas mais frequentes e a correção habitual.",
      a_cases: [
        { name: "Respostas longas demais", body: "Adicione: máximo X palavras ou Y frases. Mostre um exemplo de resposta ideal." },
        { name: "O agente inventa dados", body: "Adicione: se não tem informação explícita, responda não sei em vez de supor." },
        { name: "Tom inconsistente", body: "Adicione 2 a 3 frases obrigatórias e 2 a 3 frases proibidas." },
        { name: "Formato variável", body: "Mostre um exemplo exato de output e instrua a replicar a estrutura." },
        { name: "Sai do tema", body: "Adicione um bloco de fora de escopo com respostas modelo para declinar." }
      ],
      e_title: "Versionamento e regressão",
      e_lead: "Em sistemas reais, cada mudança de prompt é um release. Você precisa de estratégia, não só vontade.",
      e_v: [
        { name: "Semver do prompt", body: "v1.2.3: major quebra contratos, minor adiciona capacidades, patch corrige bugs." },
        { name: "Set de regressão", body: "20+ casos que devem continuar funcionando após qualquer mudança. Se um caso quebra, não vai pro ar." },
        { name: "Changelog explícito", body: "Cada versão documenta o que mudou, por quê e quais testes melhoraram ou pioraram." },
        { name: "Rollback rápido", body: "Mantenha a versão anterior acessível. Se a nova degrada em produção, você volta em minutos." },
        { name: "Canary deploy", body: "Ative a nova versão para 5-10% do tráfego antes de generalizar. Compare métricas." }
      ]
    }
  };
  const c = copy[lang] || copy.es;

  if (level === 0) {
    return (
      <>
        <SkillBanner level={0} />
        <Card>
          <h2 className="card__title">{c.f_title}</h2>
          <p className="card__lead">{c.f_lead}</p>
          <div className="cycle">
            {c.cycle.map((step, i) => (
              <div className="cycle__step" key={step.name}>
                <div className="cycle__step-icon"><RefreshCw size={16} /></div>
                <div className="cycle__step-num">{`0${i + 1}`}</div>
                <div className="cycle__step-title"><span className="term">{step.name}</span></div>
                <div className="cycle__step-desc">{step.body}</div>
              </div>
            ))}
          </div>
        </Card>
      </>
    );
  }

  if (level === 1) {
    return (
      <>
        <SkillBanner level={1} />
        <Card>
          <h2 className="card__title">{c.a_title}</h2>
          <p className="card__lead">{c.a_lead}</p>
          <div className="diagram">
            {c.a_cases.map((cs) => (
              <div className="diagram__layer" key={cs.name}>
                <div className="diagram__layer-name">
                  <span className="term">{cs.name}</span>
                </div>
                <div className="diagram__layer-body">{cs.body}</div>
              </div>
            ))}
          </div>
        </Card>
      </>
    );
  }

  return (
    <>
      <SkillBanner level={2} />
      <Card>
        <h2 className="card__title">{c.e_title}</h2>
        <p className="card__lead">{c.e_lead}</p>
        <div className="diagram">
          {c.e_v.map((v) => (
            <div className="diagram__layer" key={v.name}>
              <div className="diagram__layer-name">
                <span className="term">{v.name}</span>
              </div>
              <div className="diagram__layer-body">{v.body}</div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

/* ============================================================================
   MODULE 9 — ERRORES COMUNES
   ========================================================================== */

function ErroresModule({ level }) {
  const { lang } = useT();
  const copy = {
    es: {
      f_title: "Seis errores frecuentes al construir un agente",
      f_lead: "Casi todos los agentes que fallan caen en alguno de estos seis patrones.",
      errors: [
        { name: "Prompt genérico", body: "Sin rol, sin contexto, sin criterio. Resultado: respuestas vagas y poco útiles." },
        { name: "Demasiados objetivos", body: "Pedirle al mismo agente que responda soporte, escriba marketing y agende. Pierde foco." },
        { name: "Sin ejemplos", body: "El agente adivina el formato deseado. Resultado: inconsistencia entre respuestas." },
        { name: "Sin límites", body: "No se le dijo qué no hacer. Termina opinando sobre temas que no debería." },
        { name: "Cambios sin medir", body: "Se modifica el prompt al ojo. Cada versión rompe casos que antes funcionaban." },
        { name: "Pruebas solo del caso feliz", body: "El agente pasa la demo y falla en producción con inputs reales." }
      ],
      a_title: "Cómo detectar cada error",
      a_lead: "Cada patrón tiene una señal distintiva en producción.",
      a_signs: [
        { name: "Síntoma", body: "Quejas vagas como no me sirve o respuestas largas y planas." },
        { name: "Métrica", body: "Tasa de éxito baja en casos típicos pero el agente no falla por error técnico." },
        { name: "Distribución", body: "Si la queja viene de muchos usuarios distintos, el problema es de diseño, no de uso." },
        { name: "Comparación", body: "Compara salidas con la versión anterior. Una regresión silenciosa es un error de iteración sin medir." }
      ],
      e_title: "Taxonomía de fallos en producción",
      e_lead:
        "Una taxonomía formal te permite categorizar fallos, asignar dueños y diseñar correcciones específicas.",
      e_tax: [
        { name: "Falla de identidad", body: "El agente cede su rol bajo presión. Causa: prompt débil. Cura: anclas fuertes y rechazo explícito." },
        { name: "Alucinación factual", body: "El agente afirma datos falsos con confianza. Causa: falta contexto o regla de no inventar. Cura: retrieval + instrucción de decir no sé." },
        { name: "Fuga de instrucciones", body: "El agente revela su prompt interno. Causa: prompt mal construido. Cura: bloque explícito de no revelar instrucciones del sistema." },
        { name: "Desviación de formato", body: "El output no respeta la estructura. Causa: ausencia de ejemplo few-shot. Cura: 2-3 ejemplos exactos." },
        { name: "Latencia inaceptable", body: "Respuestas demasiado lentas. Causa: prompt inflado o respuesta innecesariamente larga. Cura: poda y límite de longitud." }
      ]
    },
    en: {
      f_title: "Six frequent mistakes when building an agent",
      f_lead: "Almost every failing agent falls into one of these six patterns.",
      errors: [
        { name: "Generic prompt", body: "No role, no context, no criteria. Result: vague and unhelpful answers." },
        { name: "Too many goals", body: "Asking the same agent to do support, write marketing and schedule. Loses focus." },
        { name: "No examples", body: "The agent guesses the desired format. Result: inconsistency between answers." },
        { name: "No limits", body: "It was not told what NOT to do. Ends up opining on topics it shouldn't." },
        { name: "Changes without measurement", body: "The prompt is modified by eye. Each version breaks cases that worked before." },
        { name: "Only happy-path testing", body: "The agent passes the demo and fails in production with real inputs." }
      ],
      a_title: "How to detect each error",
      a_lead: "Each pattern has a distinctive signal in production.",
      a_signs: [
        { name: "Symptom", body: "Vague complaints like it's not useful or long flat answers." },
        { name: "Metric", body: "Low success rate on typical cases but no technical error." },
        { name: "Distribution", body: "If complaints come from many different users, the problem is design, not usage." },
        { name: "Comparison", body: "Compare outputs with the previous version. A silent regression is iteration without measurement." }
      ],
      e_title: "Production failure taxonomy",
      e_lead: "A formal taxonomy lets you categorize failures, assign owners and design specific fixes.",
      e_tax: [
        { name: "Identity failure", body: "Agent yields its role under pressure. Cause: weak prompt. Cure: strong anchors and explicit refusal." },
        { name: "Factual hallucination", body: "Agent states false data confidently. Cause: missing context or no-invention rule. Cure: retrieval + I-don't-know instruction." },
        { name: "Instruction leak", body: "Agent reveals its internal prompt. Cause: poorly built prompt. Cure: explicit block on revealing system instructions." },
        { name: "Format drift", body: "Output ignores structure. Cause: no few-shot example. Cure: 2-3 exact examples." },
        { name: "Unacceptable latency", body: "Answers too slow. Cause: bloated prompt or needlessly long answer. Cure: pruning and length limit." }
      ]
    },
    pt: {
      f_title: "Seis erros frequentes ao construir um agente",
      f_lead: "Quase todo agente que falha cai em um destes seis padrões.",
      errors: [
        { name: "Prompt genérico", body: "Sem papel, sem contexto, sem critério. Resultado: respostas vagas e pouco úteis." },
        { name: "Objetivos demais", body: "Pedir ao mesmo agente que faça suporte, escreva marketing e agende. Perde foco." },
        { name: "Sem exemplos", body: "O agente adivinha o formato desejado. Resultado: inconsistência entre respostas." },
        { name: "Sem limites", body: "Não foi dito o que NÃO fazer. Acaba opinando sobre temas que não deveria." },
        { name: "Mudanças sem medir", body: "Modifica-se o prompt no olho. Cada versão quebra casos que antes funcionavam." },
        { name: "Só testar caso feliz", body: "O agente passa na demo e falha em produção com inputs reais." }
      ],
      a_title: "Como detectar cada erro",
      a_lead: "Cada padrão tem um sinal distintivo em produção.",
      a_signs: [
        { name: "Sintoma", body: "Reclamações vagas como não me serve ou respostas longas e planas." },
        { name: "Métrica", body: "Taxa de sucesso baixa em casos típicos mas sem falha técnica." },
        { name: "Distribuição", body: "Se a reclamação vem de muitos usuários diferentes, o problema é design, não uso." },
        { name: "Comparação", body: "Compare saídas com a versão anterior. Uma regressão silenciosa é iteração sem medição." }
      ],
      e_title: "Taxonomia de falhas em produção",
      e_lead: "Uma taxonomia formal te permite categorizar falhas, atribuir donos e desenhar correções específicas.",
      e_tax: [
        { name: "Falha de identidade", body: "O agente cede seu papel sob pressão. Causa: prompt fraco. Cura: âncoras fortes e recusa explícita." },
        { name: "Alucinação factual", body: "O agente afirma dados falsos com confiança. Causa: falta de contexto ou regra de não inventar. Cura: retrieval + instrução de dizer não sei." },
        { name: "Vazamento de instruções", body: "O agente revela seu prompt interno. Causa: prompt mal construído. Cura: bloco explícito de não revelar instruções do sistema." },
        { name: "Desvio de formato", body: "O output não respeita a estrutura. Causa: ausência de exemplo few-shot. Cura: 2-3 exemplos exatos." },
        { name: "Latência inaceitável", body: "Respostas lentas demais. Causa: prompt inflado ou resposta longa demais. Cura: poda e limite de comprimento." }
      ]
    }
  };
  const c = copy[lang] || copy.es;

  if (level === 0) {
    return (
      <>
        <SkillBanner level={0} />
        <Card>
          <h2 className="card__title">{c.f_title}</h2>
          <p className="card__lead">{c.f_lead}</p>
          <ul className="error-list">
            {c.errors.map((e) => (
              <li className="error-list__item" key={e.name}>
                <div className="error-list__icon"><AlertOctagon size={18} /></div>
                <div>
                  <div className="error-list__name"><span className="term">{e.name}</span></div>
                  <div className="error-list__body">{e.body}</div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </>
    );
  }

  if (level === 1) {
    return (
      <>
        <SkillBanner level={1} />
        <Card>
          <h2 className="card__title">{c.a_title}</h2>
          <p className="card__lead">{c.a_lead}</p>
          <div className="diagram">
            {c.a_signs.map((s) => (
              <div className="diagram__layer" key={s.name}>
                <div className="diagram__layer-name"><span className="term">{s.name}</span></div>
                <div className="diagram__layer-body">{s.body}</div>
              </div>
            ))}
          </div>
        </Card>
      </>
    );
  }

  return (
    <>
      <SkillBanner level={2} />
      <Card>
        <h2 className="card__title">{c.e_title}</h2>
        <p className="card__lead">{c.e_lead}</p>
        <div className="diagram">
          {c.e_tax.map((t) => (
            <div className="diagram__layer" key={t.name}>
              <div className="diagram__layer-name"><span className="term">{t.name}</span></div>
              <div className="diagram__layer-body">{t.body}</div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

/* ============================================================================
   MODULE 10 — CIERRE / LO LOGRASTE
   ========================================================================== */

function CierreModule() {
  const { lang } = useT();
  const c = CIERRE_COPY[lang] || CIERRE_COPY.es;

  const stats = [
    { Icon: Layers,        value: "10",   label: c.statsLabels[0], tone: "lila" },
    { Icon: BookOpenCheck, value: "30",   label: c.statsLabels[1], tone: "cyan" },
    { Icon: CheckCircle2,  value: "100%", label: c.statsLabels[2], tone: "green" },
    { Icon: Sparkles,      value: c.statsBuilder, label: c.statsLabels[3], tone: "lila" }
  ];

  function shareAchievement() {
    const text = c.shareText;
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: c.title, text, url }).catch(() => {});
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(`${text} ${url}`.trim());
    }
  }

  function scrollToTop() {
    const main = document.querySelector(".main__scroll");
    if (main) main.scrollTo({ top: 0, behavior: "smooth" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="achievement">
      <div className="achievement__bg" aria-hidden="true" />
      <div className="achievement__inner">
        <div className="achievement__module-pill">
          <span>{c.modulePill}</span>
        </div>

        <div className="achievement__core-wrapper">
          <AchievementCore />
        </div>

        <div className="achievement__tag">
          <Star size={14} strokeWidth={2.5} />
          <span>{c.tag}</span>
        </div>

        <h1 className="achievement__title">{c.title}</h1>
        <p className="achievement__subtitle">{c.subtitle}</p>

        <div className="achievement__manifesto">
          <p className="achievement__manifesto-line">{c.manifestoL1}</p>
          <p className="achievement__manifesto-line achievement__manifesto-line--em">{c.manifestoL2}</p>
          <p className="achievement__manifesto-line achievement__manifesto-line--em">{c.manifestoL3}</p>
        </div>

        <div className="ach-stats__label">{c.completedHeading}</div>
        <div className="ach-stats">
          {stats.map((s) => (
            <div className={`ach-stat ach-stat--${s.tone}`} key={s.label}>
              <div className="ach-stat__icon"><s.Icon size={20} strokeWidth={1.75} /></div>
              <div className="ach-stat__text">
                <div className="ach-stat__value">{s.value}</div>
                <div className="ach-stat__label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="ach-ctas">
          <button className="ach-cta ach-cta--primary" onClick={scrollToTop}>
            <Rocket size={18} />
            <div>
              <div className="ach-cta__title">{c.ctaContinueTitle}</div>
              <div className="ach-cta__sub">{c.ctaContinueSub}</div>
            </div>
          </button>
          <button className="ach-cta ach-cta--secondary" onClick={shareAchievement}>
            <Share2 size={18} />
            <div>
              <div className="ach-cta__title">{c.ctaShareTitle}</div>
              <div className="ach-cta__sub">{c.ctaShareSub}</div>
            </div>
          </button>
        </div>

        <div className="ach-resources">
          <div className="ach-resources__head">
            <div className="ach-resources__kicker">{c.resourcesKicker}</div>
            <h2 className="ach-resources__title">{c.resourcesTitle}</h2>
            <p className="ach-resources__lead">{c.resourcesLead}</p>
          </div>

          {RESOURCES_GROUPS.map((group) => (
            <div className="ach-res-group" key={group.id}>
              <div className="ach-res-group__head">
                <group.Icon size={14} />
                <span>{c.groupLabels[group.id]}</span>
              </div>
              <div className="ach-res-grid">
                {group.items.map((r) => (
                  <a
                    key={r.url}
                    className="ach-res-card"
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="ach-res-card__head">
                      <div className="ach-res-card__icon"><r.Icon size={16} /></div>
                      <ArrowUpRight size={14} className="ach-res-card__arrow" />
                    </div>
                    <div className="ach-res-card__title">{r.title[lang] || r.title.es}</div>
                    <div className="ach-res-card__desc">{r.desc[lang] || r.desc.es}</div>
                    <div className="ach-res-card__url">{r.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}</div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const CIERRE_COPY = {
  es: {
    modulePill: "MÓDULO 10",
    tag: "LOGRO DESBLOQUEADO",
    title: "Lo lograste",
    subtitle: "Ya tienes los fundamentos para construir agentes en Claude. Lo demás es práctica.",
    manifestoL1: "Los dinosaurios no se extinguieron por ser débiles, sino por no adaptarse a un cambio radical.",
    manifestoL2: "La inteligencia artificial no llegó para reemplazarte.",
    manifestoL3: "Llegó para amplificar a quienes saben adaptarse.",
    completedHeading: "HAS COMPLETADO",
    statsLabels: ["Módulos completados", "Lecciones dominadas", "Progreso alcanzado", "constructor de agentes"],
    statsBuilder: "Nuevo",
    ctaContinueTitle: "Continuar al siguiente nivel",
    ctaContinueSub: "Explora rutas avanzadas y especializaciones",
    ctaShareTitle: "Compartir logro",
    ctaShareSub: "Inspira a otros",
    shareText: "Acabo de completar la Academia de Agentes con Claude. Lo lograste.",
    resourcesKicker: "RECURSOS PROFESIONALES",
    resourcesTitle: "Tu siguiente paso, curado",
    resourcesLead: "Documentación oficial, cursos avanzados y código real para llevar tus agentes a producción.",
    groupLabels: {
      learn: "Aprender más",
      build: "Construir con Claude",
      deepen: "Profundizar"
    }
  },
  en: {
    modulePill: "MODULE 10",
    tag: "ACHIEVEMENT UNLOCKED",
    title: "You did it",
    subtitle: "You now have the fundamentals to build agents in Claude. The rest is practice.",
    manifestoL1: "Dinosaurs did not go extinct for being weak, but for failing to adapt to a radical change.",
    manifestoL2: "Artificial intelligence did not arrive to replace you.",
    manifestoL3: "It arrived to amplify those who know how to adapt.",
    completedHeading: "YOU'VE COMPLETED",
    statsLabels: ["Modules completed", "Lessons mastered", "Progress reached", "agent builder"],
    statsBuilder: "New",
    ctaContinueTitle: "Continue to the next level",
    ctaContinueSub: "Explore advanced paths and specializations",
    ctaShareTitle: "Share achievement",
    ctaShareSub: "Inspire others",
    shareText: "I just completed the Claude Agents Academy. You did it.",
    resourcesKicker: "PROFESSIONAL RESOURCES",
    resourcesTitle: "Your next step, curated",
    resourcesLead: "Official documentation, advanced courses and real code to take your agents to production.",
    groupLabels: {
      learn: "Learn more",
      build: "Build with Claude",
      deepen: "Go deeper"
    }
  },
  pt: {
    modulePill: "MÓDULO 10",
    tag: "CONQUISTA DESBLOQUEADA",
    title: "Você conseguiu",
    subtitle: "Agora você tem os fundamentos para construir agentes no Claude. O resto é prática.",
    manifestoL1: "Os dinossauros não foram extintos por serem fracos, mas por não se adaptarem a uma mudança radical.",
    manifestoL2: "A inteligência artificial não chegou para te substituir.",
    manifestoL3: "Chegou para amplificar quem sabe se adaptar.",
    completedHeading: "VOCÊ COMPLETOU",
    statsLabels: ["Módulos completados", "Lições dominadas", "Progresso alcançado", "construtor de agentes"],
    statsBuilder: "Novo",
    ctaContinueTitle: "Continuar para o próximo nível",
    ctaContinueSub: "Explore rotas avançadas e especializações",
    ctaShareTitle: "Compartilhar conquista",
    ctaShareSub: "Inspire outros",
    shareText: "Acabei de completar a Academia de Agentes com Claude. Você conseguiu.",
    resourcesKicker: "RECURSOS PROFISSIONAIS",
    resourcesTitle: "Seu próximo passo, curado",
    resourcesLead: "Documentação oficial, cursos avançados e código real para levar seus agentes à produção.",
    groupLabels: {
      learn: "Aprender mais",
      build: "Construir com Claude",
      deepen: "Aprofundar"
    }
  }
};

const RESOURCES_GROUPS = [
  {
    id: "learn",
    Icon: GraduationCap,
    items: [
      {
        url: "https://claude.com/resources/courses",
        Icon: BookOpen,
        title: { es: "Claude Courses", en: "Claude Courses", pt: "Cursos Claude" },
        desc: {
          es: "Cursos guiados desde fundamentos hasta agentes avanzados.",
          en: "Guided courses from fundamentals to advanced agents.",
          pt: "Cursos guiados de fundamentos a agentes avançados."
        }
      },
      {
        url: "https://anthropic.skilljar.com/",
        Icon: GraduationCap,
        title: { es: "Anthropic Academy", en: "Anthropic Academy", pt: "Anthropic Academy" },
        desc: {
          es: "Plataforma oficial de aprendizaje con tracks por rol.",
          en: "Official learning platform with role-based tracks.",
          pt: "Plataforma oficial de aprendizado com trilhas por papel."
        }
      },
      {
        url: "https://www.anthropic.com/learn",
        Icon: Library,
        title: { es: "Anthropic Learn", en: "Anthropic Learn", pt: "Anthropic Learn" },
        desc: {
          es: "Recursos curados de aprendizaje sobre IA segura y útil.",
          en: "Curated learning resources on safe, useful AI.",
          pt: "Recursos curados de aprendizado sobre IA segura e útil."
        }
      },
      {
        url: "https://claude.ai",
        Icon: Sparkles,
        title: { es: "Claude AI", en: "Claude AI", pt: "Claude AI" },
        desc: {
          es: "Producto principal donde construyes y usas tus agentes.",
          en: "The main product where you build and use your agents.",
          pt: "O produto principal onde você constrói e usa seus agentes."
        }
      }
    ]
  },
  {
    id: "build",
    Icon: Wrench,
    items: [
      {
        url: "https://platform.claude.com/docs/en/intro",
        Icon: FileText,
        title: { es: "Claude API Docs", en: "Claude API Docs", pt: "Docs da API Claude" },
        desc: {
          es: "Referencia técnica completa para integrar Claude en tu producto.",
          en: "Full technical reference to integrate Claude into your product.",
          pt: "Referência técnica completa para integrar Claude no seu produto."
        }
      },
      {
        url: "https://code.claude.com/docs/es/quickstart",
        Icon: Code2,
        title: { es: "Claude Code Docs", en: "Claude Code Docs", pt: "Docs do Claude Code" },
        desc: {
          es: "Quickstart oficial de Claude Code para coding agéntico.",
          en: "Official Claude Code quickstart for agentic coding.",
          pt: "Quickstart oficial do Claude Code para coding agêntico."
        }
      },
      {
        url: "https://claude.com/product/claude-code",
        Icon: Rocket,
        title: { es: "Claude Code", en: "Claude Code", pt: "Claude Code" },
        desc: {
          es: "Herramienta de desarrollo agéntico desde la terminal.",
          en: "Agentic development tool from the terminal.",
          pt: "Ferramenta de desenvolvimento agêntico no terminal."
        }
      },
      {
        url: "https://modelcontextprotocol.io/docs/getting-started/intro",
        Icon: Network,
        title: { es: "Model Context Protocol", en: "Model Context Protocol", pt: "Model Context Protocol" },
        desc: {
          es: "Estándar abierto para conectar agentes a herramientas y datos.",
          en: "Open standard to connect agents with tools and data.",
          pt: "Padrão aberto para conectar agentes a ferramentas e dados."
        }
      }
    ]
  },
  {
    id: "deepen",
    Icon: Microscope,
    items: [
      {
        url: "https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills",
        Icon: Brain,
        title: {
          es: "Engineering at Anthropic",
          en: "Engineering at Anthropic",
          pt: "Engineering at Anthropic"
        },
        desc: {
          es: "Cómo equipar agentes para el mundo real con Agent Skills.",
          en: "How to equip agents for the real world with Agent Skills.",
          pt: "Como equipar agentes para o mundo real com Agent Skills."
        }
      },
      {
        url: "https://github.com/anthropics/claude-cookbooks/tree/main/skills",
        Icon: Github,
        title: { es: "Claude Cookbooks", en: "Claude Cookbooks", pt: "Claude Cookbooks" },
        desc: {
          es: "Repositorio oficial con recetas y skills listas para usar.",
          en: "Official repo with ready-to-use recipes and skills.",
          pt: "Repositório oficial com receitas e skills prontas para usar."
        }
      },
      {
        url: "https://github.com/anthropics/skills",
        Icon: Github,
        title: { es: "Anthropic / skills", en: "Anthropic / skills", pt: "Anthropic / skills" },
        desc: {
          es: "Skills oficiales de Anthropic en código abierto.",
          en: "Official Anthropic skills in open source.",
          pt: "Skills oficiais da Anthropic em código aberto."
        }
      },
      {
        url: "https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf",
        Icon: BookMarked,
        title: {
          es: "Guía completa de Skills",
          en: "Complete Guide to Skills",
          pt: "Guia completo de Skills"
        },
        desc: {
          es: "PDF oficial: la guía completa para construir Skills para Claude.",
          en: "Official PDF: complete guide to building Skills for Claude.",
          pt: "PDF oficial: guia completo para construir Skills para Claude."
        }
      },
      {
        url: "https://agentskills.io/home",
        Icon: Boxes,
        title: { es: "Agent Skills", en: "Agent Skills", pt: "Agent Skills" },
        desc: {
          es: "Comunidad y catálogo de skills creados por desarrolladores.",
          en: "Community and catalog of skills built by developers.",
          pt: "Comunidade e catálogo de skills construídos por desenvolvedores."
        }
      },
      {
        url: "https://github.com/agentskills/agentskills",
        Icon: Github,
        title: { es: "GitHub Agent Skills", en: "GitHub Agent Skills", pt: "GitHub Agent Skills" },
        desc: {
          es: "Repositorio de skills de la comunidad agentskills.",
          en: "Community agentskills repo on GitHub.",
          pt: "Repositório de skills da comunidade agentskills no GitHub."
        }
      }
    ]
  }
];
