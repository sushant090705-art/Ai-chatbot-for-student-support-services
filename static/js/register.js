const togglePassword=document.getElementById("togglePassword");
const password=document.getElementById("password");

togglePassword.onclick=function(){

if(password.type==="password"){

password.type="text";
togglePassword.innerHTML="🙈";

}
else{

password.type="password";
togglePassword.innerHTML="👁";

}

};

document.querySelector("form").addEventListener("submit",function(e){

const pass=document.getElementById("password").value;
const confirm=document.getElementById("confirmPassword").value;

if(pass!==confirm){

e.preventDefault();

alert("Passwords do not match!");

}

});