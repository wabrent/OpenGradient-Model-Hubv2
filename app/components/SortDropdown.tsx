'use client'

interface SortOption {
  value: string
  label: string
}

const sortOptions: SortOption[] = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'inferences', label: 'Most Inferences' },
  { value: 'accuracy', label: 'Highest Accuracy' },
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
]

interface SortDropdownProps {
  sortBy: string
  onSortChange: (value: string) => void
}

export default function SortDropdown({ sortBy, onSortChange }: SortDropdownProps) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="text-sm text-gray-400">Sort by:</span>
      <div className="relative">
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-2 pr-10 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 cursor-pointer hover:bg-white/10 transition-all"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value} className="bg-gray-900">
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  )
}
