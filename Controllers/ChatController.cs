using Microsoft.AspNetCore.Mvc;

namespace chatMe.Controllers
{
    public class ChatController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
