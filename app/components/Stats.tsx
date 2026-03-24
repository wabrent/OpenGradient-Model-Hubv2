'use client'

interface StatsProps {
  totalModels: number
  totalInferences: number
  zkmlProofs: number
  teeAttestations: number
}

export default function Stats({ totalModels, totalInferences, zkmlProofs, teeAttestations }: StatsProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M+'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K+'
    }
    return num.toString()
  }

  const stats = [
    { 
      label: 'Total Models', 
      value: formatNumber(totalModels), 
      color: 'text-indigo-400',
      gradient: 'from-indigo-500/20 to-indigo-600/5',
      icon: '🧠',
      glow: 'glow-indigo'
    },
    { 
      label: 'Inferences', 
      value: formatNumber(totalInferences), 
      color: 'text-violet-400',
      gradient: 'from-violet-500/20 to-violet-600/5',
      icon: '⚡',
      glow: 'glow-violet'
    },
    { 
      label: 'zkML Proofs', 
      value: formatNumber(zkmlProofs), 
      color: 'text-cyan-400',
      gradient: 'from-cyan-500/20 to-cyan-600/5',
      icon: '🔐',
      glow: 'glow-cyan'
    },
    { 
      label: 'TEE Attestations', 
      value: formatNumber(teeAttestations), 
      color: 'text-emerald-400',
      gradient: 'from-emerald-500/20 to-emerald-600/5',
      icon: '✅',
      glow: 'glow-emerald'
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`relative group bg-gradient-to-br ${stat.gradient} backdrop-blur-sm border border-white/10 rounded-2xl p-5 text-center hover:border-white/20 transition-all duration-300 hover:-translate-y-1 ${stat.glow}`}
          style={{ animation: `fadeIn 0.5s ease-out ${index * 100}ms forwards`, opacity: 0 }}
        >
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
          
          {/* Icon */}
          <div className="text-3xl mb-2 relative z-10">{stat.icon}</div>
          
          {/* Value */}
          <div className={`text-2xl md:text-3xl font-bold ${stat.color} relative z-10`}>
            {stat.value}
          </div>
          
          {/* Label */}
          <div className="text-xs md:text-sm text-gray-400 mt-1 relative z-10">
            {stat.label}
          </div>
          
          {/* Corner accent */}
          <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${stat.gradient} opacity-20 rounded-tr-2xl`}></div>
        </div>
      ))}
    </div>
  )
}
