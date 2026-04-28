import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Sparkles, Bot, Rocket, ChevronRight, ChevronDown, Check, Copy,
  CheckCircle2, XCircle, AlertTriangle, Lightbulb, Target, Wrench,
  TestTube2, RefreshCw, BookOpen, Zap, Brain, MessageSquare,
  ArrowRight, Code2, Eye, Play, Trophy, Settings2, ShieldCheck,
  Workflow, FileText, Database, Hexagon, Menu, X, Search,
  Command, ArrowUpRight, BookMarked, Activity, ChevronLeft, Info,
  Layers, GraduationCap, Clock, Circle
} from "lucide-react";

/* ============================================================================
   AGENT ACADEMY · Aprende a crear agentes en Claude
   --------------------------------------------------------------------------
   Arquitectura:
   - Design tokens (colors, spacing, radius, typography) en CSS variables
   - Layout: sidebar 260px + main content (max-width 880px)
   - Componentes reutilizables: Card, StepBlock, Checklist, CodeBlock,
     ExpandableSection, AlertBox, Progress, Tabs, QuizCard, AgentSimulator
   - Estado centralizado en App, persistido en memoria
   ========================================================================== */

/* ============================================================================
   DESIGN TOKENS (CSS-in-JS via styled string injected once)
   ========================================================================== */

