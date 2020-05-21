<template>
  <tr v-bind:class="'table-' + this.type">

    <td><i class="fa fa-commenting"></i></td>
    <td>
      Message From Server
    </td>
    <td>{{message}}</td>
    
    <td align="right"></td>
    <td align="middle">
      <i v-bind:class="typeToStatusIconClass(this.type)"></i>
    </td>
  </tr>
</template>


<script>
  import BootstrapProgressBar from './progressbar/BootstrapProgressBar.vue'

    export default {
      name: 'progress-table-entry',
      props: {
        type: {
          type: String,
          default: 'success'
        },
        message: {
          type: String,
          default: 'MyTask'
        },

      },
      components: {
        BootstrapProgressBar
      },
      methods :{
        typeToCompletionStatus (tname){
          if(tname === "danger"){
            return "ERROR"
          }
          if(tname === "info"){
            return "QUEUED"
          }
          return tname.toUpperCase()
        },
        typeToStatusIconClass(tname){
          if(tname === "success"){
            return "fa fa-check success-icon icon-right input-icon"
          }          
          if(tname === "warning"){
            return "fa fa-warning icon-right input-icon"
          }
          if(tname === "danger"){
            return "fa fa-exclamation-triangle icon-right input-icon error-icon"
          }
          if(tname === "info"){
            return "fa fa-cog fa-spin"
          }
        }
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
