# 💰 OpenAI API Costs for Nodeo

## Current Setup (GPT-4o Mini)

- **Input**: $0.15 per 1M tokens
- **Output**: $0.60 per 1M tokens
- **~4x cheaper than GPT-4!**

## Real Usage Examples

### Typical Hint Request

- **Input tokens**: ~200-400 (code + context)
- **Output tokens**: ~100-200 (hints)
- **Cost per request**: ~$0.001-0.003
- **Very affordable!**

### Daily Usage Scenarios

- **Light usage** (10 hints/day): ~$0.03/day
- **Moderate usage** (50 hints/day): ~$0.15/day  
- **Heavy usage** (100 hints/day): ~$0.30/day

### Monthly Costs

- **Light**: ~$1/month
- **Moderate**: ~$5/month
- **Heavy**: ~$9/month

## Even Cheaper Options

### GPT-3.5 Turbo (if you want to go cheaper)

```typescript
// In src/services/aiService.ts, change:
model: 'gpt-3.5-turbo' // Even cheaper!
```

- **Input**: $0.50 per 1M tokens
- **Output**: $1.50 per 1M tokens
- **~3x cheaper than GPT-4o Mini**

### Cost Comparison

| Model | Input Cost | Output Cost | Quality | Best For |
|-------|------------|-------------|---------|----------|
| GPT-4 | $5.00/1M | $15.00/1M | Excellent | Complex tasks |
| GPT-4o Mini | $0.15/1M | $0.60/1M | Very Good | Most use cases |
| GPT-3.5 Turbo | $0.50/1M | $1.50/1M | Good | Budget-friendly |

## Cost-Saving Tips

### 1. **Set Usage Limits**

- Go to [OpenAI Dashboard](https://platform.openai.com/usage)
- Set monthly spending limits
- Enable billing alerts

### 2. **Optimize Prompts**

- Current prompts are already optimized
- AI only runs when tests fail
- Basic hints are always free

### 3. **Monitor Usage**

- Check usage dashboard regularly
- Start with $5-10 budget
- Scale up as needed

### 4. **Alternative Models**

If you want even cheaper options:

```typescript
// Ultra-budget option
model: 'gpt-3.5-turbo'

// Or disable AI entirely
// Just comment out the AI service calls
```

## Setup Your API Key

1. **Get API Key**:
   - Visit [OpenAI Platform](https://platform.openai.com/)
   - Create account or sign in
   - Go to API Keys section
   - Create new key

2. **Add to Environment**:

   ```bash
   # Create .env file
   VITE_OPENAI_API_KEY=your_key_here
   ```

3. **Set Billing**:
   - Add payment method
   - Set usage limits ($5-10 to start)
   - Enable alerts

## Why GPT-4o Mini is Perfect

✅ **Cost-effective**: 4x cheaper than GPT-4
✅ **High quality**: Great for educational hints
✅ **Fast responses**: Quick hint generation
✅ **Reliable**: Consistent performance
✅ **Scalable**: Can handle many users

## Budget Recommendations

- **Personal use**: Start with $5/month
- **Small class**: $10-20/month  
- **Large deployment**: $50+/month
- **Enterprise**: Custom pricing available

The costs are very reasonable for the value you get! 🚀
