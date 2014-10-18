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
    ['Year', 'Value', 'Type'],
    ['2009',  parseInt(region["primary_education_gross_intake_2009"]), 'gross intake'],
    ['2010',  parseInt(region["primary_education_gross_intake_2010"]), 'gross intake'],
    ['2009',  parseInt(region["primary_education_net_intake_2009"]), 'net intake'],
    ['2010',  parseInt(region["primary_education_net_intake_2010"]), 'net intake'],
    ['2009',  parseInt(region["primary_education_gross_enrollment_2009"]), 'gross enrollment'],
    ['2010',  parseInt(region["primary_education_gross_enrollment_2010"]), 'gross enrollment']
    ['2009',  parseInt(region["primary_education_net_enrollment_2009"]), 'net enrollment'],
    ['2010',  parseInt(region["primary_education_net_enrollment_2010"]), 'net enrollment']
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
    vAxis: {title: 'gross intake', minValue: 0}
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

var build_chart = function(region){
  $('#chart_view').html("");
  add_health(region);
  add_population(region);
  add_primary_education(region);
};

var start = function() {
  $.getJSON('/health.json', function(data){
    data.forEach(build_link);
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

google.load("visualization", "1", {packages:["corechart", "geochart"]});
google.setOnLoadCallback(start);