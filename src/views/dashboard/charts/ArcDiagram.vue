<!--inspired by https://www.d3-graph-gallery.com/graph/arc_highlight.html
-->

<template>
	<div id="arc-diagram"></div>
</template>

<script>

	import * as d3Chord from "d3-chord";
	import * as d3Path from "d3-path";
	import * as d3Array from "d3-array";

	import * as d3 from "d3";

  import Chartist from 'chartist'
  


	export default{
    methods:{

      draw: async function(){

        d3.select("#arc-diagram").selectAll("svg").remove();

        var margin = {top: 0, right: 30, bottom: 200, left: 120},
  width = 1250 - margin.left - margin.right,
  height = 750 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#arc-diagram")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

  console.log("this gets executed!!!")
// Read dummy data
//var data = await d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_researcherNetwork.json")
var data = await d3.json("/api/package-listing-by-id/"+this.nodeID)

  console.log(data)
  console.log("this gets executed inside!!!!")
  // List of node names
  var allNodes = data.nodes.map(function(d){return d.name})

  // List of groups
  var allGroups = data.nodes.map(function(d){return d.grp})
  allGroups = [...new Set(allGroups)]

  // A color scale for groups:
  var color = d3.scaleOrdinal()
    .domain(allGroups)
    .range(d3.schemeSet2);

  // A linear scale for node size
  var size = d3.scaleLinear()
    .domain([1,10])
    .range([4,20]);

  // A linear scale to position the nodes on the X axis
  var x = d3.scalePoint()
    .range([0, width])
    .domain(allNodes)

  // In my input data, links are provided between nodes -id-, NOT between node names.
  // So I have to do a link between this id and the name
  var idToNode = {};
  data.nodes.forEach(function (n) {
    idToNode[n.id] = n;
  });

  // Add the links
  var links = svg
    .selectAll('mylinks')
    .data(data.links)
    .enter()
    .append('path')
    .attr('d', function (d) {
      var start = x(idToNode[d.source].name)    // X position of start node on the X axis
      var end = x(idToNode[d.target].name)      // X position of end node
      return ['M', start, height-30,    // the arc starts at the coordinate x=start, y=height-30 (where the starting node is)
        'A',                            // This means we're gonna build an elliptical arc
        (start - end)/2, ',',    // Next 2 lines are the coordinates of the inflexion point. Height of this point is proportional with start - end distance
        (start - end)/2, 0, 0, ',',
        start < end ? 1 : 0, end, ',', height-30] // We always want the arc on top. So if end is before start, putting 0 here turn the arc upside down.
        .join(' ');
    })
    .style("fill", "none")
    .attr("stroke", function(d){return x(idToNode[d.source].name) < x(idToNode[d.target].name) ? "grey" : "red"})
    .style("stroke-width", 2)

  // Add the circle for the nodes
  var nodes = svg
    .selectAll("mynodes")
    .data(data.nodes.sort(function(a,b) { return +b.n - +a.n }))
    .enter()
    .append("circle")
      .attr("cx", function(d){ return(x(d.name))})
      .attr("cy", height-30)
      .attr("r", function(d){ return(size(d.n))})
      .style("fill", function(d){ return color(d.grp)})
      .attr("stroke", "white")

  // And give them a label
  var labels = svg
    .selectAll("mylabels")
    .data(data.nodes)
    .enter()
    .append("text")
      .attr("x", 0)
      .attr("y", 0)
      .text(function(d){ return(d.name)} )
      .style("text-anchor", "end")
      .attr("transform", function(d){ return( "translate(" + (x(d.name)) + "," + (height-15) + ")rotate(-45)")})
      .style("font-size", 12)

  // Add the highlighting functionality
  nodes
    .on('mouseover', function (d) {
      // Highlight the nodes: every node is green except of him
      nodes
        .style('opacity', .2)
      d3.select(this)
        .style('opacity', 1)
      // Highlight the connections
      links
        .style('stroke', function (link_d) { return link_d.source === d.id || link_d.target === d.id ? color(d.grp) : '#b8b8b8';})
        .style('stroke-opacity', function (link_d) { return link_d.source === d.id || link_d.target === d.id ? 1 : .2;})
        .style('stroke-width', function (link_d) { return link_d.source === d.id || link_d.target === d.id ? 4 : 2;})
      labels
        .style("font-size", function(label_d){ return label_d.name === d.name ? 16 : 2 } )
        .attr("y", function(label_d){ return label_d.name === d.name ? 10 : 0 } )

    })
    .on('mouseout', function (d) {
      nodes.style('opacity', 1)
      links
        .style("stroke", function(d){return x(idToNode[d.source].name) < x(idToNode[d.target].name) ? "grey" : "red"})
        .style('stroke-opacity', .8)
        .style('stroke-width', '2')
      labels
        .style("font-size", 12 )

    })


      }
    },
          
      props: {
           nodeID: {
            type: Number,
             default: 146
           },
     },
      data(){
        return {
            name: 'dashboard-traffic-chart',
            myprop: 'aha?',
            canvasId: 'arc-diagram-chart'
        }
      },
      watch: {
        nodeID: async function(new_val){
          this.draw()
        }
      },

      //template: "<div :id='canvasId'></div>",
      template: '<div :id="canvasId" class="traffic-chart"></div>',
      async mounted(){
        this.draw()
    }
}
</script>

<style>

.node {
  font: 10px sans-serif;
}

.link {
  stroke: steelblue;
  stroke-opacity: 0.5;
  fill: none;
  pointer-events: none;
}

	@import "../../../../node_modules/chartist/dist/chartist.min.css"
</style>