import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
  chartHeight = 50;
  subElements = {};

  constructor({
    url = '',
    range = {},
    data = [],
    label = '',
    value = 0,
    link = '',
    formatHeading = value => value } = {})
  {
    this.url = url;
    this.range = range;
    this.label = label;
    this.data = data;
    this.value = formatHeading(value);
    this.link = link;
    this.render();
  }

  /**
   * Render компонента
   */
  render() {
    const element = document.createElement('div');
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;

    this.subElements = this.getSubElements();

    // Если данные есть - убираем скелетон, на тот случай когда данные уже переданы в компонент
    if (this.data.length) {
      this.element.classList.remove('column-chart_loading');
    }

    // Есть url и нет данных
    if (this.url && !this.data.length) {
      this.getServerData().then(result => {
        this.element.classList.remove('column-chart_loading');

        this.reRenderNewData(Object.values(result));
      }).catch(console.error);
    }
  }

  /**
   * Загрузить данные для компонента
   * @return данные для компонента
   */
  async getServerData() {
    const url = this.normalizeUrl();
    return await fetchJson(url);
  }

  async update(from, to) {
    this.range = { from, to };

    this.element.classList.add('column-chart_loading');

    const serverData = await this.getServerData();

    this.element.classList.remove('column-chart_loading');

    this.reRenderNewData(Object.values(serverData));

    return serverData;
  }

  /**
   * Сформировать валидный URL
   * @return {URL} валидный url
   */
  normalizeUrl() {
    const fullUrl = new URL(this.url, BACKEND_URL);

    if (this.range && this.range.from instanceof Date && this.range.from.getTime()) {
      fullUrl.searchParams.set('from', this.range?.from.toISOString());
    }
    if (this.range && this.range.to instanceof Date && this.range.to.getTime()) {
      fullUrl.searchParams.set('to', this.range?.to.toISOString());
    }

    return fullUrl;
  }

  /**
   * Вернуть шаблон компонента
   * @return {string} шаблон
   */
  getTemplate() {
    return `
      <div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
          Total ${this.label}
          ${this.renderViewAllLink()}
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">${this.value}</div>
            <div data-element="body" class="column-chart__chart">${this.renderColumns()}</div>
        </div>
      </div>
    `;
  }

  /**
   * Re-render компонента
   * @param data данные колонок
   */
  reRenderNewData(data) {
    this.data = data;
    this.subElements.body.innerHTML = this.renderColumns();
  }

  getSubElements() {
    const result = {};
    const elements = this.element.querySelectorAll('[data-element]');

    for (const subElement of elements) {
      const name = subElement.dataset.element;

      result[name] = subElement;
    }

    return result;
  }

  /**
   * Render линка ViewAll
   */
  renderViewAllLink() {
    return this.link ? `<a href="${this.link}" class="column-chart__link">View all</a>` : '';
  }

  /**
   * Render колонок компонента
   */
  renderColumns() {
    const calculatedData = this.getColumnProps(this.data);
    return calculatedData.map(({ percent, value }) => {
      return `<div style="--value: ${value}" data-tooltip="${percent}"></div>`;
    }).join('');
  }

  /**
   * Высчитать значения и проценты для шаблона колонок
   * @param data исходные данные
   */
  getColumnProps(data) {
    const maxValue = Math.max(...data);
    const scale = 50 / maxValue;

    return data.map(item => {
      return {
        percent: (item / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scale))
      };
    });
  }

  /**
   * Удалить компонент
   */
  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
