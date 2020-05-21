<template>
    <div class="col-lg-6">
        <div class="card">
            <div class="card-top">
                <h4 class="card-title m-0 float-left">Edge Bundling Diagram of node </h4><!-- /.content-title -->
                <div class="float-right text-r">
                    <button class="content-settings" data-toggle="tooltip" data-placement="top" title="Settings"><i class="fa fa-cog"></i></button>
                    <button class="content-collapse" data-toggle="tooltip" data-placement="top" title="Collapse"><i class="fa fa-angle-down"></i></button>
                    <button class="content-close" data-toggle="tooltip" data-placement="top" title="Close"><i class="fa fa-close"></i></button>
                </div>

            </div><!-- /.card-top -->
            <div class="card-body pb-0">
                <edge-bundling :nodeID="+nodeid"/>
            </div>


        </div>
    </div>
</template>

<script>

import EdgeBundling from './charts/EdgeBundling.vue';

export default{

    props: {
        nodeid: {
            type: Number,
            default: 146
        }
    },
    //props: ['icon', 'symbol', 'counter', 'title', 'bgclass', 'hasPercentage', 'canvasId'],
    components:{
        EdgeBundling
    }
}
</script>