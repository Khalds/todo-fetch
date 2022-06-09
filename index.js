document.addEventListener('DOMContentLoaded', () => {

  const usersUrl = 'https://jsonplaceholder.typicode.com/todos'

  const btn = document.getElementById('btn')
  const input = document.getElementById('input')
  const result = document.getElementById('result')

  //? Кнопка для отправления вводимых данных
  btn.addEventListener('click', () => {
    if (input.value === '') return
    createDeleteElement(input.value, false, Date.now())
    input.value = '';
    console.log('Заметка добавлена');
  })

  //? Fetch запрос на получение
  async function fetchAndRenderUsers() {
    try {
      const res = await fetch(usersUrl)
      const result = await res.json()
      renderUsersByUrl(result)
    } catch (err) {
      console.log('Error')
    }
  }

  fetchAndRenderUsers()

  //? Метод для перебора полученных данных из сервера
  function renderUsersByUrl(value) {
    value.map((item) => {
      createDeleteElement(item.title, item.completed, item.id)
    })
  }



  //? Create and delete todo
  const createDeleteElement = (value, complete, item) => {

    //? Пустой массив для хранения полученных данных
    const arr = []

    //? Структура получения вводимых данных в объект
    const obj = {
      id: item,
      title: value,
      completed: complete
    }
    arr.push(obj)
    console.log(arr);

    //? Добавление строки для todo
    const li = document.createElement('li')
    li.className = 'li'
    li.textContent = value

    //? Добавление кнопки для удаления
    const btn = document.createElement('button')
    btn.className = 'btn'
    btn.textContent = 'x'
    li.appendChild(btn)

    //? Добавление чекбокса
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    li.prepend(checkbox)

    //? Удаление тодо при клике
    btn.addEventListener('click', () => {
      deleteTodo(obj.id)
    })

    //? Функция для добавление галочки в чекбокс при получении данных
    function getChecked(value) {
      if (value.completed === true) {
        li.classList.toggle('li-active')
        checkbox.checked = true
      }
    }
    getChecked(obj)

    //? При клике проверяет состояние чекбокса и изменяет
    li.addEventListener('click', () => {
      li.classList.toggle('li-active')
      patchTodoList(obj.id)
      if (checkbox.checked === true) {
        checkbox.checked = false
      } else {
        checkbox.checked = true
      }
    })


    //? Fetch запрос на добавление
    const fetchSettingsForPost = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(obj)
    }

    async function postTodoList() {
      try {
        const res = await fetch('https://jsonplaceholder.typicode.com/todos', fetchSettingsForPost)
        const result = await res.json()
      } catch (err) {
        console.log(err);
      }
    }

    postTodoList()


    //? Fetch запрос на изменение
    const fetchSettingsForPatch = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        completed: true
      })
    }

    async function patchTodoList(id) {
      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, fetchSettingsForPatch)
        const result = await response.json()
        console.log('Todo изменен');
      } catch (err) {
        console.log(err);
      }
    }


    //? Fetch запрос на удаление
    async function deleteTodo(id) {
      try {
        const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
          method: 'DELETE'
        })
        if (res.ok === true) {
          result.removeChild(li)
          console.log(`Пользователь с id ${id} успешно удален`);
        }
      } catch (err) {
        console.log(err);
      }
    }

    result.prepend(li)
  }

})