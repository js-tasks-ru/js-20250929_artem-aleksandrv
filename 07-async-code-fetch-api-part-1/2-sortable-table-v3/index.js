// import fetchJson from "./utils/fetch-json.js";
import SortableTableV2 from "../../06-events-practice/1-sortable-table-v2/index.js";

const BACKEND_URL = "https://course-js.javascript.ru";

export default class SortableTableV3 extends SortableTableV2 {
  static pageSize = 10;
   offsetStart = 0;
   offsetEnd = 30;
   isFetching=false;

   constructor(
     headerConfig,
     {
       url,
       data = [],
       sorted = {
         id: headerConfig.find((item) => item.sortable).id,
         order: "asc",
       },
       isSortLocally = false,
     } = {}
   ) {
     super(headerConfig, {data, sorted, isSortLocally});
     this.isSortLocally = isSortLocally;
     this.url = url;
     this.render();
   }

   async handleWindowScroll() {
     const shouldFetch = window.scrollY + window.innerHeight >= document.body.clientHeight - 200;
     if (shouldFetch && !this.isFetching) {
       this.offsetStart = this.offsetEnd;
       this.offsetEnd = this.offsetEnd + SortableTableV3.pageSize;
       console.log(`start${this.offsetStart} end:${this.offsetEnd}`);
       await this.render();
     }
   }

   async fetchData() {

     if (this.isFetching || !this.url) {
       return;
     }

     const url = new URL(this.url, BACKEND_URL);

     this.isFetching = true;

     url.searchParams.set('_embed', 'subcategory.category');
     url.searchParams.set('_sort', this.sorted.id);
     url.searchParams.set('_order', this.sorted.order);
     url.searchParams.set('_start', this.offsetStart.toString());
     url.searchParams.set('_end', this.offsetEnd.toString());

     this.subElements.loading.style.display = 'block';

     try {
       const data = await fetch(url.toString());
       const response = await data.json();
       this.data = [...this.data, ...response];
       super.update();
       return response;
     } catch (error) {
       console.error(error);
     } finally {
       this.isFetching = false;
       this.subElements.loading.style.display = 'none';
     }
   }

   async render() {
     await this.fetchData();
   }

   async sortOnServer(sortField, sortOrder) {
     super.sortOnServer(sortField, sortOrder);
     this.sorted.id = sortField;
     this.sorted.order = sortOrder;
     this.data = [];
     this.offsetStart = 0;
     this.offsetEnd = 30;
     await this.render();
   }
   createListeners() {
     super.createListeners();

     this.handleWindowScroll = this.handleWindowScroll.bind(this);

     window.addEventListener('scroll', this.handleWindowScroll);
   }

   destroyListeners() {
     super.destroyListeners();
     window.removeEventListener('scroll', this.handleWindowScroll);
   }
}
