require 'csv'
require 'json'
require 'httparty'

File.open( 'data/health2.json', "r" ) do |main|
  File.open( 'data/region_lat_lngs.json', "r" ) do |lat_lng|
    main = JSON.load( main );
    lat_lng = JSON.load( lat_lng );
    merged = (main+lat_lng).group_by{|h| h["region_district"]}.map{|k,v| v.reduce(:merge)}
    File.open("data/merged.json", "w") do |file|
      file.puts JSON.pretty_generate merged
    end
  end
end