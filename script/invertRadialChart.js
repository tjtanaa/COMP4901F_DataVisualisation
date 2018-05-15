
function exist(array, data){
	for( i = 0; i < array.length; i++){
		if(data == array[i]){
			return true;
		}
	}
	return false;
}

// Get a subset of the data based on the group
function getFilteredData_Constructor(data, ConstructorName) {
	return data.filter(function(d) { return d.ConstructorName === ConstructorName; });
}

function getFilteredData_Year(data, StartYear, EndYear) {
	return data.filter(function(d) { 
		var status = false;
		_tempYearArray = d.Years.split(",");
		// console.log(_tempYearArray);
		// console.log(_tempYearArray.length);
		for(i = 1; i < _tempYearArray.length; i++){
			if((parseInt(_tempYearArray[i]) >= parseInt(StartYear)) && (parseInt(_tempYearArray[i]) <= parseInt(EndYear)))
				status = true;
				break; 
			}
		return status;
		});
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

function describeArc(x, y, radius, startAngle, endAngle){

var start = polarToCartesian(x, y, radius, endAngle);
var end = polarToCartesian(x, y, radius, startAngle);

var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

var d = [
    "M", start.x, start.y, 
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
].join(" ");

return d;       
}


const WIDTH = 300;
const HEIGHT = 300;

var margin ={top: 20, right: 20, bottom: 20, left: 20},
	width = WIDTH -margin.left - margin.right,
	height = HEIGHT - margin.top - margin.bottom;

var radius = d3.scale.linear()
				.range([0, width/2]);

var color = d3.scale.linear()
				.range(["red", "blue"]);

function generateRandomRadian(){
	var min = -Math.PI, max = Math.PI;
	var saved_y_radian = Math.random() * 2 * Math.PI;//(max - min) + min;
	return saved_y_radian;
}

function generateRandomRadianRestrict(start, end){
	var min = start, max = end;
	var saved_y_radian = Math.random() *(max - min) + min;
	return saved_y_radian;
}

var svg = d3.select(".invertRadialChart")
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom);

// Define the div for the tooltip
var div = d3.select(".invertRadialChart").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0)
    .style("font", "10px times");

