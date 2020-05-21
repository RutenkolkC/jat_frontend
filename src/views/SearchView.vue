<template>
  <div>
    <div class="row">
      <div class="col-xs-12 col-md-12">
                <card header-text="Search Option">
          <div class="table-responsive">
            <table class="table table-striped first-td-padding">
              <thead>
              <tr>
                <td>Type</td>
                <td>Expression</td>
                <td></td>
              </tr>
              </thead>
              <tbody>

              <template v-for="n in numberOfSearchTerms">

                <tr>
                  <td>
                  <select name="select" v-bind:id="'search_type_'+n" class="form-control">
                    <option value="0">Name</option>
                    <option value="1">Label</option>
                    <option value="2">Visibility</option>
                  </select>
                    
                    </td>
                  <td><input type="text" v-bind:id="'search_expression_'+n" name="text-input" placeholder="Text" class="form-control"></td>
                  <td></td>
                </tr>
                
              </template
              >
              
              </tbody>
            </table>
            <div class="float-left text-r">
                    <button type="button" class="btn btn-primary" v-on:click="incColumns()" ><i class="fa fa-plus"></i>&nbsp; Add Column</button>
            </div>            
            <div class="float-left text-r">
                    <button type="button" class="btn btn-danger" v-on:click="decColumns()" ><i class="fa fa-minus"></i>&nbsp; Remove Column</button>
            </div>

            <div class="float-right text-r">
                    <button type="button" class="btn btn-primary" v-on:click="search()" ><i class="fa fa-search"></i>&nbsp; Search</button>
            </div>            

          </div>
        </card>
        <card header-text="Search Results">
          <div class="table-responsive">
            <table class="table table-striped first-td-padding">
              <thead>
              <tr>
                <td>Name</td>
                <td>Labels</td>
                <td>Fully Qualified Name</td>
                <td>Id</td>
                <td></td>
              </tr>
              </thead>
              <tbody>

              <template v-for="(item, index) in SearchResults">

                <tr>
                  <td>{{item.name}}</td>
                  <td>{{item.labels.join(',')}}</td>
                  <td>{{item.fqn}}</td>
                  <td><router-link :to="{ path: 'detail', query: { id: item.id }}"> {{item.id}}</router-link> </td>
                  <td></td>
                </tr>
                
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

        if(this.$route.query.name){
          $(('#search_expression_1')).val(this.$route.query.name)
          this.search();
        }

        this.interval = setInterval(function () {
          this.loadData();
        }.bind(this), 2000); 
      },
      beforeDestroy: function(){
        clearInterval(this.interval);
      },
      components: {
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
