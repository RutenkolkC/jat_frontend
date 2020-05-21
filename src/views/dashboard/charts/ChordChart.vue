<template>
<div>JOJOJO BITCHES
	<div id="chord-chart" class="traffic-chart"></div>
</div>
	
</template>


<script>

	import * as d3Chord from "d3-chord";
	import * as d3Path from "d3-path";
	import * as d3Array from "d3-array";

	import * as d3 from "d3";


	

	export default{
	  name: 'dashboard-chord-chart',
	  props: {
		  data: Object
	  },
      data(){
        return{
			msg: "hello from the chord-chart",
			width: 600,
			height: 600,
            canvasId: 'chord-chart'
        }
      },
      //template: "<div :id='canvasId'></div>",
      template: '<div :id="canvasId" class="chord-chart"></div>',
      mounted: function () {
		  throw "AAAAA";

var svg = d3.select("#chord-chart")
  .append("svg")
    .attr("width", 440)
    .attr("height", 440)
  .append("g")
    .attr("transform", "translate(220,220)")
var matrix = [
  [11975,  5871, 8916, 2868],
  [ 1951, 10048, 2060, 6171],
  [ 8010, 16145, 8090, 8045],
  [ 1013,   990,  940, 6907]
];
		 
// give this matrix to d3.chord(): it will calculates all the info we need to draw arc and ribbon
var res = d3Chord.chord()
    .padAngle(0.05)     // padding between entities (black arc)
    .sortSubgroups(d3.descending)
    (matrix)

// add the groups on the inner part of the circle
svg
  .datum(res)
  .append("g")
  .selectAll("g")
  .data(function(d) { return d.groups; })
  .enter()
  .append("g")
  .append("path")
    .style("fill", "grey")
    .style("stroke", "black")
    .attr("d", d3.arc()
      .innerRadius(200)
      .outerRadius(210)
    )

// Add the links between groups
svg
  .datum(res)
  .append("g")
  .selectAll("path")
  .data(function(d) { return d; })
  .enter()
  .append("path")
    .attr("d", d3.ribbon()
      .radius(200)
    )
    .style("fill", "#69b3a2")
    .style("stroke", "black");




    }
}
</script>

<style>
	@import "../../../../node_modules/chartist/dist/chartist.min.css"
</style>