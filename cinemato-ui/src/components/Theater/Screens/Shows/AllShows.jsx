import React, { useEffect, useState } from "react";
import Loading from "../../../Admin/AdminAddMovies/Loading";
import useAxiosInstance from "../../../../axiosConfig";
import { IoIosArrowBack,IoIosArrowForward } from "react-icons/io";
import { useDispatch } from "react-redux";
import { setContent } from "../../../../slices/OwnerScreenSlice";
import { setScreen } from "../../../../slices/screenFullDetailsSlice";

const AllShows = ({ screenId }) => {
    const [selectedDateIndex, setSelectedDateIndex] = useState(0);
    const [loading, setLoading] = useState(true)
    const [showData, setShowData] = useState([])
    const axiosInstance = useAxiosInstance()
    const [dates, setDates] = useState([]);
    const dispatch = useDispatch()





    const formatDate = (date) => {
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        return {
            day: dayNames[date.getDay()],
            date: date.getDate().toString().padStart(2, '0'),
            month: monthNames[date.getMonth()],
            year: date.getFullYear(),
        };
    };


    const generateDateRange = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const dateArray = [];

        while (startDate <= endDate) {
            dateArray.push(formatDate(new Date(startDate)));
            startDate.setDate(startDate.getDate() + 1);
        }

        return dateArray;
    };




    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const response = await axiosInstance.get(`screen/get-movie-schedule/${screenId}`);
                if (response.status === 200) {
                    const { startDate, endDate } = response.data.data;
                    const dates = generateDateRange(startDate, endDate);
                    setDates(dates);
                } else {
                    console.error("Failed to fetch schedule:", response);
                }
            } catch (error) {
                console.error("An error occurred while fetching the schedule:", error);
            }
        };
        fetchSchedule();
    }, []);

    const formatDateForAPI = (date) => {
        const monthMapping = {
            "Jan": "01", "Feb": "02", "Mar": "03", "Apr": "04",
            "May": "05", "Jun": "06", "Jul": "07", "Aug": "08",
            "Sep": "09", "Oct": "10", "Nov": "11", "Dec": "12"
        };
        return `${date.year}-${String(date.date).padStart(2, '0')}-${monthMapping[date.month] || "01"}`; // Map months or use more dynamic logic
    };

    console.log('show datasss:', showData)
    useEffect(() => {
        if (dates.length > 0) {
            console.log("hererererer")
            setLoading(true)
            const fetchAllTime = async () => {
                console.log("selected dates: ",dates[selectedDateIndex])
                try {
                    const formattedDate = formatDateForAPI(dates[selectedDateIndex]);
                    console.log("formatted dateee: ",formattedDate)
                    const response = await axiosInstance.get(`screen/dated-screen-time/${screenId}/${formattedDate}/`);
                    if (response.status === 200) {
                        const showTimeEntries = Object.values(response.data.data)
                        console.log("show time entries: ",showTimeEntries)
                        const times = showTimeEntries.map((showtimeEntry) => {
                            return {
                                time: showtimeEntry.time.start_time.slice(0, 5),
                                movie: showtimeEntry.movie !== "None" ? showtimeEntry.movie : null,
                            };
                        });

                        setShowData(times);
                    } else {
                        console.error("error response", response);
                    }
                } catch (error) {
                    console.error("something went wrong", error);
                }
                setLoading(false)
            };

            fetchAllTime();
        }
    }, [dates, selectedDateIndex]);





    const handleDateChange = (index) => {
        setSelectedDateIndex(index);
    };

    const scrollLeft = () => {
        setSelectedDateIndex((prev) => Math.max(prev - 1, 0));
    };

    const scrollRight = () => {
        setSelectedDateIndex((prev) => Math.min(prev + 1, dates.length - 1));
    };

    const selectedDate = dates[selectedDateIndex];

    console.log("selected date: ", selectedDate)


    const convertTo12HourFormat = (timeString) => {
        console.log("conatetefefe time", timeString)
        // Assuming timeString is in "HH:mm:ss" or "HH:mm" format
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const adjustedHour = hour % 12 || 12; // Convert 0 to 12 for AM times
        return `${adjustedHour}:${minutes} ${ampm}`;
    };

    return (
        <div className="p-6 font-sans">
            <div className="flex items-center justify-between mb-6">
            <button 
  onClick={scrollLeft} 
  className="p-2 bg-gray-100 rounded-full shadow-md hover:bg-gray-200 hover:shadow-lg transition-all duration-200 ease-in-out"
>
  <IoIosArrowBack className="text-2xl text-gray-600" />
</button>
                <div className="flex overflow-x-auto space-x-4 scrollbar-hide">
                    {dates.map((date, index) => (
                        <div
                            key={index}
                            className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer ${selectedDateIndex === index ? "bg-primary text-white" : "bg-white text-gray-700"
                                }`}
                            onClick={() => handleDateChange(index)}
                        >
                            <p className="text-lg font-semibold">{date.day}</p>
                            <p className="text-xl font-bold">{date.date}</p>
                            <p className="text-sm">{date.month}</p>
                            <p className="text-xs">{date.year}</p>
                        </div>
                    ))}
                </div>
                <button 
  onClick={scrollRight} 
  className="p-2 bg-gray-100 rounded-full shadow-md hover:bg-gray-200 hover:shadow-lg transition-all duration-200 ease-in-out"
>
  <IoIosArrowForward className="text-2xl text-gray-600" />
</button>
            </div>

            <div className="mt-6">
                {showData.length === 0 ? (
                    <p className="text-gray-600">
                        No movies running on this date. Please select another date.
                    </p>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {showData.map((show, index) => (
                            <div
                                key={index}
                                className="relative p-6 border rounded-lg shadow-lg border-gray-200 bg-white flex flex-col items-center transition-transform transform hover:scale-105"
                            >
                                {show.movie && ( // Check if show.movie exists
                                    <>
                                    {console.log("moie imagefegeg",show.movie.backdrop_path)}
                                    
                                        <img
                                              src={show.movie.backdrop_path && show.movie.backdrop_path !== 'null' 
                                                ? `https://image.tmdb.org/t/p/w500${show.movie.backdrop_path}` 
                                                : '/assets/coming-soon-word-metallic-text-style_53876-124845.avif'} 
                                            alt={show.movie.title}
                                            className="w-full h-48 rounded-md object-cover mb-4 transition-transform transform hover:scale-110"
                                        />
                                        <div className="flex flex-col items-center text-center">
                                            <div className="movie-details">
                                                <h3 className="text-xl font-bold text-gray-700">{show.movie.title}</h3>
                                                <p className="text-gray-500 my-2">{show.movie.genres.map(genre => genre.name).join(', ')}</p>
                                                <p className="text-sm text-gray-400">{show.movie.languages.map(lang => lang.name).join(', ')}</p>
                                            </div>

                                            <p className="flex items-center justify-center bg-[#E8F5E9] text-[#177D23] font-medium rounded-full px-6 py-2 mt-2 border border-[#177D23] shadow-sm hover:shadow-lg transform hover:scale-105 transition-all duration-200 ease-in-out"
                                                onClick={() => {dispatch(setContent({subContent:"show-layout"})) ; dispatch(setScreen({showScreenBacic:{"time":show.time,"date":dates[selectedDateIndex],"screen_id":screenId}}))   }}
                                            >
                                                <svg className="w-5 h-5 mr-2 text-[#177D23]" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 4a8 8 0 108 8 8 8 0 00-8-8zm0 14.5a6.5 6.5 0 116.5-6.5 6.5 6.5 0 01-6.5 6.5zm-.25-9.25v3.5H15v1.5h-4.75V9.25z" />
                                                </svg>
                                                {convertTo12HourFormat(show.time)}
                                            </p>
                                        </div>

                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                )}
            </div>
        </div>
    );
};

export default AllShows;