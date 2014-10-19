require 'sinatra'
require 'json'
require 'net/http'
require 'uri'
require 'csv'

def get_data
  csv_data = CSV.open('data/health2.csv')
  headers = csv_data.shift.map {|i| i.to_s }
  string_data = csv_data.map {|row| row.map {|cell| cell.to_s } }
  array_of_hashes = string_data.map {|row| Hash[*headers.zip(row).flatten] }
end

get '/style.css' do
  send_file 'style.css'
end

get '/nvd3.js' do
  send_file 'nv.d3.min.js'
end

get '/ol.js' do
  send_file 'ol.js'
end

get '/d3.js' do
  send_file 'd3.js'
end

get '/script.js' do
  send_file 'script.js'
end

get '/health.json' do
  send_file 'data/merged.json'
end

get '/iati.json' do
  send_file 'data/iati.json'
end

get '/' do
  # @data = get_data().to_json
  # File.open("data/health2.json", "w") do |file|
  #   file.puts JSON.pretty_generate(get_data())
  # end
  erb :home
end

