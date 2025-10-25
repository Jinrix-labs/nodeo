/**
 * Cost Calculator Component
 * Shows users the actual costs of using AI features
 */

interface CostCalculatorProps {
    isVisible: boolean;
    onClose: () => void;
}

export function CostCalculator({ isVisible, onClose }: CostCalculatorProps) {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-2xl p-6 max-w-2xl mx-4 border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-slate-100">💰 AI Usage Costs</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-200 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="bg-slate-700 rounded-lg p-4">
                        <h3 className="font-medium text-slate-200 mb-2">Current Model: GPT-4o Mini</h3>
                        <div className="text-sm text-slate-300 space-y-1">
                            <div>• Input: $0.15 per 1M tokens</div>
                            <div>• Output: $0.60 per 1M tokens</div>
                            <div>• ~4x cheaper than GPT-4!</div>
                        </div>
                    </div>

                    <div className="bg-slate-700 rounded-lg p-4">
                        <h3 className="font-medium text-slate-200 mb-2">Real Usage Examples</h3>
                        <div className="text-sm text-slate-300 space-y-2">
                            <div className="flex justify-between">
                                <span>Typical hint request:</span>
                                <span className="text-green-400">~$0.001-0.003</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Heavy usage (100 hints/day):</span>
                                <span className="text-green-400">~$0.30/day</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Monthly (3000 hints):</span>
                                <span className="text-green-400">~$9/month</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-700">
                        <h3 className="font-medium text-blue-300 mb-2">💡 Cost-Saving Tips</h3>
                        <div className="text-sm text-blue-200 space-y-1">
                            <div>• AI hints only generate when tests fail</div>
                            <div>• Basic hints are always free</div>
                            <div>• You can disable AI in your .env file</div>
                            <div>• Set usage limits in OpenAI dashboard</div>
                        </div>
                    </div>

                    <div className="bg-amber-900/30 rounded-lg p-4 border border-amber-700">
                        <h3 className="font-medium text-amber-300 mb-2">⚠️ Important Notes</h3>
                        <div className="text-sm text-amber-200 space-y-1">
                            <div>• Always set up billing alerts in OpenAI</div>
                            <div>• Start with a small budget ($5-10)</div>
                            <div>• Monitor usage in OpenAI dashboard</div>
                            <div>• You can switch to even cheaper models if needed</div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-slate-600 hover:bg-slate-500 text-slate-200 px-4 py-2 rounded-lg transition-colors"
                        >
                            Got it!
                        </button>
                        <a
                            href="https://platform.openai.com/usage"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-center"
                        >
                            View Usage Dashboard
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
