require 'csv'
require 'json'
def get_data
  csv_data = CSV.open('data/iati.csv')
  headers = csv_data.shift.map {|i| i.to_s }
  string_data = csv_data.map {|row| row.map {|cell| cell.to_s } }
  array_of_hashes = string_data.map {|row| Hash[*headers.zip(row).flatten] }
end
@data = get_data()
File.open("data/iati.json", "w") do |file|
  file.puts JSON.pretty_generate(get_data())
end