<template>
  <table class="table table-striped first-td-padding">
    <thead>
    <tr>
      <td>{{description}}</td>
      <td></td>
    </tr>
    </thead>
    <tbody>
      <template v-for="([argumentDescription,argumentValue], index) in archArguments">
        <tr>
          <td>{{argumentDescription}}</td>
          <td v-if="argumentValue"><i class="fa fa-check"></i></td>
          <td v-if="!argumentValue"><i class="fa fa-times"></i></td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<script>

    export default {
    props: {
           description: {
            type: String,
             default: "description"
           },
            archArguments: {
            type: Array,
             default: []
           },
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
