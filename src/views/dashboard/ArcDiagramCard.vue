<template>
    <div class="col-lg-12">
        <div class="card">
            <div class="card-top">
                <h4 class="card-title m-0 float-left">{{cardTitle}} </h4><!-- /.content-title -->
                <div class="float-right text-r">
                    <button class="content-settings" data-toggle="tooltip" data-placement="top" title="Settings"><i class="fa fa-cog"></i></button>
                    <button class="content-collapse" data-toggle="tooltip" data-placement="top" title="Collapse"><i class="fa fa-angle-down"></i></button>
                    <button class="content-close" data-toggle="tooltip" data-placement="top" title="Close"><i class="fa fa-close"></i></button>
                </div>

            </div><!-- /.card-top -->
            <div class="card-body pb-0">
                <arc-diagram :nodeID="+nodeid" :apiQuery="apiQuery"/>
            </div>


        </div>
    </div>
</template>

<script>

import ArcDiagram from './charts/ArcDiagram.vue';

export default{

    props: {
        nodeid: {
            type: Number,
            default: 146
        },
        apiQuery: {
            type: String,
            default:  "api/package-listing-by-id/"
        },
        cardTitle: {
            type: String,
            default:  "Arc Diagram of node"
        },
    },
    //props: ['icon', 'symbol', 'counter', 'title', 'bgclass', 'hasPercentage', 'canvasId'],
    components:{
        ArcDiagram
    }
}
</script>