d3.csv("DriverID_Points_ConstructorID_TotalPoints_NumDrivers.csv", function(data){
	// console.log(error);
	// console.log(data);
	ConstructorNameArray = []
	YearsArray = []
	// Turn data to usable format
	data.forEach(function(d){
		// console.log(d);
		// The attributes are 
		// [["DriverID", \
		//  "DriverName" ,\
		// "Points", \
		// "ConstructorID", \
		// "ConstructorName", \
		// "TotalPoints", \
		// "NumberOfDrivers", \
		// "AveragePoints", \
		// "NumberOfCollaborations", \
		// "Years"]]
		d.DriverID = +d.DriverID;
		d.Points = +d.Points;
		d.ConstructorID = +d.ConstructorID;
		d.TotalPoints = +d.TotalPoints;
		d.NumberOfDrivers = +d.NumberOfDrivers;
		d.AveragePoints = +d.AveragePoints;
		d.NumberOfCollaborations = +d.NumberOfCollaborations;
		if(exist(ConstructorNameArray, d.ConstructorName)){
			
		}else{
			ConstructorNameArray.push(d.ConstructorName);
		}
	});

	for(i = 1950; i < 2018; i++){
		YearsArray.push(i);
	}
	// console.log(ConstructorIDArray.sort(function(a, b){return a-b}))

	// Create labels for choosing the Constructor for filtering
	var selectConstructor = d3.select('.invertRadialChart')
		.append("label")
		.text("Constructor Name : ")
	  	.append('select')
	  	.attr('class','ConstructorName-select')
	    // .on('change',onchange)

	var ConstructorOptions = selectConstructor
	  	.selectAll('option')
		.data(ConstructorNameArray.sort())//function(a, b){return a-b}))
		.enter()
		.append('option')
			.text(function (d) { return d; });

	d3.select(".invertRadialChart").append("text").html("<br />")

	var selectStartYear = d3.select('.invertRadialChart')
		// .append("br /")
		.append("label")
		.text("Start Year : ")
	  	.append('select')
	  	.attr('class','StartYears-select')
	    // .on('change',onchange)

	var StartYearOptions = selectStartYear
	  	.selectAll('option')
		.data(YearsArray.sort(function(a, b){return a-b}))
		.enter()
		.append('option')
			.text(function (d) { return d; });

	d3.select(".invertRadialChart").append("text").html("<br />")

	var selectEndYear = d3.select('.invertRadialChart')
		// .append("br /")
		.append("label")
		.text("End Year : ")
	  	.append('select')
	  	.attr('class','EndYears-select')
	    // .on('change',onchange)

	var YearEndOptions = selectEndYear
	  	.selectAll('option')
		.data(YearsArray.sort(function(a, b){return a-b}))
		.enter()
		.append('option')
			.text(function (d) { return d; });

	var yMin = d3.min(data, function(d){ return parseInt(d.NumberOfCollaborations);})

	var yMax = d3.max(data, function(d){ return parseInt(d.NumberOfCollaborations);})

	var	yRange1 = d3.scale.linear().domain([yMax,0]).range([0, height/2])

	var yAxis1 = d3.svg.axis().scale(yRange1).tickSize(1).orient("right").tickSubdivide(true);

	var	yRange2 = d3.scale.linear().domain([yMax, 0]).range([0, height/2])

	var yAxis2 = d3.svg.axis().scale(yRange2).tickSize(1).orient("right").tickSubdivide(true);

	var	yRange3 = d3.scale.linear().domain([0, yMax]).range([0, height/2])

	var yAxis3 = d3.svg.axis().scale(yRange3).tickSize(1).orient("right").tickSubdivide(true);

	var	xRange2 = d3.scale.linear().domain([yMax, 0]).range([0, height/2])

	var xAxis2 = d3.svg.axis().scale(xRange2).tickSize(1).orient("bottom").tickSubdivide(true);

	var	xRange3 = d3.scale.linear().domain([0, yMax]).range([0, height/2])

	var xAxis3 = d3.svg.axis().scale(xRange3).tickSize(1).orient("bottom").tickSubdivide(true);

	radius.domain([yMax, 0]);
	color.domain(d3.extent(data, function(d){ return parseFloat(d.Points) / parseFloat(d.NumberOfCollaborations); }));



	// New select element for allowing the user to select a group!
	var $ConstructorSelector = document.querySelector('.ConstructorName-select');
	// var constructorData = getFilteredData_Constructor(data, $ConstructorSelector.value);
	var $StartYearSelector = document.querySelector('.StartYears-select');
	// var startyearData = getFilteredData_Year(data, $YearSelector.value);
	var $EndYearSelector = document.querySelector('.EndYears-select');
	// var endyearData = getFilteredData_Year(data, $YearSelector.value);

	// g1 = svg.append("g")
	//     .attr("class", "y axis")
	//     .attr("transform", "translate(" + WIDTH/2 + "," + HEIGHT/2 + ")" )
	//     .style("font", "14px times")
	//     .call(yAxis1);

	g2 = svg.append("g")
	    .attr("class", "y axis")
	    .attr("transform", "translate(" + WIDTH/2 + "," + (margin.top + 0) + ")" )
	    .style("font", "14px times")
	    .call(yAxis2);

	g3 = svg.append("g")
	    .attr("class", "y axis")
	    .attr("transform", "translate(" + WIDTH/2 + "," + HEIGHT/2 + ")" )
	    .style("font", "14px times")
	    .call(yAxis3);

	g4 = svg.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(" + (margin.left) + "," + (HEIGHT/2) + ")" )
	    .style("font", "14px times")
	    .call(xAxis2);

	g5 = svg.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(" + WIDTH/2 + "," + HEIGHT/2 + ")" )
	    .style("font", "14px times")
	    .call(xAxis3);

	// g6 = svg.append("g")
	//     .attr("class", "background")
	//     .attr("transform", "translate(" + WIDTH/2 + "," + HEIGHT/2 + ")" )
	//     .style("font", "14px times")

	g = svg.append("g");

	// var defs = svg.append("defs");

	// var gradient = defs.append("linearGradient")
	//    .attr("id", "svgGradient")
	//    .attr("x1", "0%")
	//    .attr("x2", "100%")
	//    .attr("y1", "0%")
	//    .attr("y2", "100%");

	// gradient.append("stop")
	//    .attr('class', 'start')
	//    .attr("offset", "0%")
	//    .attr("stop-color", "red")
	//    .attr("stop-opacity", 1);

	// gradient.append("stop")
	//    .attr('class', 'end')
	//    .attr("offset", "100%")
	//    .attr("stop-color", "blue")
	//    .attr("stop-opacity", 1);

	// var arc = d3.svg.arc()
	//     .innerRadius(0)
	//     .outerRadius(WIDTH/8)
	//     .startAngle(0) //converting from degs to radians
	//     .endAngle(2*Math.PI) //just radians

	// g4.append("path")
	//     .attr("d", arc)
	//     .attr("stroke", "url(#svgGradient)")
	//     .attr("stroke-width", WIDTH/4)
//           .attr("fill", "none");

	for( i= 0; i < 12 ; i++){
	g.append("circle")
		.attr("class", "radial axis")
		.attr("cx", WIDTH/2)
		.attr("cy", HEIGHT/2)
		.attr("r", radius(i))
		.style("fill", "none")
		.style("stroke-width", "1px")
		.style("stroke", "steelblue")
	}

	function enterPoints(data){
		g.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		.attr("class","point")
		.attr("transform",function(d){
			var angle = 0;
			if(d.AveragePoints == 0){
				angle = generateRandomRadianRestrict(Math.PI/6, Math.PI/2 - Math.PI/6);
			}else if(d.AveragePoints <= 3){
				angle = generateRandomRadianRestrict(Math.PI/2 + Math.PI/6, Math.PI- Math.PI/6);
			}else if(d.AveragePoints <= 5){
				angle = generateRandomRadianRestrict(Math.PI + Math.PI/6, 3*Math.PI/2 - Math.PI/6);
			}else{
				angle = generateRandomRadianRestrict(3*Math.PI/2 + Math.PI/6, 2* Math.PI - Math.PI/6);
			}
			// var angle = generateRandomRadian();
			var ra = radius(d.NumberOfCollaborations);
			var x = WIDTH/2 + (ra) * Math.cos(angle);
			var y = HEIGHT/2 + (ra) * Math.sin(angle);
			return "translate(" + [x, y] + ")";
		})
		// .attr("cx", function(d) {return 0;})// (radius(d.NumberOfCollaborations))*Math.cos(generateRandomRadian());})
		// .attr("cy", function(d) { return (radius(d.NumberOfCollaborations));})//*Math.sin(generateRandomRadian());})
		.attr("r", function(d){return 3;})
		.style("fill" , function(d){return color(d.AveragePoints);})
        .on("mouseover", handleMouseOver)
		.on("mouseout", handleMouseOut)
		.select(".ConstructorName-select")
		.append("option")
		.attr("value", function(d){ return "" + d.ConstructorName;})
		.text(function(d){ return d.ConstructorName;})
;
	}

	function exitPoints(data) {
		g.selectAll(".point")
		  .data(data)
		  .exit()
		  .remove();
	}	

	function updatePoints(data) {
	  g.selectAll(".point")
	      .data(data)
	      .transition()
			.attr("transform",function(d){
			var angle = 0;
			if((parseFloat(d.Points) / parseFloat(d.NumberOfCollaborations)) === 0){
				angle = generateRandomRadianRestrict(Math.PI/6, Math.PI/2 - Math.PI/6);
			}else if((parseFloat(d.Points) / parseFloat(d.NumberOfCollaborations)) <= 50){
				angle = generateRandomRadianRestrict(Math.PI/2 + Math.PI/6, Math.PI- Math.PI/6);
			}else if((parseFloat(d.Points) / parseFloat(d.NumberOfCollaborations)) <= 100){
				angle = generateRandomRadianRestrict(Math.PI + Math.PI/6, 3*Math.PI/2 - Math.PI/6);
			}else{
				angle = generateRandomRadianRestrict(3*Math.PI/2 + Math.PI/6, 2* Math.PI - Math.PI/6);
			}
			// var angle = generateRandomRadian();
			var ra = radius(d.NumberOfCollaborations);
			var x = WIDTH/2 + (ra) * Math.cos(angle);
			var y = HEIGHT/2 + (ra) * Math.sin(angle);
			return "translate(" + [x, y] + ")";
		})
		// .attr("cx", function(d) {return 0;})// (radius(d.NumberOfCollaborations))*Math.cos(generateRandomRadian());})
		// .attr("cy", function(d) { return (radius(d.NumberOfCollaborations));})//*Math.sin(generateRandomRadian());});
	}	

	var current_constructor = 0;
	var current_start_year = "1950";
	var current_end_year = "2017";
	$ConstructorSelector.onchange = function(e) {
	  // var constructor = e.target.value;
	  current_constructor = e.target.value;
	  var constructorData = getFilteredData_Constructor(data, current_constructor);
	  var yearConstructorData = getFilteredData_Year(constructorData, current_start_year, current_end_year);

	  enterPoints(yearConstructorData);
	  exitPoints(yearConstructorData);
	  // updatePoints(yearConstructorData);

	};

	$StartYearSelector.onchange = function(e) {
	  // var constructor = e.target.value;
	  current_start_year = e.target.value;
	  var constructorData = getFilteredData_Constructor(data, current_constructor);
	  var yearConstructorData = getFilteredData_Year(constructorData, current_start_year, current_end_year);


	  enterPoints(yearConstructorData);
	  exitPoints(yearConstructorData);
	  // updatePoints(yearConstructorData);

	};

	$EndYearSelector.onchange = function(e) {
	  // var constructor = e.target.value;
	  current_end_year = e.target.value;
	  var constructorData = getFilteredData_Constructor(data, current_constructor);
	  var yearConstructorData = getFilteredData_Year(constructorData, current_start_year, current_end_year);


	  enterPoints(yearConstructorData);
	  exitPoints(yearConstructorData);
	  // updatePoints(yearConstructorData);

	};

// Create Event Handlers for mouse
function handleMouseOver(d, i) {  // Add interactivity
	div.transition()		
        .duration(200)		
        .style("opacity", .9);		
    div	.style("width", 60)
    	.style("height", 70).html("DriverName: " + d.DriverName + "\n" + "Number of Collaborations: " + d.NumberOfCollaborations + "\n" + "Average Points: " + (parseFloat(d.Points)/ parseFloat(d.NumberOfCollaborations)))
        .style("left", (d3.event.pageX + 10) + "px")		
        .style("top", (d3.event.pageY - 28) + "px");	
    
      // Use D3 to select element, change color and size
      d3.select(this).attr(
      	{r: 6}
      	);
    }

function handleMouseOut(d, i){

	div.transition()		
            .duration(500)		
            .style("opacity", 0);	
      // Use D3 to select element, change color back to normal
      d3.select(this).attr(
      	{r: 3}
      	);
    }

});
