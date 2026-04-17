using System.ComponentModel.DataAnnotations;

namespace Coffee.Models
{
    public class Config
    {
        [Key]
        public string Key { get; set; } = string.Empty;

        [Required]
        public string Value { get; set; } = string.Empty;

        public string? Description { get; set; }
    }
}
