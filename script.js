var map;
var insert_div = function(){
  var div = $('<div class="chart" />')[0];
  $('#chart_view').append(div);
  return div;
};

var build_health_data = function(region){
  return google.visualization.arrayToDataTable([
    ['Year', 'Value'],
    ['2007',  numberify(region["health_2007"])],
    ['2009',  numberify(region["health_2009"])],
    ['2010',  numberify(region["health_2010"])]
  ]);
};


var build_population_data = function(region){
  return google.visualization.arrayToDataTable([
    ['Year', 'Value'],
    ['1991',  numberify(region["population_1991"])],
    ['2002',  numberify(region["population_2002"])],
    ['2011',  numberify(region["population_projected_2011"])],
    ['2011',  numberify(region["population_2012"])]
  ]);
};

var build_primary_education_data = function(region){
  return google.visualization.arrayToDataTable([
    ['Year', 'gross intake', 'net intake', 'gross enrollment', 'net enrolment'],
    ['2009',  numberify(region["primary_education_gross_intake_2009"]), numberify(region["primary_education_net_intake_2009"]),numberify(region["primary_education_gross_enrolment_2009"]), numberify(region["primary_education_net_enrolment_2009"]) ],
    ['2010',  numberify(region["primary_education_gross_intake_2010"]), numberify(region["primary_education_net_intake_2010"]),numberify(region["primary_education_gross_enrolment_2010"]), numberify(region["primary_education_net_enrolment_2010"]) ]
  ]);
};

var build_secondary_education_data = function(region){
  return google.visualization.arrayToDataTable([
    ['Year', 'gross intake', 'net intake', 'gross enrollment', 'net enrolment'],
    ['2009',  numberify(region["secondary_education_gross_intake_2009"]), numberify(region["secondary_education_net_intake_2009"]),numberify(region["secondary_education_gross_enrolment_2009"]), numberify(region["secondary_education_net_enrolment_2009"]) ],
    ['2010',  numberify(region["secondary_education_gross_intake_2010"]), numberify(region["secondary_education_net_intake_2010"]),parseInt(region["secondary_education_gross_enrolment_2010"]), parseInt(region["secondary_education_net_enrolment_2010"]) ]
  ]);
};

var build_land_usage_data = function(region){
  return google.visualization.arrayToDataTable([
    ["Name", "Value", "Units"],
    ["Urbanised Areas" , numberify(region["urbanised_areas"]), "square km"],
    ["Bushlands" , numberify(region["bushlands"]), "square km"],
    ["Commercial Farmlands (cattle)" , numberify(region["commercial_farmlands"]), "square km"],
    ["Cultivated Lands (farming)" , numberify(region["cultivated_lands"]), "square km"],
    ["GrassLands" , numberify(region["grasslands"]), "square km"],
    ["Impediments (collapsed terrain, landslides etc)" , numberify(region["impediments"]), "square km"],
    ["Plantations" , numberify(region["plantations"]), "square km"],
    ["Plantations Softwoods" , numberify(region["plantations_softwoods"]), "square km"],
    ["Depleted Tropical Forest" , numberify(region["depleted_tropical_forest"]), "square km"],
    ["Tropical Forest" , numberify(region["tropical_forest"]), "square km"],
    ["Water Bodies" , numberify(region["water_bodies"]), "square km"],
    ["Wetlands" , numberify(region["wetlands"]), "square km"],
    ["Woodlands" , numberify(region["woodlands"]), "square km"]
  ]);
};

var build_health_options = function(region){
  return {
    title: "Health over time for ugandan region " + region["region_district"],
    hAxis: {title: 'Year',  titleTextStyle: {color: '#333'}},
    vAxis: {title: 'health', minValue: 0}
  };
};

var build_population_options = function(region){
  return {
    title: "Population for ugandan region " + region["region_district"],
    hAxis: {title: 'Year',  titleTextStyle: {color: '#333'}},
    vAxis: {title: 'population', minValue: 0}
  };
};

