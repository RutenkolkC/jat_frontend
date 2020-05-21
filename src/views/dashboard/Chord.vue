<template>
    <div class="col-lg-6">
        <div class="card">
            <div class="card-top">
                <h4 class="card-title m-0 float-left">Chord Diagram of node {{this.id}}</h4><!-- /.content-title -->
                <div class="float-right text-r">
                    <button class="content-settings" data-toggle="tooltip" data-placement="top" title="Settings"><i class="fa fa-cog"></i></button>
                    <button class="content-collapse" data-toggle="tooltip" data-placement="top" title="Collapse"><i class="fa fa-angle-down"></i></button>
                    <button class="content-close" data-toggle="tooltip" data-placement="top" title="Close"><i class="fa fa-close"></i></button>
                </div>

            </div><!-- /.card-top -->
            <div class="card-body pb-0">
                <ChordChart3 :nodeID="this.id" myprop="halli hallo bla bla"/>
            </div>
            <div class="card-footer bg-white br-0 pl-5 pr-5 pt-0 pb-5">
                <div class="row">
                    <div class="col-md-4">
                        <div class="item text-center">
                            <span class="text-muted">Size</span>
                            <h4 class="m-0 text-up pb-1">{{size}} Elements ({{((size/parentSize)*100).toFixed(3)}}% of Parent)</h4>
                            <div class="progress progress-thin">
                                <div
                                    class="progress-bar bg-success"
                                    role="progressbar"
                                    :style="'width: '+((size/parentSize)*100)+'%;'"
                                    aria-valuenow="25"
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                ></div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="item text-center">
                            <span class="text-muted">Cyclomatic</span>
                            <h4 class="m-0 text-up pb-1">{{cycloComplexSum}} Combined Complexity ({{((cycloComplexSum/(parentCycloComplexSum+1))*100).toFixed(3)}}% of Parent)</h4>
                            <div class="progress progress-thin">
                                <div
                                    class="progress-bar bg-info"
                                    role="progressbar"
                                    :style="'width: '+(cycloComplexSum/(parentCycloComplexSum+1))*100+'%;'"
                                    aria-valuenow="25"
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                ></div>
                            </div>
                        </div>
                    </div>
                    <!--
                    <div class="col-md-4">
                        <div class="item text-center">
                            <span class="text-muted">Visits</span>
                            <h4 class="m-0 text-up pb-1">29.703 Users (40%)</h4>
                            <div class="progress progress-thin">
                                <div
                                    class="progress-bar bg-success"
                                    role="progressbar"
                                    style="width: 40%;"
                                    aria-valuenow="25"
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                ></div>
                            </div>
                        </div>
                    </div>
                    -->
                </div>
            </div>

        </div>
    </div>
</template>

<script>

import ChordChart3 from './charts/ChordChart3.vue';

export default{

    props: {
        id: {
            type: Number,
            default: 1717
        },
        size: {
            type: Number,
            default: 21
        },
        cycloComplexSum: {
            type: Number,
            default: 42
        },
        parentCycloComplexSum: {
            type: Number,
            default: 84
        },
        parentSize: {
            type: Number,
            default: 84
        }
    },
    //props: ['icon', 'symbol', 'counter', 'title', 'bgclass', 'hasPercentage', 'canvasId'],
    components:{
        ChordChart3
    }
}
</script>