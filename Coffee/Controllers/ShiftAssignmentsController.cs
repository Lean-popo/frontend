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
    public class ShiftAssignmentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ShiftAssignmentsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/ShiftAssignments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ShiftAssignment>>> GetShiftAssignments()
        {
            return await _context.ShiftAssignments.Include(s => s.User).Include(s => s.Shift).ToListAsync();
        }

        // GET: api/ShiftAssignments/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ShiftAssignment>> GetShiftAssignment(int id)
        {
            var shiftAssignment = await _context.ShiftAssignments.Include(s => s.User).Include(s => s.Shift).FirstOrDefaultAsync(m => m.Id == id);

            if (shiftAssignment == null)
            {
                return NotFound();
            }

            return shiftAssignment;
        }

        // PUT: api/ShiftAssignments/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutShiftAssignment(int id, ShiftAssignment shiftAssignment)
        {
            if (id != shiftAssignment.Id)
            {
                return BadRequest();
            }

            _context.Entry(shiftAssignment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ShiftAssignmentExists(id))
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

        // POST: api/ShiftAssignments
        [HttpPost]
        public async Task<ActionResult<ShiftAssignment>> PostShiftAssignment(ShiftAssignment shiftAssignment)
        {
            _context.ShiftAssignments.Add(shiftAssignment);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetShiftAssignment", new { id = shiftAssignment.Id }, shiftAssignment);
        }

        // DELETE: api/ShiftAssignments/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteShiftAssignment(int id)
        {
            var shiftAssignment = await _context.ShiftAssignments.FindAsync(id);
            if (shiftAssignment == null)
            {
                return NotFound();
            }

            _context.ShiftAssignments.Remove(shiftAssignment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ShiftAssignmentExists(int id)
        {
            return _context.ShiftAssignments.Any(e => e.Id == id);
        }
    }
}
