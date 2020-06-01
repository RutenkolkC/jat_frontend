<template>
  <div>
    <div class="row">


        <div class="col-md-12 panel panel-default">

              <div class="row form-group">
                <div class="col col-md-3"><label for="text-input" class=" form-control-label">Node ID:</label></div>
                <div class="col-12 col-md-9">
                  <input v-model="lastSelectedNodeID" type="text" placeholder="Please enter Node ID" class="form-control">
                </div>
              </div>
        </div>
        <div class="col-md-12 panel panel-default">
          <table class="table table-striped first-td-padding">
              <thead>
              <tr>
                <td>Name</td>
                <td>Labels</td>
              </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{nodeInfo.name}}</td>
                  <td>{{nodeInfo.labels}}</td>
                </tr>

               
              </tbody>
          </table>

            </div>

          <div class="col-md-6 panel panel-default" v-if="nodeInfo.labels.includes('Package')">
            <argument-table :description="'Arguments for Layered Architecture'" 
                            :archArguments="[['DEPENDS_ON Relation corresponds to Package Hierarchy?',layer_pro_1],
                                             ['Dependency condensation corresponds to Package Hierarchy?',layer_pro_2]]"/>
            <argument-table :description="'Arguments against Layered Architecture'" 
                            :archArguments="[['Low number of strong connected components in Dependency Graph?',layer_contra_1],
                                             ['Seperator sets in dependency graph are small?',layer_contra_2]]"/>
          </div>
          <div class="col-md-6 panel panel-default" v-if="nodeInfo.labels.includes('Package')">

            <argument-table :description="'Arguments for Ports and Adapters Architecture'" 
                :archArguments="[['Low number of packages in components in dependency graph?',ports_and_adapters_pro_1],
                                 ['Condensation of dependency graph contains few sinks?',ports_and_adapters_pro_2]]"/>
            <argument-table :description="'Arguments against Ports and Adapters Architecture'" 
                :archArguments="[['Low number of strongly connected components in dependency graph?',ports_and_adapters_contra_1]]"/>
          </div>
          
          <div class="col-md-6 panel panel-default" v-if="nodeInfo.labels.includes('Type')">
            <argument-table :description="'Arguments for Factory'" 
                :archArguments="[['Name ends on factory?',factory_pro_1],
                                 ['Only declares methods with same return Type?',factory_pro_2]]"/>
            <argument-table :description="'Arguments against Factory'" 
                :archArguments="[['Only declares void Methods?',factory_contra_1]]"/>
          </div>
          
          <div class="col-md-6 panel panel-default" v-if="nodeInfo.labels.includes('Type')">
            <argument-table :description="'Arguments for Singleton'" 
                :archArguments="[['Name ends on Singleton?',singleton_pro_1],
                                 ['All constructors are private?',singleton_pro_2],
                                 ['Declares a static class variable of same Type as Class?',singleton_pro_3]]"/>
            <argument-table :description="'Arguments for Builder'" 
                :archArguments="[['Name ends on builder?',builder_pro_1],
                                 ['Declares high number of methods which have return type that is the same as class?',builder_pro_2],
                                 ['Only declares one Method that does not have return type which is the same as the class?',builder_pro_3]]"/>
            
          </div>
    </div>

    <div class="row">

          <Chord :id="lastSelectedNodeIDPackage"
                 :cycloComplexSum="lastSelectedNode.cycloComplexSum"
                 :size="lastSelectedNode.size"
                 :parentCycloComplexSum="lastSelectedNode.parent.cycloComplexSum"
                 :parentSize="lastSelectedNode.parent.size"/>

          <edge-bundling-card :nodeid="lastSelectedNodeIDPackage"/>
          <arc-diagram-card :nodeid="lastSelectedNodeIDPackage" :cardTitle="'Dependencies in this package'"/>
          <arc-diagram-card  v-if="nodeInfo.labels.includes('Package')" :nodeid="lastSelectedNodeIDPackage" :apiQuery="'api/inter-package-fas/'" :cardTitle="'Dependencies between this package and direct dependencies'"/>
      </div>
    
  </div>
</template>

