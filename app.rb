require 'sinatra'

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
  erb :home
end

