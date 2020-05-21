<template>
      <div class="col-md-12">
        <card header-text="Choose Project To Analyze">
          <div class="table-responsive">

            <div class="form-check">
                    <div class="radio">
                      <label for="radio1" class="form-check-label ">
                        <input v-model="isLocal" type="radio" id="radio1" name="radios" value="true" class="form-check-input">Local preconfigured project
                      </label>
                    </div>
                    <div class="radio">
                      <label for="radio2" class="form-check-label ">
                        <input v-model="isLocal" type="radio" id="radio2" name="radios" value="false" class="form-check-input">Remote Git Repository
                      </label>
                    </div>
            </div>
                <div class="col-9 col-md-9" v-if="isLocal === 'true'">
                  <select v-model="analyzePath" name="select" id="select" class="form-control">
                    <option value="1">ProB 2 Kernel Test Environment</option>
                    <option value="2">Dummy Entry</option>
                  </select>
                </div>
              <div class="col-9 col-md-9" v-else>
                <input v-model="analyzePath" type="text" placeholder="enter git-repo address here" class="form-control">
                <div class="row col-12 col-md-12">
                  <!-- <div class="col col-md-3"><label for="selectLg" class=" form-control-label">Select Large</label></div> -->
                  <input v-model="buildTask" type="text" placeholder="buildtool task (install, shadowjar, assemble, etc)" class="form-control col col-md-6">
                  <div class="col-12 col-md-6">
                    <select v-model="buildTask" name="selectTask" id="selectTask" class="form-control form-control">
                      <template v-for="(items, index) in buildTasks">
                        <optgroup v-bind:label="items[0]">
                          <template v-for="(item, index2) in items[1]">
                            <option v-bind:value="item">{{item}}</option>
                          </template>
                        </optgroup>
                      </template>
                    </select>
                  </div>
                </div>
                <input v-model="buildDirRelativePath" type="text" placeholder="(Optional) specify build directory" class="form-control">
              </div>
              <template v-for="(item, index) in errors">
                  <div class="alert alert-danger" role="alert" >{{item}}</div>
                </template>
            <div class="float-right text-r">
                    <button type="button" class="btn btn-primary" v-on:click="analyzeRequest()" ><i class="fa fa-star"></i>&nbsp; Start Analysis</button>
            </div>            
            <div class="float-right text-r">
                    <button type="button" class="btn btn-danger" v-on:click="stopAndReset()" ><i class="fa fa-ban"></i>&nbsp; Stop/Reset</button>
            </div>
          </div>
        </card>
      </div>
</template>

<script>
  import BootstrapProgressBar from './progressbar/BootstrapProgressBar.vue'
  import ProgressTableEntry from './ProgressTableEntry.vue'
  import $ from 'jquery'


 

    export default {
      data: () => {
        return {
          buildTasks: [["maven suggestions",["package","install","clean"]],["gradle suggestions",["build","jar","shadowjar"]]],
          errors: [],
          isLocal: 'true',
          analyzePath: '',
          buildTask: '',
          buildDirRelativePath: ''
          
        }
      },
      methods: {
        alertIsLocal : function () {
          console.log(this.isLocal)
          console.log(this.analyzePath)
          
        },
        stopAndReset: function() {
          $.post('/api/reset')
          this.$toasted.show("Reset has been issued. Please wait...",
          {    action : {
                text : 'OK',
                onClick : (e, toastObject) => {
                    toastObject.goAway(0);
                }
            },
});
        },
        analyzeRequest: function() {
          this.errors = []
          if( (!(this.isLocal === 'true')) && (!this.buildTask)){
            this.errors = ["You must supply a build task for the application to be built."]
            return
          }
          if(!(this.analyzePath.startsWith("http"))){
            this.errors = ["You must supply a http link to the git repository (ssh causes docker issues)."]
            return
          }

          const clone = JSON.parse(JSON.stringify(this.$data)) //lmao. i have no idea how to js. I fear this is the "best" solution in some sense
          delete clone.buildTasks
          $.post('/api/analyze',clone)
        }
      },
      mounted: function () {
        
      },
      beforeDestroy: function(){
        
      },
      components: {
        BootstrapProgressBar,
        ProgressTableEntry
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
