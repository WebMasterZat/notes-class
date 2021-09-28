class NotesClass {
    constructor() {
        this.form = new FormClass
        console.log('this.form: ', this.form)
    }


    add(note) {

        // ВАЛИДАЦИЯ
        //if (!this.validation(note)) return

        this.validation(note)

        const newNote = {
            id: uuid.v4(),
            completed: false,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            ...note
            // title: note.title,
            // body: note.body,
        }
        const notes = this.notes // массив объектов заметок
        notes.push(newNote)
        this.save(notes)
        this.render()
        console.log('Заметка добавлена')
        this.form.reset()
    }


    // сохранить заметку в localstorage
    save(notes) {
        localStorage.setItem("notes", JSON.stringify(notes))
    }

    // получаем из localstorage объект заметки
    get notes() {
        return localStorage.getItem("notes") ? JSON.parse(localStorage.getItem("notes")) : []
    }

    // удалить заметку по id
    remove(id) {
        const notes = this.notes
        const index = notes.findIndex(note => note.id === id)
        if (index !== -1) {
            notes.splice(index, 1)
            this.save(notes)
        }
    }


    update(id, note) {

        this.validation(note)

        const notes = this.notes
        notes.forEach(item => {
            if (item.id === id) {
                item.title = note.title
                item.body = note.body
                item.updatedAt = Date.now()
            }
        })
        this.save(notes)
        console.log(`Заметка c id = ${id} обновлена`)
        this.form.reset()

        // ВАЛИДАЦИЯ
        // if (!this.validation) ...

        // обновление отдельной заметки
        // получить из хранилища ...
    }

    // получаем заметку по её id
    getById(id) {
        // возврат заметки по id
        return this.notes.find(el => el.id === id)
    }


    getByTitle(_title) {
        // возврат заметки по id
        return this.notes.filter(el => el.title.includes(_title))
    }

    // ПРИВАТНЫЙ МЕТОД - ВЫЗЫВАЕТСЯ ТОЛЬКО ВНУТРИ КЛАССА

    // проверка введённых полей на наличие данных
    validation(note) {
        // удаляем список всех ошибок в классе .error
        this.form.errorsReset()
        // сохраняем в переменную keys все ключи из объекта note
        let keys = Object.keys(note)
        // создаём пустой массив
        let wrongFields = []
        // находим все пустые поля в форме отсекая пробелы с справа и слева
        keys.forEach(key => {
            if (note[key].trim() === '') {
                wrongFields.push(key)
            }
        })
        // и если в массиве есть хотя бы один элемент, который указывает на незаполненное поле то
        // выдаётся сообщение
        if (wrongFields.length > 0) {
            console.log('Валидация не пройдена')
            // функция error получает на вход объект (в зависимости от незаполненного поля), значения которого заносятся в новый массив,
            //  потом значения этого массива формируют структуру html и сообщение об ошибки
            this.form.errors(wrongFields)

            // ПРЕКРАЩЕНИЕ РАБОТЫ ПРОГРАММЫ
            throw new Error('Пустые поля формы')
        }
    }

    // print
    // вывод текущего (временного) массива заметок в консоль
    // аргументы: -

    print() {
        // this.render()
        console.log(this.notes)
    }

    // ВЫВОД И ПЕРЕРИСОВКА СПИСКА ЗАМЕТОК
    // ПРИ ДОБАВЛЕНИИ ИЗ ФОРМЫ ЗАМЕТКА ДОЛЖНА ВЫВОДИТЬСЯ В КОНЦЕ СПИСКА ЗАМЕТОК НА ЭКРАНЕ
    render() {
        let notesList = document.querySelector('.notes-list')
        const notes = this.notes
        let ul = document.createElement('ul')

        notesList.innerText = ''
        notes.forEach((item, index) => {

            // Удалить
            let buttonDelete = document.createElement('button')
            buttonDelete.innerText = 'Удалить'
            buttonDelete.classList.add('btn')
            buttonDelete.classList.add('btn-danger')
            buttonDelete.classList.add('m-1')
            buttonDelete.addEventListener('click', (e) => {
                this.remove(item.id)
                this.render()
            })

            // Редактирование
            let buttonEdit = document.createElement('button')
            buttonEdit.innerText = 'Редактировать'
            buttonEdit.classList.add('btn')
            buttonEdit.classList.add('btn-success')
            buttonEdit.addEventListener('click', () => {
                // const origin = location.origin
                const {origin} = location
                // location.href = `${origin}/edit.html`
                location.href = 'BASE_URL/edit.html' + '?id=' + item.id

            })


            // checkbox
            let inputNotesList = document.createElement('input')
            let labelNotesList = document.createElement('label')
            inputNotesList.setAttribute('name', 'labelNotesList')
            labelNotesList.setAttribute('for', 'labelNotesList' + index)
            inputNotesList.type = 'checkbox'
            inputNotesList.id = 'labelNotesList' + index
            inputNotesList.className = 'labelNotesList'
            inputNotesList.checked = item.completed

            // Card
            let cardBody = document.createElement('div')
            cardBody.classList.add('card-body')

            let h5 = document.createElement('h5')
            h5.classList.add('card-title')
            h5.innerText = 'TITLE: ' + item.title

            let p = document.createElement('p')
            p.classList.add('card-text')
            p.innerText = 'BODY: ' + item.body + ' | ' + 'COMPLETED: ' + item.completed

            cardBody.appendChild(h5)
            cardBody.appendChild(p)

            notesList.appendChild(ul)
            let li = document.createElement('li')
            li.classList.add('my-3')

            let btnDateOfCreate = document.createElement('button')
            btnDateOfCreate.type = 'button'
            btnDateOfCreate.classList.add('btn')
            btnDateOfCreate.classList.add('btn-outline-secondary')


            btnDateOfCreate.innerText = 'Дата создания: ' + DateClass.formatData(item.createdAt, FULL_DATE)



            let badgeDateOfEdit = document.createElement('span')
            //<span class="badge bg-secondary">Secondary</span>
            badgeDateOfEdit.classList.add('badge')
            badgeDateOfEdit.classList.add('m-1')
            badgeDateOfEdit.classList.add('bg-secondary')


           badgeDateOfEdit.innerText = 'Дата редактирования: ' + DateClass.formatData(item.updatedAt, FULL_DATE) // baged bootstrap

            ul.appendChild(li)
            li.appendChild(h5)
            li.appendChild(p)
            li.appendChild(inputNotesList)
            li.appendChild(labelNotesList)
            li.appendChild(buttonEdit)
            li.appendChild(buttonDelete)
            li.appendChild(btnDateOfCreate)
            li.appendChild(badgeDateOfEdit)

            inputNotesList.addEventListener('change', (e) => {
                item.completed = e.target.checked
                this.save(notes)
                this.render()
            })
        })
    }
}


/*
1. Поменять кнопки на бейджи вывод времени (кнопки применяются, если есть логика клика)
2. Вывести дату создания заметки на странице редактирования редактирования в формате:
    2.1 Заметка создана: 26 сентября 2021 (подключить русскую локализацию)
    2.2 Вывод в виде бейджа (baige)
    2.3 Создать и передать новую константу форматированного вывода. С названием LOCALIZED_DATE

 */