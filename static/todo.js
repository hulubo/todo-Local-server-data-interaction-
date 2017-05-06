var e = function(selector) {
    return document.querySelector(selector)
}

var bindEvent = function(element, eventName, callback) {
    element.addEventListener(eventName, callback)
}

var toggleClass = function(element, className) {
    if (element.classList.contains(className)) {
        element.classList.remove(className)
    } else {
        element.classList.add(className)
    }
}



var ajax = function(method, path, data, reseponseCallback) {
    var r = new XMLHttpRequest()
    // 设置请求方法和请求地址
    r.open(method, path, true)
    // 设置发送的数据的格式
    r.setRequestHeader('Content-Type', 'application/json')
    // 注册响应函数
    r.onreadystatechange = function() {
        if(r.readyState === 4) {
            reseponseCallback(r)
        }
    }
    // 发送请求
    r.send(data)
}

class TodoAPI {
    constructor() {
        this.baseUrl = '/todo'
    }
    all(callback) {
        var method = 'GET'
        var path = '/all'
        var url = this.baseUrl + path
        ajax(method, url, '', function(r){
            var todos = JSON.parse(r.response)
            callback(todos)
        })
    }

    add(task, callback) {
        // 发送 ajax 来创建 todo
        var method = 'POST'
        var path = '/add'
        var url = this.baseUrl + path
        var data = {
            'task': task,
        }
        data = JSON.stringify(data)
        ajax(method, url, data, function(r){
            var t = JSON.parse(r.response)
            callback(t)
        })
    }

    delete(todo_id, callback) {
        // 发送 ajax 请求来删除 todov
        var method = 'GET'
        var path = '/delete/' + todo_id
        var url = this.baseUrl + path
        ajax(method, url, '', function(r){
            var t = JSON.parse(r.response)
            callback(t)
        })
    }
}

var api = new TodoAPI()




var templateTodo = function(todo) {
    var id = todo.id
    var task = todo.task
    var t = `
        <div class='todo-cell'>
            <i class="todo-done icon-check-empty"></i>
            <span class="todo-content">${task}</span>
            <i class="todo-delete icon-trash" data-id=${id}></i>
        </div>
    `
    return t
}

var insetTodo = function(todo) {
    var t = templateTodo(todo)
    todoContainer = e('#id-div-list')
    todoContainer.insertAdjacentHTML('beforeend', t)
}



var loadTodos = function () {
    api.all(function (todos) {
        console.log('获取todos',todos)
        for (var i= 0;i < todos.length; i++) {
            var todo = todos[i]
            insetTodo(todo)
        }
    })

}

var bindEventAdd = function() {
    var addButton = e('#id-button-add')
    bindEvent(addButton,'click',function() {
        //获得输入todo值
        var todoInput = e('#id-input-todo')
        var task = todoInput.value
        api.add(task,function (todo) {
            console.log('添加的 todo', todo)
            insetTodo(todo)
        })
  })
}

var bindEventDone_Delete = function() {
    var container = e('#id-div-list')
    bindEvent(container,'click',function(event) {
        var target = event.target
        if(target.classList.contains('todo-done')) {
            //给单元添加class
            var cell = target.parentElement
            var done = cell.children
            toggleClass(target,'icon-check-empty')
            toggleClass(target,'icon-check')
            //下滑线
            toggleClass(done[1],'done')

        }
        else if (target.classList.contains('todo-delete')) {
            var self = event.target
            var id = self.dataset.id
            var cell = self.parentElement
            api.delete(id,function (todo) {
                console.log('删除todo',id)
                cell.remove()
            })

        }
  })
}

var __main = function() {
    loadTodos()
    bindEventAdd()
    bindEventDone_Delete()
}

__main()
