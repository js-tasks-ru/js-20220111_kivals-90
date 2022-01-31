export default class ColumnChart {
  chartHeight = 50;
  constructor({ data, label, value, link, formatHeading } = {}) {
    this.label = label;
    this.data = data;
    this.value = value;
    this.formatHeading = formatHeading;
    this.link = link;
    this.render();
  }

  /**
   * Re-render компонента
   * @param data данные колонок
   */
  update(data) {
    this.data = data;
    this._renderColumns();
  }

  /**
   * Вернуть шаблон компонента
   * @return {string} шаблон
   */
  getTemplate() {
    return `
      <div class="column-chart" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
          <a href="#" class="column-chart__link">View all</a>
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header"></div>
            <div data-element="body" class="column-chart__chart">
            </div>
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

    this._renderTitle();
    this._renderViewAllLink();
    this._renderHeader();
    this._renderColumns();
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
   * Render заголовка
   * @private
   */
  _renderTitle() {
    const titleNode = this.element.querySelector('.column-chart__title');
    const titleTextNode = document.createTextNode(`Total ${this.label}`);
    titleNode.prepend(titleTextNode);
  }

  /**
   * Render линка ViewAll
   * @private
   */
  _renderViewAllLink() {
    const linkNode = this.element.querySelector('.column-chart__link');
    if (this.link) {
      linkNode.href = this.link;
    } else {
      linkNode.remove();
    }
  }

  /**
   * Render колонок компонента
   * @private
   */
  _renderColumns() {
    if (this.data && this.data.length > 0) {
      this.element.classList.remove('column-chart_loading');
      const columnsContainerNode = this.element.querySelector('.column-chart__chart');
      // очищаем контейнер колонок
      columnsContainerNode.innerHTML = '';

      const calculatedData = this._getColumnProps(this.data);
      calculatedData.forEach(({ percent, value }) => {
        const node = document.createElement('div');
        node.style = `--value: ${value}`;
        node.dataset.tooltip = percent;
        columnsContainerNode.append(node);
      });
    } else {
      this.element.classList.add('column-chart_loading');
    }
  }

  /**
   * Render общего значения компонента
   * @private
   */
  _renderHeader() {
    const headerText = this.formatHeading ? this.formatHeading(this.value) : this.value;
    const headerTextNode = document.createTextNode(headerText);
    this.element.querySelector('.column-chart__header').append(headerTextNode);
  }

  /**
   * Высчитать значения и проценты для шаблона колонки
   * @param data исходные данные
   * @private
   */
  _getColumnProps(data) {
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
