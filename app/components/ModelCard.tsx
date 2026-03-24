'use client'

import { Model } from '../data/models'

interface ModelCardProps {
  model: Model
  onClick: () => void
}

export default function ModelCard({ model, onClick }: ModelCardProps) {
  return (
    <div
      onClick={onClick}
      className="group relative bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-sm border border-white/10 rounded-2xl p-6 cursor-pointer hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/20 overflow-hidden"
    >
      {/* Animated gradient border on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-violet-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl -z-10 blur-xl"></div>
      
      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-br-full"></div>

      <div className="flex gap-2 mb-4">
        {model.zkmlVerified && (
          <span className="badge-zkml px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></span>
            zkML ✓
          </span>
        )}
        {model.teeAttested && (
          <span className="badge-tee px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
            TEE ✓
          </span>
        )}
      </div>
      
      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-400 transition-colors line-clamp-1">
        {model.name}
      </h3>
      
      <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
        {model.description}
      </p>
      
      {/* Stats row */}
      <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
        <span className="px-2.5 py-1 bg-white/5 rounded-md border border-white/10 group-hover:border-indigo-500/30 transition-colors">
          {model.type}
        </span>
        <span className="text-gray-600">•</span>
        <span>{model.parameters}</span>
        <span className="text-gray-600">•</span>
        <span className="text-emerald-400 font-semibold flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {model.avgAccuracy}%
        </span>
      </div>
      
      {/* Bottom bar with additional info */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10 group-hover:border-indigo-500/30 transition-colors">
        <div className="text-xs text-gray-500">
          <span className="text-gray-400">by</span> {model.creator}
        </div>
        <div className="flex items-center gap-1 text-xs text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span>View Details</span>
          <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
      
      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/10 to-transparent -z-5"></div>
    </div>
  )
}
