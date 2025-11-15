using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
namespace RescueLink.API.Models
{
    public class ApplicationUser : IdentityUser
    {
        [StringLength(100)]
        public string FullName { get; set; }
    }
}
