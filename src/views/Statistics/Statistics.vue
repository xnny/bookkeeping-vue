<template>
  <Layout name="statistics">
    <div class="sta_wrapper">
      <ul>
        <li :class="{selected:title === 'Overview'}" @click="setTextTitle('Overview')">
          <router-link to="/statistics/overview">Overview</router-link>
        </li>
        <li :class="{selected:title === 'Expenditure'}" @click="setTextTitle('Expenditure')">
          <router-link to="/statistics/expenses">Expenditure analysis</router-link>
        </li>
        <li :class="{selected:title === 'Income'}" @click="setTextTitle('Income')">
          <router-link to="/statistics/income">Income analysis</router-link>
        </li>
      </ul>
    </div>
    <router-view/>
  </Layout>
</template>

<script lang="ts">
  import {Component} from 'vue-property-decorator';


  import Vue from 'vue';

  @Component
  export default class Statistics extends Vue {
    title = 'Overview';

    setTextTitle(newTitle: string) {
      this.title = newTitle;
    }

  }
</script>

<style lang="scss" scoped>
  .sta_wrapper {
    > ul {
      display: flex;
      justify-content: center;

      > li {
        margin: 4px 8px;
        padding: 10px 24px;
        background-color: #fff;
        color: #000;
        border-radius: 10px;

        &.selected {
          background-color: #9ccac0;
          color: #fff;
        }
      }
    }
  }
</style>