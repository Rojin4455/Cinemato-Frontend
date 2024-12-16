import React from "react";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import Select from "react-select";
import { FaLocationArrow } from "react-icons/fa6";

function PlacesAutoComplete({ setTheaterData, theaterData }) {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({});

  // Handle address selection
  const handleSelect = async (selectedOption) => {
    const address = selectedOption.label;
    setValue(address, false); // Update the input value
    clearSuggestions(); // Clear suggestions list

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);

      setTheaterData({
        ...theaterData,
        address: address,
        lat: lat,
        lng: lng,
      });
    } catch (error) {
      console.error("Error fetching geocode or lat/lng", error);
    }
  };

  // Map suggestions to options format for React-Select
  const options =
    status === "OK"
      ? data.map(({ description, place_id }) => ({
          label: description,
          value: place_id,
        }))
      : [];

  // Styling for React-Select
  const customStyles = {
    control: (provided) => ({
      ...provided,
      paddingLeft: "2.5rem", // Space for the icon
      borderColor: "#d1d5db",
      height: "40px",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#2563eb",
      },
    }),
    input: (provided) => ({
      ...provided,
      margin: "0",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#9ca3af",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#374151",
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 50,
    }),
  };

  if (!ready) {
    return <p>Loading Google Maps API...</p>;
  }

  return (
    <div className="relative flex items-center">
      {/* Icon */}
      <FaLocationArrow className="absolute left-3 text-gray-400" />
      {/* Dropdown */}
      <Select
        options={options} // Provide suggestions as options
        onChange={handleSelect} // Handle selection
        styles={customStyles} // Apply custom styles
        isDisabled={!ready} // Disable if API isn't ready
        placeholder="Select Your Location"
        className="w-full" // Adjust width to match container
        value={value ? { label: value, value: value } : null} // Sync selected value
        onInputChange={(inputValue) => setValue(inputValue)} // Update value on input change
      />
    </div>
  );
}

export default PlacesAutoComplete;
