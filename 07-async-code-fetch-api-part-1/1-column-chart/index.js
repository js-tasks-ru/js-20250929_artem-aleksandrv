// import fetchJson from './utils/fetch-json.js';
import ColumnChart from "../../04-oop-basic-intro-to-dom/1-column-chart/index.js";

export default class ColumnChartv2 extends ColumnChart {
  BACKEND_URL = "https://course-js.javascript.ru/";
  constructor(props = {}) {
    const {
      data = [],
      url,
      range = {},
      label = "",
      link = "#",
      formatHeading = (value) => value,
      value = "",
    } = props;
    super({ data, label, formatHeading, link, value });
    this.url = url;
    const { from, to } = range;
    this.fetchData(from, to);
  }

  convertData(data) {
    return Object.values(data);
  }

  async fetchData(from, to) {
    try {
      const data = await (await fetch(this.createUrl(from, to))).json();
      const convertedValues = Object.values(data);
      super.update(convertedValues);
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async update(from, to) {
    return await this.fetchData(from, to);
  }

  createUrl(from, to) {
    const url = new URL(this.BACKEND_URL + this.url);
    url.search = new URLSearchParams({ from, to });
    return url.href;
  }
}
