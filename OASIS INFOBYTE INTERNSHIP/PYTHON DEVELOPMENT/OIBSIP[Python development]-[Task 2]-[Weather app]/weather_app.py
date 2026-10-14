


import os
import requests

API_KEY = os.environ.get("OWM_API_KEY", "ec2f55f4161d5627980cf743a27c7c67")
BASE_URL = "https://api.openweathermap.org/data/2.5/weather"


def get_city():
    while True:
        city = input("Enter a city name: ").strip()

        if city:
            return city

        print("Error: City name cannot be empty. Please try again.")


def fetch_weather(city):
    params = {
        "q": city,
        "appid": API_KEY,
        "units": "metric"
    }

    try:
        response = requests.get(
            BASE_URL,
            params=params,
            timeout=10
        )

        if response.status_code == 401:
            print("Error: Invalid API key. Please check your API key.")
            return None

        elif response.status_code == 404:
            print(f"Error: City '{city}' not found. Try another city.")
            return None

        response.raise_for_status()
        return response.json()

    except requests.exceptions.Timeout:
        print("Error: Request timed out. Please try again.")

    except requests.exceptions.ConnectionError:
        print("Error: Unable to connect. Check your internet connection.")

    except requests.exceptions.HTTPError:
        print("Error: Weather service is unavailable. Please try later.")

    except requests.exceptions.RequestException as e:
        print(f"Error: Something went wrong: {e}")

    except ValueError:
        print("Error: Unable to read weather data.")

    return None


def display_weather(data):
    temp_c = data["main"]["temp"]
    temp_f = (temp_c * 9 / 5) + 32
    humidity = data["main"]["humidity"]
    description = data["weather"][0]["description"].title()
    wind_speed = data["wind"]["speed"]
    city_name = data["name"]

    print("-" * 40)
    print(f"Weather in {city_name}")
    print("-" * 40)
    print(f"Temperature: {temp_c:.1f}°C / {temp_f:.1f}°F")
    print(f"Condition:   {description}")
    print(f"Humidity:    {humidity}%")
    print(f"Wind speed:  {wind_speed} m/s")
    print("-" * 40)


def main():
    print("=" * 40)
    print("          BASIC WEATHER APP")
    print("=" * 40)

    if not API_KEY:
        print("Error: API key is missing.")
        print("Set the OWM_API_KEY environment variable first.")
        return

    while True:
        city = get_city()
        data = fetch_weather(city)

        if data:
            display_weather(data)

        again = input("Check another city? (y/n): ").strip().lower()

        if again != "y":
            print("Thank you for using the Weather App. Goodbye!")
            break


if __name__ == "__main__":
    main()
