<template>
  <div>
    <div class="row">
      <div class="col-xs-12 col-md-12">
<router-link :to="{ path: 'guirefactor/merge', query: {}}">
  <info
    icon="icon-lg pe-7f-users"
    bgclass="bg-flat-color-1"
    title="Merge Classes">
  </info>
</router-link>
<router-link :to="{ path: 'guirefactor/split', query: {}}">
  <info
    icon="icon-lg pe-7f-users"
    bgclass="bg-flat-color-2"
    title="Split Class in Two Classes">
  </info>
</router-link>
<router-link :to="{ path: 'guirefactor/move', query: {}}">
  <info
    icon="icon-lg pe-7f-users"
    bgclass="bg-flat-color-3"
    title="Move Methods">
  </info>
</router-link>




      </div>

    </div>



  </div>
</template>

<script>

  import Info from './dashboard/InfoBoxText.vue';
  import $ from 'jquery'

    export default {
      data: () => {
        return {
          interval: null,
          numberOfSearchTerms: 1,
          SearchResults:  [ 
            {name: "Example result",
              labels: ["a","b","c"],
              id: 42,
              fqn: "package.classname"}
              ]
        }
      },
      methods: {
        loadData: function () {
          $.get('/analyze/status', function (response) {
            this.dataTable = response;
          }.bind(this));
        },
        analyzeRequest: function() {
          $.post('/api/analyze?/home/wiredaemon/test')
        },
        incColumns: function() {
          this.numberOfSearchTerms += 1;
        },
        decColumns: function() {
          this.numberOfSearchTerms -= 1;
        },
        search: function() {
          var requestObj = [];
          for(var i=1;i<this.numberOfSearchTerms+1;i++){
            var t = $(('#search_type_'+i)).val();
            var ex = $(('#search_expression_'+i)).val();
            requestObj.push([t,ex]);
          }
          var slf = this;
          console.log(requestObj)
          $.ajax
          ({
              type: "POST",
              url: '/api/search',
              dataType: 'json',
              contentType: 'application/json',
              async: true,
              data: JSON.stringify(requestObj),
              success: function (response) {
                console.log(response)
                slf.SearchResults = response;
              }
          })

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
        Info
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