const DESIGN_TOKENS = `
  :root {
    /* Color system — neutral grayscale + single accent */
    --bg-base: #0a0a0b;
    --bg-surface: #111113;
    --bg-elevated: #16161a;
    --bg-hover: #1c1c21;
    --bg-active: #232329;

    --border-subtle: #1f1f24;
    --border-default: #2a2a31;
    --border-strong: #3a3a44;
    --border-focus: #4f46e5;

    --text-primary: #ededef;
    --text-secondary: #a1a1aa;
    --text-tertiary: #71717a;
    --text-muted: #52525b;
    --text-inverse: #0a0a0b;

    --accent-primary: #6366f1;
    --accent-hover: #818cf8;
    --accent-subtle: rgba(99, 102, 241, 0.1);
    --accent-border: rgba(99, 102, 241, 0.3);

    --success: #10b981;
    --success-subtle: rgba(16, 185, 129, 0.1);
    --success-border: rgba(16, 185, 129, 0.3);

    --warning: #f59e0b;
    --warning-subtle: rgba(245, 158, 11, 0.1);
    --warning-border: rgba(245, 158, 11, 0.3);

    --danger: #ef4444;
    --danger-subtle: rgba(239, 68, 68, 0.1);
    --danger-border: rgba(239, 68, 68, 0.3);

    --info: #3b82f6;
    --info-subtle: rgba(59, 130, 246, 0.1);
    --info-border: rgba(59, 130, 246, 0.3);

    /* Spacing — 4px base scale */
    --s-1: 4px;
    --s-2: 8px;
    --s-3: 12px;
    --s-4: 16px;
    --s-5: 20px;
    --s-6: 24px;
    --s-8: 32px;
    --s-10: 40px;
    --s-12: 48px;
    --s-16: 64px;
    --s-20: 80px;

    /* Radius */
    --r-sm: 4px;
    --r-md: 6px;
    --r-lg: 8px;
    --r-xl: 12px;
    --r-2xl: 16px;

    /* Typography */
    --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    --font-mono: 'JetBrains Mono', 'SF Mono', Menlo, monospace;
    --font-display: 'Inter', -apple-system, sans-serif;

    --fs-xs: 11px;
    --fs-sm: 13px;
    --fs-base: 14px;
    --fs-body: 15px;
    --fs-md: 15px;
    --fs-lg: 17px;
    --fs-xl: 20px;
    --fs-2xl: 24px;
    --fs-3xl: 30px;
    --fs-4xl: 38px;
    --fs-display: 52px;

    --lh-tight: 1.2;
    --lh-snug: 1.4;
    --lh-normal: 1.5;
    --lh-relaxed: 1.65;

    --fw-normal: 400;
    --fw-medium: 500;
    --fw-semibold: 600;
    --fw-bold: 700;

    /* Shadows */
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4);
    --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.5);
    --shadow-lg: 0 12px 32px rgba(0, 0, 0, 0.6);

    /* Transitions */
    --t-fast: 120ms cubic-bezier(0.4, 0, 0.2, 1);
    --t-base: 180ms cubic-bezier(0.4, 0, 0.2, 1);
    --t-slow: 280ms cubic-bezier(0.4, 0, 0.2, 1);

    /* Layout */
    --sidebar-width: 260px;
    --header-height: 56px;
    --content-max: 820px;
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

  ::selection { background: var(--accent-subtle); color: var(--accent-hover); }

  /* Focus rings — accesibilidad + look pro */
  :focus { outline: none; }
  :focus-visible {
    outline: 2px solid var(--accent-primary);
    outline-offset: 2px;
    border-radius: var(--r-sm);
  }

  /* Custom scrollbar — sutil, solo aparece al hover del contenedor */
  ::-webkit-scrollbar { width: 8px; height: 8px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 8px;
    border: 2px solid transparent;
    background-clip: padding-box;
  }
  *:hover > ::-webkit-scrollbar-thumb,
  *:hover::-webkit-scrollbar-thumb {
    background: var(--border-default);
    background-clip: padding-box;
  }
  ::-webkit-scrollbar-thumb:hover { background: var(--border-strong) !important; background-clip: padding-box !important; }
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

  @media (max-width: 900px) {
    .app { grid-template-columns: 1fr; }
  }

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
    background: linear-gradient(135deg, var(--accent-primary), #4338ca);
    display: grid;
    place-items: center;
    color: white;
    box-shadow: 0 0 0 1px var(--accent-border), 0 4px 12px rgba(99, 102, 241, 0.25);
  }

  .brand-name {
    font-size: var(--fs-md);
    font-weight: var(--fw-semibold);
    letter-spacing: -0.01em;
    color: var(--text-primary);
  }

  .brand-tag {
    font-size: var(--fs-xs);
    color: var(--text-muted);
    margin-top: 1px;
  }

  .sidebar__search {
    padding: var(--s-3) var(--s-4) var(--s-2);
    flex-shrink: 0;
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
    position: relative;
  }
  .search-input:focus { outline: none; border-color: var(--border-strong); }
  .search-input::placeholder { color: var(--text-muted); }

  .search-wrap { position: relative; }
  .search-wrap svg {
    position: absolute;
    left: var(--s-3);
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
  }
  .search-kbd {
    position: absolute;
    right: var(--s-2);
    top: 50%;
    transform: translateY(-50%);
    font-size: 10px;
    font-family: var(--font-mono);
    padding: 2px 6px;
    background: var(--bg-elevated);
    border: 1px solid var(--border-subtle);
    border-radius: var(--r-sm);
    color: var(--text-muted);
  }

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
    color: var(--text-muted);
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
  .nav-item:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }
  .nav-item.active {
    background: var(--bg-active);
    color: var(--text-primary);
    box-shadow: inset 2px 0 0 var(--accent-primary);
  }

  .nav-item__icon {
    width: 16px; height: 16px;
    flex-shrink: 0;
    color: var(--text-tertiary);
  }
  .nav-item.active .nav-item__icon,
  .nav-item:hover .nav-item__icon { color: var(--text-primary); }

  .nav-item__num {
    font-size: 10px;
    font-family: var(--font-mono);
    color: var(--text-muted);
    margin-left: auto;
    flex-shrink: 0;
  }

  .nav-item__check {
    width: 14px; height: 14px;
    margin-left: auto;
    color: var(--success);
    flex-shrink: 0;
  }

  .sidebar__footer {
    padding: var(--s-3) var(--s-4);
    border-top: 1px solid var(--border-subtle);
    flex-shrink: 0;
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
  .progress-card__label {
    font-size: var(--fs-xs);
    color: var(--text-secondary);
    font-weight: var(--fw-medium);
  }
  .progress-card__value {
    font-size: var(--fs-xs);
    font-family: var(--font-mono);
    color: var(--text-primary);
    font-weight: var(--fw-semibold);
  }
  .progress-bar {
    height: 4px;
    background: var(--border-subtle);
    border-radius: 2px;
    overflow: hidden;
  }
  .progress-bar__fill {
    height: 100%;
    background: linear-gradient(90deg, var(--accent-primary), var(--accent-hover));
    border-radius: 2px;
    transition: width var(--t-slow);
  }

  /* ============ MAIN ============ */
  .main {
    overflow-y: auto;
    background: var(--bg-base);
    position: relative;
  }

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
  }
  .header__crumb-sep { color: var(--text-muted); flex-shrink: 0; }
  .header__crumb-current { color: var(--text-primary); font-weight: var(--fw-medium); }

  .header__spacer { flex: 1; }

  .header__meta {
    display: flex;
    align-items: center;
    gap: var(--s-2);
    height: 28px;
    padding: 0 var(--s-3);
    border-radius: var(--r-md);
    font-size: var(--fs-xs);
    color: var(--text-tertiary);
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
  .header__menu-btn:hover { background: var(--bg-hover); color: var(--text-primary); }
  @media (max-width: 900px) { .header__menu-btn { display: flex; } }

  .content {
    max-width: var(--content-max);
    margin: 0 auto;
    padding: var(--s-12) var(--s-6) var(--s-20);
  }

  @media (max-width: 600px) {
    .content { padding: var(--s-8) var(--s-5) var(--s-16); }
  }

  /* ============ TYPOGRAPHY ============ */
  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: var(--s-2);
    font-size: 11px;
    font-weight: var(--fw-semibold);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--accent-hover);
    margin-bottom: var(--s-3);
  }
  .eyebrow__dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--accent-primary);
    box-shadow: 0 0 10px var(--accent-primary);
  }

  .h1 {
    font-size: var(--fs-3xl);
    font-weight: var(--fw-semibold);
    line-height: 1.15;
    letter-spacing: -0.02em;
    color: var(--text-primary);
    margin-bottom: var(--s-3);
  }
  @media (max-width: 600px) { .h1 { font-size: var(--fs-2xl); } }

  .h2 {
    font-size: var(--fs-xl);
    font-weight: var(--fw-semibold);
    line-height: var(--lh-snug);
    letter-spacing: -0.01em;
    color: var(--text-primary);
    margin-bottom: var(--s-3);
  }

  .h3 {
    font-size: var(--fs-md);
    font-weight: var(--fw-semibold);
    color: var(--text-primary);
    margin-bottom: var(--s-2);
    line-height: 1.35;
  }

  .lede {
    font-size: var(--fs-md);
    line-height: var(--lh-relaxed);
    color: var(--text-secondary);
    max-width: 640px;
  }

  .text-secondary { color: var(--text-secondary); }
  .text-tertiary { color: var(--text-tertiary); }
  .text-muted { color: var(--text-muted); }

  /* ============ CARD SYSTEM ============ */
  .card {
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    border-radius: var(--r-lg);
    padding: var(--s-5);
    transition: border-color var(--t-fast), background var(--t-fast), transform var(--t-fast);
  }
  .card--interactive { cursor: pointer; }
  .card--interactive:hover {
    border-color: var(--border-default);
    background: var(--bg-elevated);
  }
  .card--elevated { background: var(--bg-elevated); }
  .card--ghost { background: transparent; }

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

  /* Card content helpers */
  .card-emoji {
    font-size: 22px;
    line-height: 1;
    margin-bottom: var(--s-3);
  }
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
  .card-header-row__emoji { font-size: 22px; line-height: 1; }
  .card-header-row__title {
    font-size: var(--fs-base);
    font-weight: var(--fw-semibold);
    color: var(--text-primary);
    line-height: 1.3;
  }
  .card-header-row__sub {
    font-size: 10px;
    color: var(--text-muted);
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

  .btn--primary {
    background: var(--accent-primary);
    color: white;
  }
  .btn--primary:hover:not(:disabled) {
    background: var(--accent-hover);
  }

  .btn--secondary {
    background: var(--bg-elevated);
    border-color: var(--border-default);
    color: var(--text-primary);
  }
  .btn--secondary:hover:not(:disabled) {
    background: var(--bg-hover);
    border-color: var(--border-strong);
  }

  .btn--ghost {
    color: var(--text-secondary);
  }
  .btn--ghost:hover:not(:disabled) {
    background: var(--bg-hover);
    color: var(--text-primary);
  }

  .btn--success {
    background: var(--success-subtle);
    border-color: var(--success-border);
    color: var(--success);
  }

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

  .step__title {
    font-size: var(--fs-base);
    font-weight: var(--fw-semibold);
    color: var(--text-primary);
    margin-bottom: var(--s-1);
  }
  .step__desc {
    font-size: var(--fs-sm);
    color: var(--text-secondary);
    line-height: var(--lh-relaxed);
  }

  /* ============ STEP HEADER (3-col qué/por qué/cómo) ============ */
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
    color: var(--text-tertiary);
    margin-bottom: var(--s-2);
    font-weight: var(--fw-medium);
  }
  .step-header__text {
    font-size: var(--fs-sm);
    color: var(--text-secondary);
    line-height: var(--lh-relaxed);
  }

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
    color: var(--text-primary);
  }
  .expandable__chevron {
    color: var(--text-tertiary);
    transition: transform var(--t-base);
  }
  .expandable__chevron--open { transform: rotate(90deg); color: var(--accent-hover); }
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
    background: var(--accent-primary);
    border-color: var(--accent-primary);
  }
  .check-item--checked .check-item__box svg { color: white; }

  .check-item__title {
    font-size: var(--fs-sm);
    font-weight: var(--fw-medium);
    color: var(--text-primary);
    margin-bottom: 2px;
  }
  .check-item--checked .check-item__title {
    text-decoration: line-through;
    color: var(--text-tertiary);
  }
  .check-item__desc {
    font-size: var(--fs-xs);
    color: var(--text-tertiary);
    line-height: var(--lh-relaxed);
  }

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
  .codeblock__copy:hover { background: var(--bg-hover); color: var(--text-primary); }
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
  .alert__title {
    font-size: var(--fs-sm);
    font-weight: var(--fw-semibold);
    margin-bottom: 4px;
  }
  .alert__body { font-size: var(--fs-sm); line-height: var(--lh-relaxed); color: var(--text-secondary); }

  .alert--info { background: var(--info-subtle); border-color: var(--info-border); }
  .alert--info .alert__icon, .alert--info .alert__title { color: var(--info); }

  .alert--warning { background: var(--warning-subtle); border-color: var(--warning-border); }
  .alert--warning .alert__icon, .alert--warning .alert__title { color: var(--warning); }

  .alert--success { background: var(--success-subtle); border-color: var(--success-border); }
  .alert--success .alert__icon, .alert--success .alert__title { color: var(--success); }

  /* ============ TABS ============ */
  .tabs {
    display: flex;
    gap: 2px;
    padding: 3px;
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    border-radius: var(--r-md);
    width: fit-content;
  }
  .tab {
    padding: 6px var(--s-3);
    border-radius: 4px;
    font-size: var(--fs-sm);
    font-weight: var(--fw-medium);
    color: var(--text-tertiary);
    transition: all var(--t-fast);
  }
  .tab:hover { color: var(--text-primary); }
  .tab--active {
    background: var(--bg-active);
    color: var(--text-primary);
  }

  /* ============ COMPARE CARD ============ */
  .compare {
    padding: var(--s-4);
    border-radius: var(--r-lg);
    border: 1px solid;
  }
  .compare--bad { background: var(--danger-subtle); border-color: var(--danger-border); }
  .compare--good { background: var(--success-subtle); border-color: var(--success-border); }
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
    color: var(--text-primary);
    line-height: var(--lh-relaxed);
    font-family: var(--font-mono);
    padding: var(--s-3);
    background: rgba(0,0,0,0.25);
    border-radius: var(--r-md);
    margin-bottom: var(--s-2);
  }
  .compare__footer {
    font-size: var(--fs-xs);
    color: var(--text-secondary);
  }

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
    color: var(--accent-hover);
    margin-bottom: var(--s-3);
    font-weight: var(--fw-semibold);
  }
  .quiz__question {
    font-size: var(--fs-md);
    font-weight: var(--fw-medium);
    color: var(--text-primary);
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
    color: var(--text-secondary);
    font-size: var(--fs-sm);
    transition: all var(--t-fast);
    margin-bottom: var(--s-2);
  }
  .quiz__option:last-child { margin-bottom: 0; }
  .quiz__option:hover:not(:disabled) {
    border-color: var(--border-default);
    color: var(--text-primary);
    background: var(--bg-elevated);
  }
  .quiz__option--correct {
    border-color: var(--success-border);
    background: var(--success-subtle);
    color: var(--success);
    animation: pop 280ms cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .quiz__option--wrong {
    border-color: var(--danger-border);
    background: var(--danger-subtle);
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
    color: var(--text-muted);
    width: 18px;
    flex-shrink: 0;
  }
  .quiz__feedback {
    margin-top: var(--s-3);
    padding: var(--s-3);
    border-radius: var(--r-md);
    font-size: var(--fs-sm);
    background: var(--bg-elevated);
    border-left: 2px solid var(--accent-primary);
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
    height: 40px;
    padding: 0 var(--s-4);
    display: flex;
    align-items: center;
    gap: var(--s-3);
    border-bottom: 1px solid var(--border-subtle);
    background: var(--bg-elevated);
  }
  .sim__status {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--success);
    box-shadow: 0 0 8px var(--success);
  }
  .sim__title {
    font-size: var(--fs-sm);
    font-weight: var(--fw-medium);
    color: var(--text-primary);
  }
  .sim__tag {
    margin-left: auto;
    font-size: var(--fs-xs);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--text-muted);
    font-family: var(--font-mono);
  }
  .sim__body {
    padding: var(--s-4);
    min-height: 240px;
    max-height: 360px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: var(--s-3);
  }
  .sim__row {
    display: flex;
    gap: var(--s-2);
    max-width: 92%;
    align-items: flex-start;
  }
  .sim__row--user { align-self: flex-end; }
  .sim__row--bot { align-self: flex-start; }
  .sim__msg--user {
    background: var(--bg-active);
    padding: var(--s-2) var(--s-3);
    border-radius: 12px 12px 2px 12px;
    font-size: var(--fs-sm);
    color: var(--text-primary);
    line-height: var(--lh-relaxed);
  }
  .sim__msg--bot {
    background: var(--accent-subtle);
    border: 1px solid var(--accent-border);
    padding: var(--s-3) var(--s-4);
    border-radius: 12px 12px 12px 2px;
    font-size: var(--fs-sm);
    color: var(--text-primary);
    line-height: var(--lh-relaxed);
    flex: 1;
  }
  .sim__avatar {
    width: 26px; height: 26px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--accent-primary), #4338ca);
    display: grid;
    place-items: center;
    font-size: 13px;
    flex-shrink: 0;
    color: white;
    margin-top: 2px;
  }
  .sim__empty {
    text-align: center;
    color: var(--text-muted);
    font-size: var(--fs-sm);
    padding: var(--s-8) var(--s-4);
    line-height: var(--lh-relaxed);
  }
  .sim__suggest {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    justify-content: center;
    margin-top: var(--s-3);
  }
  .sim__chip {
    font-size: var(--fs-xs);
    padding: 4px var(--s-2);
    background: var(--bg-elevated);
    border: 1px solid var(--border-subtle);
    border-radius: 12px;
    color: var(--text-secondary);
    transition: all var(--t-fast);
  }
  .sim__chip:hover { border-color: var(--border-default); color: var(--text-primary); }

  .sim__cursor {
    display: inline-block;
    width: 6px;
    height: 14px;
    background: var(--accent-hover);
    margin-left: 2px;
    animation: blink 1s infinite;
    vertical-align: text-bottom;
  }
  @keyframes blink { 0%, 50% { opacity: 1; } 50.01%, 100% { opacity: 0; } }

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
    color: var(--text-primary);
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
    color: var(--text-muted);
    padding: 4px 10px;
    border: 1px solid var(--border-subtle);
    border-radius: var(--r-md);
    background: var(--bg-surface);
    flex-shrink: 0;
    margin-top: 4px;
    letter-spacing: 0.05em;
  }
  .module-header__main { flex: 1; min-width: 0; }
  .module-header__main .eyebrow { margin-bottom: var(--s-2); }
  .module-header__main .h1 { margin-bottom: var(--s-2); }
  .hero__title {
    font-size: var(--fs-4xl);
    font-weight: var(--fw-semibold);
    line-height: 1.08;
    letter-spacing: -0.025em;
    color: var(--text-primary);
    margin-bottom: var(--s-4);
    max-width: 720px;
  }
  @media (max-width: 600px) { .hero__title { font-size: var(--fs-3xl); } }

  .hero__title-em {
    background: linear-gradient(135deg, var(--accent-hover) 0%, var(--accent-primary) 100%);
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
    color: var(--text-tertiary);
  }
  .hero__meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
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
    color: var(--text-primary);
    border: 0;
    padding: var(--s-4);
    font-family: var(--font-mono);
    font-size: 12.5px;
    line-height: 1.7;
    resize: none;
    min-height: 140px;
  }
  .editor textarea:focus { outline: none; }

  /* ============ FOOTER NAV ============ */
  .module-nav {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--s-3);
    margin-top: var(--s-12);
    padding-top: var(--s-6);
    border-top: 1px solid var(--border-subtle);
  }
  @media (max-width: 600px) {
    .module-nav { grid-template-columns: 1fr; }
  }
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
    background: var(--accent-subtle);
    border-color: var(--accent-border);
  }
  .module-nav__btn--next:hover:not(:disabled) {
    background: rgba(99, 102, 241, 0.15);
    border-color: var(--accent-primary);
  }
  .module-nav__btn--next .module-nav__label { color: var(--accent-hover); }
  .module-nav__label {
    font-size: var(--fs-xs);
    color: var(--text-tertiary);
    margin-bottom: 4px;
    font-weight: var(--fw-medium);
  }
  .module-nav__title {
    font-size: var(--fs-sm);
    font-weight: var(--fw-semibold);
    color: var(--text-primary);
    display: flex;
    align-items: center;
    gap: var(--s-2);
  }
  .module-nav__btn--next .module-nav__title { justify-content: flex-end; }

  /* ============ DIAGRAM SVG ============ */
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
    color: var(--text-tertiary);
    margin-bottom: var(--s-4);
    font-weight: var(--fw-medium);
  }

  /* ============ MOBILE OVERLAY ============ */
  .overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.6);
    z-index: 99;
  }
  @media (max-width: 900px) {
    .overlay.show { display: block; }
  }

  /* ============ ERROR LIST (errores comunes) ============ */
  .error-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--s-3);
  }
  @media (max-width: 720px) {
    .error-list { grid-template-columns: 1fr; }
  }
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
  .error-card__head {
    display: flex;
    align-items: center;
    gap: var(--s-3);
  }
  .error-card__icon {
    width: 24px; height: 24px;
    border-radius: var(--r-sm);
    background: var(--danger-subtle);
    color: var(--danger);
    display: grid;
    place-items: center;
    flex-shrink: 0;
  }
  .error-card__title {
    font-size: var(--fs-sm);
    font-weight: var(--fw-semibold);
    color: var(--text-primary);
    flex: 1;
    line-height: 1.35;
  }
  .error-card__num {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--text-muted);
    font-weight: var(--fw-medium);
  }
  .error-card__desc {
    font-size: var(--fs-sm);
    color: var(--text-secondary);
    line-height: var(--lh-relaxed);
  }
  .error-card__fix {
    display: flex;
    align-items: flex-start;
    gap: var(--s-2);
    padding-top: var(--s-3);
    border-top: 1px dashed var(--border-subtle);
    font-size: var(--fs-sm);
    color: var(--accent-hover);
    line-height: var(--lh-relaxed);
  }
  .error-card__fix svg { flex-shrink: 0; margin-top: 2px; }

  /* ============ CYCLE (iteración) ============ */
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
    .cycle {
      flex-direction: column;
      gap: var(--s-4);
    }
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
    background: var(--accent-subtle);
    border: 1px solid var(--accent-border);
    display: grid;
    place-items: center;
    color: var(--accent-hover);
  }
  .cycle__step-num {
    font-size: 10px;
    font-family: var(--font-mono);
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: var(--fw-semibold);
  }
  .cycle__step-title {
    font-size: var(--fs-base);
    font-weight: var(--fw-semibold);
    color: var(--text-primary);
  }
  .cycle__step-desc {
    font-size: var(--fs-xs);
    color: var(--text-tertiary);
    line-height: var(--lh-relaxed);
  }
  .cycle__sep {
    color: var(--text-muted);
    align-self: center;
    flex-shrink: 0;
  }

  /* ============ ITER EXAMPLES ============ */
  .iter-examples {
    display: flex;
    flex-direction: column;
    gap: var(--s-3);
  }
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
  .iter-card__text {
    font-size: var(--fs-sm);
    color: var(--text-primary);
    line-height: var(--lh-relaxed);
  }
  .iter-card__text--mono {
    font-family: var(--font-mono);
    font-size: 12.5px;
    color: var(--text-secondary);
  }
  .iter-card__arrow {
    color: var(--text-muted);
    flex-shrink: 0;
  }

  /* ============ CRIT GRID ============ */
  .crit-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--s-2);
  }
  @media (max-width: 720px) {
    .crit-grid { grid-template-columns: repeat(2, 1fr); }
  }
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
    background: linear-gradient(135deg, var(--accent-hover), var(--accent-primary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: var(--s-2);
    letter-spacing: -0.02em;
  }
  .crit-cell__name {
    font-size: var(--fs-sm);
    font-weight: var(--fw-semibold);
    color: var(--text-primary);
    margin-bottom: 2px;
  }
  .crit-cell__desc {
    font-size: var(--fs-xs);
    color: var(--text-tertiary);
    line-height: var(--lh-snug);
  }

  /* ============ TOOL CARD (herramientas) ============ */
  .tool-card__icon {
    width: 32px; height: 32px;
    border-radius: var(--r-md);
    background: var(--accent-subtle);
    border: 1px solid var(--accent-border);
    display: grid;
    place-items: center;
    color: var(--accent-hover);
    margin-bottom: var(--s-3);
  }
  .tool-card__example {
    margin-top: var(--s-3);
    padding-top: var(--s-3);
    border-top: 1px dashed var(--border-subtle);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-muted);
    font-family: var(--font-mono);
    font-weight: var(--fw-medium);
  }

  /* ============ CELEBRATE (cierre) ============ */
  .celebrate {
    text-align: center;
    padding: var(--s-12) var(--s-6);
    background: radial-gradient(ellipse at center, var(--accent-subtle) 0%, transparent 70%),
                var(--bg-surface);
    border: 1px solid var(--border-subtle);
    border-radius: var(--r-xl);
  }
  .celebrate__icon {
    width: 64px; height: 64px;
    margin: 0 auto var(--s-5);
    border-radius: 50%;
    background: var(--bg-elevated);
    border: 1px solid var(--accent-border);
    display: grid;
    place-items: center;
    color: var(--accent-hover);
    box-shadow: 0 0 32px var(--accent-subtle);
  }
  .celebrate__title {
    font-size: var(--fs-3xl);
    font-weight: var(--fw-semibold);
    line-height: 1.15;
    letter-spacing: -0.02em;
    color: var(--text-primary);
    margin-bottom: var(--s-3);
  }
  .celebrate__sub {
    font-size: var(--fs-md);
    color: var(--text-secondary);
    line-height: var(--lh-relaxed);
    max-width: 460px;
    margin: 0 auto;
  }

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
  .mantra:hover {
    border-color: var(--border-default);
    background: var(--bg-elevated);
  }
  .mantra__num {
    font-family: var(--font-mono);
    font-size: var(--fs-xs);
    font-weight: var(--fw-semibold);
    color: var(--accent-hover);
    min-width: 22px;
    flex-shrink: 0;
  }
  .mantra__text {
    font-size: var(--fs-sm);
    color: var(--text-primary);
    line-height: var(--lh-snug);
  }

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
    max-width: 420px;
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
    color: var(--accent-hover);
    font-size: var(--fs-xs);
    font-weight: var(--fw-medium);
  }
  .glossary__def {
    color: var(--text-secondary);
    line-height: var(--lh-snug);
  }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  .animate-in { animation: fadeIn 280ms cubic-bezier(0.4, 0, 0.2, 1); }

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
`;

