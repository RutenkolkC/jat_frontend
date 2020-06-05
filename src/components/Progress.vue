<template>
  <div>
    <div class="row">
      <project-chooser>
      </project-chooser>
      <div class="col-md-12">
        <card header-text="Progress Report">
          <div class="table-responsive">
            <table class="table table-striped table-sm color-icon-label-table">
              <thead>
              <tr>
                <td></td>
                <td>Task</td>
                <td>Progress</td>
                <td align="right">Time Elapsed</td>
                <td align="middle"></td>
              </tr>
              </thead>
              <tbody>
                <template v-for="(item, index) in dataTable">
                  <progress-table-entry 
                    v-bind:name="item['name']" 
                    v-bind:amount="+item['percent']" 
                    v-bind:elapsedTime="+item['elapsed-time']" 
                    v-bind:type="item['status']"></progress-table-entry>
                  <progress-table-message
                    v-if="item['message']"
                    v-bind:type="item['status']"
                    v-bind:message="item['message']"> </progress-table-message>
                </template>
              </tbody>
            </table>
          </div>
        </card>
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

 

    export default {
      data: () => {
        return {
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
        loadData: function () {
          $.get('/api/progress-status', function (response) {
            this.dataTable = response;
          }.bind(this));
        },
        analyzeRequest: function() {
          $.post('/api/analyze?/home/wiredaemon/test')
        }
      },
      mounted: function () {
        this.loadData();

        this.interval = setInterval(function () {
          this.loadData();
        }.bind(this), 2000); 
      },
      beforeDestroy: function(){
        clearInterval(this.interval);
      },
      components: {
        BootstrapProgressBar,
        ProgressTableEntry,
        ProgressTableMessage,
        ProjectChooser
      }
  }
</script>

<style lang="scss">
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
