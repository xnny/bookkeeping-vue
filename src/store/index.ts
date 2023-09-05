import Vue from 'vue';
import Vuex from 'vuex';
import clone from '@/common/clone';
import {nanoid} from 'nanoid';
import day from 'dayjs';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    recordList: [],
    tagList: [],
  } as RootStore,
  getters: {
    // tags
    findTag: (state) => (id: string) => {
      return state.tagList.filter(t => t.id === id)[0];
    },
    getItemName: (state) => (id: string) => {
      const tag = state.tagList.filter(tag => tag.id === id)[0];
      return tag ? tag.name : '';
    },
    getItemIcon: (state) => (id: string) => {
      const tag = state.tagList.filter(tag => tag.id === id)[0];
      return tag ? tag.iconName : '9999';
    },
    // 获取 Income的标签
    income: (state) => {
      return state.recordList.filter(item => item.category === '+');
    },
    // 获取 今日Income的金额
    incomeMoney: () => (today: string) => {
      const todayIncome = (store.getters.income as RecordItem[])
              .filter(item => day(item.createdAt).format('MM') === today);
      return todayIncome.map(item => item.amount);
    },
    // 获取 Expenditure的标签
    expenses: (state) => {
      return state.recordList.filter(item => item.category === '-');
    },
    // 获取 本月Expenditure的金额
    expensesMoney: () => (today: string) => {
      const mouthExpenses = (store.getters.expenses as RecordItem[])
              .filter(item => day(item.createdAt).format('DD') === today);
      return mouthExpenses.map(item => item.amount);
    },
    // 获取当日的总Income或总Expenditure
    dayTotalList: (state) => (type: string) => {
      // 日期从大到小排
      const newList = [...state.recordList]
              .filter(r => r.category === type)
              .sort((a, b) => day(b.createdAt).valueOf() - day(a.createdAt).valueOf());
      if (newList.length === 0) {return [];}

      type Result = { title: string; total?: number; items: RecordItem[] }[]
      const result: Result = [{title: day(newList[0].createdAt).format('MM/DD'), items: [newList[0]]}];
      for (let i = 1; i < newList.length; i++) {
        const current = newList[i];
        const last = result[result.length - 1];
        if (day(last.title).isSame(day(current.createdAt), 'day')) {
          last.items.push(current);
        } else {
          result.push({title: day(current.createdAt).format('MM/DD'), items: [current]});
        }
      }
      // 将金额相加
      result.map(group =>
              group.total = group.items.reduce((sum, item) => {
                return sum + item.amount;
              }, 0));
      return result;
    }
  },
  mutations: {
    // records
    fetchRecords(state) {
      state.recordList = JSON.parse(window.localStorage.getItem('recordList') || '[]') as RecordItem[];
      store.commit('saveRecords');

    },
    saveRecords(state) {
      window.localStorage.setItem('recordList', JSON.stringify(state.recordList));
    },
    createRecord(state, record: RecordItem) {
      if (record.tagIds.length === 0) {
        alert('Please enter tag!');
        return;
      }
      if (record.amount <= 0) {
        alert('Please enter the amount!');
        return;
      }

      const newRecord: RecordItem = clone(record);
      state.recordList.push(newRecord);
      store.commit('saveRecords');
      window.alert('Saved successfully');
      window.location.reload();
    },
    // tags
    fetchTags(state) {
      let localTags = JSON.parse(window.localStorage.getItem('tagList') || '[]');
      if (localTags.length === 0) {
        localTags = [
          {id: nanoid(10), name: '', iconName: '1', mold: '-'},  // 1
          {id: nanoid(10), name: '', iconName: '2', mold: '-'},  // 2
          {id: nanoid(10), name: '', iconName: '3', mold: '-'},  // 3
          {id: nanoid(10), name: '', iconName: '4', mold: '-'},  // 4
          {id: nanoid(10), name: '', iconName: '5', mold: '-'},  // 5
          {id: nanoid(10), name: '', iconName: '6', mold: '-'},  // 6
          {id: nanoid(10), name: '', iconName: '7', mold: '-'},  // 7
          {id: nanoid(10), name: '', iconName: '8', mold: '-'},  // 8
          {id: nanoid(10), name: '', iconName: '9', mold: '-'},  // 9
          {id: nanoid(10), name: '', iconName: '10', mold: '-'},  // 10
          {id: nanoid(10), name: '', iconName: '11', mold: '-'},  // 11
          {id: nanoid(10), name: '', iconName: '12', mold: '-'},  // 12
          {id: nanoid(10), name: '', iconName: '13', mold: '-'},  // 13,
          {id: nanoid(10), name: '', iconName: '14', mold: '-'},  // 14
          {id: nanoid(10), name: '', iconName: '15', mold: '-'},  // 15
          {id: nanoid(10), name: '', iconName: '16', mold: '-'},  // 16
          {id: nanoid(10), name: '', iconName: '17', mold: '-'},  // 17
          {id: nanoid(10), name: '', iconName: '18', mold: '-'},  // 18
          {id: nanoid(10), name: '', iconName: '19', mold: '-'},  // 19
          {id: nanoid(10), name: '', iconName: '20', mold: '-'},  // 20
          {id: nanoid(10), name: '', iconName: '21', mold: '-'},  // 21
          {id: nanoid(10), name: '', iconName: '22', mold: '-'},  // 22
          {id: nanoid(10), name: '', iconName: '23', mold: '-'},  // 23
          {id: nanoid(10), name: '', iconName: '24', mold: '-'},  // 24
          {id: nanoid(10), name: '', iconName: '001', mold: '+'},  // 25
          {id: nanoid(10), name: '', iconName: '002', mold: '+'},  // 25
          {id: nanoid(10), name: '', iconName: '003', mold: '+'},  // 25
          {id: nanoid(10), name: '', iconName: '004', mold: '+'},  // 25
          {id: nanoid(10), name: '', iconName: '005', mold: '+'},  // 25
        ] as Tag[];
      }
      state.tagList = [...localTags];
      store.commit('saveTags');
    },
    saveTags(state) {
      window.localStorage.setItem('tagList', JSON.stringify(state.tagList));
    },
    createTag(state, payload: Payload) {
      const {name, iconName, mold} = payload;
      state.tagList.push({id: nanoid(10), name, iconName, mold});
      store.commit('saveTags');
      window.location.reload();
    },
    removeTag(state, id: string) {
      let index = -1;
      for (let i = 0; i < state.tagList.length; i++) {
        if (state.tagList[i].id === id) {
          index = i;
          break;
        }
      }
      state.tagList.splice(index, 1);
      store.commit('saveTags');
      window.location.reload();
    },
    updateTag(state, payload: Payload) {
      const {id, name, iconName, mold} = payload;
      const newTags = state.tagList.map(tag => tag.id === id ? {id, name, iconName, mold} : tag);
      state.tagList = [...newTags];
      store.commit('saveTags');
      window.location.reload();
    },
  }
});

export default store;