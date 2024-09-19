import React, { useState, useEffect } from 'react';
import useAxiosInstance from '../../../axiosConfig'; // Adjust path as needed
import { IoFilter } from "react-icons/io5";
import { useSelector,useDispatch } from 'react-redux';
import { MdFormatListBulletedAdd } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { getGenreNames, getLanguageName } from '../../../utils/genreAndLanguageUtils';
import AdminFilterMovies from './AdminFilterMovies';
import Loading from './Loading';


function AdminAddMovies() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const axiosInstance = useAxiosInstance();
  const [searchInput,setSearchInput] = useState("")
  const filter = useSelector((state) => state.adminfilter)
  const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY
  console.log("api kek",TMDB_API_KEY)

  const dispatch = useDispatch()
  const navigate = useNavigate();

    // Dropdown states
    const [languageDropdown, setLanguageDropdown] = useState(false);
    const [genreDropdown, setGenreDropdown] = useState(false);
  
    // Selected filter states
    const [selectedLanguage, setSelectedLanguage] = useState('Lan');
    const [selectedGenre, setSelectedGenre] = useState('Gen');
    const [changeFilter, setChangeFilter] = useState(false)


  // Fetch movies using infinite scrolling
  const fetchMovies = async () => {
    if (loading) return; // Prevent multiple API calls at once
    setLoading(true);
    if (changeFilter){
      setPage(1)
    }
    try {
      const response = await axiosInstance.get(
        `https://api.themoviedb.org/3/discover/movie?with_original_language=${filter.language}&with_genres=${filter.genre}&sort_by=release_date.desc&api_key=${TMDB_API_KEY}&page=${page}&region=IN`
      );

      if (response.status === 200) {
        const fetchedMovies = response.data.results;

        // If less than 12 movies are returned, it means there are no more pages
        if (fetchedMovies.length < 12) {
          setHasMore(false); // No more data to fetch
        }

        if (changeFilter){
          setMovies(fetchedMovies)
          
          setChangeFilter(false)
        }else{
        // Append new movies to the current list
        setMovies((prevMovies) => [...prevMovies, ...fetchedMovies]);
        }
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchMovies();
    
  }, [filter.language,filter.genre]);


  useEffect(() => {
    const handleScroll = () => {
      // Check if the user is near the bottom of the page
      if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight && hasMore) {
        setPage((prevPage) => prevPage + 1); // Increment page number to load next set of movies
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll); // Cleanup scroll listener on component unmount
  }, [hasMore]);

  // Fetch new movies when page changes
  useEffect(() => {
    if (page > 1) {
      fetchMovies();
    }
  }, [page]);


  const handleSearch = async (e) => {
    setLoading(true)
    setSearchInput(e.target.value)
    console.log('object')
    try{
      const response = await axiosInstance.get(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${searchInput}`)
      console.log("response",response)
      if (response.status === 200){
        setMovies(response.data.results);
      }
    }catch(error){
      console.log("Error fetching movies:", error);
    }finally{
      setLoading(false)
    }
  }


  const handleShowDetails = (movieId) => {
    navigate(`/admin/addmovie-datail/${movieId}`)
  }
  return (
    <div className="admin-add-movies p-4">
      {/* Top left heading and search with filters */}
      <div className="fixed left-0 top-16 w-full bg-white z-10 p-4  shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Explore Movies</h1>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search movies"
              className="border rounded-lg p-2 mr-4"
              value={searchInput}
              onChange={(e) => handleSearch(e)}
            />
            <IoFilter size={27} className='mr-5'/>
            
            
          <AdminFilterMovies {...{setLanguageDropdown, languageDropdown, selectedLanguage, setSelectedLanguage, setChangeFilter, setGenreDropdown, genreDropdown, selectedGenre,
            setSelectedGenre,filter 
          }} />
            
          </div>
        </div>
      </div>

      {/* Movie cards in a grid */}
      <div className="grid grid-cols-6 gap-10 p-10 mt-16">
  {movies
    .filter(movie => movie.poster_path) // Filter out movies without a poster
    .map((movie, index) => (
      <div
        key={`${movie.id}-${index}`}
        className="relative group bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 transform hover:scale-105 hover:shadow-xl cursor-pointer"
        onClick={() => handleShowDetails(movie.id)} // Trigger function on click
      >
        {/* Movie Poster */}
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full h-80 object-cover"
        />

        {/* Hover effect - Add Movie Button */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex flex-col items-center justify-end p-4">
        

          <button className="flex items-center gap-4 bg-secondary text-black px-6 py-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <MdFormatListBulletedAdd size={22}/>
            
          </button>
        </div>

        {/* Movie title, genre, and language */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-800">{movie.title}</h3>
          <p className="text-sm text-gray-600">{getGenreNames(movie.genre_ids)}</p>
          <p className="text-sm text-gray-600">{getLanguageName(movie.original_language)}</p>
        </div>

        {/* Highlight border on hover */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-secondary transition-all duration-300 rounded-lg"></div>
      </div>
    ))}
</div>


    <Loading loading={loading}/>

      {!hasMore && <p>No more movies to display</p>}
    </div>
  );
}

export default AdminAddMovies;