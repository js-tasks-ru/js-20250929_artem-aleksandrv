export default class ColumnChart {
  chartHeight = 50;
  constructor(props = {}) {
    const {
      data = [],
      value = 0,
      label = "",
      link = "",
      formatHeading = (value) => value,
    } = props;
    this.data = data;
    this.value = value;
    this.label = label;
    this.link = link;
    this.formatHeading = formatHeading;
    this.element = this.createElement();
  }

  getColumnProps(data) {
    const maxValue = Math.max(...data);
    const scale = this.chartHeight / maxValue;

    return data.map(item => {
      return {
        percent: (item / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scale))
      };
    });
  }

  checkForLinkProp () {
    return this.link ? `<a href=${this.link} class="column-chart__link">View all</a>` : '';
  }
  createChartTemplate (data) {
    const list = this.getColumnProps(data).map(({percent, value}) => `<div style="--value: ${value}" data-tooltip=${percent}></div>`);
    return list.join('');
  }
  createTemplate() {
    return `
    <div class="column-chart" style="--chart-height: ${this.chartHeight}">
      <div class="column-chart__title">
        ${this.label}
        ${this.checkForLinkProp()}
      </div>
      <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">${this.formatHeading(this.value)}</div>
        <div data-element="body" class="column-chart__chart">
          ${this.createChartTemplate(this.data)}
        </div>
      </div>
    </div>
    `;
  }

  createElement() {
    const element = document.createElement("div");
    element.innerHTML = this.createTemplate();
    const firstElementChild = element.firstElementChild;
    if (!this.data.length) {
      firstElementChild.classList.add('column-chart_loading');
    }
    return firstElementChild;
  }

  destroy() {
    this.remove();
  }

  remove() {
    this.element.remove();
  }

  update(newData) {
    this.data = newData;
    this.createElement();
  }
}
