import React, { useState, useEffect, useRef } from 'react';
import WeatherApp from './weather';

interface City {
  geoname_id: number;
  name: string;
  cou_name_en: string;
  ascii_name: string;
  alternate_names: string[];
  population: number;
  timezone: string;
}

function App() {
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [currentCity, setCurrentCity] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [showWeather, setShowWeather] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const observer = useRef<IntersectionObserver | null>(null);
  const bottomBoundaryRef = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    fetchCities();
  }, [page]);

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1 }
    );

    if (bottomBoundaryRef.current) {
      observer.current.observe(bottomBoundaryRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  const fetchCities = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=20&offset=${(page - 1) * 20}`
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setCities((prevCities) => [...prevCities, ...data.results]);
    } catch (error) {
      setError('Error fetching data');
      console.error('Error fetching data: ', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCityClick = async (cityName: string) => {
    console.log(`Clicked on ${cityName}`);
    setCurrentCity(cityName);
    try {
      const response = await fetchWeather(cityName);
      setWeatherData(response);
      setError(null);
      setShowWeather(true); // Show weather details
    } catch (error) {
      setError('Could not fetch weather data. Please try again.');
    }
  };

  const fetchWeather = async (cityName: string) => {
    const API_KEY = 'a778f1d4940b722a52fa4fae3c325ee8';
    const API_URL = 'https://api.openweathermap.org/data/2.5/weather';
    const response = await fetch(`${API_URL}?q=${cityName}&appid=${API_KEY}&units=metric`);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  const handleBack = () => {
    setShowWeather(false);
  };

  const handleSearch = () => {
    // Perform search based on searchQuery
    // For simplicity, let's filter cities array by name
    const filteredCities = cities.filter((city) =>
      city.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setCities(filteredCities);
  };

  return (
    <div>
      {showWeather ? (
        <WeatherApp cityName={currentCity!} weatherData={weatherData} onBack={handleBack} />
      ) : (
        <div>
          <input
            type="text"
            placeholder="Search a city"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
          <table className="shadow-lg bg-white border-collapse">
            <thead>
              <tr>
                <th className="bg-blue-100 border text-left px-8 py-4">Geoname ID</th>
                <th className="bg-blue-100 border text-left px-8 py-4">Name</th>
                <th className="bg-blue-100 border text-left px-8 py-4">Country Name</th>
                <th className="bg-blue-100 border text-left px-8 py-4">ASCII Name</th>
                <th className="bg-blue-100 border text-left px-8 py-4">Alternate Names</th>
                <th className="bg-blue-100 border text-left px-8 py-4">Population</th>
                <th className="bg-blue-100 border text-left px-8 py-4">Timezone</th>
              </tr>
            </thead>
            <tbody>
              {cities.map((city, index) => (
                <tr key={city.geoname_id} className="hover:bg-gray-50 focus:bg-gray-300 city">
                  <td className="border px-8 py-4">{city.geoname_id}</td>
                  <td>
                    <button onClick={() => handleCityClick(city.name)} className="cursor-pointer hover:text-blue-500">
                      {city.ascii_name}
                    </button>
                  </td>
                  <td className="border px-8 py-4">{city.cou_name_en}</td>
                  <td className="border px-8 py-4">{city.name}</td>
                  <td className="border px-8 py-4">
                    {city.alternate_names ? city.alternate_names.slice(0, 3).join(', ') + '...' : ''}
                  </td>
                  <td className="border px-8 py-4">{city.population}</td>
                  <td className="border px-8 py-4">{city.timezone}</td>
                </tr>
              ))}
              {/* Add a reference to the last row */}
              <tr ref={bottomBoundaryRef} style={{ height: '1px' }}></tr>
            </tbody>
          </table>
        </div>
      )}
      {isLoading && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </div>
  );
}

export default App;
