using ChatCore.Models;
using Microsoft.AspNetCore.Mvc;

namespace ChatCore.Controllers
{
    public class ChatController : Controller
    {
        private readonly IAIProvider _aiProvider;

        public ChatController(IAIProvider aiProvider)
        {
            _aiProvider = aiProvider;
        }

        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<JsonResult> GetBotResponse([FromBody] ChatMessage chat)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(chat.UserMessage))
                {
                    return Json(new { response = "Please provide a message." });
                }

                var response = await _aiProvider.GenerateResponseAsync(chat.UserMessage);
                return Json(new { response = response });
            }
            catch (Exception ex)
            {
                return Json(new { response = $"Error: {ex.Message}" });
            }
        }
    }
}
