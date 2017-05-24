$(document).ready(function () {
  let $todos = $('#todos');
  const TODO_ON_PAGE = 3;



  let todosArray = [],
    currentId = 0,
    currentPage = 1;

  function addTodo (toAdd) {
    if(!toAdd.length){ return; }
    todosArray.push({checked: false, name: toAdd, id: currentId++});
    $('#todo input').val('');
    renderTodos(todosArray);
  }

  $('#button').click(function () {
    addTodo($('#todo input').val().trim());
  });

  $todos.keypress(
    function (e) {
      if (e.which == 13) {
        addTodo($(this).val().trim());
        return false;
      }
    });



  function renderTodos(todosArray) {
    $('ul').empty();
    let last = TODO_ON_PAGE * currentPage;
    let first = TODO_ON_PAGE * (currentPage - 1);
    let array = todosArray.slice(first, last);
    array.forEach(function (todo) {
      let todoElement = '<li ' + (todo.checked ? 'class = "checked"' : "") + '><input type="checkbox"' + (todo.checked ? "checked" : "") + ' data-id=" '+ todo.id + ' "><span class="content">' + todo.name + '</span><div id="delete">✗</div></li>';
      $('ul').append(todoElement);
    });
    updateCounters();
    paginPage(todosArray);
  }

  function removeTodo (todo) {
    let id = +$(todo).find("input[type='checkbox']").data('id');
    todosArray = $.grep(todosArray, function(e){ return e.id != id;});
    renderTodos(todosArray);

  }

  $('body').on('click', "#delete", function() {
    removeTodo($(this).parent());
  });

  $('.delete_all').click(
    function () {
      todosArray = [];
      renderTodos(todosArray);
    });


  function editTodo(todo, value) {
    let id = +$(todo).find("input[type='checkbox']").data('id');
    let todoElemenet = $.grep(todosArray, function(e){ return e.id == id; })[0];
    let index = todosArray.indexOf(todoElemenet);
    todosArray[index].name = value;
    console.log(todosArray[index].name);
    renderTodos(todosArray);
  }

  $('body').on('dblclick', ".content", function() {
    let text = $(this).text();
    $(this).hide();
    $(this).parent().append("<input type='text' class='edit-todo' value =" + text + ">");
  });

  $('body').on('blur', ".edit-todo", function() {
    editTodo($(this).parent(), $('.edit-todo').val());
    $('.edit-todo').remove();
  });

  $('body').on('keypress', ".edit-todo", function(e) {
    if (e.which == 13) {
      editTodo($(this).parent(), $('.edit-todo').val());
      $('.edit-todo').remove();
    }
  });





  function checkAll(checked) {
    todosArray.forEach(function(todo){
      todo.checked = checked;
    });
    renderTodos(todosArray);

  }

  $('body').on('change', "#checked_all", function() {
    checkAll(this.checked);
  });


  function getActive() {
    return todosArray.filter(function(x) {
      return !x.checked;
    })
  }

  $('body').on('click', ".active", function() {
    currentPage = 1;
    renderTodos(getActive());
  });

  function getCompleted() {
    return todosArray.filter(function(x) {
      return x.checked;
    })
  }

  $('body').on('click', ".completed", function() {
    currentPage = 1;
    renderTodos(getCompleted());
  });

  function getAll() {
    return todosArray.filter(function(x) {
      return x;
    })
  }

  $('body').on('click', ".all", function() {
    currentPage = 1;
    renderTodos(getAll());
  });


function paginPage (todosArray) {
  let countTodo = todosArray.length;
  let pageCount = Math.ceil(countTodo / TODO_ON_PAGE);
  $('.pagin').empty();
  $('.pagin').append('<a href="#" class="pagination-button prev">prev</a>');
  for (let i = 0; i < pageCount; i++) {
    $('.pagin').append('<a href = "#" class="pagination-button">' + (i + 1) + '</a>')
  }
  $('.pagin').append('<a href="#" class="pagination-button next">next</a>');

  $($('.pagination-button')[currentPage]).addClass('active-pagination')

  $('body').off('change', "input[type='checkbox']:not(#checked_all)");

  $('body').on('change', "input[type='checkbox']:not(#checked_all)", function() {
    checkboxHandler($(this).parent());
  });

  function checkboxHandler(todo) {
    let id = +$(todo).find("input[type='checkbox']").data('id');
    let todoElemenet = $.grep(todosArray, function(e){ return e.id == id; })[0];
    let index = todosArray.indexOf(todoElemenet);
    todosArray[index].checked = !todosArray[index].checked;
    renderTodos(todosArray);
  }

  $('body').off('click', ".pagination-button");

  $('body').on('click', ".pagination-button", function() {
    let countTodo = todosArray.length;
    let pageCount = Math.ceil(countTodo / TODO_ON_PAGE);
    let text = $(this).text();
    switch (text) {
      case "prev":
        if(currentPage != 1) {
          currentPage--;
        }
        break;
      case "next":
        if(currentPage != pageCount) {
          currentPage++;
        }
        break;
      default:
        currentPage = +text;
        break;
    }
    console.log(countTodo, currentPage);
    renderTodos(todosArray)
  });

}




  function updateCounters(){
    $('.all').text( "All:" + getAll().length );
    $('.completed').text( "Completed:" + getCompleted().length );
    $('.active').text( "Active:" + getActive().length );
  }

});



