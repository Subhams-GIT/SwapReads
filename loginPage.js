 // Import the functions you need from the SDKs you need

 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
 import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";
 import {getDatabase,set,ref,get,child} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js"
 import {
   getAuth,
   createUserWithEmailAndPassword,
   signInWithEmailAndPassword,
   signOut,
 } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

 //if session storage contains user data then only show logout button
 window.addEventListener('load',function(){
	if(sessionStorage.getItem('user-info'))
		{
			let logout=document.getElementById("logout");
			console.log(logout);
			logout.removeAttribute('style');
		}
 })

 //const credential = EmailAuthProvider.credential(email, password);
 // TODO: Add SDKs for Firebase products that you want to use
 // https://firebase.google.com/docs/web/setup#available-libraries

 // Your web app's Firebase configuration
 // For Firebase JS SDK v7.20.0 and later, measurementId is optional
 const firebaseConfig = {
	apiKey: "AIzaSyBEiIKrS7Raxv-73DyTjv_7xHkPKCyTKoo",
	authDomain: "gssoc-issue-solve.firebaseapp.com",
	databaseURL: "https://gssoc-issue-solve-default-rtdb.firebaseio.com",
	projectId: "gssoc-issue-solve",
	storageBucket: "gssoc-issue-solve.appspot.com",
	messagingSenderId: "897320160719",
	appId: "1:897320160719:web:7cb31eed6e903af62bd6ba"
  };

 // Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const db=getDatabase();
 const dbref=ref(db)
 const analytics = getAnalytics(app);
 //console.log(app);
 const auth = getAuth();


 
 //----- New Registration code start
 let register = document.querySelector(".register");
 document.getElementById("register").addEventListener("click", function () {
   let email = document.getElementById("email").value;
   let password = document.getElementById("password").value;
   //For new registration
   createUserWithEmailAndPassword(auth, email, password)
	 .then((userCredential) => {
	   // Signed in
	   const user = userCredential.user;
	   console.log(user);
	   set(ref(db , 'UsersAuthList/' +userCredential.user.uid),{
		email:email
	 	})
	   alert("Registration successfully!!");
	   email = "";
	   password = "";
	   register.style.transform = "translateY(8%)";
	   // ...
	 })
	 .catch((error) => {
	   const errorCode = error.code;
	   const errorMessage = error.message;
	   // ..
	   console.log(errorMessage);
	   alert(error);
	 });
 });
 //----- End

 //----- Login code start
 document.getElementById("login").addEventListener("click", async function () {
   let email = document.getElementById("login_email").value;
   let password = document.getElementById("login_password").value;
   try {
	 const userCredential=await  signInWithEmailAndPassword(auth, email, password)
	 // .then((userCredential) => {
	 //   // Signed in
	 //   //const user = userCredential.user;
	  get(child(dbref,'UsersAuthList/'+userCredential.user.uid))
		.then((snapshot)=>{
			console.log('inside snapshot');
			if(snapshot.exists()){
				console.log('dbh');
			sessionStorage.setItem('user-info',JSON.stringify({
				username:snapshot.val().email
			}))
			console.log(JSON.stringify(userCredential.user));
			sessionStorage.setItem('user-creds',JSON.stringify(userCredential.user))
		}
	 })
	email="";
	password="";
	console.log(userCredential._tokenResponse.email);
	document.getElementById("logout").style.display = "block";
	//window.location.href = "index.html";
   } 
   catch(error)  {
	   const errorCode = error.code;
	   const errorMessage = error.message;
	   console.log(errorMessage);
	   alert(errorMessage);
   };
   
   });
   
 //----- End

 //----- Logout code start
 function logOut () {
	signOut(auth)
	  .then(() => {
		// Sign-out successful.
		console.log("Sign-out successful.");
		alert("Sign-out successful.");
		sessionStorage.removeItem("user-info");
		 sessionStorage.removeItem("user-creds");
		document.getElementById("logout").style.display = "none";
	  })
	  .catch((error) => {
		// An error happened.
		console.log("An error happened.");
	  });
  };
 document.getElementById("logout").addEventListener("click",logOut)
  

 //----- End