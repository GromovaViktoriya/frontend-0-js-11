const model = {
    notes: [],
    addNote(title, description, color) {
        const newNote = {
            title,
            description,
            id: new Date().getTime(),
            isFavorite: false,
            color
        }
        this.notes.push(newNote)
        view.renderNotes(this.notes)
    }
}

const view = {
    init() {
        this.renderNotes(model.notes)

        const form = document.querySelector('.form')
        const input = document.querySelector('.input')
        const textarea = document.querySelector('.textarea')
        const button = document.querySelector('.button')

        const colors = document.querySelector('.colors')



        button.addEventListener('submit', (event) => {
            event.preventDefault()
            controller.addNote(input.value, textarea.value)
            input.value = ''
            textarea.value = ''
        })

        colors.addEventListener('click', (event) => {
            if (event.target.classList.contains('circle')) {
                const color = event.target.classList[1]
                event.target.parentElement.classList.add('selected')
                controller.addNote(color)
            }
        })

    },
    renderNotes(notes) {
        const notesContainer = document.querySelector('.cards-wrapper')
        notesContainer.innerHTML = ''
        notes.forEach(note => {
            notesContainer.innerHTML += `
            <div class="card">
                <div class="card-title-wrapper ${note.color}"
                    <h2 class="card-title">${note.title}</h2>
                <div class="card-icon-wrapper">
                   <svg class="icon-heart ${note.isFavorite ? 'favorite' : ''}" width="16" height="16" viewBox="0 0 16 16" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path d="M14.6667 5.90815C14.6667 6.93913 14.2708 7.9294 13.5639 8.66193C11.9366 10.3487 10.3583 12.1075 8.67024 13.7331C8.2833 14.1003 7.66951 14.0869 7.29924 13.7031L2.43588 8.66193C0.965872 7.13813 0.965872 4.67815 2.43588 3.15438C3.92033 1.61563 6.33867 1.61563 7.82311 3.15438L7.9999 3.33761L8.17657 3.15449C8.88831 2.41633 9.85764 2 10.8702 2C11.8828 2 12.8521 2.41629 13.5639 3.15438C14.2709 3.88697 14.6667 4.87718 14.6667 5.90815Z"
                                      stroke="#3D4D27" stroke-width="1.5" stroke-linejoin="round"/>
                            </svg>
                   <svg class="icon-bucket" width="16" height="16" viewBox="0 0 16 16" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.6667 7.33331V13.6C12.6667 13.8209 12.4876 14 12.2667 14H3.73337C3.51246 14 3.33337 13.8209 3.33337 13.6V7.33331"
                                      stroke="#3D4D27" stroke-width="1.5" stroke-linecap="round"
                                      stroke-linejoin="round"/>
                                <path d="M6.66663 11.3333V7.33331" stroke="#3D4D27" stroke-width="1.5"
                                      stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M9.33337 11.3333V7.33331" stroke="#3D4D27" stroke-width="1.5"
                                      stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M14 4.66667H10.6667M10.6667 4.66667V2.4C10.6667 2.17909 10.4876 2 10.2667 2H5.73333C5.51242 2 5.33333 2.17909 5.33333 2.4V4.66667M10.6667 4.66667H5.33333M2 4.66667H5.33333"
                                      stroke="#3D4D27" stroke-width="1.5" stroke-linecap="round"
                                      stroke-linejoin="round"/>
                            </svg>
                </div>
                </div>
                <div class="card-description">${note.description}</div>
            </div>
            `
        })

    }
}

const controller = {
    addNote(title, description, color) {
        if ((title && title.trim() !== '') && (description && description.trim() !== '')) {
            model.addNote(title, description, color)
        }
    },
}