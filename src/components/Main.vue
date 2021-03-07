<template>
    <v-tabs
      id="tab"
      height=40
      background-color="deep-purple accent-4"
      class="elevation-3 fill-height"
      grow
      dark
      centered
    >
      <v-tab
        :key="1"
        :href="`#tab-1`"
      >
        基本记点
      </v-tab>
      <v-tab
        :key="2"
        :href="`#tab-2`"
      >
        功能开发中
      </v-tab>

      <v-tabs-slider></v-tabs-slider>
      
      <v-tab-item
        :key="1"
        :value="'tab-1'"
        fluid
      >
        <v-container fluid>
          <v-row>
            <v-col>
              <!-- Top part -->
              <v-container
                class="pa-0 mx-0"
              >
                <v-row>
                  <!-- Top left part -->
                  <v-col
                    cols="8"
                  >
                    <v-sheet 
                      color="darken-2"
                      v-bind:height="topHeight">

                      <h1 v-if="test">{{ topHeight }}</h1>
                      <v-textarea
                        v-else
                        class = "textinput"
                        label="记点文本"
                        style="font-family: 'Courier New'"
                        no-resize
                        v-bind:height="topHeight - 15"
                        v-bind:rows="Math.floor((topHeight - 15) / 25).toFixed(0)-1"
                        v-model="inputText"
                      ></v-textarea>
                    </v-sheet>
                  </v-col>
                  <!-- Top right part -->
                  <v-col
                    cols="4"
                    class="ml-0 pl-0"
                  >
                    <v-btn
                      block
                      large
                      rounded
                      color="primary"
                      class="mt-15"
                      v-on:click="OnResetAll"
                    >
                      重置所有
                    </v-btn>
                    <v-btn
                      block
                      large
                      rounded
                      color="primary"
                      class="mt-13"
                      v-on:click="OnCopyIn"
                      v-if="copy"
                    >
                      粘贴文本
                    </v-btn>
                    <v-btn
                      block
                      large
                      rounded
                      color="primary"
                      class="mt-13"
                      v-on:click="OnCountResult"
                    >
                      计算点数
                    </v-btn>
                  </v-col>

                </v-row>
              </v-container>
            </v-col>
          </v-row>
          <v-spacer height="30"></v-spacer>
          <v-row>
            <v-col>
              <!-- Below part -->
              <v-container
                class="pa-0 mx-0"
              >
                <v-row>
                  <!-- Top left part -->
                  <v-col
                    cols="if(copy){ return 8} else { return 12; };"

                  >
                    <v-sheet 
                      color="darken-2"
                      v-bind:height="topHeight">

                      <h1 v-if="test">{{ topHeight }}</h1>
                      <v-textarea 
                        v-else
                        class="textinput"
                        label="记点结果"
                        no-resize
                        v-bind:height="topHeight - 15"
                        v-bind:rows="Math.floor((topHeight - 15) / 25).toFixed(0)-1"
                        v-model="outputText"
                      ></v-textarea>
                    </v-sheet>
                  </v-col>
                  <!-- Top right part -->
                  <v-col
                    cols="4"
                    class="ml-0 pl-0"
                    v-if="copy"
                  >
                    <v-btn
                      block
                      large
                      rounded
                      color="primary"
                      class="mt-13"
                      v-on:click="OnCopySimpleResult"
                    >
                      复制简报
                    </v-btn>
                    <v-btn
                      block
                      large
                      rounded
                      color="primary"
                      class="mt-13"
                      v-on:click="OnCopyAllResult"
                    >
                      复制全部
                    </v-btn>
                  </v-col>

                </v-row>
              </v-container>
            </v-col>
          </v-row>
        </v-container>
      </v-tab-item>

      <v-tab-item
        :value="'tab-2'"
      >
        <v-card
          flat
          tile
        >
          <v-card-text>绝赞开发中！</v-card-text>
        </v-card>
      </v-tab-item>
      
    </v-tabs>
</template>

<script>

import { CommentSet } from "../scripts/comments"

export default {
  name: 'Main',
  mounted() {
    // Watch the height of element tab
    let elementResizeDetectorMaker = require("element-resize-detector");
    let erd = elementResizeDetectorMaker()
    let vm = this;
    erd.listenTo(document.getElementById("tab"), function(element) {
      let width = element.offsetWidth;
      let height = element.offsetHeight;
      console.log("Size: " + width + "x" + height);
      vm.totalHeight = height;
    });
  },
  data() {
    return {
      test: false,
      copy: false,
      inputText: "",
      outputText: "",
      tabs: 2,
      totalHeight: 0, // init value, not important
      simpleReport: "",
      allReport: "",
    }
  },
  computed: {
    topHeight: function() {
      return (this.totalHeight-40) * 0.45;
    },
    belowHeight: function() {
      return (this.totalHeight-40) * 0.45;
    }
  },
  methods: {
    OnCopyIn() {
      let mv = this;
      navigator.clipboard.readText().then(function(data) {
        console.log("Your string: ", data);
        mv.inputText = data;
      });
    },
    OnResetAll() {
      this.inputText = ""
      this.outputText = ""
    },
    OnCountResult() {
      let cs = new CommentSet(this.inputText)
      let reports = cs.count_point();

      this.simpleReport = reports['simple']
      this.outputText = this.allReport = reports['report'];
    },
    async OnCopySimpleResult() {
      await navigator.clipboard.writeText(this.simpleReport);
      console.log("simple");
    },
    async OnCopyAllResult() {
      navigator.clipboard.writeText(this.allReport);
      console.log("all");
    },
  }
}

</script>

<style>

.textinput {
  font-family: 'Courier New';
  font-size: 4px;
}

</style>