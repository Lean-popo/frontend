using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Coffee.Data;
using Coffee.Models;

namespace Coffee.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Tags("Cấu hình hệ thống")]
    public class ConfigsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ConfigsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Configs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Config>>> GetConfigs()
        {
            return await _context.Configs.ToListAsync();
        }

        // GET: api/Configs/ShopName
        [HttpGet("{key}")]
        public async Task<ActionResult<Config>> GetConfig(string key)
        {
            var config = await _context.Configs.FindAsync(key);

            if (config == null)
            {
                return NotFound();
            }

            return config;
        }

        // PUT: api/Configs/ShopName
        [HttpPut("{key}")]
        public async Task<IActionResult> PutConfig(string key, Config config)
        {
            if (key != config.Key)
            {
                return BadRequest();
            }

            _context.Entry(config).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ConfigExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        private bool ConfigExists(string key)
        {
            return _context.Configs.Any(e => e.Key == key);
        }
    }
}
