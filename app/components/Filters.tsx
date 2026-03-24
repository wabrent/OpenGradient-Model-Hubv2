'use client'

interface FiltersProps {
  search: string
  setSearch: (value: string) => void
  selectedType: string
  setSelectedType: (value: string) => void
  types: string[]
  zkmlOnly: boolean
  setZkmlOnly: (value: boolean) => void
  teeOnly: boolean
  setTeeOnly: (value: boolean) => void
}

export default function Filters({
  search,
  setSearch,
  selectedType,
  setSelectedType,
  types,
  zkmlOnly,
  setZkmlOnly,
  teeOnly,
  setTeeOnly,
}: FiltersProps) {
  return (
    <>
      {/* Search */}
      <div className="relative max-w-xl mx-auto mb-6">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search models by name, type, or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Type Filters */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              selectedType === type
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30 scale-105'
                : 'bg-white/5 text-gray-400 border border-white/10 hover:border-indigo-500/50 hover:text-white hover:bg-white/10'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Verification Filters */}
      <div className="flex gap-6 justify-center mb-8">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              checked={zkmlOnly}
              onChange={(e) => setZkmlOnly(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-10 h-6 bg-white/10 rounded-full border border-white/20 peer-checked:bg-indigo-600 peer-checked:border-indigo-500 transition-all"></div>
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div>
          </div>
          <span className="text-indigo-400 font-medium group-hover:text-indigo-300 transition-colors flex items-center gap-2">
            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>
            zkML Only
          </span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              checked={teeOnly}
              onChange={(e) => setTeeOnly(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-10 h-6 bg-white/10 rounded-full border border-white/20 peer-checked:bg-emerald-600 peer-checked:border-emerald-500 transition-all"></div>
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div>
          </div>
          <span className="text-emerald-400 font-medium group-hover:text-emerald-300 transition-colors flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            TEE Only
          </span>
        </label>
      </div>
    </>
  )
}
