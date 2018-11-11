var width = 1000,
    height = 500;

var projection = d3
  .geo.mercator()
  .center([0, 0])
  .scale(100)

  // .translate([WIDTH / 2, HEIGHT / 2]);

// var projection = d3.geo.mercator()
//     .center([0, 5])
//     .scale(200)
//     .rotate([-180,0]);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var path = d3.geo.path()
    .projection(projection);

var g = svg.append("g");

// Define the div for the tooltip
var div = d3.select("body").append("div") 
    .attr("class", "tooltip")       
    .style("opacity", 0);

// load and display the World
d3.json("world-110m2.json", function(error, topology) {

// load and display the cities
d3.csv("circuits.csv", function(error, data) {
    g.selectAll("circle")
       .data(data)
       .enter()
       .append("a")
          .attr("xlink:href", function(d) {
            return "https://www.google.com/search?q="+d.location;}
          )
       .append("circle")
       .attr("cx", function(d) {
               return projection([d.lng, d.lat])[0];
       })
       .attr("cy", function(d) {
               return projection([d.lng, d.lat])[1];
       })
       .attr("r", 3)
       .style("fill", "hsl(216, 100%, 75%)")
       .on("mouseover", function(d,i){
            d3.select(this).attr({r: 6});
       })
       .on("mouseout", function(d,i){
            d3.select(this).attr({r: 3});
       })
});

// Create Event Handlers for mouse
function handleMouseOver(d, i) {  // Add interactivity

      // Use D3 to select element, change color and size
      d3.select(this).attr({
        fill: "orange",
        r: 5
      });

      // Specify where to put label of text
      svg.append("text").attr({
         id: "t" + projection([d.lng, d.lat])[0] + "-" + projection([d.lng, d.lat])[1] + "-" + i,  // Create an id for text so we can select it later for removing on mouseout
          x: function() { return projection([d.lng, d.lat])[0]- 30; },
          y: function() { return projection([d.lng, d.lat])[1]- 15; }
      })
      .text(function() {
        return [projection([d.lng, d.lat])[0], projection([d.lng, d.lat])[1]];  // Value of the text
      });
    }

function handleMouseOut(d, i) {
      // Use D3 to select element, change color back to normal
      d3.select(this).attr({
        fill: "black",
        r: 3
      });

      // Select text by id and then remove
      d3.select("#t" + projection([d.lng, d.lat])[0]+ "-" + projection([d.lng, d.lat])[1] + "-" + i).remove();  // Remove text location
    }


g.selectAll("path")
      .data(topojson.object(topology, topology.objects.countries)
          .geometries)
    .enter()
      .append("path")
      .attr("d", path)
});

// zoom and pan
var zoom = d3.behavior.zoom()
    .on("zoom",function() {
        g.attr("transform","translate("+ 
            d3.event.translate.join(",")+")scale("+d3.event.scale+")");
        g.selectAll("circle")
            .attr("d", path.projection(projection));
        g.selectAll("path")  
            .attr("d", path.projection(projection)); 

  });

svg.call(zoom)