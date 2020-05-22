<template>
	<div id="chord-chart"></div>
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
      drawChord: async function(){
          const my_data = await this.getImports(this.nodeID);
    
          var width = 440;
          var height = 440;

          var outerRadius = Math.min(width, height) * 0.5;
          var innerRadius = outerRadius - 124;// TODO: fix harcoded offset with text size

          var arc = d3.arc()
              .innerRadius(innerRadius)
              .outerRadius(innerRadius + 20);
          var chord = d3.chord()
              .padAngle(.04)
              .sortSubgroups(d3.descending)
              .sortChords(d3.descending);
          var ribbon = d3.ribbon()
              .radius(innerRadius);
          var color = d3.scaleOrdinal(d3.schemeCategory10);

          d3.select("#chord-chart").selectAll("*").remove()

          var svg = d3.select("#chord-chart")
            .append("svg")
                .attr("viewBox", [-width / 2, -height / 2, width, height])
                .attr("font-size", 10)
                .attr("font-family", "sans-serif")
                .style("width", "100%")
                .style("height", "auto");

          const chords = chord(my_data.matrix);

          const group = svg.append("g")
            .selectAll("g")
            .data(chords.groups)
            .join("g");

          group.append("path")
              .attr("fill", d => color(d.index))
              .attr("stroke", d => color(d.index))
              .attr("d", arc);

          group.append("text")
              .each(d => { d.angle = (d.startAngle + d.endAngle) / 2; })
              .attr("dy", ".35em")
              .attr("transform", d => `
                rotate(${(d.angle * 180 / Math.PI - 90)})
                translate(${innerRadius + 26})
                ${d.angle > Math.PI ? "rotate(180)" : ""}
              `)
              .attr("text-anchor", d => d.angle > Math.PI ? "end" : null)
              .text(d => my_data.nameByIndex.get(d.index));

          svg.append("g")
              .attr("fill-opacity", 0.67)
            .selectAll("path")
            .data(chords)
            .join("path")
              .attr("stroke", d => d3.rgb(color(d.source.index)).darker())
              .attr("fill", d => color(d.source.index))
              .attr("d", ribbon);
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
          this.drawChord()
        }
      },

      //template: "<div :id='canvasId'></div>",
      template: '<div :id="canvasId" class="traffic-chart"></div>',
      async mounted(){
        this.drawChord()
    }
}
</script>

<style>
	@import "../../../../node_modules/chartist/dist/chartist.min.css"
</style>