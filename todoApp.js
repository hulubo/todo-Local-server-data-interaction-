var express = require('express')
var bodyParse = require('body-parser')

var app = express()
var todoList = []

// 配置静态文件目录
app.use(express.static('static'))
// 数据json 解析
app.use(bodyParse.json())

var sendHtml = function(path, response) {
    var fs = require('fs')
    var options = {
        encoding: 'utf-8'
    }
    fs.readFile(path, options, function(err, data){
        //console.log(`读取的html文件 ${path} 内容是`, data)
        //response.send(data)发送数据给浏览器
        response.send(data)
    })
}
// 用 get 定义一个给用户访问的网址
app.get('/', function(request, response) {
    var path = 'template/index.html'
    sendHtml(path, response)
})

var todoAddId = function(todo) {
    // 判断 todoList 中是否有数据
    // 如果是第一次插入, id 为 1
    // 否则 id 是最后一个数据的 id + 1
    if(todoList.length === 0) {
        todo.id = 1
    } else {
        todo.id = todoList[todoList.length-1].id + 1
    }
    // 把 todo 添加到 todoList 中
    todoList.push(todo)
    return todo
}

var todoDelete = function (id) {
    id = Number(id)
    var index = -1
    for(var i = 0; i < todoList.length; i++) {
        // 找到对应 id 的数据
        var t = todoList[i]
        if(t.id == id) {
            index = i
            break
        }
    }
    if(index > -1) {
        var todo = todoList.splice(index, 1)
        return todo[0]
    } else {
        return null
    }
}

var sendJSON = function (response, object) {
    var data = JSON.stringify(object)
    response.send(data)
}


// // 获取所有 todo 的路由
app.get('/todo/all', function(request, response) {
    var r = JSON.stringify(todoList, null, 2)
    response.send(r)
})
//
// // 添加 todo 的路由
app.post('/todo/add', function(request, response) {
    var todo = request.body
    console.log('todo',typeof todo)
    var t = todoAddId(todo)
    sendJSON(response, t)
})

// // 删除 todo 的路由
app.get('/todo/delete/:id', function(request, response) {
    var id = request.params.id
    console.log('id',typeof id,id)
    var t = todoDelete(id)
    sendJSON(response, t)
})

// listen 函数的第一个参数是我们要监听的端口
var server = app.listen(8080, function () {
  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)
})
