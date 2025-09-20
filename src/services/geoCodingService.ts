export async function getWeatherLocation(location: string) {
  const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    location
  )}&count=1&language=en&format=json`;

  try {
    const response = await fetch(geocodingUrl);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch geocoding data. Status: ${response.status}`
      );
    }
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const { latitude, longitude } = data.results[0];
      return { latitude, longitude };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching geocoding data:", error);
    throw error;
  }
}
