// const MOCKData = [
//     {
//         title: 'Codewars',
//         id: Math.random(),
//         description: 'Решить 2-3 задачи на Codewars',
//         color: 'magenta',
//         isFavorite: false
//     },
//     {
//         title: 'IT Incubator',
//         id: Math.random(),
//         description: 'Дописать самостоятельный проект',
//         color: 'green',
//         isFavorite: false
//     },
//     {
//         title: 'Javascript course',
//         id: Math.random(),
//         description: 'Посмотреть курс Димыча на youtube по JS с нуля',
//         color: 'blue',
//         isFavorite: false
//     },
//     {
//         title: 'CSS practise',
//         id: Math.random(),
//         description: 'Сделать несколько проектов со сложной версткой на youtube',
//         color: 'yellow',
//         isFavorite: false
//     },
//     {
//         title: 'Книга по JS',
//         id: Math.random(),
//         description: 'Прочитать уже знакомые темы в книге "Javascript с нуля", чтобы их закрепить',
//         color: 'red',
//         isFavorite: false
//     }
// ]


const model = {
    notes: [],

    //свойство-переключатель для отслеживания работы фильтра избранных заметок
    isFilterActive: false,

    addNote(title, description, color) {
        const newNote = {
            title,
            id: new Date().getTime(),
            description,
            color,
            isFavorite: false,
        }
        //добавить в начало массива
        this.notes.unshift(newNote)
        return this.notes //отрисовка через контроллер после проверки на фильтр
    },

    //меняет свойство isFavorite на противоположное
    toggleFavorite(noteId) {
        this.notes = this.notes.map(note => {
            if (note.id === noteId) {
                note.isFavorite = !note.isFavorite
            }
            return note //отрисовка через контроллер после проверки на фильтр
        })
    },

    //фильтрует массив, кроме выбранной по id заметки
    deleteNote(noteId) {
        this.notes = this.notes.filter(note => {
            return note.id !== noteId //отрисовка через контроллер после проверки на фильтр
        })
    },

    //фильтрует массив с заметками со свойством isFavorite: true
    filterFavorites() {
        return this.notes.filter(note => {
            return note.isFavorite //отрисовка через контроллер
        })
    },

    //возвращает в контроллер цифру длины общего массива заметок для счетчика
    countTasks() {
        return this.notes.length; //отрисовка через контроллер
    },

    //меняет порядок заметок в массиве с учетом drag and drop логики
    reorderNote(draggedId, targetId) {
        //ищет заметку в общем массиве по айди переносимой заметки
        const draggedNote = this.notes.find(note => note.id === draggedId);
        //ищет индекс переносимой заметки в общем массиве
        const draggedIndex = this.notes.findIndex(note => note.id === draggedId);

        //ищет индекс заметки на месте "сброса"
        const targetIndex = this.notes.findIndex(note => note.id === targetId);

        //вырезает перетаскиваемую заметку из её старого места по ее индексу
        this.notes.splice(draggedIndex, 1);

        //вставляет перетаскиваемую заметку на место "сброса" заметки, по индексу заметки на месте сброса
        this.notes.splice(targetIndex, 0, draggedNote);
    }
}

export default model;