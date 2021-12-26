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
        this.save([...this.notes, newNote])
        this.render()
        console.log('Заметка добавлена')
        this.form.reset()
    }


    // сохранить заметку в localstorage
    save(notes) {
        localStorage.setItem("notes", JSON.stringify(notes))
    }

    // 4 БАЗОВЫХ ОПЕРАЦИИ РАБОТЫ С ДАННЫМИ
    // Create - создание
    // Read - чтение (выборка)
    // Update - обновление
    // Delete - удаление

    // получаем из localstorage объект заметки
    get notes() {
        return localStorage.getItem("notes") ? JSON.parse(localStorage.getItem("notes")) : []
    }

    // удалить заметку по id
    remove(id) {
        this.save(this.notes.filter((note) => note.id !== id))
    }


    update(id, note) {
        this.validation(note)
        const {title, body} = note
        const newNotes = this.notes.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    body,
                    title,
                    updatedAt: Date.now()
                }
            }
            return note
        })
        this.save(newNotes)
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
        let ul = document.createElement('ul')

        notesList.innerText = ''
        this.notes.forEach((item, index) => {

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
                const { origin } = location
                location.href = `${origin}/edit.html?id=${item.id}`
                // location.href = BASE_URL + '/edit.html' + '?id=' + item.id

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

            let div = document.createElement('div')
            div.innerHTML = `
                <hr class="my-3"/>
                <div class="d-flex">
                    <span class="badge m-1 bg-secondary">Дата создания: ${DateClass.formatData(item.createdAt, FULL_DATE)}</span>
                    <span class="badge m-1 bg-secondary">Дата редактирования: ${DateClass.formatData(item.updatedAt, FULL_DATE)}</span>
                </div>
            `

            ul.appendChild(li)
            li.appendChild(h5)
            li.appendChild(p)
            li.appendChild(inputNotesList)
            li.appendChild(labelNotesList)
            li.appendChild(buttonEdit)
            li.appendChild(buttonDelete)
            li.appendChild(div)


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
2. Вывести дату создания заметки на странице редактирования в формате:
    2.1 Заметка создана: 26 сентября 2021 (подключить русскую локализацию)
    2.2 Вывод в виде бейджа (baige)
    2.3 Создать и передать новую константу форматированного вывода. С названием LOCALIZED_DATE

 */