/* ============================================================================
   DATA — module definitions
   ========================================================================== */

const MODULES = [
  { id: "intro", num: "01", title: "Introducción", subtitle: "¿Qué es un agente?", icon: Sparkles, section: "Fundamentos", time: "3 min" },
  { id: "requisitos", num: "02", title: "Requisitos previos", subtitle: "Lo que necesitas", icon: ShieldCheck, section: "Fundamentos", time: "2 min" },
  { id: "crear", num: "03", title: "Crear el agente", subtitle: "Tu primer proyecto", icon: Rocket, section: "Construcción", time: "4 min" },
  { id: "personalidad", num: "04", title: "Personalidad", subtitle: "Tono y comportamiento", icon: Bot, section: "Construcción", time: "5 min" },
  { id: "prompts", num: "05", title: "Prompt engineering", subtitle: "Instrucciones efectivas", icon: Brain, section: "Construcción", time: "8 min" },
  { id: "herramientas", num: "06", title: "Herramientas", subtitle: "Contexto y conexiones", icon: Wrench, section: "Construcción", time: "4 min" },
  { id: "pruebas", num: "07", title: "Pruebas", subtitle: "Validación", icon: TestTube2, section: "Refinamiento", time: "5 min" },
  { id: "iteracion", num: "08", title: "Iteración", subtitle: "Mejora continua", icon: RefreshCw, section: "Refinamiento", time: "3 min" },
  { id: "errores", num: "09", title: "Errores comunes", subtitle: "Qué evitar", icon: AlertTriangle, section: "Maestría", time: "4 min" },
  { id: "cierre", num: "10", title: "Lo lograste", subtitle: "Próximos pasos", icon: Trophy, section: "Maestría", time: "1 min" },
];

