import { useState, useEffect } from 'react';
import { MovieForm } from "./MovieForm";

export default function App() {
    const [movies, setMovies] = useState([]);
    const [actors, setActors] = useState([]);
    const [editingMovie, setEditingMovie] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchMovies = () => {
        fetch('http://localhost:5000/api/movies')
            .then(res => res.json())
            .then(data => setMovies(data));
    };

    const fetchActors = () => {
        fetch('http://localhost:5000/api/movies/actors')
            .then(res => res.json())
            .then(data => setActors(data));
    };

    useEffect(() => {
        Promise.all([fetchMovies(), fetchActors()]).then(() => setLoading(false));
    }, []);

    // CREATE / UPDATE
    const handleSaveMovie = (movieData) => {
        if (editingMovie) {
            // PUT
            fetch(`http://localhost:5000/api/movies/${editingMovie.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(movieData)
            }).then(() => {
                setEditingMovie(null);
                fetchMovies();
            });
        } else {
            // POST
            fetch('http://localhost:5000/api/movies', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(movieData)
            }).then(() => fetchMovies());
        }
    };

    // DELETE
    const handleDeleteMovie = (id) => {
        if (window.confirm('Сигурни ли сте, че искате да изтриете този филм?')) {
            fetch(`http://localhost:5000/api/movies/${id}`, { method: 'DELETE' })
                .then(() => fetchMovies());
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>🎬 Каталог Филми и Актьори (CRUD)</h1>

            <MovieForm
                onSubmit={handleSaveMovie}
                editingMovie={editingMovie}
                onCancel={() => setEditingMovie(null)}
                availableActors={actors}
            />

            {loading ? <p>Зареждане...</p> : movies.map(movie => (
                <MovieCard
                    key={movie.id}
                    movie={movie}
                    onDelete={handleDeleteMovie}
                    onEdit={m => setEditingMovie(m)}
                />
            ))}
        </div>
    );
}

import { ActorList } from './ActorList';

export function MovieCard({ movie, onDelete, onEdit }) {
    return (
        <div style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px',
            backgroundColor: '#f9f9f9',
            color: '#333',
            position: 'relative'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, color: '#1a1a1a' }}>
                    {movie.title} <span style={{ fontSize: '0.8em', color: '#666' }}>({movie.releaseYear})</span>
                </h2>
                <div>
                    <button onClick={() => onEdit(movie)} style={{ marginRight: '8px', padding: '4px 8px', cursor: 'pointer' }}>✏️ Редактирай</button>
                    <button onClick={() => onDelete(movie.id)} style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>🗑️ Изтрий</button>
                </div>
            </div>
            <ActorList actors={movie.actors} />
        </div>
    );
}
