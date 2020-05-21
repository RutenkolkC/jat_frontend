<!--after Mike Bostock’s Block 1044242
https://bl.ocks.org/mbostock/1044242
LICENSE#
Released under the GNU General Public License, version 3.
-->

<template>
	<div id="edge-bundling"></div>
</template>

<script>

	import * as d3Chord from "d3-chord";
	import * as d3Path from "d3-path";
	import * as d3Array from "d3-array";

	import * as d3 from "d3";

  import Chartist from 'chartist'
  
  async function getImports_old(nodeID){

    var hmm = await d3.json("/api/node-info/"+nodeID);
    var matrix,indexByName,nameByIndex;
    if(hmm["dep-matrix"]){
            matrix= hmm["dep-matrix"].matrix,
            indexByName= new Map(Object.entries(hmm["dep-matrix"].indexByName)),
            nameByIndex= new Map(Object.entries(hmm["dep-matrix"].nameByIndex).map(e => [+e[0],e[1]]))
    }else{
      matrix=[[0,1,2],[1,0,2],[1,2,0]],
      indexByName= new Map([["aaaa",0],["bbbb",2],["cccc",2]]),
      nameByIndex= new Map([["aaaa",0],["bbbb",2],["cccc",2]].map(e => [+e[0],e[1]]))
    }
    return {matrix,indexByName,nameByIndex}
  }

	export default{
    methods:{
      getImports: async function (nodeID){
        var hmm = await d3.json("/api/node-info/"+nodeID);
        var matrix,indexByName,nameByIndex;
        if(hmm["dep-matrix"]){
                matrix= hmm["dep-matrix"].matrix,
                indexByName= new Map(Object.entries(hmm["dep-matrix"].indexByName)),
                nameByIndex= new Map(Object.entries(hmm["dep-matrix"].nameByIndex).map(e => [+e[0],e[1]]))
        }else{
          matrix=[[0,1,2],[1,0,2],[1,2,0]],
          indexByName= new Map([["aaaa",0],["bbbb",2],["cccc",2]]),
          nameByIndex= new Map([["aaaa",0],["bbbb",2],["cccc",2]].map(e => [+e[0],e[1]]))
        }
        return {matrix,indexByName,nameByIndex}
      },
      draw: async function(){

        d3.select("#edge-bundling").selectAll("svg").remove();

        var diameter = 960*0.75,
            radius = diameter / 2,
            innerRadius = radius - 120;

        var cluster = d3.cluster()
            .size([360, innerRadius]);

        var line = d3.radialLine()
            .curve(d3.curveBundle.beta(0.85))
            .radius(function(d) { return d.y; })
            .angle(function(d) { return d.x / 180 * Math.PI; });

        var svg = d3.select("#edge-bundling").append("svg")
            .attr("width", diameter)
            .attr("height", diameter)
          .append("g")
            .attr("transform", "translate(" + radius + "," + radius + ")");

        var link = svg.append("g").selectAll(".link"),
            node = svg.append("g").selectAll(".node");
        console.log("jooo")
        var requestObj = {"id": this.nodeID}
        $.get("api/edgebundling",requestObj, function(classes) {

          console.log("-------------------------- wtf -------------------------------")
          console.log(classes)
          var root = packageHierarchy(classes)
              .sum(function(d) { return d.size; });

          cluster(root);
console.log(root.leaves())
          link = link
            .data(packageImports(root.leaves()))
            .enter().append("path")
              .each(function(d) { d.source = d[0], d.target = d[d.length - 1]; })
              .attr("class", "link")
              .attr("d", line);

          node = node
            .data(root.leaves())
            .enter().append("text")
              .attr("class", "node")
              .attr("dy", "0.31em")
              .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + (d.y + 8) + ",0)" + (d.x < 180 ? "" : "rotate(180)"); })
              .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
              .text(function(d) { return d.data.key; });
        });

        console.log("jooo")
        // Lazily construct the package hierarchy from class names.
        function packageHierarchy(classes) {
          var map = {};

          function find(name, data) {
            var node = map[name], i;
            if (!node) {
              node = map[name] = data || {name: name, children: []};
              if (name.length) {
                node.parent = find(name.substring(0, i = name.lastIndexOf(".")));
                node.parent.children.push(node);
                node.key = name.substring(i + 1);
              }
            }
            return node;
          }

          classes.forEach(function(d) {
            find(d.name, d);
          });

          return d3.hierarchy(map[""]);
        }

        // Return a list of imports for the given array of nodes.
        function packageImports(nodes) {
          var map = {},
              imports = [];

          // Compute a map from name to node.
          nodes.forEach(function(d) {
            map[d.data.name] = d;
          });

          // For each import, construct a link from the source to target node.
          nodes.forEach(function(d) {
            if (d.data.imports) d.data.imports.forEach(function(i) {
              imports.push(map[d.data.name].path(map[i]));
            });
          });

          return imports;
        }

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
            canvasId: 'chord-chart'
        }
      },
      watch: {
        nodeID: async function(new_val){
          console.log("AHA!")
          console.log(new_val)
          console.log(this.nodeID)
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