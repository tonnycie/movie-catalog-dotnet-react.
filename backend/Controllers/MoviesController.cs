using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs;

using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MoviesController : ControllerBase
{
    private readonly AppDbContext _context;

    public MoviesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MovieDto>>> GetMovies()
    {
        var movies = await _context.Movies
            .Include(m => m.Actors)
            .Select(m => new MovieDto(
                m.Id,
                m.Title,
                m.ReleaseYear,
                m.Actors.Select(a => new ActorDto(
                    a.Id,
                    a.Name,
                    a.Bio
                )).ToList()
            ))
            .ToListAsync();

        return Ok(movies);
    }
}