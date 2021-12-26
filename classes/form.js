class FormClass {
    constructor() {
        this.form = document.forms[0]
        this.errorsField = this.form.querySelector('.error')
    }
    fields = {
        title: 'Заголовок',
        body: 'Содержание'
    }
    // [title, body]
    // ['Заголовок', 'Содержание']

    // [title]
    // ['Заголовок']

    // сбросить все поля формы до значений по умолчанию (метод объекта forms браузера)
    reset(){
        this.form.reset()
    }

    //
    errorsReset(){
        // удаляет информацию из секции с классом error (список не заполненных полей)
        this.errorsField.innerHTML = null
    }

    //
    errors(b) {
        // ВАРИАНТ 1
        console.log('wrongFields', b)
        let a = []
        for (let i = 0; i < b.length; i++){
            let field = b[i]
/*            console.log('b: ',b)
            console.log('i: ',i)
            console.log('b[i]: ',b[i])*/

            // this.fields['title'] = Заголовок
            a.push(this.fields[field])
        }
        // ВАРИАНТ 2
        /*
        let a = b.reduce((acc, cur) => {
            acc.push(this.fields[cur])
            return acc
        },[])
        */

        // формирование сообщения о предупреждении, что отсутствует информация в поле или полях формы
        document.forms[0].querySelector('.error').innerHTML =
            `
               <div class="alert alert-danger  my-4">
                     <p>Заполните пустые поля</p>
                     <ul>
                            ${a.map(field => { return `<li>${field}</li>`})
                            .join('')}
                     </ul>
               </div>
            `
    }
}