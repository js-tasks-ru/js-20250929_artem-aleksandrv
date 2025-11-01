import RangePicker from './components/range-picker/src/index.js';
import SortableTable from './components/sortable-table/src/index.js';
import ColumnChart from './components/column-chart/src/index.js';
import header from './bestsellers-header.js';

import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru/';

export default class Page {
  subElements = {};
  element;
  urlBestsellers = new URL('api/dashboard/bestsellers', BACKEND_URL);
  componentContainer = {};
  constructor() {
    this.createElement();
    this.setSubElements();
    this.handleOnDateSelect = this.handleOnDateSelect.bind(this);
  }

  createElement() {
    const element = document.createElement('div');
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;
  }

  getTemplate() {
    return `
             <div class="dashboard">
                <div class="content__top-panel">
                <h2 class="page-title">Dashboard</h2>
                <div data-element="rangePicker"></div>
                </div>
                <div data-element="chartsRoot" class="dashboard__charts">
                <div data-element="ordersChart" class="dashboard__chart_orders"></div>
                <div data-element="salesChart" class="dashboard__chart_sales"></div>
                <div data-element="customersChart" class="dashboard__chart_customers"></div>
                </div>
                <h3 class="block-title">Best sellers</h3>
                <div data-element="sortableTable"></div>
            </div>`;
  }

  setSubElements() {
    const dataElements = this.element.querySelectorAll('[data-element]');
    for (const elem of dataElements) {
      const name = elem.dataset.element;
      this.subElements[name] = elem;
    }
  }
  async render() {
    await this.createComponents();
    return this.element;
  }
  async createComponents() {
    const to = new Date();
    const from = new Date(to.getFullYear(), to.getMonth() - 1, to.getDate());

    this.urlBestsellers.searchParams.set('from', from.toISOString());
    this.urlBestsellers.searchParams.set('to', to.toISOString());

    const ordersChart = new ColumnChart({
      url: new URL('api/dashboard/orders', BACKEND_URL).href,
      range: { from, to },
      label: 'orders',
      link: '#'
    });
    this.componentContainer.ordersChart = ordersChart;
    ordersChart.update(from, to);
    this.subElements.ordersChart.append(ordersChart.element);

    const salesChart = new ColumnChart({
      url: new URL('api/dashboard/sales', BACKEND_URL).href,
      range: { from, to },
      label: 'sales',
      formatHeading: (val) => `$ ${val}`
    });
    this.componentContainer.salesChart = salesChart;
    salesChart.update(from, to);
    this.subElements.salesChart.append(salesChart.element);

    const customersChart = new ColumnChart({
      url: new URL('api/dashboard/customers', BACKEND_URL).href,
      range: { from, to },
      label: 'customers',
    });
    this.componentContainer.customersChart = customersChart;
    customersChart.update(from, to);
    this.subElements.customersChart.append(customersChart.element);

    const sortableTable = new SortableTable(header, {
      url: this.urlBestsellers.href,
      sorted: { id: 'title', order: 'asc' },
      isSortLocally: true,
      start: 0
    });
    this.componentContainer.sortableTable = sortableTable;
    this.subElements.sortableTable.append(sortableTable.element);

    const rangePicker = new RangePicker({ from, to });
    this.componentContainer.rangePicker = rangePicker;
    this.subElements.rangePicker.append(rangePicker.element);
    this.createEventListeners();
  }

  async updateComponents(from, to) {
    this.componentContainer.ordersChart.update(from, to);
    this.componentContainer.salesChart.update(from, to);
    this.componentContainer.customersChart.update(from, to);

    this.urlBestsellers.searchParams.set('from', from.toISOString());
    this.urlBestsellers.searchParams.set('to', to.toISOString());
    const data = await fetchJson(this.urlBestsellers.toString());
    this.componentContainer.sortableTable.update([]);
    this.componentContainer.sortableTable.update(data);
  }

  createEventListeners() {
    this.componentContainer.rangePicker.element.addEventListener(
      'date-select',
      this.handleOnDateSelect
    );
  }

  handleOnDateSelect(event) {
    const { from, to } = event.detail;
    this.updateComponents(from, to);
  }

  destroy() {
    this.componentContainer.rangePicker.element.removeEventListener(
      'date-select',
      this.onDateSelect
    );

    Object.values(this.componentContainer).forEach(component => {
      component.destroy();
    });
    this.remove();
  }

  remove() {
    this.element.remove();
  }

}
