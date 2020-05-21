<template>

    <div class="row">


        <info
            v-if="renderComponent"
            icon="icon-lg pe-7f-users"
            bgclass="bg-flat-color-1"
            v-bind:counter="totalNodes"
            title="Total Nodes"
        >
        </info>

        <info
            v-if="renderComponent"
            icon="icon-lg pe-7f-users"
            bgclass="bg-flat-color-2"
            v-bind:counter="totalTypes"
            title="Total Types"
        >
        </info>
        <info
            v-if="renderComponent"
            icon="icon-lg pe-7f-users"
            bgclass="bg-flat-color-3"
            v-bind:counter="totalArtifacts"
            title="Total Artifacts"
        >
        </info>
        <info
            v-if="renderComponent"
            icon="icon-lg pe-7f-users"
            bgclass="bg-flat-color-3"
            v-bind:counter="totalPackages"
            title="Total Packages"
        >
        </info>


    </div>

</template>

<script>
import Info from './dashboard/InfoBox.vue';
import InfoChart from './dashboard/InfoBoxChart.vue';
import InfoChartTwo from './dashboard/InfoBoxChart2.vue';
import RealTime from './dashboard/RealTime.vue';
import Traffic from './dashboard/Traffic.vue';
import Chord from './dashboard/Chord.vue'
import EarningStats from './dashboard/EarningStats.vue';
import Download from './dashboard/Download.vue';
import Revenue from './dashboard/Revenue.vue';


export default{
    name: 'dashboard',
    data: () => {
        return {

          totalNodes: 4242,
          totalTypes: 4242,
          totalArtifacts: 4242,
          totalPackages: 4242,
          renderComponent: true
        }
      },
    components: {
        Info,
        InfoChart,
        InfoChartTwo,
        RealTime,
        Traffic,
        EarningStats,
        Download,
        Revenue,
        Chord
    }, mounted(){
        var slf=this;
        var components = 4
        slf.renderComponent=false;
        $.get('/api/total-types', function (response) {
            slf.totalTypes = response.count;
            components -= 1
            if(components==0){
                slf.renderComponent=true;
            }
          });
        $.get('/api/total-nodes', function (response) {
            slf.totalNodes = response.count;
            components -= 1
            if(components==0){
                slf.renderComponent=true;
            }
          });
        $.get('/api/total-artifacts', function (response) {
            slf.totalArtifacts = response.count;
            components -= 1
            if(components==0){
                slf.renderComponent=true;
            }
          });
        $.get('/api/total-packages', function (response) {
            slf.totalPackages = response.count;
            components -= 1
            if(components==0){
                slf.renderComponent=true;
            }
          });
    }
}


</script>

<style>

</style>