var build_primary_education_options = function(region){
  return {
    title: "Primary Education for ugandan region " + region["region_district"],
    hAxis: {title: 'Year',  titleTextStyle: {color: '#333'}},
    vAxis: {title: '?', minValue: 0}
  };
};

var build_secondary_education_options = function(region){
  return {
    title: "Secondary Education for ugandan region " + region["region_district"],
    hAxis: {title: 'Year',  titleTextStyle: {color: '#333'}},
    vAxis: {title: '?', minValue: 0}
  };
};

var build_land_usage_options = function(region){
  return {
    title: "Land Usage for ugandan region " + region["region_district"]
  };
};

var add_health = function(region){
  new google.visualization.LineChart(insert_div()).draw(build_health_data(region), build_health_options(region));
};

var add_population = function(region){
  new google.visualization.LineChart(insert_div()).draw(build_population_data(region), build_population_options(region));
};

var add_primary_education = function(region){
  new google.visualization.LineChart(insert_div()).draw(build_primary_education_data(region), build_primary_education_options(region));
};
var add_secondary_education = function(region){
  new google.visualization.LineChart(insert_div()).draw(build_secondary_education_data(region), build_secondary_education_options(region));
};
var add_land_usage = function(region){
  new google.visualization.Table(insert_div()).draw(build_land_usage_data(region), build_land_usage_options(region));
};


var build_chart = function(region){
  $('#chart_view').html("");
  add_health(region);
  add_population(region);
  add_primary_education(region);
  add_secondary_education(region);
  add_land_usage(region);
};

var setup_map = function(){  
  var myLatLng = new google.maps.LatLng( 0.398056, 33.478056 );
  var myOptions = {
      zoom: 6,
      center: myLatLng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map( document.getElementById( 'map' ), myOptions );
};

var start = function() {
  setup_map();
  $.getJSON('/health.json', function(regions){
    regions.forEach(build_marker);
  });
  $.getJSON('/iati.json', function(projects){
    projects.forEach(build_iati_marker);
  });
};

var build_link = function(region){
  var link  = $('<a href="#">' + region["region_district"] + '</a>');
  $('#links').append(link);
  link.click(function(event){
    event.preventDefault();
    build_chart(region);
  });
};

var decide_colour = function(start_year_id, end_year_id, region){
  if(parseInt(region[start_year_id]) >= parseInt(region[end_year_id])){
    return '#ff0000';
  }else{
    return '#00ff00';
  }
};

var numberify = function(string){
  return parseInt(string.split(",").join(""));
};

var decide_radius = function(region){
  var ratio = numberify(region["population_1991"]) / numberify(region["population_2012"]);
  return ratio * 40000;
};

var get_url_vars = function()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
};

var build_marker = function(region){
  var args = get_url_vars();
  var start_year_id = args["start_year_id"] || "health_2007";
  var end_year_id   = args["end_year_id"]   || "health_2010";

  var latlng = new google.maps.LatLng( region["lat"], region["lng"] );
  var params = {
      strokeColor: '#FF0000',
      strokeOpacity: 0,
      strokeWeight: 2,
      fillColor: decide_colour(start_year_id, end_year_id, region),
      fillOpacity: 0.35,
      map: map,
      center: latlng,
      radius: decide_radius(region)
  };
  var circle = new google.maps.Circle(params);
  google.maps.event.addListener(circle, 'click', function() {
   build_chart(region);
  });
};

var build_iati_marker = function(project){
  // debugger;
  // var latlng = new google.maps.LatLng( region["lat"], region["lng"] );
  // var params = {
  //     strokeColor: '#FF0000',
  //     strokeOpacity: 0,
  //     strokeWeight: 2,
  //     fillColor: decide_colour(region),
  //     fillOpacity: 0.35,
  //     map: map,
  //     center: latlng,
  //     radius: decide_radius(region)
  // };
  // var circle = new google.maps.Circle(params);
  // google.maps.event.addListener(circle, 'click', function() {
  //  build_chart(region);
  // });
};

google.load("visualization", "1", {packages:["corechart", "geochart", "table"]});
google.setOnLoadCallback(start);