/* ============================================================================
   ROOT APP
   ========================================================================== */

export default function App() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [completed, setCompleted] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mainRef = useRef(null);

  // Inject design tokens once
  useEffect(() => {
    const id = "design-tokens";
    if (document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id;
    s.innerHTML = DESIGN_TOKENS;
    document.head.appendChild(s);
  }, []);

  // Scroll top on module change
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    setSidebarOpen(false);
  }, [activeIdx]);

  const markComplete = useCallback((id) => {
    setCompleted((p) => ({ ...p, [id]: true }));
  }, []);

  const goNext = useCallback(() => {
    setActiveIdx((i) => Math.min(i + 1, MODULES.length - 1));
  }, []);

  const goPrev = useCallback(() => {
    setActiveIdx((i) => Math.max(i - 1, 0));
  }, []);

  const completionPct = useMemo(
    () => (Object.values(completed).filter(Boolean).length / MODULES.length) * 100,
    [completed]
  );

  const activeModule = MODULES[activeIdx];

  return (
    <div className="app">
      <Sidebar
        active={activeIdx}
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
        <div className="content animate-in" key={activeModule.id}>
          <ModuleContent
            module={activeModule}
            isCompleted={!!completed[activeModule.id]}
            onComplete={() => markComplete(activeModule.id)}
            onNext={goNext}
            onPrev={goPrev}
            isFirst={activeIdx === 0}
            isLast={activeIdx === MODULES.length - 1}
            prevModule={MODULES[activeIdx - 1]}
            nextModule={MODULES[activeIdx + 1]}
          />
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   SIDEBAR
   ========================================================================== */

function Sidebar({ active, onSelect, completed, completionPct, open }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return MODULES;
    return MODULES.filter(
      (m) =>
        m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.subtitle.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

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
          <div className="brand-name">Agent Academy</div>
          <div className="brand-tag">Curso interactivo</div>
        </div>
      </div>

      <div className="sidebar__search">
        <div className="search-wrap">
          <Search size={13} />
          <input
            className="search-input"
            placeholder="Buscar módulo…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {!search && <span className="search-kbd">⌘K</span>}
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
        <div className="progress-card">
          <div className="progress-card__head">
            <span className="progress-card__label">Tu progreso</span>
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
  return (
    <header className="header">
      <button className="header__menu-btn" onClick={onMenuClick} aria-label="Open menu">
        <Menu size={18} />
      </button>
      <div className="header__crumbs">
        <span>Curso</span>
        <ChevronRight size={12} className="header__crumb-sep" />
        <span>{module.section}</span>
        <ChevronRight size={12} className="header__crumb-sep" />
        <span className="header__crumb-current">{module.title}</span>
      </div>
      <div className="header__spacer" />
      <div className="header__meta">
        <Clock size={12} />
        <span>{module.time}</span>
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

function ModuleContent({ module, isCompleted, onComplete, onNext, onPrev, isFirst, isLast, prevModule, nextModule }) {
  const map = {
    intro: <IntroModule />,
    requisitos: <RequisitosModule />,
    crear: <CrearModule />,
    personalidad: <PersonalidadModule />,
    prompts: <PromptsModule />,
    herramientas: <HerramientasModule />,
    pruebas: <PruebasModule />,
    iteracion: <IteracionModule />,
    errores: <ErroresModule />,
    cierre: <CierreModule />,
  };

  return (
    <>
      {module.id === "intro" ? (
        <Hero />
      ) : (
        <ModuleHeader module={module} />
      )}
      {map[module.id]}
      <div className="module-nav">
        <button
          className="module-nav__btn"
          disabled={isFirst}
          onClick={onPrev}
        >
          <div className="module-nav__label">Anterior</div>
          <div className="module-nav__title">
            <ChevronLeft size={14} />
            {prevModule ? prevModule.title : "—"}
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
            {isLast ? "Finalizar" : (isCompleted ? "Continuar" : "Marcar y continuar")}
          </div>
          <div className="module-nav__title">
            {isLast ? "Completar curso" : (nextModule ? nextModule.title : "—")}
            <ChevronRight size={14} />
          </div>
        </button>
      </div>
    </>
  );
}

function ModuleHeader({ module }) {
  return (
    <div className="module-header">
      <div className="module-header__num">{module.num}</div>
      <div className="module-header__main">
        <div className="eyebrow">
          <span className="eyebrow__dot" />
          {module.section}
        </div>
        <h1 className="h1">{module.title}</h1>
        <p className="lede" style={{ marginBottom: 0 }}>{module.subtitle}</p>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <div className="hero">
      <div className="eyebrow">
        <span className="eyebrow__dot" />
        Curso interactivo · Nivel principiante
      </div>
      <h1 className="hero__title">
        Construye tu primer{" "}
        <span className="hero__title-em">agente en Claude</span>{" "}
        en menos de una hora.
      </h1>
      <p className="hero__sub">
        Una guía práctica diseñada como un producto: aprenderás los fundamentos,
        construirás un agente real paso a paso y validarás tu trabajo con
        ejercicios interactivos.
      </p>
      <div className="hero__meta">
        <div className="hero__meta-item">
          <Layers size={13} /> 10 módulos
        </div>
        <div className="hero__meta-item">
          <Clock size={13} /> ~40 min
        </div>
        <div className="hero__meta-item">
          <Activity size={13} /> Ejercicios interactivos
        </div>
        <div className="hero__meta-item">
          <BookMarked size={13} /> Sin requisitos previos
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   PRIMITIVE COMPONENTS
   ========================================================================== */

function Card({ children, interactive, elevated, ghost, style }) {
  const cls = ["card"];
  if (interactive) cls.push("card--interactive");
  if (elevated) cls.push("card--elevated");
  if (ghost) cls.push("card--ghost");
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
  return (
    <div className="step-header">
      <div className="step-header__cell">
        <div className="step-header__label"><Target size={12} /> Qué hacer</div>
        <div className="step-header__text">{what}</div>
      </div>
      <div className="step-header__cell">
        <div className="step-header__label"><Lightbulb size={12} /> Por qué</div>
        <div className="step-header__text">{why}</div>
      </div>
      <div className="step-header__cell">
        <div className="step-header__label"><CheckCircle2 size={12} /> Cómo validar</div>
        <div className="step-header__text">{how}</div>
      </div>
    </div>
  );
}

function ExpandableSection({ title, children, defaultOpen = false, icon: Icon }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="expandable">
      <button className="expandable__head" onClick={() => setOpen(!open)}>
        <div className="expandable__head-left">
          {Icon && <Icon size={14} style={{ color: "var(--text-tertiary)" }} />}
          {title}
        </div>
        <ChevronRight size={15} className={`expandable__chevron ${open ? "expandable__chevron--open" : ""}`} />
      </button>
      {open && <div className="expandable__body animate-in">{children}</div>}
    </div>
  );
}

function Checklist({ items }) {
  const [checked, setChecked] = useState({});
  const toggle = (id) => setChecked((p) => ({ ...p, [id]: !p[id] }));

  return (
    <div className="stack-2">
      {items.map((it) => (
        <button
          key={it.id}
          className={`check-item ${checked[it.id] ? "check-item--checked" : ""}`}
          onClick={() => toggle(it.id)}
        >
          <div className="check-item__box">
            {checked[it.id] && <Check size={11} strokeWidth={3} />}
          </div>
          <div style={{ flex: 1 }}>
            <div className="check-item__title">{it.title}</div>
            {it.desc && <div className="check-item__desc">{it.desc}</div>}
          </div>
        </button>
      ))}
    </div>
  );
}

function CodeBlock({ title, code, type, note, filename }) {
  const [copied, setCopied] = useState(false);
  const cls = ["codeblock"];
  if (type === "good") cls.push("codeblock--good");
  if (type === "bad") cls.push("codeblock--bad");

  const onCopy = () => {
    navigator.clipboard.writeText(code);
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
          {copied ? <><Check size={12} /> Copiado</> : <><Copy size={12} /> Copiar</>}
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

function AlertBox({ type = "info", title, children }) {
  const icons = {
    info: Info,
    warning: AlertTriangle,
    success: CheckCircle2,
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
        <div className="compare__head"><XCircle size={12} /> {bad.label || "No hagas esto"}</div>
        <div className="compare__body">{bad.code}</div>
        <div className="compare__footer">{bad.note}</div>
      </div>
      <div className="compare compare--good">
        <div className="compare__head"><CheckCircle2 size={12} /> {good.label || "Mejor así"}</div>
        <div className="compare__body">{good.code}</div>
        <div className="compare__footer">{good.note}</div>
      </div>
    </div>
  );
}

function QuizCard({ question, options, correct, explanation }) {
  const [answer, setAnswer] = useState(null);
  const answered = answer !== null;
  return (
    <div className="quiz">
      <div className="quiz__label"><Target size={12} /> Validación rápida</div>
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
          {answer === correct ? "Correcto. " : "No exactamente. "}
          {explanation}
        </div>
      )}
    </div>
  );
}

function AgentSimulator() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [partial, setPartial] = useState("");

  const responses = {
    luz: "🌱 La luz es fundamental. Cuéntame: ¿la planta está cerca de una ventana? ¿La luz le da directa o filtrada? Con eso puedo recomendarte si necesitas moverla o si una variedad como Pothos o Sansevieria sería mejor.",
    riego: "💧 La regla de oro: mejor menos que más. Mete el dedo 2 cm en la tierra; si está seca, riega; si aún húmeda, espera. ¿De qué planta hablamos para darte una guía exacta?",
    muerta: "Lamento escucharlo. Antes de rendirnos, dime: ¿hojas amarillas (suele ser exceso de agua), marrones secas (falta de agua) o caídas (estrés por luz/temperatura)? Cuéntame qué ves.",
    hola: "¡Hola! Soy Verde, tu asistente de plantas. Cuéntame, ¿qué planta tienes o quieres tener? Puedo ayudarte con cuidados, ubicación, riego o problemas concretos.",
    default: "Para darte el mejor consejo necesito un poco más de contexto: ¿de qué planta hablamos, dónde está ubicada y cuánta luz recibe? Con esos tres datos puedo ser muy preciso.",
  };

  const detect = (txt) => {
    const t = txt.toLowerCase();
    if (t.includes("luz") || t.includes("sol") || t.includes("ventana")) return "luz";
    if (t.includes("riego") || t.includes("agua") || t.includes("regar")) return "riego";
    if (t.includes("muri") || t.includes("muert") || t.includes("seca") || t.includes("amarill")) return "muerta";
    if (t.includes("hola") || t.includes("buenos")) return "hola";
    return "default";
  };

  const send = (text) => {
    if (!text.trim() || typing) return;
    const userMsg = { role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);
    setPartial("");

    const reply = responses[detect(text)];
    let i = 0;
    const tick = setInterval(() => {
      if (i <= reply.length) {
        setPartial(reply.slice(0, i));
        i += 2;
      } else {
        clearInterval(tick);
        setMessages((m) => [...m, { role: "bot", content: reply }]);
        setPartial("");
        setTyping(false);
      }
    }, 14);
  };

  const suggestions = ["¿Cuánta luz necesita?", "Se me está muriendo", "Hola"];

  return (
    <div className="sim">
      <div className="sim__head">
        <div className="sim__status" />
        <div className="sim__title">Verde · Asistente de plantas</div>
        <div className="sim__tag">Simulación</div>
      </div>
      <div className="sim__body">
        {messages.length === 0 && !typing && (
          <div className="sim__empty">
            Prueba el agente que vas a aprender a construir.
            <div className="sim__suggest">
              {suggestions.map((s) => (
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
              <div className="sim__avatar">🌱</div>
              <div className="sim__msg--bot">{m.content}</div>
            </div>
          )
        ))}
        {typing && (
          <div className="sim__row sim__row--bot">
            <div className="sim__avatar">🌱</div>
            <div className="sim__msg--bot">
              {partial}<span className="sim__cursor" />
            </div>
          </div>
        )}
      </div>
      <div className="sim__footer">
        <input
          className="sim__input"
          placeholder="Escribe tu pregunta…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send(input)}
        />
        <button className="btn btn--primary" onClick={() => send(input)} disabled={typing || !input.trim()}>
          <Play size={12} /> Probar
        </button>
      </div>
    </div>
  );
}

function PromptEditor({ initial, filename = "system_prompt.txt" }) {
  const [value, setValue] = useState(initial);
  const [copied, setCopied] = useState(false);
  const onCopy = () => {
    navigator.clipboard.writeText(value);
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
          {copied ? <><Check size={12} /> Copiado</> : <><Copy size={12} /> Copiar</>}
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
   MODULE CONTENT
   ========================================================================== */

function IntroModule() {
  return (
    <div className="stack-10">
      <div>
        <h2 className="h1">¿Qué es un agente en Claude?</h2>
        <p className="lede">
          Imagina que pudieras contratar a un empleado digital con una personalidad,
          instrucciones claras y herramientas específicas. Eso es exactamente un agente.
        </p>
      </div>

      <div className="grid grid--3">
        <Card interactive>
          <div className="card-emoji">🧑‍💼</div>
          <h3 className="h3">Como un empleado</h3>
          <p className="card-body">
            Le das un rol, un manual y un tono. Ejecuta con consistencia cada vez que lo invocas.
          </p>
        </Card>
        <Card interactive>
          <div className="card-emoji">📋</div>
          <h3 className="h3">Con instrucciones</h3>
          <p className="card-body">
            El prompt es su descripción de puesto y código de conducta. Define todo su comportamiento.
          </p>
        </Card>
        <Card interactive>
          <div className="card-emoji">🛠️</div>
          <h3 className="h3">Con herramientas</h3>
          <p className="card-body">
            Puede acceder a documentos, web o sistemas según lo configures.
          </p>
        </Card>
      </div>

      <div className="diagram">
        <div className="diagram__title">Anatomía de un agente</div>
        <svg viewBox="0 0 720 220" style={{ width: "100%", height: "auto" }}>
          <defs>
            <marker id="ar" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
              <path d="M0,0 L0,6 L7,3 z" fill="#6366f1" />
            </marker>
          </defs>
          {[
            { x: 20, y: 85, label: "Usuario", sub: "Hace pregunta", emoji: "👤" },
            { x: 200, y: 85, label: "Agente", sub: "Procesa", emoji: "🤖" },
            { x: 380, y: 25, label: "Instrucciones", sub: "System prompt", emoji: "📜" },
            { x: 380, y: 145, label: "Contexto", sub: "Documentos", emoji: "🔧" },
            { x: 560, y: 85, label: "Respuesta", sub: "Útil + alineada", emoji: "✨" },
          ].map((b, i) => (
            <g key={i}>
              <rect x={b.x} y={b.y} width="140" height="50" rx="8"
                fill="#16161a" stroke="#2a2a31" />
              <text x={b.x + 14} y={b.y + 22} fontSize="14">{b.emoji}</text>
              <text x={b.x + 38} y={b.y + 21} fill="#ededef" fontSize="13" fontWeight="600">{b.label}</text>
              <text x={b.x + 14} y={b.y + 38} fill="#71717a" fontSize="10">{b.sub}</text>
            </g>
          ))}
          <line x1="160" y1="110" x2="195" y2="110" stroke="#6366f1" strokeWidth="1.5" markerEnd="url(#ar)" />
          <line x1="340" y1="100" x2="375" y2="55" stroke="#3a3a44" strokeWidth="1" strokeDasharray="3,3" markerEnd="url(#ar)" />
          <line x1="340" y1="120" x2="375" y2="170" stroke="#3a3a44" strokeWidth="1" strokeDasharray="3,3" markerEnd="url(#ar)" />
          <line x1="520" y1="50" x2="555" y2="100" stroke="#3a3a44" strokeWidth="1" strokeDasharray="3,3" markerEnd="url(#ar)" />
          <line x1="520" y1="170" x2="555" y2="120" stroke="#3a3a44" strokeWidth="1" strokeDasharray="3,3" markerEnd="url(#ar)" />
          <line x1="340" y1="110" x2="555" y2="110" stroke="#6366f1" strokeWidth="1.5" markerEnd="url(#ar)" />
        </svg>
      </div>

      <ExpandableSection title="¿Qué NO es un agente?" icon={Info}>
        <div className="stack-2">
          <div>❌ No es una IA que aprende sola con cada conversación.</div>
          <div>❌ No es un robot autónomo que funciona sin supervisión.</div>
          <div>❌ No reemplaza el criterio humano en decisiones críticas.</div>
          <div className="mt-4" style={{ color: "var(--text-primary)" }}>
            ✅ Es una <strong>configuración reutilizable</strong> que aplica tus instrucciones consistentemente.
          </div>
        </div>
      </ExpandableSection>

      <QuizCard
        question="¿Cuál es la mejor analogía para un agente en Claude?"
        options={[
          "Un robot autónomo con voluntad propia",
          "Un empleado digital con instrucciones específicas",
          "Una base de datos que guarda conversaciones",
        ]}
        correct={1}
        explanation="Un agente actúa según las instrucciones que le das. No aprende solo, no es autónomo: es una configuración reutilizable con un rol claro."
      />
    </div>
  );
}

function RequisitosModule() {
  const items = [
    { id: "r1", title: "Cuenta en Claude.ai", desc: "Gratis para empezar. Los Proyectos requieren plan Pro o Team." },
    { id: "r2", title: "Una idea (aunque sea vaga)", desc: "¿Qué tarea repetitiva quieres delegar? Soporte, redactar correos, resumir docs…" },
    { id: "r3", title: "Conceptos mínimos", desc: "Prompt = instrucción. Contexto = información. Output = respuesta. Eso es todo." },
    { id: "r4", title: "Mentalidad de iteración", desc: "Tu primera versión NO será perfecta. Y está bien: los buenos agentes se construyen mejorando." },
  ];

  return (
    <div className="stack-8">
      <p className="lede">
        Lo único que necesitas: una cuenta de Claude y unos minutos. No hace falta saber programar.
      </p>

      <Checklist items={items} />

      <Card>
        <h3 className="h3">Glosario rápido</h3>
        <div className="glossary">
          {[
            ["Prompt", "Texto con el que le hablas a la IA."],
            ["System prompt", "Instrucción base que define al agente."],
            ["Contexto", "Documentos o datos que damos al agente."],
            ["Token", "Unidad mínima de texto. ~4 caracteres = 1 token."],
            ["MCP", "Conector estándar para integrar herramientas externas."],
            ["Iteración", "Proceso de probar y mejorar el agente."],
          ].map(([k, v]) => (
            <div key={k} className="glossary__row">
              <span className="glossary__term">{k}</span>
              <span className="glossary__def">{v}</span>
            </div>
          ))}
        </div>
      </Card>

      <AlertBox type="info" title="¿No tienes plan Pro?">
        Puedes practicar todo este flujo en una conversación normal — el contenido del system prompt simplemente lo pegas al inicio de cada chat.
      </AlertBox>
    </div>
  );
}

function CrearModule() {
  return (
    <div className="stack-8">
      <StepHeader
        what="Crear un Proyecto en Claude que actuará como contenedor de tu agente."
        why="Los Proyectos guardan instrucciones, contexto y conocimiento que el agente usará en cada conversación."
        how="Sigue los 4 pasos visuales de abajo."
      />

      <Card>
        <StepBlock num="01" title="Inicia sesión en claude.ai" desc="Si no tienes cuenta, créala con tu correo. Es gratis." />
        <StepBlock num="02" title="Haz clic en 'Projects' en la barra lateral" desc="Si no ves la opción, asegúrate de tener un plan que la incluya (Pro o Team)." />
        <StepBlock num="03" title="Pulsa 'Create project'" desc="Pon un nombre descriptivo: ej. 'Asistente de soporte de plantas'." />
        <StepBlock num="04" title="Verás un panel con campos vacíos" desc="Ahí configurarás todo en los próximos módulos. ¡No los llenes aún!" />
      </Card>

      <AlertBox type="warning" title="¿No ves la opción de Projects?">
        La función de Proyectos no requiere un plan Pro o Team. Si no lo tienes, puedes simular todo el flujo en una conversación normal pegando el system prompt al inicio.
      </AlertBox>

      <ExpandableSection title="Cómo elegir un buen nombre para tu proyecto" icon={Lightbulb}>
        <div className="stack-3">
          <p>Un buen nombre te ayuda a encontrar el agente y refleja su propósito. Tres reglas:</p>
          <ul style={{ paddingLeft: 20 }} className="stack-2">
            <li><strong>Específico</strong>: "Asistente soporte plantas" mejor que "Bot 1".</li>
            <li><strong>Por dominio</strong>: incluye el área (RRHH, ventas, soporte).</li>
            <li><strong>Versionable</strong>: añade v1, v2 si vas a iterar mucho.</li>
          </ul>
        </div>
      </ExpandableSection>
    </div>
  );
}

function PersonalidadModule() {
  const ejes = [
    { icon: "🎭", t: "Rol", q: "¿Qué es?", e: "Asistente experto en cuidado de plantas." },
    { icon: "🎙️", t: "Tono", q: "¿Cómo habla?", e: "Cálido, claro, ligeramente entusiasta. Sin tecnicismos." },
    { icon: "🎯", t: "Objetivo", q: "¿Qué busca lograr?", e: "Que el cliente se sienta seguro al cuidar su planta." },
    { icon: "🚧", t: "Límites", q: "¿Qué NO hace?", e: "No diagnostica plagas. No vende productos. No improvisa dosis." },
  ];

  return (
    <div className="stack-8">
      <StepHeader
        what="Definir QUIÉN es tu agente: nombre, tono, rol y límites."
        why="Sin personalidad, suena genérico. Con personalidad, se siente como una marca."
        how="Llena los 4 ejes que ves abajo. No te saltes ninguno."
      />

      <div className="grid grid--2">
        {ejes.map((p, i) => (
          <Card key={i} interactive>
            <div className="card-header-row">
              <div className="card-header-row__emoji">{p.icon}</div>
              <div>
                <div className="card-header-row__title">{p.t}</div>
                <div className="card-header-row__sub">{p.q}</div>
              </div>
            </div>
            <div className="card-quote">{p.e}</div>
          </Card>
        ))}
      </div>

      <div>
        <div className="eyebrow"><span className="eyebrow__dot" />Comparación</div>
        <CompareCards
          bad={{
            label: "Personalidad vaga",
            code: '"Eres un asistente útil. Responde bien."',
            note: "Genérico. Sin tono. Sin límites. Sin marca.",
          }}
          good={{
            label: "Personalidad definida",
            code: '"Eres Verde, asistente de Plantas&Co. Cálido, claro, sin tecnicismos. Tu meta: que el cliente se sienta capaz. Nunca improvises dosis."',
            note: "Identidad. Tono. Objetivo. Límites claros.",
          }}
        />
      </div>

      <AlertBox type="success" title="Tip de diseñador de personajes">
        Si tu agente fuera una persona, ¿cómo se vestiría? ¿Qué referencias culturales usaría? Esa imagen mental te ayuda a escribir un tono coherente.
      </AlertBox>
    </div>
  );
}

function PromptsModule() {
  const goodPrompt = `# CONTEXTO
Trabajas para Plantas&Co, una tienda online especializada en plantas de interior.
Atiendes mayoritariamente a principiantes.

# ROL
Eres "Verde", asistente experto en cuidado de plantas con experiencia simulada
en horticultura doméstica.

# INSTRUCCIONES
1. Saluda con calidez y pregunta el nombre de la planta o pídele al usuario
   que la describa.
2. Antes de aconsejar, recoge: tipo de luz, frecuencia de riego, ubicación.
3. Da consejos en pasos numerados, máximo 5 puntos.
4. Si detectas un problema grave (plaga, hongos), sugiere consultar al
   equipo humano.
5. Termina cada respuesta con una pregunta para mantener el diálogo.

# TONO
Cálido, paciente, claro. Evita tecnicismos. Usa máximo 1 emoji por respuesta.

# LÍMITES
- No diagnostiques con fotos.
- No recomiendes pesticidas concretos.
- Si el usuario pide algo fuera del cuidado de plantas, redirige amablemente.`;

  return (
    <div className="stack-8">
      <StepHeader
        what="Escribir el system prompt: el manual del agente."
        why="Esta es la pieza más importante. Un buen prompt convierte un asistente genérico en una herramienta especializada."
        how="Usa la fórmula CRIT: Contexto + Rol + Instrucciones + Tono."
      />

      <Card elevated>
        <div className="eyebrow" style={{ marginBottom: "var(--s-4)" }}>
          <span className="eyebrow__dot" />Fórmula CRIT
        </div>
        <div className="crit-grid">
          {[
            { l: "C", w: "Contexto", d: "Quién, dónde, para qué" },
            { l: "R", w: "Rol", d: "Identidad y experiencia" },
            { l: "I", w: "Instrucciones", d: "Qué hacer paso a paso" },
            { l: "T", w: "Tono", d: "Cómo comunicarlo" },
          ].map((x) => (
            <div key={x.l} className="crit-cell">
              <div className="crit-cell__letter">{x.l}</div>
              <div className="crit-cell__name">{x.w}</div>
              <div className="crit-cell__desc">{x.d}</div>
            </div>
          ))}
        </div>
      </Card>

      <div className="stack-3">
        <CodeBlock
          type="bad"
          filename="prompt_v1_floja.txt"
          code={`Ayuda a clientes con plantas.
Sé amable.`}
          note="Demasiado vago. El agente improvisa todo."
        />
        <CodeBlock
          type="good"
          filename="prompt_v2_optimizado.txt"
          code={goodPrompt}
          note="Estructurado, específico, accionable. El agente sabe exactamente qué hacer."
        />
      </div>

      <div>
        <div className="eyebrow"><span className="eyebrow__dot" />Práctica</div>
        <h3 className="h2">Editor de prompts</h3>
        <p className="text-secondary mb-6" style={{ fontSize: "var(--fs-sm)" }}>
          Modifica el prompt usando la fórmula CRIT y cópialo en tu propio agente.
        </p>
        <PromptEditor
          initial={`Eres un asistente que ayuda a clientes de una tienda de plantas.
Responde de forma cálida y experta.
Si no sabes algo, sugiere contactar al equipo humano.`}
        />
      </div>

      <AlertBox type="info" title="Truco de prompt engineer">
        Cuando termines de escribir tu prompt, léelo en voz alta como si fueras un nuevo empleado en su primer día. Si tendrías dudas, el agente también las tendrá.
      </AlertBox>
    </div>
  );
}

function HerramientasModule() {
  return (
    <div className="stack-8">
      <StepHeader
        what="Darle al agente acceso a información o capacidades extra."
        why="Sin contexto, el agente solo sabe lo del prompt. Con contexto, conoce TU negocio."
        how="Sube documentos, conecta integraciones o pega texto en el knowledge."
      />

      <div className="grid grid--3">
        {[
          { icon: FileText, t: "Documentos", d: "PDFs, Word, Markdown. Ideal para FAQs, manuales, políticas.", c: "Catálogo, FAQ" },
          { icon: Database, t: "Conocimiento", d: "Texto pegado directo en el panel del proyecto. Persistente.", c: "Lista de productos" },
          { icon: Workflow, t: "Integraciones (MCP)", d: "Conecta apps reales: Gmail, Slack, Notion, Asana, etc.", c: "Avanzado" },
        ].map((x, i) => {
          const Icon = x.icon;
          return (
            <Card key={i} interactive>
              <div className="tool-card__icon">
                <Icon size={16} />
              </div>
              <h3 className="h3">{x.t}</h3>
              <p className="card-body">{x.d}</p>
              <div className="tool-card__example">Ej: {x.c}</div>
            </Card>
          );
        })}
      </div>

      <div className="diagram">
        <div className="diagram__title">Flujo de datos en un agente</div>
        <svg viewBox="0 0 720 180" style={{ width: "100%" }}>
          <defs>
            <marker id="ar2" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
              <path d="M0,0 L0,6 L7,3 z" fill="#6366f1" />
            </marker>
          </defs>
          {[
            { x: 30, y: 70, l: "Pregunta", c: "#a1a1aa" },
            { x: 200, y: 70, l: "System prompt", c: "#818cf8" },
            { x: 380, y: 20, l: "Documentos", c: "#818cf8" },
            { x: 380, y: 120, l: "Herramientas", c: "#818cf8" },
            { x: 560, y: 70, l: "Respuesta", c: "#10b981" },
          ].map((b, i) => (
            <g key={i}>
              <rect x={b.x} y={b.y} width="140" height="40" rx="20"
                fill="#16161a" stroke={b.c} strokeOpacity="0.4" />
              <text x={b.x + 70} y={b.y + 25} fill={b.c} fontSize="12"
                textAnchor="middle" fontFamily="JetBrains Mono, monospace">{b.l}</text>
            </g>
          ))}
          <line x1="170" y1="90" x2="195" y2="90" stroke="#6366f1" markerEnd="url(#ar2)" />
          <line x1="340" y1="80" x2="375" y2="40" stroke="#3a3a44" strokeDasharray="2,2" markerEnd="url(#ar2)" />
          <line x1="340" y1="100" x2="375" y2="140" stroke="#3a3a44" strokeDasharray="2,2" markerEnd="url(#ar2)" />
          <line x1="520" y1="40" x2="555" y2="80" stroke="#3a3a44" strokeDasharray="2,2" markerEnd="url(#ar2)" />
          <line x1="520" y1="140" x2="555" y2="100" stroke="#3a3a44" strokeDasharray="2,2" markerEnd="url(#ar2)" />
          <line x1="340" y1="90" x2="555" y2="90" stroke="#6366f1" markerEnd="url(#ar2)" />
        </svg>
      </div>

      <AlertBox type="warning" title="Regla práctica">
        No subas TODO. Sube solo lo que el agente realmente necesita consultar. Más contexto ≠ mejor agente. Demasiado contexto irrelevante puede confundir al modelo.
      </AlertBox>
    </div>
  );
}

function PruebasModule() {
  const validation = [
    { id: "v1", title: "El agente respeta el tono que definiste" },
    { id: "v2", title: "Pide información antes de aconsejar (no improvisa)" },
    { id: "v3", title: "Reconoce sus límites cuando algo está fuera de su rol" },
    { id: "v4", title: "Las respuestas son concretas, no genéricas" },
    { id: "v5", title: "Funciona con casos extremos (ofensivos, ambiguos, vacíos)" },
    { id: "v6", title: "Mantiene coherencia tras 5+ turnos de conversación" },
  ];

  return (
    <div className="stack-8">
      <StepHeader
        what="Probar el agente con casos reales y bordes."
        why="Lo que crees que dirá vs lo que realmente dice suele diferir. Solo probando lo descubres."
        how="Usa el simulador de abajo y la checklist de validación."
      />

      <div>
        <div className="eyebrow"><span className="eyebrow__dot" />Simulador</div>
        <h3 className="h2 mb-4">Prueba el agente</h3>
        <AgentSimulator />
      </div>

      <div>
        <div className="eyebrow"><span className="eyebrow__dot" />Checklist de validación</div>
        <h3 className="h2 mb-4">¿Tu agente pasa estas pruebas?</h3>
        <Checklist items={validation} />
      </div>
    </div>
  );
}

function IteracionModule() {
  return (
    <div className="stack-8">
      <StepHeader
        what="Mejorar el agente basándote en lo que descubriste probando."
        why="Ningún agente nace perfecto. Los buenos productos se construyen iterando."
        how="Sigue el ciclo de 4 pasos."
      />

      <div className="cycle">
        {[
          { n: "1", t: "Observa", d: "¿Qué falló? ¿Qué falta?", icon: Eye },
          { n: "2", t: "Hipotetiza", d: "¿Por qué crees que pasó?", icon: Lightbulb },
          { n: "3", t: "Ajusta", d: "Edita el prompt o contexto.", icon: Settings2 },
          { n: "4", t: "Re-prueba", d: "Mismo caso. ¿Mejora?", icon: RefreshCw },
        ].map((s, i, arr) => {
          const Icon = s.icon;
          return (
            <React.Fragment key={i}>
              <div className="cycle__step">
                <div className="cycle__step-icon">
                  <Icon size={16} />
                </div>
                <div className="cycle__step-num">STEP {s.n}</div>
                <div className="cycle__step-title">{s.t}</div>
                <div className="cycle__step-desc">{s.d}</div>
              </div>
              {i < arr.length - 1 && <ChevronRight size={16} className="cycle__sep" />}
            </React.Fragment>
          );
        })}
      </div>

      <div>
        <div className="eyebrow"><span className="eyebrow__dot" />Ejemplos reales</div>
        <h3 className="h2 mb-4">Iteraciones típicas</h3>
        <div className="iter-examples">
          {[
            {
              p: "El agente improvisa cuando no sabe.",
              s: 'Añade: "Si no tienes la información, di literalmente: \\"Déjame consultarlo con el equipo humano.\\" Nunca inventes."',
            },
            {
              p: "Las respuestas son demasiado largas.",
              s: 'Añade: "Limita cada respuesta a máximo 4 oraciones, salvo que el usuario pida detalle."',
            },
            {
              p: "No mantiene el tono cálido.",
              s: 'Refuerza con un ejemplo dentro del prompt: "Ejemplo de respuesta correcta: ¡Hola! Qué bien que te animes…"',
            },
          ].map((x, i) => (
            <div key={i} className="iter-card">
              <div className="iter-card__col">
                <div className="iter-card__label iter-card__label--bad">Problema</div>
                <div className="iter-card__text">{x.p}</div>
              </div>
              <div className="iter-card__arrow">
                <ArrowRight size={16} />
              </div>
              <div className="iter-card__col">
                <div className="iter-card__label iter-card__label--good">Solución</div>
                <div className="iter-card__text iter-card__text--mono">{x.s}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ErroresModule() {
  const errores = [
    {
      e: "Prompt demasiado genérico",
      d: "“Sé útil y amable” no le dice nada al agente.",
      f: "Usa la fórmula CRIT siempre.",
    },
    {
      e: "Pedirle todo a la vez",
      d: "Un agente que hace 12 cosas distintas las hace todas mal.",
      f: "Una tarea, un agente. Si necesitas más, crea otro.",
    },
    {
      e: "No definir qué NO hacer",
      d: "Sin límites, intentará responder cualquier cosa.",
      f: "Añade siempre una sección \"# LÍMITES\".",
    },
    {
      e: "No probar casos extremos",
      d: "Si solo pruebas casos amables, te llevarás sorpresas con usuarios reales.",
      f: "Prueba: vacío, ofensivo, ambiguo, fuera de tema.",
    },
    {
      e: "Subir documentos irrelevantes",
      d: "Más contexto no es mejor. Solo confunde y consume tokens.",
      f: "Sube SOLO lo que el agente realmente necesita.",
    },
    {
      e: "Esperar perfección a la primera",
      d: "Tu V1 será imperfecta. Eso no es fracaso, es el proceso.",
      f: "Itera. La V3 siempre es mucho mejor que la V1.",
    },
  ];

  return (
    <div className="stack-8">
      <p className="lede">
        Si te identificas con alguno, no pasa nada — todos los cometemos.
        Lo importante es detectarlos.
      </p>

      <div className="error-list">
        {errores.map((x, i) => (
          <div key={i} className="error-card">
            <div className="error-card__head">
              <div className="error-card__icon">
                <XCircle size={14} />
              </div>
              <div className="error-card__title">{x.e}</div>
              <div className="error-card__num">{String(i + 1).padStart(2, "0")}</div>
            </div>
            <div className="error-card__desc">{x.d}</div>
            <div className="error-card__fix">
              <Lightbulb size={13} />
              <span>{x.f}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CierreModule() {
  return (
    <div className="stack-8">
      <div className="celebrate">
        <div className="celebrate__icon">
          <Trophy size={28} />
        </div>
        <h2 className="celebrate__title">Lo lograste.</h2>
        <p className="celebrate__sub">
          Ya tienes los fundamentos para construir agentes en Claude. Lo demás es práctica.
        </p>
      </div>

      <div>
        <div className="eyebrow"><span className="eyebrow__dot" />7 mantras para llevarte</div>
        <h3 className="h2 mb-4">Resumen ejecutivo</h3>
        <div className="mantras">
          {[
            "Especifica el rol antes que la tarea.",
            "Escribe los límites con la misma claridad que las instrucciones.",
            "Da ejemplos dentro del prompt cuando puedas.",
            "Un agente, un objetivo. No mezcles.",
            "Prueba con casos hostiles, no solo amables.",
            "Versiona tus prompts: V1 → V2 → V3.",
            "Si el output es malo, casi siempre el prompt es la causa.",
          ].map((m, i) => (
            <div key={i} className="mantra">
              <div className="mantra__num">{String(i + 1).padStart(2, "0")}</div>
              <div className="mantra__text">{m}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="next-step">
        <h3 className="h3">Próximo paso</h3>
        <p className="next-step__sub">
          Abre Claude, crea tu primer Proyecto, y construye tu agente con lo que aprendiste.
          La mejor forma de fijarlo es haciéndolo.
        </p>
        <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" className="btn btn--primary">
          Ir a Claude <ArrowUpRight size={14} />
        </a>
      </div>
    </div>
  );
}
