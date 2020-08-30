
//FIREBASE SETUP
var firebaseConfig = {
  apiKey: "AIzaSyDaH2YXcdzDQUK6tm7-jC-2L2KY5RFuAms",
  authDomain: "try1-ff842.firebaseapp.com",
  databaseURL: "https://try1-ff842.firebaseio.com",
  projectId: "try1-ff842",
  storageBucket: "try1-ff842.appspot.com",
  messagingSenderId: "874316944375",
  appId: "1:874316944375:web:7cc38b208b2700ca26d4f2",
  measurementId: "G-T8LQ0NX9MG"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
var auth = firebase.auth();
var note = db.collection("user")
var id;

//Define UI Vars
const form = document.querySelector('#task-form');
const taskInput = document.querySelector('#task');
const filter = document.querySelector('#filter')
const tasklist = document.querySelector('.collection');
const clearBtn = document.querySelector('.clear-tasks');


//load all event listener
loadEventListeners();

//load all event listner
function loadEventListeners(){
//DOM load event (so that whenever page loads tasks stored in ls will display)
 //document.addEventListener('DOMContentLoaded' , getTask)
 //add task event
 form.addEventListener('submit' , addTask);
 //remove task
 tasklist.addEventListener('click' , removeTask)
 //clear task
 clearBtn.addEventListener('click' , clearTask)
 //filter
 filter.addEventListener('keyup', filterTasks)
}

//CHECKING USER STATUS
auth.onAuthStateChanged(user =>{
  if(user){
    id = (user.uid)
    document.querySelector('.form1').style.display="none"
    document.getElementById('welcome').innerHTML = `<h5>Sign in as  ${user.email} <h5>`
    document.getElementById('logout').style.display="block"
    document.querySelector('.task').style.display="block"
    getdata(id)
  }else{
    console.log('user logged out')
    document.querySelector('.task').style.display="none"
    document.querySelector('.form1').style.display="block"
    document.getElementById('logout').style.display="none"
       }
})


//SIGNIN
const SignIn = document.getElementById('signin').addEventListener('click' , (e) =>{
  e.preventDefault();
  let email = document.getElementById('email').value;
  let password = document.getElementById('password').value;
auth.createUserWithEmailAndPassword(email,password).
then( user => {let d = (user.user.uid)
//DATABASE CREATION 
    note.doc(d).set({
    email:email,
    password:password,
    tasks:[]
  })
  
})
})

//LOGOUT
const Logout = document.getElementById("logout").addEventListener('click',(e)=>{
  e.preventDefault();
  auth.signOut().then(
    tasklist.innerHTML = ""
  )
})

 //LOGIN
 const login = document.getElementById("login").addEventListener('click' , (e) => {
   e.preventDefault();
   let email = document.getElementById('email').value;
  let password = document.getElementById('password').value;
  auth.signInWithEmailAndPassword(email,password)
 })

 

//GET DATA FROM FIREBASE
function getdata(id) {
    
 note.doc(id).get().then((doc) => {
   const Tasks = (doc.data().tasks)
   getTask(Tasks)
        })
}



//--------------------------------------------------------------------------------------

//TO DO LIST




//GET TASK ON UI
function getTask (tasks){
  console.log(tasks)
    tasks.forEach(function(task){
        // create lielement
 const li = document.createElement('li')
 //add class
 li.className = 'collection-item';
 //add text Node and append to li 
 li.appendChild(document.createTextNode(task));
 // empty task-list value
 taskInput.value = ''
 //focusing input
 taskInput.focus()
 //create new link
 const link = document.createElement('a')
 // add class to link
 link.className = 'delete-item secondary-content';
 //Add icon html
 link.innerHTML='<i class="fa fa-remove"></i>'
 //appending the linkto li
 li.appendChild(link)
 //appending li to ul
 tasklist.appendChild(li)
 })
}

//ADD TASK  ON UI
function addTask (e){
   
  e.preventDefault();

if(taskInput.value === ''){
    alert('Add a Task')
}else{
// create lielement
 const li = document.createElement('li')
 //add class
 li.className = 'collection-item';
 //add text Node and append to li 
 li.appendChild(document.createTextNode(taskInput.value));
 
 //focusing input
 taskInput.focus()
 
 //create new link
 const link = document.createElement('a')
 // add class to link
 link.className = 'delete-item secondary-content';
 //Add icon html
 link.innerHTML='<i class="fa fa-remove"></i>'
 //appending the linkto li
 li.appendChild(link)
 //appending li to ul
 tasklist.appendChild(li)
 //store in firestore
       
storetofirestore(taskInput.value)
// empty task-list value
 taskInput.value = ''
 
}
}

//REMOVE TASK

function removeTask(e){
    if(e.target.parentElement.classList.contains('delete-item')){
        if(confirm('Are you sure?')){
        e.target.parentElement.parentElement.remove()
        removeTaskFirestore(e.target.parentElement.parentElement)
        }
    }
    
}
//CLEARTASK FROM FIRESTORE
function clearTask(){
    // tasklist.innerHTML = ''

    //or
    while(tasklist.firstChild){
        tasklist.removeChild(tasklist.firstChild)
    }
    filter.value=''

    clearTaskFromFirestore();
}

//STOREDATA ON FIREBASE
function storetofirestore (task){
  //  note.doc(id).tasks.push().set(task)
  console.log(task)
  console.log(id)
  note.doc(id).update({                                                         
    tasks: firebase.firestore.FieldValue.arrayUnion(task)
});

 
}

//REMOVE TASK FIRESTORE
function removeTaskFirestore(taskItem){
  note.doc(id).get().then((doc) => {
    let tasks = doc.data().tasks;
    tasks.forEach(function(task,index){
      if(taskItem.textContent === task){
          tasks.splice(index , 1)
      }
      note.doc(id).update({"tasks":tasks})
    })
  })  
}



//Clear Task FROM LS
function clearTaskFromFirestore(){
    note.doc(id).update({'tasks': ""});
}

//filter task
function filterTasks(e){
    const text = e.target.value.toLowerCase();
    document.querySelectorAll('.collection-item').forEach(
        function(task){
        const item = task.firstChild.textContent;
        if(item.toLowerCase().indexOf(text) != -1){
            task.style.display = 'block'
        }else{
            task.style.display = 'none'
        }
        }
        )
   }

filter.value=''
  