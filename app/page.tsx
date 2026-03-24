'use client'

import { useState, useEffect } from 'react'
import { mockModels, modelTypes, networkStats, Model } from './data/models'
import Stats from './components/Stats'
import Filters from './components/Filters'
import ModelCard from './components/ModelCard'
import ModelModal from './components/ModelModal'
import Pagination from './components/Pagination'
import SortDropdown from './components/SortDropdown'

const ITEMS_PER_PAGE = 12

export default function Home() {
  const [models, setModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedType, setSelectedType] = useState('All')
  const [selectedModel, setSelectedModel] = useState<Model | null>(null)
  const [zkmlOnly, setZkmlOnly] = useState(false)
  const [teeOnly, setTeeOnly] = useState(false)
  const [sortBy, setSortBy] = useState('popular')
  const [currentPage, setCurrentPage] = useState(1)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  // Fetch models from API on mount
  useEffect(() => {
    const loadModels = async () => {
      try {
        const response = await fetch('https://hub.opengradient.ai/api/models?limit=50')
        if (response.ok) {
          const data = await response.json()
          if (data.models && data.models.length > 0) {
            setModels(data.models)
            setLoading(false)
            return
          }
        }
      } catch (error) {
        console.log('API fetch failed, using mock data')
      }
      
      setModels(mockModels)
      setLoading(false)
    }

    loadModels()
  }, [])

  // Filter models
  const filtered = models.filter((model) => {
    const matchesSearch =
      model.name.toLowerCase().includes(search.toLowerCase()) ||
      model.type.toLowerCase().includes(search.toLowerCase()) ||
      model.category.toLowerCase().includes(search.toLowerCase())
    const matchesType = selectedType === 'All' || model.type === selectedType
    const matchesZkml = !zkmlOnly || model.zkmlVerified
    const matchesTee = !teeOnly || model.teeAttested
    return matchesSearch && matchesType && matchesZkml && matchesTee
  })

  // Sort models
  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.downloadCount - a.downloadCount
      case 'rating':
        return b.rating - a.rating
      case 'inferences':
        return b.totalInferences - a.totalInferences
      case 'accuracy':
        return b.avgAccuracy - a.avgAccuracy
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      default:
        return 0
    }
  })

  // Paginate models
  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE)
  const paginated = sorted.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // Toggle favorite
  const toggleFavorite = (modelId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(modelId)) {
        newFavorites.delete(modelId)
      } else {
        newFavorites.add(modelId)
      }
      return newFavorites
    })
  }

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [search, selectedType, zkmlOnly, teeOnly, sortBy])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white p-8 md:p-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 bg-clip-text text-transparent">
          OpenGradient Model Hub
        </h1>
        <p className="text-gray-400 text-lg">
          Explore 1500+ verifiable AI models with zkML proofs and TEE attestations
        </p>
        {loading && (
          <div className="mt-4 flex items-center justify-center gap-2 text-indigo-400">
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            <span className="text-sm ml-2">Loading models...</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <Stats
        totalModels={networkStats.totalModels}
        totalInferences={networkStats.totalInferences}
        zkmlProofs={networkStats.zkmlProofs}
        teeAttestations={networkStats.teeAttestations}
      />

      {/* Filters */}
      <Filters
        search={search}
        setSearch={setSearch}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        types={modelTypes}
        zkmlOnly={zkmlOnly}
        setZkmlOnly={setZkmlOnly}
        teeOnly={teeOnly}
        setTeeOnly={setTeeOnly}
      />

      {/* Sort and Results Info */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div className="text-sm text-gray-400">
          Found <span className="text-white font-semibold">{filtered.length}</span> models
          {favorites.size > 0 && (
            <span className="ml-4 text-indigo-400">
              ★ {favorites.size} favorite{favorites.size !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <SortDropdown sortBy={sortBy} onSortChange={setSortBy} />
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {paginated.map((model, index) => (
          <div
            key={model.id}
            className="relative"
            style={{ animation: `fadeIn 0.5s ease-out ${index * 50}ms forwards`, opacity: 0 }}
          >
            <ModelCard model={model} onClick={() => setSelectedModel(model)} />
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleFavorite(model.id)
              }}
              className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all z-10"
            >
              <svg
                className={`w-5 h-5 transition-colors ${
                  favorites.has(model.id) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
                }`}
                fill={favorites.has(model.id) ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && !loading && (
        <p className="text-center text-gray-400 mt-12 text-lg">
          No models found
        </p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filtered.length}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      )}

      {/* Modal */}
      <ModelModal model={selectedModel} onClose={() => setSelectedModel(null)} />

      {/* Footer */}
      <footer className="text-center mt-16 pt-8 border-t border-white/10 text-gray-500 text-sm">
        OpenGradient Model Hub - Verifiable AI on Blockchain
      </footer>
    </div>
  )
}
