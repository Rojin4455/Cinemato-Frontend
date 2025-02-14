import React from 'react';
import 'tailwindcss/tailwind.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useDispatch,useSelector } from 'react-redux';
import { MdNotificationAdd } from "react-icons/md";
import { setBooking } from '../../../../slices/userBookingSlice';
import { useNavigate } from 'react-router-dom';

function NowShowing({movies}) {
    const scrollRef = React.useRef(null);
    const isLoading = useSelector((state) => state.location.showModal)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    


    const handleMovieDetails = (movieId) => {
        movies.map((movie, index) => {
            if (index === movieId){
                dispatch(setBooking({selectedMovie:movie}))
              navigate('/user/upcoming-movie-details/',{
                state:{
                  movie
                }
              })
            }
          })
    }

    return (
        <>
            <div className="relative px-8 py-5 lg:px-24 bg-gray-100">
                <div className="flex items-center mb-6 mt-10">
                    <hr className="border-t-2 border-gray-300 flex-grow mt-10" />
                    <h1 className="text-2xl font-semibold text-gray-600 mx-4 mt-10">Future Showings</h1>
                    <hr className="border-t-2 border-gray-300 flex-grow mt-10" />
                </div>
                {/* <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
                    <button onClick={scrollLeft} className="bg-white rounded-full shadow-lg p-2 ml-4">
                        <FaChevronLeft size={20} />
                    </button>
                </div> */}
                {/* <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                    <button onClick={scrollRight} className="bg-white rounded-full shadow-lg p-2 mr-4">
                        <FaChevronRight size={20} />
                    </button>
                </div> */}
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto space-x-6 scrollbar-hide "
                    style={{ scrollBehavior: 'smooth', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {isLoading
                        ? Array.from({ length: 5 }).map((_, index) => (
                            <div key={index} className="w-64 h-140 rounded-lg shadow-lg flex-shrink-0">
                                <Skeleton height={384} className="rounded-t-lg" />
                                <div className="p-4">
                                    <Skeleton width={120} height={20} />
                                    <Skeleton width={80} height={16} className="mt-2" />
                                    <Skeleton width={80} height={16} className="mt-2" />
                                    <Skeleton width={100} height={36} className="mt-4" />
                                </div>
                            </div>
                          ))
                        : movies.map((movie, index) => (
                            <div key={index} className="w-64 h-140 rounded-lg flex-shrink-0 bg-gray-100 relative">
                                <img
                                    src={movie.poster_path}
                                    alt={movie.title}
                                    className="w-full h-96 object-cover rounded-t-lg"
                                />
                                <div className="py-4 space-y-4">
                                    <h2 className="text-xl font-semibold">{movie.title}</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {movie.genres.map((genre, index) => (
                                            <span
                                                key={index}
                                                className="text-xs text-gray-600 bg-white rounded-full px-2 py-1"
                                            >
                                                {genre.name}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex flex-wrap gap-1">
                                        {movie.languages.map((language, index) => (
                                            <span
                                                key={index}
                                                className="text-xs text-gray-600 px-2 py-1"
                                            >
                                                {language.name}
                                            </span>
                                        ))}
                                    </div>

                                    <div className='absolute bottom-0 w-full mt-6 flex items-center'>
                                        <button className="bg-white text-primary px-4 py-2 rounded-lg font-semibold border border-gray-500"
                                        onClick={() => handleMovieDetails(index)}

                                        >View Details</button>

                                        {/* <MdNotificationAdd
                                            size={39}
                                            className="ml-3 border border-gray-600 bg-white rounded-lg p-2 hover:bg-secondary transition duration-300"
                                        /> */}
                                    </div>
                                </div>
                            </div>
                          ))
                    }
                </div>
            </div>
        </>
    );
}

export default NowShowing;
