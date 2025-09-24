import view from './view.js';

function init() {
    view.init();
}

//запуск функции init после того, как загрузился контент DOM
document.addEventListener('DOMContentLoaded', init);