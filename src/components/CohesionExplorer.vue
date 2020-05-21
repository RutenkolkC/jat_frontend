<template>
  <div>
    <div class="row">
      <div class="col-md-12 p-12">

        <!--
        <card header-text="Explore Tree">
          <div class="float-right text-r">
            <toggle-button 
              v-model="layoutType"
              :value="false"
               color="#82C7EB"
               :sync="true"
               :labels="{checked: 'circular', unchecked: 'euclidean'}"/>
            <toggle-button 
              v-model="viewType"
              :value="false"
               color="#82C7EB"
               :sync="true"
               :labels="{checked: 'tree', unchecked: 'cluster'}"/>

            </div>
          <div class="col-md-12 panel panel-default" >
            <tree
            :zoomable="true"
            v-on:clicked="nodeClicked"
             ref="treeview" style="height:80vh;" :data="tree" node-text="name" 
            :layoutType="layoutType?'euclidean':'circular'"
            :type="viewType?'tree':'cluster'"
            ></tree>
          </div>
        </card>-->
      <card header-text="Explore Tree">
        <div class="float-right">
          <vue-slider
            ref="slider"
            v-model="sliderValue"
            v-bind="sliderOptions"></vue-slider>
        </div>
        <div class="float-right">
          <vue-slider
            ref="height-adjust-slider"
            v-model="heightAdjust"
            v-bind="heightAdjustOptions"></vue-slider>
        </div>
        <br>
        <div class="col-md-12 panel panel-default">
          <d-n-d-tree ref="dndtree"
          :linkLengthFactor="sliderValue"
          :heightFactor="heightAdjust"
          v-on:node-select="nodeSelect"
          ></d-n-d-tree>
        </div>
      </card>
      <card header-text="General Info">
        <div class="col-md-12 panel panel-default">
          <table class="table table-striped table-sm color-icon-label-table">
              <thead>
              <tr>
                <td>Selected Name</td>
                <td>DEPENDS_ON Relation corresponds to Package Hierarchy?</td>
              </tr>
              </thead>
              <tbody>
                <td>{{lastSelectedNode.name}}</td>
                <td>{{layer_pro_1 * 100}} %</td>
              </tbody>
          </table>
        </div>
      </card>
          <Chord :id="lastSelectedNodeID"
                 :cycloComplexSum="lastSelectedNode.cycloComplexSum"
                 :size="lastSelectedNode.size"
                 :parentCycloComplexSum="lastSelectedNode.parent.cycloComplexSum"
                 :parentSize="lastSelectedNode.parent.size"/>

          <edge-bundling-card :nodeid="lastSelectedNodeID"/>
          <arc-diagram-card :nodeid="lastSelectedNodeID"/>
      </div>
    </div>
  </div>
</template>

