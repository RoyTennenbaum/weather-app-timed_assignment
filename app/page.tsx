'use client';

import { useState, useEffect } from 'react';

import Content from '@/components/Content/Content';
import Search from '@/components/Search/Search';
import { useWeather } from '@/components/Store/WeatherStore/Store';
import { toast } from 'react-toastify';
import { CityProp } from '@/types/global';

export default function Home() {
  const [query, setQuery] = useState('');
  const [cities, setCities] = useState<CityProp[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const { selectedCity, setSelectedCity, currentWeather } = useWeather();

  useEffect(() => {
    const abortController = new AbortController();

    const autoCompleteLocation = async (abortSignal: AbortSignal) => {
      if (query.trim().length === 0) {
        setShowDropdown(false);
        setCities([]);
        return;
      }

      try {
        const response = await fetch(
          `http://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=${process.env.NEXT_PUBLIC_WEATHER_API}&q=${query}`,
          //development: 'http://localhost:3001/cities',
          {
            signal: abortSignal,
          }
        );
        if (!response.ok) {
          toast('Error occured while fetching!');
          throw new Error(
            `Response is not OK: ${response.status}, ${response.statusText}`
          );
        }

        const rawData = await response.json();
        if (!Array.isArray(rawData)) {
          toast('Wrong data type!');
          throw new Error(
            `Response data is not of the expected type: ${rawData}`
          );
        }

        const data: CityProp[] = rawData.map((city: any) => ({
          Key: city.Key,
          LocalizedName: city.LocalizedName,
        }));

        const newCities = data.filter((data) =>
          data.LocalizedName.toLowerCase().includes(query)
        );
        setCities(newCities);
        newCities && newCities.length === 0 && setShowDropdown(false);
      } catch (err) {
        toast('Oops! unexpected error!');
        console.error('Unexpected error:', err);
      }
    };

    const timeout = setTimeout(autoCompleteLocation, 200);

    return () => {
      abortController.abort();
      clearTimeout(timeout);
    };
  }, [query]);

  const handleSearch = (value: string) => {
    setQuery(value);
    setShowDropdown(!!value.trim().length);
  };

  const handleSelectCity = (city: CityProp) => {
    setSelectedCity(city);
    setQuery('');
    setShowDropdown(false);
  };

  return (
    <main className="flex h-full flex-col px-4 md:px-20 lg:px-40 xl:px-60">
      <Search
        onSearch={handleSearch}
        showDropdown={showDropdown}
        cities={cities}
        onSelect={(city: any) => handleSelectCity(city)}
      />
      {currentWeather && (
        <Content
          cityName={selectedCity.LocalizedName}
          currentWeather={currentWeather}
        />
      )}
    </main>
  );
}
