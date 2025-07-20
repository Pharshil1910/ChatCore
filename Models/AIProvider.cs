using System;
using System.Text.Json;
using Newtonsoft.Json;

namespace ChatCore.Models
{
    public interface IAIProvider
    {
        Task<string> GenerateResponseAsync(string prompt);
    }

    public class HuggingFaceProvider : IAIProvider
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public HuggingFaceProvider(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            // Get API key from configuration
            _apiKey = configuration["HuggingFace:ApiKey"] ?? 
                     Environment.GetEnvironmentVariable("HUGGINGFACE_API_KEY") ?? 
                     throw new InvalidOperationException("HuggingFace API key not found in configuration or environment variables.");
            
            if (!string.IsNullOrEmpty(_apiKey))
            {
                _httpClient.DefaultRequestHeaders.Authorization = 
                    new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _apiKey);
            }
        }

        public async Task<string> GenerateResponseAsync(string prompt)
        {
            try
            {
                var payload = new
                {
                    messages = new[]
                    {
                        new
                        {
                            role = "user",
                            content = prompt
                        }
                    },
                    model = "mistralai/Mistral-7B-Instruct-v0.2"
                };

                var json = System.Text.Json.JsonSerializer.Serialize(payload, new System.Text.Json.JsonSerializerOptions 
                { 
                    PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase 
                });
                
                var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");
                
                var response = await _httpClient.PostAsync("https://router.huggingface.co/v1/chat/completions", content);
                
                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    dynamic obj = JsonConvert.DeserializeObject<dynamic>(responseContent);
                    
                    if (obj?.choices != null && obj.choices.Count > 0)
                    {
                        var firstChoice = obj.choices[0];
                        if (firstChoice?.message?.content != null)
                        {
                            string contentMessage = firstChoice.message.content.ToString();
                            return contentMessage ?? "Sorry, I couldn't generate a response at this time.";
                        }
                    }
                }
                
                return "Sorry, I couldn't generate a response at this time.";
            }
            catch (Exception ex)
            {
                return $"Error: {ex.Message}";
            }
        }
    }

    // Response classes for backward compatibility
    public class HuggingFaceResponse
    {
        public string? GeneratedText { get; set; }
    }
} 