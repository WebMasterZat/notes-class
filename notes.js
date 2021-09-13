class NotesClass {
    constructor() {
        this.form = new FormClass
        console.log('this.form: ', this.form)
    }


    add(note){

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
        const notes = this.notes()
        const index = notes.findIndex(note => note.id === id)
        if (index !== -1) {
            notes.splice(index, 1)
            this.save(notes)
        }
    }


    update(id, note) {

        this.validation(note)

        const notes = this.notes()
        notes.forEach(item => {
            if (item.id === id) {
                item.title = note.title
                item.body = note.body
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
        return this.notes
    }

    // ВЫВОД И ПЕРЕРИСОВКА СПИСКА ЗАМЕТОК
    // ПРИ ДОБАВЛЕНИИ ИЗ ФОРМЫ ЗАМЕТКА ДОЛЖНА ВЫВОДИТЬСЯ В КОНЦЕ СПИСКА ЗАМЕТОК НА ЭКРАНЕ
    render() {
        let notesList = document.querySelector('.notes-list')
        const notes = this.notes


        let ul = document.createElement('ul')

        notesList.innerText = ''

        notes.forEach((item, index) => {
            let inputNotesList = document.createElement('input')
            let labelNotesList = document.createElement('label')
            inputNotesList.setAttribute('name', 'labelNotesList')
            labelNotesList.setAttribute('for', 'labelNotesList' + index)


            // 1. по клику на кнопку редактировать перейти на страницу edit
            // 2. get (параметр search об-та location) параметром передать id заметки в формате id = номер id (сам id)
            // 3. в самом файле edit.html в JS прописать получение get параметра id из строки браузера (он же получается из свойства search объекта location)
            // т.е. если строка вида http://test.localhost/edit.html?id=123
            // то надо создать об-т query в формате { id: 123 }
            // использовать метод split или метод match ( c регулярным выражением )

            // 4. Создать экземпляр класса заметок и по полученному из строки id получить текущую заметку из localstorage по её id (getById())

            // 5. поле заголовок найденной заметки поставить в value input формы редактирования, поле содержание в textarea. Т.е. вставить данные
            // заметки в ДОМ

            // ЕСЛИ СМОЖЕШЬ
            // 6. Отредактировать выбранную заметку и вернуться на страницу index.html, где заметка будет отображаться в отредактированном виде


            let button = document.createElement('button')
            button.innerText = 'Редактировать'
            button.classList.add('btn')
            button.classList.add('btn-success')
            button.addEventListener('click', () => {
                // const origin = location.origin
                const {origin} = location
                // location.href = `${origin}/edit.html`
                location.href = 'http://test.localhost/edit.html' + '?id=' + item.id

            })

            inputNotesList.type = 'checkbox'
            inputNotesList.id = 'labelNotesList' + index
            inputNotesList.className = 'labelNotesList'
            inputNotesList.checked = item.completed
            notesList.appendChild(ul)
            let li = document.createElement('li')
            li.classList.add('my-3')
            ul.appendChild(li).innerText = 'TITLE: ' + item.title + ' | ' + 'BODY: ' + item.body + ' | ' + 'COMPLETED: ' + item.completed
            li.appendChild(inputNotesList)
            li.appendChild(labelNotesList)
            li.appendChild(button)
            
            inputNotesList.addEventListener('change', (e) => {
                item.completed = e.target.checked
                this.save(notes)
                this.render()
            })
        })
    }
}


/*
добавь к выводимой заметке чекбокс, который будет отображать статус поля completed

true - чекбокс отмечен, false - нет

поставь на него обработчик события, который будет переключать это поле у конкретной заметки

не забывай включать перерисовку*/