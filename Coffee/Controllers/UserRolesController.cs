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
    public class UserRolesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserRolesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/UserRoles
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserRole>>> GetUserRoles()
        {
            return await _context.UserRoles.Include(u => u.User).Include(u => u.Role).ToListAsync();
        }

        // GET: api/UserRoles/5/1 (since it's a composite key, we might need two params)
        [HttpGet("{userId}/{roleId}")]
        public async Task<ActionResult<UserRole>> GetUserRole(int userId, int roleId)
        {
            var userRole = await _context.UserRoles.FindAsync(userId, roleId);

            if (userRole == null)
            {
                return NotFound();
            }

            return userRole;
        }

        // POST: api/UserRoles
        [HttpPost]
        public async Task<ActionResult<UserRole>> PostUserRole(UserRole userRole)
        {
            _context.UserRoles.Add(userRole);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (UserRoleExists(userRole.UserId, userRole.RoleId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetUserRole", new { userId = userRole.UserId, roleId = userRole.RoleId }, userRole);
        }

        // DELETE: api/UserRoles/5/1
        [HttpDelete("{userId}/{roleId}")]
        public async Task<IActionResult> DeleteUserRole(int userId, int roleId)
        {
            var userRole = await _context.UserRoles.FindAsync(userId, roleId);
            if (userRole == null)
            {
                return NotFound();
            }

            _context.UserRoles.Remove(userRole);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserRoleExists(int userId, int roleId)
        {
            return _context.UserRoles.Any(e => e.UserId == userId && e.RoleId == roleId);
        }
    }
}
