import model from './model.js';
import view from './view.js';

const controller = {
    addNote(title, description, color) {
        model.addNote(title, description, color)

        //показать зеленое сообщение с анимацией, чтобы
        //сообщения появлялись одно над другим, на 3 сек
        view.showGreenAlerts('Заметка добавлена!')

        //отрисовка с проверкой фильтра
        this.refreshView()
    },

    toggleFavorite(noteId) {
        model.toggleFavorite(noteId)
        //отрисовка с проверкой фильтра
        this.refreshView()
    },

    deleteNote(noteId) {
        model.deleteNote(noteId)
        //отрисовка с проверкой фильтра
        this.refreshView()
    },

    filterFavorites() {
        model.filterFavorites();
        //отрисовка с проверкой фильтра (чтобы при клике на чекбокс избранных заметок при отсутствии избранных заметок
        //делалась проверка, иначе экран сбрасывает все карточки и показывает дефолтное сообщение)
        this.refreshView()
    },

    //возвращает полученный в модели результат
    countTasks() {
        return model.countTasks()
    },

    countFavTasks() {
        return model.countFavTasks();
    },

    //метод для проверки состояния фильтра и отрисовки массива с учетом фильтра
    refreshView() {
        //если фильтр избранных заметок включен
        if (model.isFilterActive) {
            //массив отрисованных заметок
            const favoriteNotes = model.filterFavorites();

            //если удалить все избранные заметки из массива избранных заметок/либо избранных заметок нет, то нужно
            //перерисовать общий массив заметок и переключить фильтр на "выкл"
            if (model.filterFavorites().length === 0) {
                model.isFilterActive = false;
                view.favoritesContainer.classList.remove('filter-active');
                view.renderNotes(model.notes)
            } else {
                //если массив избранных заметок не пуст - обновить отрисовку массива избранных карточек
                view.renderNotes(favoriteNotes);
            }
            //если фильтр избранных заметок выключен
        } else {
            //отрисовать общий массив заметок
            view.renderNotes(model.notes);
        }
    },

    //перекрашивает иконку в "активный" цвет при наличии хотя бы одной избранной заметки, иначе цвет серый "неактивный"
    activateCheckbox() {
        const iconCheckbox = document.querySelector('.icon-checkbox')
        const favoritesSpan = document.querySelector('.favorites-span')

        //если хотя бы одна заметка имеет isFavorite:true
        if (model.notes.some(note => {
            return note.isFavorite === true
        })) {
            //иконка добавления в избранные окрашивается в черный "активный" цвет, что указывает на
            //возможность по ней кликнуть
            iconCheckbox.classList.remove('grayscale')
            favoritesSpan.classList.remove('grayscale')
        } else {
            iconCheckbox.classList.add('grayscale')
            favoritesSpan.classList.add('grayscale')
        }
    },

    //меняет порядок заметок с учетом перетаскивания
    reorderNote(draggedId, targetId) {
        //проверка, чтобы drag and drop работал только при выключенном фильтре избранных заметок
        if (!model.isFilterActive) {
            model.reorderNote(draggedId, targetId);
            //отрисовка заметок
            view.renderNotes(model.notes);
        }
    },

    //меняет текст в заголовке заметки
    changeTitle(noteId, titleText) {
        model.changeTitle(noteId, titleText)
    },

    //меняет текст в описании заметки
    changeDescription(noteId, descriptionText) {
        model.changeDescription(noteId, descriptionText)
    }
}


export default controller;