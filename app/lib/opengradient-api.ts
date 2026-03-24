import { Model } from '../data/models'

const API_BASE_URL = 'https://hub.opengradient.ai/api'

export interface FetchModelsParams {
  search?: string
  type?: string
  category?: string
  zkmlOnly?: boolean
  teeOnly?: boolean
  limit?: number
  offset?: number
}

export interface FetchModelsResponse {
  models: Model[]
  total: number
  hasMore: boolean
}

/**
 * Fetch models from OpenGradient Model Hub API
 */
export async function fetchModels(params: FetchModelsParams = {}): Promise<FetchModelsResponse> {
  const {
    search = '',
    type = '',
    category = '',
    zkmlOnly = false,
    teeOnly = false,
    limit = 50,
    offset = 0,
  } = params

  try {
    const queryParams = new URLSearchParams()
    if (search) queryParams.append('search', search)
    if (type && type !== 'All') queryParams.append('type', type)
    if (category && category !== 'All') queryParams.append('category', category)
    if (zkmlOnly) queryParams.append('zkml_verified', 'true')
    if (teeOnly) queryParams.append('tee_attested', 'true')
    queryParams.append('limit', limit.toString())
    queryParams.append('offset', offset.toString())

    const response = await fetch(`${API_BASE_URL}/models?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Cache for 5 minutes
      next: { revalidate: 300 },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.status}`)
    }

    const data = await response.json()
    
    return {
      models: data.models || [],
      total: data.total || 0,
      hasMore: (data.total || 0) > offset + limit,
    }
  } catch (error) {
    console.error('Error fetching models:', error)
    // Return empty result on error
    return {
      models: [],
      total: 0,
      hasMore: false,
    }
  }
}

/**
 * Fetch a single model by ID
 */
export async function fetchModelById(modelId: string): Promise<Model | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/models/${modelId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.model || null
  } catch (error) {
    console.error('Error fetching model:', error)
    return null
  }
}

/**
 * Deploy model to OpenGradient
 */
export async function deployModel(modelData: {
  name: string
  modelPath: string
  modelType: string
  description: string
  tags: string[]
  privateKey: string
}): Promise<{ success: boolean; address?: string; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/models/deploy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(modelData),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to deploy model',
      }
    }

    return {
      success: true,
      address: data.address,
    }
  } catch (error) {
    console.error('Error deploying model:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Run inference on a deployed model
 */
export async function runInference(params: {
  modelAddress: string
  inputData: Record<string, any>
  privateKey: string
}): Promise<{ success: boolean; result?: any; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/inference`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Inference failed',
      }
    }

    return {
      success: true,
      result: data.result,
    }
  } catch (error) {
    console.error('Error running inference:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Get network statistics
 */
export async function getNetworkStats(): Promise<{
  totalModels: number
  totalInferences: number
  zkmlProofs: number
  teeAttestations: number
  activeUsers: number
} | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.stats || null
  } catch (error) {
    console.error('Error fetching stats:', error)
    return null
  }
}
