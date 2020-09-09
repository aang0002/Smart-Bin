function login(){
    // get user inputted username and password
    let username_input = document.getElementById("username").value;
    let password_input = document.getElementById("password").value;

    // check rather username and password matched
    var request = new XMLHttpRequest()

    // url pattern: http://127.0.0.1:8000/validatelogin/username/password
    url = 'http://127.0.0.1:8000/validatelogin' + '/' + username_input + '/' + password_input;
    request.open('GET', url, true);

    request.onload = function () {

      if (request.status == 200) {
        let response = JSON.parse(this.response)
        if (response.data.length == 0) {
            console.log("Failed to login");
            alert("Failed to login");
        }
        else{
            console.log("Login success");
            window.location.replace("http://127.0.0.1:8000/home");
        }
      } else {
        console.log('error')
      }
    }

    request.send();
}