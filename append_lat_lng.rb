require 'csv'
require 'json'
require 'httparty'

def get_coords url
  response = HTTParty.get(url)
  body = JSON.parse(response.body) if response
  location = body["results"].first["geometry"]["location"]
end

File.open( 'data/health2.json', "r" ) do |f|
  location_strings = JSON.load( f );
  coords = location_strings.map do |region|
    string = "#{region["region_district"]}, Uganda"
    response = get_coords("https://maps.googleapis.com/maps/api/geocode/json?address=#{URI.encode(string)}&key=AIzaSyClfRnPRIKFpNVE1K33vshZG5nidiSVR5k")
    { name: region["region_district"], lat: response["lat"], lng: response["lng"] } if response
  end
  File.open("data/region_lat_lngs.json", "w") do |file|
    file.puts JSON.pretty_generate coords
  end
end