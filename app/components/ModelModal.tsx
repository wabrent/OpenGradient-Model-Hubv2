'use client'

import { useState } from 'react'
import { Model } from '../data/models'

interface InfoCardProps {
  label: string
  value: string
  highlight?: boolean
  color?: string
}

function InfoCard({ label, value, highlight, color = 'text-white' }: InfoCardProps) {
  return (
    <div className="group bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-xl p-4 hover:border-indigo-500/30 transition-all duration-300 hover:-translate-y-0.5">
      <div className="text-xs text-gray-500 mb-1 font-medium">{label}</div>
      <div className={`text-lg font-semibold ${highlight ? color : 'text-white'} group-hover:text-indigo-400 transition-colors`}>
        {value}
      </div>
    </div>
  )
}

interface ModelModalProps {
  model: Model | null
  onClose: () => void
}

export default function ModelModal({ model, onClose }: ModelModalProps) {
  const [showDeployGuide, setShowDeployGuide] = useState(false)
  const [copiedStep, setCopiedStep] = useState<string | null>(null)

  if (!model) return null

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K'
    }
    return num.toString()
  }

  const copyToClipboard = (text: string, stepId: string) => {
    navigator.clipboard.writeText(text)
    setCopiedStep(stepId)
    setTimeout(() => setCopiedStep(null), 2000)
  }

  const deployCode = `# OpenGradient Model Deployment
# SDK Version: 0.9.0

from opengradient import Client

# Initialize client with your private key
client = Client(private_key="YOUR_PRIVATE_KEY")

# Deploy model to OpenGradient
model = client.deploy_model(
    model_path="./${model.name.toLowerCase().replace(/\s+/g, '_')}.onnx",
    model_type="${model.type}",
    description="${model.description}",
    tags=${JSON.stringify(model.tags)}
)

print(f"Model deployed: {model.address}")`

  const inferCode = `# Run inference with deployed model
from opengradient import Client

client = Client(private_key="YOUR_PRIVATE_KEY")

# Ensure OPG approval for payments
client.ensure_opg_approval(opg_amount=0.1)

# Run inference
result = client.infer(
    model_address="MODEL_ADDRESS",
    input_data={"input": "your_data"}
)

print(f"Result: {result}")`

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-900 border border-white/10 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
      >
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-white">{model.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-3xl leading-none transition-colors"
          >
            ×
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          {model.zkmlVerified && (
            <span className="px-3 py-1.5 bg-indigo-500/20 border border-indigo-500/30 rounded-md text-xs font-semibold text-indigo-400">
              zkML Verified ✓
            </span>
          )}
          {model.teeAttested && (
            <span className="px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-md text-xs font-semibold text-emerald-400">
              TEE Attested ✓
            </span>
          )}
        </div>

        <p className="text-gray-300 mb-6 leading-relaxed">
          {model.description}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <InfoCard label="Type" value={model.type} />
          <InfoCard label="Category" value={model.category} />
          <InfoCard label="Parameters" value={model.parameters} />
          <InfoCard label="Size" value={model.size} />
          <InfoCard label="Accuracy" value={`${model.avgAccuracy}%`} highlight color="text-emerald-400" />
          <InfoCard label="Inferences" value={formatNumber(model.totalInferences)} />
          <InfoCard label="Creator" value={model.creator} />
          <InfoCard label="License" value={model.license} />
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {model.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Deploy Button */}
        <button
          onClick={() => setShowDeployGuide(true)}
          className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
        >
          <span>🚀</span>
          <span>Deploy Model</span>
        </button>

        {/* Deploy Guide Modal */}
        {showDeployGuide && (
          <div
            onClick={() => setShowDeployGuide(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-60"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border border-white/10 rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Deploy {model.name}</h3>
                <button
                  onClick={() => setShowDeployGuide(false)}
                  className="text-gray-400 hover:text-white text-2xl transition-colors"
                >
                  ×
                </button>
              </div>

              {/* Step 1 */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <h4 className="text-lg font-semibold text-white">Preparation</h4>
                </div>
                <div className="bg-gray-800/50 border border-white/10 rounded-xl p-4 ml-11">
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400 mt-1">▸</span>
                      <span>Get <strong>OPG tokens</strong> from <a href="https://faucet.opengradient.ai" target="_blank" className="text-indigo-400 hover:underline">faucet.opengradient.ai</a> (limit: 0.1 OPG)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400 mt-1">▸</span>
                      <span>Get <strong>ETH Base Sepolia</strong> for gas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400 mt-1">▸</span>
                      <span>Install SDK:</span>
                    </li>
                  </ul>
                  <div className="mt-3 bg-black/50 rounded-lg p-3 flex items-center justify-between">
                    <code className="text-sm text-emerald-400">pip install opengradient==0.9.0</code>
                    <button
                      onClick={() => copyToClipboard('pip install opengradient==0.9.0', 'step1-sdk')}
                      className="text-xs px-3 py-1 bg-indigo-600 hover:bg-indigo-500 rounded transition-colors"
                    >
                      {copiedStep === 'step1-sdk' ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <h4 className="text-lg font-semibold text-white">Wallet Setup</h4>
                </div>
                <div className="bg-gray-800/50 border border-white/10 rounded-xl p-4 ml-11">
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400 mt-1">▸</span>
                      <span>Create a new wallet (do NOT use your main wallet!)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400 mt-1">▸</span>
                      <span>Add private key to <code className="bg-black/30 px-2 py-0.5 rounded">.env</code>:</span>
                    </li>
                  </ul>
                  <div className="mt-3 bg-black/50 rounded-lg p-3 flex items-center justify-between">
                    <code className="text-sm text-emerald-400">OG_PRIVATE_KEY=your_private_key_here</code>
                    <button
                      onClick={() => copyToClipboard('OG_PRIVATE_KEY=your_private_key_here', 'step2-env')}
                      className="text-xs px-3 py-1 bg-indigo-600 hover:bg-indigo-500 rounded transition-colors"
                    >
                      {copiedStep === 'step2-env' ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                  <p className="mt-3 text-sm text-amber-400">
                    ⚠️ <strong>Important:</strong> You must complete Permit2 approval to enable OPG token spending
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <h4 className="text-lg font-semibold text-white">Deploy Model</h4>
                </div>
                <div className="bg-gray-800/50 border border-white/10 rounded-xl p-4 ml-11">
                  <p className="text-gray-300 mb-3">Deployment code example:</p>
                  <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-gray-300">
                      <code>{deployCode}</code>
                    </pre>
                  </div>
                  <button
                    onClick={() => copyToClipboard(deployCode, 'step3-deploy')}
                    className="mt-3 text-xs px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded transition-colors"
                  >
                    {copiedStep === 'step3-deploy' ? '✓ Copied' : 'Copy Code'}
                  </button>
                </div>
              </div>

              {/* Step 4 */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">
                    4
                  </div>
                  <h4 className="text-lg font-semibold text-white">Run Inference</h4>
                </div>
                <div className="bg-gray-800/50 border border-white/10 rounded-xl p-4 ml-11">
                  <p className="text-gray-300 mb-3">Inference example:</p>
                  <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-gray-300">
                      <code>{inferCode}</code>
                    </pre>
                  </div>
                  <button
                    onClick={() => copyToClipboard(inferCode, 'step4-infer')}
                    className="mt-3 text-xs px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded transition-colors"
                  >
                    {copiedStep === 'step4-infer' ? '✓ Copied' : 'Copy Code'}
                  </button>
                </div>
              </div>

              {/* Resources */}
              <div className="bg-gradient-to-r from-indigo-900/30 to-violet-900/30 border border-indigo-500/30 rounded-xl p-6 mb-6">
                <h4 className="text-lg font-semibold text-white mb-4">📚 Resources</h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="https://docs.opengradient.ai/developers/x402/"
                      target="_blank"
                      className="text-indigo-400 hover:underline flex items-center gap-2"
                    >
                      <span>📖</span>
                      x402 Gateway Documentation
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://docs.opengradient.ai/developers/sdk/llm.html"
                      target="_blank"
                      className="text-indigo-400 hover:underline flex items-center gap-2"
                    >
                      <span>📖</span>
                      SDK LLM Documentation
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/OpenGradient/OpenGradient-SDK/tree/main/examples"
                      target="_blank"
                      className="text-indigo-400 hover:underline flex items-center gap-2"
                    >
                      <span>💻</span>
                      GitHub Examples
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://hub.opengradient.ai/"
                      target="_blank"
                      className="text-indigo-400 hover:underline flex items-center gap-2"
                    >
                      <span>🔗</span>
                      OpenGradient Model Hub
                    </a>
                  </li>
                </ul>
              </div>

              {/* Known Issues */}
              <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-4 mb-6">
                <h4 className="text-lg font-semibold text-amber-400 mb-2">⚠️ Known Issues</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span><strong>DNS Issues:</strong> <code className="bg-black/30 px-1.5 py-0.5 rounded text-amber-300">llm.opengradient.ai</code> may not resolve. Use IP: <code className="bg-black/30 px-1.5 py-0.5 rounded text-amber-300">3.15.214.21</code></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span><strong>402 Payment Required:</strong> Ensure you have OPG tokens and Permit2 approval is set</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span><strong>Faucet Limit:</strong> 0.1 OPG per request, ~3 hour cooldown</span>
                  </li>
                </ul>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowDeployGuide(false)}
                className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
