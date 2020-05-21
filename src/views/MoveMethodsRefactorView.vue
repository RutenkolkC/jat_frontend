<template>
  <div>
    <div class="row">

      <div class="col-xs-12 col-md-12">
        <button  v-on:click="doRefactor()" class="col-xs-12 col-md-12 btn btn-warning">{{'Move Method \"'+methodToMove+'\" from '+id_1+' to '+id_2}}</button>
      </div>
      <div class="col-xs-6 col-md-6">
                <card header-text="Search Source Class">
                  <input type="text" v-bind:value="id_1" name="text-input" placeholder="ID 1" class="form-control">
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

              <template v-for="n in numberOfSearchTerms1">

                <tr>
                  <td>
                  <select name="select" v-bind:id="'search1_type_'+n" class="form-control">
                    <option value="0">Name</option>
                    <option value="1">Label</option>
                    <option value="2">Visibility</option>
                  </select>
                    
                    </td>
                  <td><input type="text" v-bind:id="'search1_expression_'+n" name="text-input" placeholder="Text" class="form-control"></td>
                  <td></td>
                </tr>
                
              </template
              >
              
              </tbody>
            </table>
            <div class="float-left text-r">
                    <button type="button" class="btn btn-primary" v-on:click="incColumns1()" ><i class="fa fa-plus"></i>&nbsp; Add Column</button>
            </div>            
            <div class="float-left text-r">
                    <button type="button" class="btn btn-danger" v-on:click="decColumns1()" ><i class="fa fa-minus"></i>&nbsp; Remove Column</button>
            </div>

            <div class="float-right text-r">
                    <button type="button" class="btn btn-primary" v-on:click="search1()" ><i class="fa fa-search"></i>&nbsp; Search</button>
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

              <template v-for="(item, index) in SearchResults1">

                <tr v-on:click="setid1(item)">
                  <td>{{item.name}}</td>
                  <td>{{item.labels.join(',')}}</td>
                  <td>{{item.fqn}}</td>
                  <td>{{item.id}}</td>
                  <td></td>
                </tr>
                
              </template>
              </tbody>
            </table>
          </div>
        </card>
      </div>

      <div class="col-xs-6 col-md-6">
                <card header-text="Search Target Class">

                  <input type="text" v-bind:value="id_2" name="text-input" placeholder="ID 2" class="form-control">
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

              <template v-for="n in numberOfSearchTerms2">

                <tr>
                  <td>
                  <select name="select" v-bind:id="'search2_type_'+n" class="form-control">
                    <option value="0">Name</option>
                    <option value="1">Label</option>
                    <option value="2">Visibility</option>
                  </select>
                    
                    </td>
                  <td><input type="text" v-bind:id="'search2_expression_'+n" name="text-input" placeholder="Text" class="form-control"></td>
                  <td></td>
                </tr>
                
              </template
              >
              
              </tbody>
            </table>
            <div class="float-left text-r">
                    <button type="button" class="btn btn-primary" v-on:click="incColumns2()" ><i class="fa fa-plus"></i>&nbsp; Add Column</button>
            </div>            
            <div class="float-left text-r">
                    <button type="button" class="btn btn-danger" v-on:click="decColumns2()" ><i class="fa fa-minus"></i>&nbsp; Remove Column</button>
            </div>

            <div class="float-right text-r">
                    <button type="button" class="btn btn-primary" v-on:click="search2()" ><i class="fa fa-search"></i>&nbsp; Search</button>
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

              <template v-for="(item, index) in SearchResults2">

                <tr v-on:click="setid2(item.id)">
                  <td>{{item.name}}</td>
                  <td>{{item.labels.join(',')}}</td>
                  <td>{{item.fqn}}</td>
                  <td>{{item.id}}</td>
                  <td></td>
                </tr>
                
              </template>
              </tbody>
            </table>
          </div>
        </card>
      </div>

    

    </div>


      <div class="col-xs-12 col-md-12">
                <card header-text="Methods">

          <div class="table-responsive">
            <table class="table table-striped first-td-padding">
              <thead>
              <tr>
                <td></td>
                <td>Method Signature</td>
              </tr>
              </thead>
              <tbody>

              <template v-for="(n, index) in methodsOfClass">

                <tr v-bind:class="{ 'table-success': n.name === methodToMove}" v-on:click="selectMoveMethod(n)">
                  <td>
                    <span v-if="n.name === methodToMove" class="badge badge-pill badge-primary">Selected</span>
                  </td>
                  <td>{{n.signature}}</td>
                </tr>                

                
              </template>
              
              </tbody>
            </table>
      

          </div>
        </card>

      </div>

  </div>
</template>

<script>
  import $ from 'jquery'

    export default {
      data: () => {
        return {
          interval: null,
          numberOfSearchTerms1: 1,
          numberOfSearchTerms2: 1,
          id_1:42,
          id_2:21,
          SearchResults1:  [ 
            {name: "Example result",
              labels: ["a","b","c"],
              id: 42,
              fqn: "package.classname"}
              ],
          SearchResults2:  [ 
            {name: "Example result",
              labels: ["a","b","c"],
              id: 42,
              fqn: "package.classname"}
              ],
          methodsOfClass: [{signature: "someMethod"}, {signature: "anotherMethod"}],
          methodToMove: "someMethod"
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
        selectMoveMethod: function (methodObj) {
          this.methodToMove=methodObj.name;
        },
        incColumns1: function() {
          this.numberOfSearchTerms1 += 1;
        },
        decColumns1: function() {
          this.numberOfSearchTerms1 -= 1;
        },
        incColumns2: function() {
          this.numberOfSearchTerms2 += 1;
        },
        decColumns2: function() {
          this.numberOfSearchTerms2 -= 1;
        },
        setid1: function(item) {
          var n = item.id;

          this.id_1 = n;
          var slf = this;
          $.ajax
          ({
              type: "GET",
              url: '/api/node-info/'+n,
              dataType: 'json',
              contentType: 'application/json',
              success: function (response) {
                slf.methodsOfClass = response["declared-methods"];
              }
          })

        

        },
        setid2: function(n) {
          this.id_2 = n;
        },
        search1: function() {
          var requestObj = [];
          for(var i=1;i<this.numberOfSearchTerms1+1;i++){
            var t = $(('#search1_type_'+i)).val();
            var ex = $(('#search1_expression_'+i)).val();
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
                slf.SearchResults1 = response;
              }
          })

        },
        search2: function() {
          var requestObj = [];
          for(var i=1;i<this.numberOfSearchTerms2+1;i++){
            var t = $(('#search2_type_'+i)).val();
            var ex = $(('#search2_expression_'+i)).val();
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
                slf.SearchResults2 = response;
              }
          })

        },
        doRefactor: function() {
          var requestObj = {fromClassfqn: this.SearchResults1.filter(s=>s.id===this.id_1)[0].fqn,
                            toClassfqn: this.SearchResults2.filter(s=>s.id===this.id_2)[0].fqn,
                            methodName: this.methodToMove};
          var slf = this;
          $.ajax
          ({
              type: "POST",
              url: '/refactor/move_methods',
              async: true,
              data: requestObj,
              success: function (response) {
                console.log(response)
              }
          })

        },
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
