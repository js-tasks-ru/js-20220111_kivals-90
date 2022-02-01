export default class ColumnChart {
  chartHeight = 50;

  constructor({
    data = [],
    label = '',
    value = 0,
    link = '',
    formatHeading = value => value } = {})
  {
    this.label = label;
    this.data = data;
    this.value = formatHeading(value);
    this.link = link;

    this.render();
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
   * Render компонента
   */
  render() {
    const element = document.createElement('div');
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;

    // Если данные есть(загружены) убираем скелетон
    if (this.data.length) {
      this.element.classList.remove('column-chart_loading');
    }
  }

  /**
   * Re-render компонента
   * @param data данные колонок
   */
  update(data) {
    this.data = data;
    this.element.querySelector('[data-element="body"]').innerHTML = this.renderColumns();
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
}
