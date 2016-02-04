$().ready(function(){
  $('form#login').on('submit', loginUser);
  $('form#register').on('submit', registerUser);
  $('form#additem').on('submit', addItem);

  console.log('client script loaded')
});


function loginUser(e){
  e.preventDefault();

  var loginData = {
    email: $('#InputEmail').val(),
    password: $('#InputPassword').val()
  }
  console.log(loginData);

  $.post('/users/login', loginData)
    .success(function(){
      location.href="/users/profile"
      console.log("success");
    })
    .fail(function(err){
      console.log(err);
    });
}



function registerUser(e){
  e.preventDefault();
  var password2 = $('#regPassword2').val()

  var registerData = {
    name: $('#regFirst').val(),
    email: $('#regEmail').val(),
    password: $('#regPassword').val()
  }

  if(registerData.password !== password2){
    $('.pass').val('');
    return alert('Passwords dont match')
  }

  $.post('/users/register', registerData)
    .success(function(){
      location.href="/login"
      console.log("success");
    })
    .fail(function(err){
      console.log(err);
    });
}

function addItem(e){
  e.preventDefault();

  var itemData = {
    name: $('#itemName').val(),
    description: $('#description').val(),
    ownerId: $('#addItemButton').attr('data-id'),
    listed: $('#listopt').attr('checked')
  }

  $.post('/items', itemData)
    .success(function(){
      location.href="/users/profile"
    })
    .fail(function(err){
      console.log(err);
    });
}
