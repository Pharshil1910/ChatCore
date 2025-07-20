# ChatCore - AI Chat Bot

A simple ASP.NET Core web application that provides a chat interface for AI language models using free cloud-based APIs.

## Features

- 🤖 **Free AI Integration**: Uses Hugging Face Inference API (30,000 free requests/month)
- 💬 **Real-time Chat**: Simple and clean chat interface
- 🔄 **Multiple AI Models**: Support for different AI models
- 🚀 **Easy Setup**: Minimal configuration required
- 📱 **Responsive Design**: Works on desktop and mobile

## Free AI Models Available

### 1. Hugging Face Inference API (Recommended)
- **Free Tier**: 30,000 requests/month
- **Models**: Mistral-7B, DialoGPT, GPT-2, and more
- **Quality**: Excellent
- **Setup**: Requires free API key

### 2. Google Gemini API
- **Free Tier**: 1,500 requests/day
- **Quality**: Very good
- **Setup**: Requires Google Cloud account

### 3. OpenAI API
- **Free Tier**: $5 credit/month
- **Quality**: Best
- **Setup**: Requires credit card

## Quick Start

### Prerequisites
- .NET 8.0 SDK
- Visual Studio 2022 or VS Code

### Setup with Hugging Face (Recommended)

1. **Get a free API key**:
   - Go to [Hugging Face](https://huggingface.co/)
   - Create a free account
   - Go to Settings → Access Tokens
   - Create a new token

2. **Configure the API key**:
   - Open `appsettings.json` or `appsettings.Development.json`
   - Add your API key to the `HuggingFace:ApiKey` field:
   ```json
   {
     "HuggingFace": {
       "ApiKey": "hf_your_api_key_here",
       "ModelUrl": "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2"
     }
   }
   ```

3. **Run the application**:
   ```bash
   dotnet run
   ```

4. **Open your browser**:
   - Navigate to `https://localhost:7244` or `http://localhost:5185`
   - Start chatting!

## Alternative AI Providers

### Using Google Gemini API

1. **Get API key**:
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a free API key

2. **Add Gemini provider**:
   ```csharp
   // In Program.cs
   builder.Services.AddScoped<IAIProvider, GeminiProvider>();
   ```

3. **Configure in appsettings.json**:
   ```json
   {
     "Gemini": {
       "ApiKey": "your_gemini_api_key"
     }
   }
   ```

### Using OpenAI API

1. **Get API key**:
   - Go to [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create an API key

2. **Add OpenAI provider**:
   ```csharp
   // In Program.cs
   builder.Services.AddScoped<IAIProvider, OpenAIProvider>();
   ```

3. **Configure in appsettings.json**:
   ```json
   {
     "OpenAI": {
       "ApiKey": "sk-your_openai_api_key"
     }
   }
   ```

## Project Structure

```
ChatCore/
├── Controllers/
│   ├── ChatController.cs          # Main chat logic
│   └── HomeController.cs          # Basic MVC controller
├── Models/
│   ├── ChatMessage.cs             # Chat message model
│   ├── ErrorViewModel.cs          # Error handling
│   └── AIProvider.cs              # AI provider interface & implementations
├── Views/
│   ├── Chat/
│   │   └── Index.cshtml          # Chat interface
│   └── Shared/
│       └── _Layout.cshtml        # Main layout
├── Program.cs                     # Application startup
└── appsettings.json              # Configuration
```

## Configuration Options

### Hugging Face Models

You can switch between different models by changing the `ModelUrl`:

- **Mistral-7B**: `mistralai/Mistral-7B-Instruct-v0.2` (Best quality)
- **DialoGPT**: `microsoft/DialoGPT-medium` (Good for chat)
- **GPT-2**: `gpt2` (Basic but reliable)
- **GPT-Neo**: `EleutherAI/gpt-neo-125M` (Lightweight)

### Response Parameters

You can adjust response quality by modifying parameters in `AIProvider.cs`:

```csharp
parameters = new
{
    max_new_tokens = 500,    // Maximum response length
    temperature = 0.7,       // Creativity (0.0-1.0)
    top_p = 0.9,            // Response diversity
    do_sample = true         // Enable sampling
}
```

## Troubleshooting

### Common Issues

1. **"Error: No response"**
   - Check your API key is correct
   - Verify internet connection
   - Try a different model

2. **Slow responses**
   - Hugging Face models may take 10-30 seconds for first request
   - Subsequent requests are faster
   - Consider using a smaller model

3. **API rate limits**
   - Hugging Face: 30,000 requests/month
   - If exceeded, wait until next month or upgrade

### Fallback Options

If one AI provider fails, you can easily switch to another:

```csharp
// In Program.cs, change the provider:
builder.Services.AddScoped<IAIProvider, DialoGPTProvider>();  // Alternative model
// or
builder.Services.AddScoped<IAIProvider, OpenAIProvider>();     // Different service
```

## Scaling Considerations

For production use, consider:

1. **Database Integration**: Store chat history
2. **User Authentication**: Add user accounts
3. **Rate Limiting**: Prevent abuse
4. **Caching**: Cache frequent responses
5. **Multiple Providers**: Fallback if one fails
6. **Monitoring**: Add logging and metrics

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to submit issues and enhancement requests! 