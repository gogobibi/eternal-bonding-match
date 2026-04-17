import { useEffect, useState } from 'react'
import { getScoreTier } from '../../lib/scoreTier'

interface Props {
  score: number
  comment: string | null
}

const RADIUS = 90
const STROKE = 10
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function ScoreHero({ score, comment }: Props) {
  const tier = getScoreTier(score)
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    const timeout = setTimeout(() => setAnimatedScore(score), 50)
    return () => clearTimeout(timeout)
  }, [score])

  const offset = CIRCUMFERENCE - (animatedScore / 100) * CIRCUMFERENCE

  return (
    <div className="flex flex-col items-center gap-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl py-8 px-6 shadow-sm">
      <p className="text-slate-500 text-xs tracking-[0.3em] uppercase">Compatibility Score</p>
      <div className="relative" style={{ filter: `drop-shadow(${tier.glow})` }}>
        <svg width={220} height={220} viewBox="0 0 220 220" className="-rotate-90">
          <circle
            cx={110}
            cy={110}
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth={STROKE}
            className="text-slate-200"
          />
          <circle
            cx={110}
            cy={110}
            r={RADIUS}
            fill="none"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            className={tier.ringColor}
            style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.22, 1, 0.36, 1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-6xl font-bold tabular-nums ${tier.color}`}>{Math.round(animatedScore)}</span>
          <span className="text-slate-500 text-xs tracking-widest mt-1">/ 100</span>
        </div>
      </div>

      <div className="text-center space-y-1">
        <p className={`text-2xl font-bold tracking-wide ${tier.color}`}
          style={{ textShadow: tier.glow }}>
          {tier.label}
        </p>
        <p className="text-slate-500 text-sm">{tier.sublabel}</p>
      </div>

      {comment && (
        <div className="w-full max-w-md mt-2 px-5 py-3 rounded-md bg-[var(--color-primary-softer)] border border-[var(--color-primary-soft)]">
          <p className="text-slate-700 text-sm text-center italic">&ldquo;{comment}&rdquo;</p>
        </div>
      )}
    </div>
  )
}
