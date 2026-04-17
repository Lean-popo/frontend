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
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                .ToListAsync();
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // PUT: api/Users/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, User user)
        {
            if (id != user.Id)
            {
                return BadRequest();
            }

            var existingUser = await _context.Users
                .Include(u => u.UserRoles)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (existingUser == null)
            {
                return NotFound();
            }

            // Update simple properties
            existingUser.Username = user.Username;
            existingUser.FullName = user.FullName;
            existingUser.Phone = user.Phone;
            existingUser.Status = user.Status;
            if (!string.IsNullOrEmpty(user.PasswordHash) && user.PasswordHash != "default_password")
            {
                existingUser.PasswordHash = user.PasswordHash;
            }

            // Update Roles if provided
            if (user.UserRoles != null && user.UserRoles.Any())
            {
                _context.UserRoles.RemoveRange(existingUser.UserRoles);
                foreach (var ur in user.UserRoles)
                {
                    existingUser.UserRoles.Add(new UserRole { UserId = id, RoleId = ur.RoleId });
                }
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
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

        // POST: api/Users
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            // Extract roles to add later or add them to the entity
            var rolesToAdd = user.UserRoles?.ToList();
            user.UserRoles = new List<UserRole>();

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            if (rolesToAdd != null && rolesToAdd.Any())
            {
                foreach (var role in rolesToAdd)
                {
                    _context.UserRoles.Add(new UserRole { UserId = user.Id, RoleId = role.RoleId });
                }
                await _context.SaveChangesAsync();
            }

            return CreatedAtAction("GetUser", new { id = user.Id }, user);
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }
}