<script>
  import BootstrapProgressBar from './progressbar/BootstrapProgressBar.vue'
  import ProgressTableEntry from './ProgressTableEntry.vue'
  import ProgressTableMessage from './ProgressTableMessage.vue'
  import $ from 'jquery'

  import ProjectChooser from './ProjectChooser.vue'
  import {tree} from 'vued3tree'
  import { ToggleButton } from 'vue-js-toggle-button'

  import DNDTree from './DNDTree.vue'
  import VueSlider from 'vue-slider-component'
  import 'vue-slider-component/theme/default.css'
  import Chord from '../views/dashboard/Chord.vue'
  import EdgeBundlingCard from "../views/dashboard/EdgeBundlingCard.vue"
  import ArcDiagramCard from "../views/dashboard/ArcDiagramCard.vue"

    export default {
      data: () => {
        return {
          tree: {
        name: "father",
        children:[{
          name: "son1",
          children:[ {name: "grandson"}, {name: "grandson2"}]
        },{
          name: "son2",
          children:[ {name: "grandson3"}, {name: "grandson4"}]
        }]
      },
      layer_pro_1: 0.0,
      sliderValue: 2.5,
      sliderOptions: {
        dotSize: 14,
        width: '20vw',
        height: 4,
        contained: false,
        direction: 'ltr',
	      data: null,
        min: 0.1,
        max: 10,
        interval: 0.1,
        disabled: false,
        clickable: true,
        duration: 0.5,
        adsorb: false,
        lazy: false,
        tooltip: 'focus',
        tooltipPlacement: 'top',
        tooltipFormatter: void 0,
        useKeyboard: false,
        enableCross: true,
        fixed: false,
        minRange: void 0,
        maxRange: void 0,
        order: true,
        marks: false,
        dotOptions: void 0,
        process: true,
        dotStyle: void 0,
        railStyle: void 0,
        processStyle: void 0,
        tooltipStyle: void 0,
        stepStyle: void 0,
        stepActiveStyle: void 0,
        labelStyle: void 0,
        labelActiveStyle: void 0,
      },
      heightAdjust: 0.2,
      heightAdjustOptions: {
        dotSize: 14,
        width: '20vw',
        height: 4,
        contained: false,
        direction: 'ltr',
	      data: null,
        min: 0.01,
        max: 1,
        interval: 0.01,
        disabled: false,
        clickable: true,
        duration: 0.5,
        adsorb: false,
        lazy: false,
        tooltip: 'focus',
        tooltipPlacement: 'top',
        tooltipFormatter: void 0,
        useKeyboard: false,
        enableCross: true,
        fixed: false,
        minRange: void 0,
        maxRange: void 0,
        order: true,
        marks: false,
        dotOptions: void 0,
        process: true,
        dotStyle: void 0,
        railStyle: void 0,
        processStyle: void 0,
        tooltipStyle: void 0,
        stepStyle: void 0,
        stepActiveStyle: void 0,
        labelStyle: void 0,
        labelActiveStyle: void 0,
      },
      layoutType:true,
      viewType:true,
      lastSelectedNode: {name: "nothing selected yet",
                         cycloComplexSum: 42,
                         size: 21,
                         parent: {cycloComplexSum: 84,
                                  size: 84}},
      lastSelectedNodeID: 0,
      idmap:{
        "father": 42
      },
          interval: null,
          dataTable:  [ 
            {name: "SAMPLE TASK",
              percent: 42,
              'elapsed-time': 21,
              status: "success",
              message: ""},
            {name: "SAMPLE TASK",
              percent: 41,
              'elapsed-time': 32,
              status: "danger",
              message: "Error Message."},
            {name: "SAMPLE TASK",
              percent: 43,
              'elapsed-time': 26,
              status: "warning",
              message: ""},
            {name: "SAMPLE TASK",
              percent: 21,
              'elapsed-time': 73,
              status: "info",
              message: ""}
              ]
        }
      },
      methods: {
        loadNodeInfo: function (nodeID){
          $.get("/api/tree-node-info/"+nodeID, function (hmm) {
            this.nodeInfo = hmm
          }.bind(this))
        },
        loadData: function () {
          $.get('/api/package-hierarchy-root', function (response) {
          //$.get('/api/package-hierarchy-root-complete', function (response) {
            this.tree = response.tree;
            this.idmap = response.idmap;
            //this.$refs.treeview.collapseAll(this.tree)
          }.bind(this));

        },
        nodeSelect:function(in_node) {
          this.lastSelectedNode=in_node
          this.lastSelectedNodeID=+(in_node.name.split(/[()]/))[1];
          this.loadNodeInfo(this.lastSelectedNodeID);
          var slf = this
          $.get("api/layer-pro-1/"+this.lastSelectedNodeID,{},function(response){
            console.log("OUIIII")
            console.log(response)
            slf.layer_pro_1=response
          })
        },
        nodeClicked: function(in_data) {
          return 
            this.$refs.treeview.expandAll(in_data.data)
            return
          var node = in_data.element
          if (node.children) {
              this.$refs.treeview.collapse(node)
              //node._children = node.children;
              //node.children = null;
          } else {
              this.$refs.treeview.expand(node)
              //node.children = node._children;
              //node._children = null;
          }
          //update(d);
        },
        analyzeRequest: function() {
          $.post('/api/analyze?/home/wiredaemon/test')
        }
      },
      mounted: function () {
        this.loadData();

        this.interval = setInterval(function () {
          
        }.bind(this), 2000); 
      },
      beforeDestroy: function(){
        clearInterval(this.interval);
      },
      components: {
        BootstrapProgressBar,
        ProgressTableEntry,
        ProgressTableMessage,
        ProjectChooser,
        tree,
        DNDTree,
        ToggleButton,
        VueSlider,
        Chord,
        EdgeBundlingCard,
        ArcDiagramCard
      }
  }
</script>

<style lang="scss">
  .half-height{
    height: 50%;
  }
  .table thead tr{
    color: #007bff;
  }
  .error-icon{
    color: #e34a4a;
  }
  .success-icon {
    display: inline-block;
    color: #4ae387;
  }
  .table-sm th, .table-sm td{
    padding: .7rem;
  }
  .color-icon-label-table {
    td:first-child {
      width: 1rem;
    }
  }
</style>
