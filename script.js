var map;
var insert_div = function(){
  var div = $('<div class="chart" />')[0];
  $('#chart_view').append(div);
  return div;
};

var build_health_data = function(region){
  return google.visualization.arrayToDataTable([
    ['Year', 'Value'],
    ['2007',  parseInt(region["health_2007"])],
    ['2009',  parseInt(region["health_2009"])],
    ['2010',  parseInt(region["health_2010"])]
  ]);
};


var build_population_data = function(region){
  return google.visualization.arrayToDataTable([
    ['Year', 'Value'],
    ['1991',  parseInt(region["population_1991"])],
    ['2002',  parseInt(region["population_2002"])],
    ['2011',  parseInt(region["population_projected_2011"])],
    ['2011',  parseInt(region["population_2012"])]
  ]);
};

var build_primary_education_data = function(region){
  return google.visualization.arrayToDataTable([
    ['Year', 'gross intake', 'net intake', 'gross enrollment', 'net enrolment'],
    ['2009',  parseInt(region["primary_education_gross_intake_2009"]), parseInt(region["primary_education_net_intake_2009"]),parseInt(region["primary_education_gross_enrolment_2009"]), parseInt(region["primary_education_net_enrolment_2009"]) ],
    ['2010',  parseInt(region["primary_education_gross_intake_2010"]), parseInt(region["primary_education_net_intake_2010"]),parseInt(region["primary_education_gross_enrolment_2010"]), parseInt(region["primary_education_net_enrolment_2010"]) ]
  ]);
};

var build_secondary_education_data = function(region){
  return google.visualization.arrayToDataTable([
    ['Year', 'gross intake', 'net intake', 'gross enrollment', 'net enrolment'],
    ['2009',  parseInt(region["secondary_education_gross_intake_2009"]), parseInt(region["secondary_education_net_intake_2009"]),parseInt(region["secondary_education_gross_enrolment_2009"]), parseInt(region["secondary_education_net_enrolment_2009"]) ],
    ['2010',  parseInt(region["secondary_education_gross_intake_2010"]), parseInt(region["secondary_education_net_intake_2010"]),parseInt(region["secondary_education_gross_enrolment_2010"]), parseInt(region["secondary_education_net_enrolment_2010"]) ]
  ]);
};

var build_land_usage_data = function(region){
  return google.visualization.arrayToDataTable([
    ["Name", "Value"],
    ["Urbanised Areas" , parseInt(region["urbanised_areas"])],
    ["Bushlands" , parseInt(region["bushlands"])],
    ["Commercial Farmlands" , parseInt(region["commercial_farmlands"])],
    ["Cultivated Lands" , parseInt(region["cultivated_lands"])],
    ["GrassLands" , parseInt(region["grasslands"])],
    ["Impediments" , parseInt(region["impediments"])],
    ["Plantations" , parseInt(region["plantations"])],
    ["Plantations Softwoods" , parseInt(region["plantations_softwoods"])],
    ["Depleted Tropical Forest" , parseInt(region["depleted_tropical_forest"])],
    ["Tropical Forest" , parseInt(region["tropical_forest"])],
    ["Water Bodies" , parseInt(region["water_bodies"])],
    ["Wetlands" , parseInt(region["wetlands"])],
    ["Woodlands" , parseInt(region["woodlands"])]
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
  })
};

var build_link = function(region){
  var link  = $('<a href="#">' + region["region_district"] + '</a>');
  $('#links').append(link);
  link.click(function(event){
    event.preventDefault();
    build_chart(region);
  });
};

var decide_colour = function(region){
  if(parseInt(region["health_2007"]) >= parseInt(region["health_2009"])){
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

var build_marker = function(region){
  var latlng = new google.maps.LatLng( region["lat"], region["lng"] );
  var params = {
      strokeColor: '#FF0000',
      strokeOpacity: 0,
      strokeWeight: 2,
      fillColor: decide_colour(region),
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

google.load("visualization", "1", {packages:["corechart", "geochart", "table"]});
google.setOnLoadCallback(start);