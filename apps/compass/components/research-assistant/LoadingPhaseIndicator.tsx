import { memo } from 'react'
import { CheckCircle, Loader2 } from 'lucide-react'

interface LoadingPhase {
  message: string
  duration: number
}

interface LoadingPhaseIndicatorProps {
  phases: LoadingPhase[]
  currentPhase: number
}

// Memoized individual phase item to prevent unnecessary re-renders
const PhaseItem = memo(({
  phase,
  index,
  currentPhase
}: {
  phase: LoadingPhase
  index: number
  currentPhase: number
}) => {
  const isComplete = index < currentPhase
  const isCurrent = index === currentPhase
  const isPending = index > currentPhase

  return (
    <div
      className="flex items-center gap-2"
      style={{
        // Use transform for GPU acceleration instead of opacity
        transform: isPending ? 'translateZ(0)' : 'translateZ(0)',
        opacity: isPending ? 0.4 : 1,
        transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        // Use will-change only when animating for better performance
        willChange: isCurrent ? 'opacity' : 'auto',
        // Hardware acceleration hint
        backfaceVisibility: 'hidden' as const,
        perspective: 1000
      }}
    >
      {isComplete ? (
        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
      ) : isCurrent ? (
        <Loader2
          key="spinner"
          className="w-4 h-4 text-[#1075DC] flex-shrink-0 animate-spin"
          style={{
            transform: 'translateZ(0)',
            willChange: 'transform',
          }}
        />
      ) : (
        <div className="w-4 h-4 rounded-full border-2 border-[#AADAF9] flex-shrink-0" />
      )}
      <span
        className="text-sm"
        style={{
          color: isPending ? '#64748b' : '#162950',
          fontWeight: isCurrent ? 500 : 400,
          transition: 'color 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {phase.message.replace('...', '')}
      </span>
    </div>
  )
})

PhaseItem.displayName = 'PhaseItem'

// Custom comparison function to prevent unnecessary re-renders
const arePropsEqual = (
  prevProps: { phase: LoadingPhase; index: number; currentPhase: number },
  nextProps: { phase: LoadingPhase; index: number; currentPhase: number }
) => {
  // Only re-render if the phase status changes (not just currentPhase changes)
  const prevStatus = prevProps.index === prevProps.currentPhase ? 'current' :
                     prevProps.index < prevProps.currentPhase ? 'complete' : 'pending'
  const nextStatus = nextProps.index === nextProps.currentPhase ? 'current' :
                     nextProps.index < nextProps.currentPhase ? 'complete' : 'pending'

  return prevStatus === nextStatus && prevProps.phase.message === nextProps.phase.message
}

// Re-export with custom comparison
const MemoizedPhaseItem = memo(PhaseItem, arePropsEqual)

// Main component with memoization to prevent parent re-renders
export const LoadingPhaseIndicator = memo(({ phases, currentPhase }: LoadingPhaseIndicatorProps) => {
  return (
    <div className="bg-[#DCF2FA] border border-[#AADAF9] rounded-xl p-4 mb-6">
      <div className="flex flex-col gap-2">
        {phases.map((phase, idx) => (
          <MemoizedPhaseItem
            key={idx}
            phase={phase}
            index={idx}
            currentPhase={currentPhase}
          />
        ))}
      </div>
    </div>
  )
})

LoadingPhaseIndicator.displayName = 'LoadingPhaseIndicator'
