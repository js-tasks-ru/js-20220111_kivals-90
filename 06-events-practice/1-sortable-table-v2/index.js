export default class SortableTable {
  constructor(headerConfig, {
    data = [],
    sorted = {}
  } = {}) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.sorted = sorted;
    if (sorted) {
      this.data = this.getSortedData(sorted.id, sorted.order)
    }

    this.render();

    this.initEventListeners();
  }

  getTemplate() {
    return `
      <div data-element="productsContainer" class="products-list__container">
        <div class="sortable-table">
          <div data-element="header" class="sortable-table__header sortable-table__row">
            ${this.renderHeaderRow()}
          </div>
          <div data-element="body" class="sortable-table__body">
            ${this.renderRows(this.data)}
          </div>
        </div>
      </div>
    `;
  }

  initEventListeners() {
    this.subElements.header.addEventListener('pointerdown', this.headerHandlerClick);
  }

  headerHandlerClick = (event) => {
    const headerTarget = event.target.closest('.sortable-table__cell');
    const fieldId = headerTarget.dataset.id;
    const isSortable = headerTarget.dataset.sortable === 'true';

    let order = 'desc';
    if (headerTarget.dataset.order) {
      order = headerTarget.dataset.order === 'asc' ? 'desc' : 'asc';
    }

    if (isSortable) {
      //Очищаем сортировку в хедере
      this.subElements.header.querySelectorAll('.sortable-table__cell').forEach( cell => cell.dataset.order = '');
      this.sort(fieldId, order);
    }
  }


  render() {
    const element = document.createElement('div');

    element.innerHTML = this.getTemplate();

    this.element = element.firstElementChild;

    this.subElements = this.getSubElements();
  }

  renderHeaderRow() {
    return this.headerConfig.map(({ id, title, sortable, template }) => {
      // Определяем сортировку по умолчанию
      let defaultOrder = this.sorted.id === id ? this.sorted.order : '';

      return `
        <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}" data-order="${defaultOrder}">
          <span>${title}</span>
          ${this.renderArrowBlock(sortable)}
        </div>
      `;
    }).join('');
  }

  renderRows(data) {
    return data.map((item) => {
      return `
        <a href="/products/${item}" class="sortable-table__row">
          ${this.renderRow(item)}
        </a>
      `;
    }).join('');
  }

  renderRow(item) {
    return this.headerConfig.map(({ id, template }) => {
      return template ? template(item[id]) : `<div class="sortable-table__cell">${item[id]}</div>`
    }).join('');
  }

  renderArrowBlock(sortable) {
    return sortable ? `
      <span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>
    ` : '';
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

  sort(field, direction) {
    const sortedData = this.getSortedData(field, direction);
    const currentColumn = this.element.querySelector(`.sortable-table__cell[data-id="${field}"]`);

    currentColumn.dataset.order = direction;
    this.subElements.body.innerHTML = this.renderRows(sortedData);
  }

  getSortedData(field, direction) {
    const directions = {
      asc: 1,
      desc: -1
    };
    const column = this.headerConfig.find((item) => item.id === field);
    const sortType = column.sortType;

    const order = directions[direction];
    const dataArray = [...this.data];

    return dataArray.sort((a, b) => {
      if (sortType === 'string') {
        return order * (a[field].localeCompare(b[field], ['ru', 'en']));
      }
      return order * (a[field] - b[field]);
    });
  }


  remove () {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
  }
}
