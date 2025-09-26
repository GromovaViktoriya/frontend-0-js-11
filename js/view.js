import controller from './controller.js'
import model from './model.js'

const view = {

    //основной метод запуска view
    init() {

        // view.renderNotes(model.notes)  //отрисовывает моковые заметки со старта

        //элементы формы
        const form = document.querySelector('.form')
        const input = document.querySelector('.input')
        const textarea = document.querySelector('.textarea')

        //элементы выбора цвета заметки
        const colorUl = document.querySelector('.colors')
        const radioButtons = document.querySelectorAll('.radio')
        const firstCircle = document.querySelector('.circle')
        let selectedColor = firstCircle.classList[1]

        //контейнер для заметок
        const notesContainer = document.querySelector('.cards-wrapper')
        //контейнер с иконкой и надписью избранных заметок
        const favoritesContainer = document.querySelector('.favorites-span-wrapper')


        //обработчик на список с "кнопками" выбора цвета
        colorUl.addEventListener('click', (event) => {
            if (event.target.classList.contains('circle')) {
                selectedColor = event.target.classList[1]
                radioButtons.forEach(radio => {
                    radio.classList.remove('selected')
                })
                event.target.parentElement.classList.add('selected')
                return selectedColor
            }
        })

        //обработчик на форму
        form.addEventListener('submit', (event) => {
            //отменить дефолтную перезагрузку страницы
            event.preventDefault()
            //проверки ввода данных
            if ((input.value.trim() === '') || (textarea.value.trim() === '') ||
                (input.value.length > 50) || (textarea.value.length > 200)) {

               //если инпуты пустые => показывать красное сообщение на 3 сек
                if((input.value.trim() === '') || (textarea.value.trim() === '')){
                    view.showRedAlerts('Заполните все поля!')
                }
                //границы инпутов подкрашиваются красным цветом (в зависимости от того, какой из них не заполнен)
                if (input.value.trim() === '') {
                    input.classList.add('warning')
                    //функция с таймером на 1сек
                    setWarningTimeout(input)
                }
                if (textarea.value.trim() === '') {
                    textarea.classList.add('warning')
                    //функция с таймером на 1сек
                    setWarningTimeout(textarea)
                }
                //если количество символов заголовка больше 50 => показывать красное сообщение на 3 сек
                if (input.value.length > 50){
                    view.showRedAlerts('Максимальная длина заголовка - 50 символов')
                }
                //если количество символов в описании больше 200 => показывать красное сообщение на 3 сек
                if(textarea.value.length > 200){
                    view.showRedAlerts('Ограничение описания заметки - 200 символов')
                }
            }

            //передать данные контроллеру, стереть инпуты, показать зеленое сообщение на 3 сек
            else {
                controller.addNote(input.value, textarea.value, selectedColor)
                input.value = ''
                textarea.value = ''

                //возвращает дефолтный выбор цвета на желтый кружок
                selectedColor = firstCircle.classList[1]
                radioButtons.forEach(radio => {
                    radio.classList.remove('selected')
                })
                firstCircle.closest('.radio').classList.add('selected')

                //обновить отрисовку счетчика заметок
                view.renderCounter()
            }
        })

        //один общий слушатель на родительский элемент заметок, т.е. на контейнер, для отслеживания событий в заметках
        notesContainer.addEventListener('click', (event) => {
            //находит айди ближайшей к целевому элементу заметки
            const noteId = +(event.target.closest('.card').id)
            if (event.target.closest('.icon-heart')) {
                controller.toggleFavorite(noteId)

                //перекрашивает иконку для добавления в избранные
                controller.activateCheckbox()
            }
            if (event.target.closest('.icon-bucket')) {
                controller.deleteNote(noteId)

                //перекрашивает иконку для добавления в избранные (в случае если удалить все избранные заметки при
                //вкл фильтре, чтобы выполнялась проверка и перекрашивалась иконка)
                controller.activateCheckbox()

                //показать зеленое сообщение с анимацией, чтобы сообщения появлялись одно над другим, на 3 сек
                view.showGreenAlerts('Заметка удалена!')

                //обновить отрисовку счетчика заметок
                view.renderCounter()
            }
        })

        //общий слушатель на контейнер с иконкой и надписью избранных заметок
        favoritesContainer.addEventListener('click', (event) => {
            //переключатель класса, который показывает одну иконку и скрывает другую
            favoritesContainer.classList.toggle('filter-active');
            //свойство-переключатель меняет значение на противоположное с каждым кликом
            model.isFilterActive = !model.isFilterActive

            if (model.isFilterActive) {
                controller.filterFavorites()
            } else {
                view.renderNotes(model.notes)
            }
        })
    },

    //отрисовка заметок
    renderNotes(notes) {
        //контейнер для заметок
        const notesContainer = document.querySelector('.cards-wrapper')
        //контейнер с иконкой и надписью избранных заметок
        const favoritesContainer = document.querySelector('.favorites-span-wrapper')

        //если массив с заметками пуст, показывать дефолтное сообщение
        if (notes.length === 0) {
            favoritesContainer.style.display = 'none'
            notesContainer.innerHTML = `
            <div class="no-cards-message">У вас нет еще ни одной заметки.<br> 
            Заполните поля выше и создайте свою первую заметку!
            </div>
            `
            //отрисовать каждую заметку
        } else {
            notesContainer.innerHTML = '';
            notes.forEach(note => {
                notesContainer.innerHTML += `
                <div class="card" id="${note.id}">
                <div class="card-title-wrapper ${note.color}">
                    <h2 class="card-title">${note.title}</h2>
                    <div class="card-icon-wrapper">
                        <svg class="icon-heart ${note.isFavorite ? 'favorite' : ''}" width="16" height="16" viewBox="0 0 16 16" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path d="M14.6667 5.90815C14.6667 6.93913 14.2708 7.9294 13.5639 8.66193C11.9366 10.3487 10.3583 12.1075 8.67024 13.7331C8.2833 14.1003 7.66951 14.0869 7.29924 13.7031L2.43588 8.66193C0.965872 7.13813 0.965872 4.67815 2.43588 3.15438C3.92033 1.61563 6.33867 1.61563 7.82311 3.15438L7.9999 3.33761L8.17657 3.15449C8.88831 2.41633 9.85764 2 10.8702 2C11.8828 2 12.8521 2.41629 13.5639 3.15438C14.2709 3.88697 14.6667 4.87718 14.6667 5.90815Z"
                                      stroke="#000" stroke-width="1.5" stroke-linejoin="round"/>
                            </svg>
                        <svg class="icon-bucket" width="16" height="16" viewBox="0 0 16 16" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.6667 7.33331V13.6C12.6667 13.8209 12.4876 14 12.2667 14H3.73337C3.51246 14 3.33337 13.8209 3.33337 13.6V7.33331"
                                      stroke="#000" stroke-width="1.5" stroke-linecap="round"
                                      stroke-linejoin="round"/>
                                <path d="M6.66663 11.3333V7.33331" stroke="#000" stroke-width="1.5"
                                      stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M9.33337 11.3333V7.33331" stroke="#000" stroke-width="1.5"
                                      stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M14 4.66667H10.6667M10.6667 4.66667V2.4C10.6667 2.17909 10.4876 2 10.2667 2H5.73333C5.51242 2 5.33333 2.17909 5.33333 2.4V4.66667M10.6667 4.66667H5.33333M2 4.66667H5.33333"
                                      stroke="#000" stroke-width="1.5" stroke-linecap="round"
                                      stroke-linejoin="round"/>
                            </svg>
                    </div>
                </div>
                <div class="card-description">${note.description}</div>
            </div>`
            })
            //включить контейнер с иконкой и надписью избранных заметок
            favoritesContainer.style.display = 'flex'

            //обновить отрисовку счетчика заметок
            this.renderCounter()
        }
    },

    //отрисовка счетчика заметок
    renderCounter() {
        const counter = document.querySelector('.header-notes-number')
        counter.textContent = controller.countTasks()
    },

    //отрисовка всплывающих alert-green сообщений с анимацией
    //метод находится во View, поскольку он не работает с данными в model
    showGreenAlerts(description) {
        const alertContainer = document.querySelector('.alert-wrapper')
        const alertGreenMessage = document.createElement('div')
        alertGreenMessage.classList.add('alert-green')

        alertGreenMessage.innerHTML = `
               <svg class="green-svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 12.5L10 15.5L17 8.5" stroke="white" stroke-width="2" stroke-linecap="round"
                              stroke-linejoin="round"/>
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                              stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
               <span class="alert-green-span">${description}</span>`;

        //вставляет сообщение в начало "списка"
        alertContainer.prepend(alertGreenMessage);

        //функция таймера манипуляции классами для анимации сообщений
        animateAlertMessage(alertGreenMessage);
    },

    //отрисовка всплывающих alert-red сообщений с анимацией
    showRedAlerts(description) {
        const alertContainer = document.querySelector('.alert-wrapper')
        const alertRedMessage = document.createElement('div')
        alertRedMessage.classList.add('alert-red')

        alertRedMessage.innerHTML = `
               <svg class="red-svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                          stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 8V12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 16.01L12.01 15.9989" stroke="white" stroke-width="2" stroke-linecap="round"
                          stroke-linejoin="round"/>
                </svg>
               <span class="alert-red-span">${description}</span>`;

        //вставляет сообщение в начало "списка"
        alertContainer.prepend(alertRedMessage);

        //функция таймера манипуляции классами для анимации сообщений
        animateAlertMessage(alertRedMessage);
    }
}

function animateAlertMessage(alertDiv) {
    //таймеры манипуляции классами для анимации сообщений
    setTimeout(() => {
        alertDiv.classList.add('visible');
    }, 10); //0,1 сек

    //таймер на удаление
    setTimeout(() => {
        //сначала анимация исчезновения
        alertDiv.classList.remove('visible');
        alertDiv.classList.add('fade-out');

        //после того как анимация исчезновения закончится, удаляет элемент из HTML
        setTimeout(() => {
            alertDiv.remove();
        }, 400); //0,4 сек
    }, 3000);
}

//просто вынос таймера в функцию для подсветки инпутов красным
function setWarningTimeout(name) {
    setTimeout(() => {
        name.classList.remove('warning');
    }, 1000)
}

export default view;