<script>
  import BootstrapProgressBar from '../components/progressbar/BootstrapProgressBar.vue'
  import ProgressTableEntry from '../components/ProgressTableEntry.vue'
  import ProgressTableMessage from '../components/ProgressTableMessage.vue'
  import $ from 'jquery'

  import ProjectChooser from '../components/ProjectChooser.vue'
  import {tree} from 'vued3tree'
  import { ToggleButton } from 'vue-js-toggle-button'

  import DNDTree from '../components/DNDTree.vue'
  import VueSlider from 'vue-slider-component'
  import 'vue-slider-component/theme/default.css'
  import Chord from '../views/dashboard/Chord.vue'
  import EdgeBundlingCard from "../views/dashboard/EdgeBundlingCard.vue"
  import ArcDiagramCard from "../views/dashboard/ArcDiagramCard.vue"
  import ArgumentTable from "../components/ArgumentTable.vue"

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
      layer_pro_1: false,
      layer_pro_2: false,
      layer_contra_1: false,
      layer_contra_2: false,
      ports_and_adapters_pro_1: false,
      ports_and_adapters_pro_2: false,
      ports_and_adapters_contra_1: false,

      factory_pro_1: false,
      factory_pro_2: false,
      factory_contra_1: false,

      singleton_pro_1: false,
      singleton_pro_2: false,
      singleton_pro_3: false,

      builder_pro_1: false,
      builder_pro_2: false,
      builder_pro_3: false,


      
      layoutType:true,
      viewType:true,
      lastSelectedNode: {name: "nothing selected yet",
                         cycloComplexSum: 42,
                         size: 21,
                         parent: {cycloComplexSum: 84,
                                  size: 84}},
      nodeInfo: {name: "nothing selected yet",
                         cycloComplexSum: 42,
                         size: 21,
                         parent: {cycloComplexSum: 84,
                                  size: 84}},
      lastSelectedNodeID: "1",
      lastSelectedNodeIDPackage: "1",
      idmap:{
        "father": 42
      },
      interval: null,
      dnd_js: null
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
          $.get("api/package-of/"+this.lastSelectedNodeID,{},function(response){
            slf.lastSelectedNodeIDPackage=response
          })

          $.get("api/layer-pro-1/"+this.lastSelectedNodeID,{},function(response){
            slf.layer_pro_1=response
          })
          $.get("api/layer-pro-2/"+this.lastSelectedNodeID,{},function(response){
            slf.layer_pro_2=response
          })
          $.get("api/layer-contra-1/"+this.lastSelectedNodeID,{},function(response){
            slf.layer_contra_1=response
          })
          $.get("api/layer-contra-2/"+this.lastSelectedNodeID,{},function(response){
            slf.layer_contra_2=response
          })
          $.get("api/ports-and-adapters-pro-1/"+this.lastSelectedNodeID,{},function(response){
            slf.ports_and_adapters_pro_1=response
          })
          $.get("api/ports-and-adapters-pro-2/"+this.lastSelectedNodeID,{},function(response){
            slf.ports_and_adapters_pro_2=response
          })
          $.get("api/ports-and-adapters-contra-1/"+this.lastSelectedNodeID,{},function(response){
            slf.ports_and_adapters_contra_1=response
          })

          $.get("api/factory-pro-1/"+this.lastSelectedNodeID,{},function(response){
            slf.factory_pro_1=response
          })
          $.get("api/factory-pro-2/"+this.lastSelectedNodeID,{},function(response){
            slf.factory_pro_2=response
          })
          $.get("api/factory-contra-1/"+this.lastSelectedNodeID,{},function(response){
            slf.factory_contra_1=response
          })
          $.get("api/singleton-pro-1/"+this.lastSelectedNodeID,{},function(response){
            slf.singleton_pro_1=response
          })
          $.get("api/singleton-pro-2/"+this.lastSelectedNodeID,{},function(response){
            slf.singleton_pro_2=response
          })
          $.get("api/singleton-pro-3/"+this.lastSelectedNodeID,{},function(response){
            slf.singleton_pro_3=response
          })
          $.get("api/builder-pro-1/"+this.lastSelectedNodeID,{},function(response){
            slf.builder_pro_1=response
          })
          $.get("api/builder-pro-2/"+this.lastSelectedNodeID,{},function(response){
            slf.builder_pro_2=response
          })
          $.get("api/builder-pro-3/"+this.lastSelectedNodeID,{},function(response){
            slf.builder_pro_3=response
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
        
        $.get("/api/package-hierarchy-root-complete", function (response) {
            this.dnd_js = response; // TODO: use this info to display stuff (find out how to retrieve a single node by id and set last selectedNode to this retrieved node)
        })


        this.loadData();

        if(this.$route.query.id){
          this.lastSelectedNodeID = +this.$route.query.id;
          this.loadNodeInfo(this.lastSelectedNodeID);
          var slf = this

          $.get("api/package-of/"+this.lastSelectedNodeID,{},function(response){
            slf.lastSelectedNodeIDPackage=response
          })

          $.get("api/layer-pro-1/"+this.lastSelectedNodeID,{},function(response){
            slf.layer_pro_1=response
          })
          $.get("api/layer-pro-2/"+this.lastSelectedNodeID,{},function(response){
            slf.layer_pro_2=response
          })
          $.get("api/layer-contra-1/"+this.lastSelectedNodeID,{},function(response){
            slf.layer_contra_1=response
          })
          $.get("api/layer-contra-2/"+this.lastSelectedNodeID,{},function(response){
            slf.layer_contra_2=response
          })
          $.get("api/ports-and-adapters-pro-1/"+this.lastSelectedNodeID,{},function(response){
            slf.ports_and_adapters_pro_1=response
          })
          $.get("api/ports-and-adapters-pro-2/"+this.lastSelectedNodeID,{},function(response){
            slf.ports_and_adapters_pro_2=response
          })
          $.get("api/ports-and-adapters-contra-1/"+this.lastSelectedNodeID,{},function(response){
            slf.ports_and_adapters_contra_1=response
          })

          $.get("api/factory-pro-1/"+this.lastSelectedNodeID,{},function(response){
            slf.factory_pro_1=response
          })
          $.get("api/factory-pro-2/"+this.lastSelectedNodeID,{},function(response){
            slf.factory_pro_2=response
          })
          $.get("api/factory-contra-1/"+this.lastSelectedNodeID,{},function(response){
            slf.factory_contra_1=response
          })
          $.get("api/singleton-pro-1/"+this.lastSelectedNodeID,{},function(response){
            slf.singleton_pro_1=response
          })
          $.get("api/singleton-pro-2/"+this.lastSelectedNodeID,{},function(response){
            slf.singleton_pro_2=response
          })
          $.get("api/singleton-pro-3/"+this.lastSelectedNodeID,{},function(response){
            slf.singleton_pro_3=response
          })
          $.get("api/builder-pro-1/"+this.lastSelectedNodeID,{},function(response){
            slf.builder_pro_1=response
          })
          $.get("api/builder-pro-2/"+this.lastSelectedNodeID,{},function(response){
            slf.builder_pro_2=response
          })
          $.get("api/builder-pro-3/"+this.lastSelectedNodeID,{},function(response){
            slf.builder_pro_3=response
          })
        }
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
        ArcDiagramCard,
        ArgumentTable
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
