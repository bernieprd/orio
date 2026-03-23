import { useEffect, useRef } from 'react'
import {
  Zap,
  ClipboardList,
  GitMerge,
  Clock,
  UserX,
  LayoutTemplate,
  UserPlus,
  BarChart3,
  FileText,
  Eye,
  DollarSign,
  BookOpen,
  ExternalLink,
  ArrowRight,
  ChevronRight,
} from 'lucide-react'

// ── Scroll reveal hook ─────────────────────────────────────────────────────

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    const els = document.querySelectorAll('.reveal')
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

// ── Section wrapper ────────────────────────────────────────────────────────

function Section({ children, className = '' }) {
  return (
    <section className={`py-16 ${className}`}>
      {children}
    </section>
  )
}

function SectionLabel({ children }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-3">
      <span className="h-px w-8 bg-coral-200" />
      <span className="text-xs font-bold tracking-widest uppercase text-coral-400">{children}</span>
      <span className="h-px w-8 bg-coral-200" />
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────

export default function Overview({ navigate }) {
  useScrollReveal()

  return (
    <div className="-mt-8">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="pt-16 pb-16 text-center">

        {/* Wordmark */}
        <div
          className="reveal flex items-center justify-center gap-2 mb-8"
          style={{ transitionDelay: '0ms' }}
        >
          <div className="w-9 h-9 rounded-xl bg-coral-400 flex items-center justify-center shadow-warm-md">
            <Zap size={17} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-coral-400">orio</span>
        </div>

        <h1
          className="reveal text-4xl font-extrabold text-warm-900 tracking-tight leading-tight mb-4"
          style={{ transitionDelay: '80ms' }}
        >
          Access automation for growing teams
        </h1>

        <p
          className="reveal text-lg text-warm-500 max-w-xl mx-auto mb-10 leading-relaxed"
          style={{ transitionDelay: '160ms' }}
        >
          Create role-based templates. Onboard in one click.<br />
          Know exactly what was provisioned.
        </p>

        {/* CTAs */}
        <div
          className="reveal flex items-center justify-center gap-3 mb-12"
          style={{ transitionDelay: '240ms' }}
        >
          <button
            onClick={() => navigate('templates')}
            className="flex items-center gap-2 px-5 py-2.5 bg-coral-400 text-white text-sm font-semibold rounded-lg hover:bg-coral-500 transition-colors duration-150 shadow-warm-md"
          >
            Explore Templates
            <ArrowRight size={15} strokeWidth={2.5} />
          </button>
          <button
            onClick={() => navigate('onboarding')}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-warm-700 text-sm font-semibold rounded-lg border border-warm-200 hover:bg-warm-50 hover:border-warm-300 transition-all duration-150 shadow-warm"
          >
            Start Onboarding
            <ArrowRight size={15} strokeWidth={2.5} />
          </button>
        </div>

        {/* Stat */}
        <div
          className="reveal inline-flex items-center gap-4 bg-white border border-warm-200 rounded-xl px-6 py-4 shadow-warm"
          style={{ transitionDelay: '320ms' }}
        >
          <span className="text-sm text-warm-400 line-through">Manual: ~2 hours</span>
          <span className="text-warm-300">→</span>
          <span className="text-sm font-bold text-coral-500">
            With Orio: <span className="text-warm-900">38 seconds</span>
          </span>
          <span className="text-xs font-semibold bg-coral-50 text-coral-500 px-2 py-1 rounded-full border border-coral-100">
            From hours to seconds
          </span>
        </div>
      </section>

      <div className="border-t border-warm-100" />

      {/* ── Problem ──────────────────────────────────────────────────── */}
      <Section className="text-center">
        <SectionLabel>The problem</SectionLabel>

        <p
          className="reveal text-base text-warm-600 max-w-2xl mx-auto leading-relaxed mb-10"
          style={{ transitionDelay: '0ms' }}
        >
          Every new hire means hours of manual provisioning. IT teams juggle spreadsheets, tickets, and tribal knowledge to figure out which apps each role needs — then provision them one by one.
        </p>

        <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
          {[
            { icon: ClipboardList, label: 'Manual provisioning',     desc: 'Apps set up one by one, every time' },
            { icon: GitMerge,      label: 'No role-to-app mapping',  desc: 'No source of truth for what each role needs' },
            { icon: Clock,         label: 'Delayed offboarding',     desc: 'Revoked access takes days, not seconds' },
            { icon: UserX,         label: 'Forgotten role changes',  desc: 'Promotions leave old access in place' },
          ].map(({ icon: Icon, label, desc }, i) => (
            <div
              key={label}
              className="reveal flex flex-col items-start gap-2 bg-white border border-warm-200 rounded-xl p-4 text-left shadow-warm"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="w-8 h-8 rounded-lg bg-warm-100 flex items-center justify-center">
                <Icon size={16} className="text-warm-500" strokeWidth={1.75} />
              </div>
              <span className="text-sm font-semibold text-warm-800">{label}</span>
              <span className="text-xs text-warm-400 leading-relaxed">{desc}</span>
            </div>
          ))}
        </div>
      </Section>

      <div className="border-t border-warm-100" />

      {/* ── Solution ─────────────────────────────────────────────────── */}
      <Section className="text-center">
        <SectionLabel>How it works</SectionLabel>

        <h2
          className="reveal text-2xl font-extrabold text-warm-900 mb-10"
          style={{ transitionDelay: '0ms' }}
        >
          How Orio Automation works
        </h2>

        <div className="flex items-start justify-center gap-0 max-w-2xl mx-auto">
          {[
            {
              icon:  LayoutTemplate,
              step:  '1',
              title: 'Create templates',
              desc:  'Define which apps each role needs. Set it once.',
              delay: 0,
            },
            {
              icon:  UserPlus,
              step:  '2',
              title: 'Onboard in one click',
              desc:  'Select employee, pick template, provision all apps instantly.',
              delay: 120,
            },
            {
              icon:  BarChart3,
              step:  '3',
              title: 'Track everything',
              desc:  'Every action logged. Every app accounted for.',
              delay: 240,
            },
          ].map(({ icon: Icon, step, title, desc, delay }, i, arr) => (
            <div key={step} className="flex items-start">
              <div
                className="reveal flex flex-col items-center text-center gap-3 px-6"
                style={{ transitionDelay: `${delay}ms` }}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-coral-50 border border-coral-200 flex items-center justify-center">
                    <Icon size={20} className="text-coral-400" strokeWidth={1.75} />
                  </div>
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-coral-400 text-white text-[10px] font-bold flex items-center justify-center">
                    {step}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-bold text-warm-900 mb-1">{title}</div>
                  <div className="text-xs text-warm-500 leading-relaxed max-w-[140px]">{desc}</div>
                </div>
              </div>
              {i < arr.length - 1 && (
                <div className="flex items-center pt-6 text-warm-300">
                  <ChevronRight size={18} strokeWidth={1.5} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div
          className="reveal mt-10"
          style={{ transitionDelay: '360ms' }}
        >
          <button
            onClick={() => navigate('templates')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-coral-500 hover:text-coral-600 transition-colors duration-150"
          >
            <ArrowRight size={14} strokeWidth={2.5} />
            Try it yourself
          </button>
        </div>
      </Section>

      <div className="border-t border-warm-100" />

      {/* ── Roadmap ───────────────────────────────────────────────────── */}
      <Section className="text-center">
        <SectionLabel>Roadmap</SectionLabel>

        <h2
          className="reveal text-2xl font-extrabold text-warm-900 mb-10"
          style={{ transitionDelay: '0ms' }}
        >
          Built to grow
        </h2>

        <div className="flex gap-4 max-w-2xl mx-auto">
          {[
            {
              version: 'v1',
              title:   'Templates + Provisioning',
              sub:     'What you\'re seeing now',
              active:  true,
              delay:   0,
            },
            {
              version: 'v2',
              title:   'Offboarding + HRIS',
              sub:     'Coming next',
              active:  false,
              delay:   100,
            },
            {
              version: 'v3',
              title:   'Self-service + Compliance',
              sub:     'Full lifecycle',
              active:  false,
              delay:   200,
            },
          ].map(({ version, title, sub, active, delay }) => (
            <div
              key={version}
              className={`reveal flex-1 rounded-xl p-5 text-left border transition-all duration-150 ${
                active
                  ? 'bg-coral-50 border-coral-300 shadow-warm-md'
                  : 'bg-white border-warm-200 shadow-warm opacity-60'
              }`}
              style={{ transitionDelay: `${delay}ms` }}
            >
              <div className={`text-xs font-bold tracking-widest uppercase mb-2 ${active ? 'text-coral-400' : 'text-warm-400'}`}>
                {version}
              </div>
              <div className={`text-sm font-bold mb-1 ${active ? 'text-warm-900' : 'text-warm-600'}`}>
                {title}
              </div>
              <div className={`text-xs ${active ? 'text-coral-400 font-semibold' : 'text-warm-400'}`}>
                {sub}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <div className="border-t border-warm-100" />

      {/* ── Design principles ─────────────────────────────────────────── */}
      <Section className="text-center">
        <SectionLabel>Design principles</SectionLabel>

        <div className="flex gap-4 max-w-3xl mx-auto mt-6">
          {[
            { icon: BookOpen,    title: 'Rules, not scripts',       desc: 'Configure behavior through templates, not custom code.',   delay: 0   },
            { icon: Zap,         title: 'Progressive automation',   desc: 'Start simple. Add complexity only when you\'re ready.',   delay: 80  },
            { icon: Eye,         title: 'Visibility first',         desc: 'Every action is logged and auditable by default.',        delay: 160 },
            { icon: DollarSign,  title: 'Cost-aware',               desc: 'Surface license costs as you provision. No surprises.',   delay: 240 },
          ].map(({ icon: Icon, title, desc, delay }) => (
            <div
              key={title}
              className="reveal flex-1 flex flex-col items-center text-center gap-2"
              style={{ transitionDelay: `${delay}ms` }}
            >
              <div className="w-9 h-9 rounded-lg bg-warm-100 flex items-center justify-center mb-1">
                <Icon size={17} className="text-warm-500" strokeWidth={1.75} />
              </div>
              <div className="text-sm font-bold text-warm-800">{title}</div>
              <div className="text-xs text-warm-400 leading-relaxed">{desc}</div>
            </div>
          ))}
        </div>
      </Section>

      <div className="border-t border-warm-100" />

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="py-10 text-center flex flex-col items-center gap-3">
        <a
          href="https://www.notion.so/32b332846c00818f93ddc55e6f7d4605"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-warm-500 hover:text-coral-500 transition-colors duration-150 border border-warm-200 rounded-lg px-4 py-2 hover:border-coral-200 hover:bg-coral-50"
        >
          Full case study & documentation
          <ExternalLink size={13} strokeWidth={2} />
        </a>
        <p className="text-xs text-warm-400">
          Built by Bernardo Prudêncio for the Orio Product Designer Challenge
        </p>
      </footer>

    </div>
  )
}
