// AJAX is all about making requests via JS, in the browser, without the page refreshing.
// Asynchronous JavaScript And XML.
// Traditional browser requests happen in response to:
// - Entering a URL in the browser bar.
// - Clicking on a link.
// - Submitting a form.
// In all cases: 
// - Browser makes request
// - Receives response
// - Replaces entire resource with result
// Around 1996, different browser adding new ways to make requests but with JavaScript.
// We can now make websites where we can load content from an API, from a server somewhere, make a request, 
// get data back, and we don't have to refresh the page. 
// AJAX is a concept or a way of srtucturing webpages in making requests. 
// Reddit is so good that it makes all kinds of requests even you simply hover your mouse over items
// on pages (probably so it can collect info for ads, who knows?). 
// Why use AJAX? 
// - Don't need to reload entire page if just 1 thing is changing.
// - Interactive web sites.
// - Fewer full page loads from server. Your JS can talk to other servers directly.
// - Less info has to go across network. 

// AJAX with Axios
// XMLHttpRequest is an old clunky, first request interface. Annoying syntax. 

// To start a server on the teriminal, type $ python3 -m http.server (works if you downloaded python3)
// In the browser type in localhost:8000

// Can easily include Axios using a CDN link: <script src="https://unpkg.com/axios/dist/axios.js"></script>   

// Making a Simple Request 
// axios.get(url)
// Make GET request to that URL

// Not what we expected: 
const response = axios.get('https://swapi.co/api/planets/') 
console.log(response);
// "Promise {<pending>}" 

// For now ignore what a promise is until we learn about Node.
// For now, all you need to know is that a promise is like a placeholder for a future value.
// At the moment, we don't have the value, because axios.get() doesn't actually get it itself.
// We want to wait for the promise to have that value before proceeding.
// But we don't know when the promise will receive its value!

// Asynchronicity 
// AJAX requests are asynchronous. Async and Await will be important.
// - axios.get() completes before the response is received
// - This means that if we want to use the data we get back from our AJAX requests,
// we need to wait until the response has been given to us.

async function getData(){
    const response = await axios.get('https://swapi.co/api/planets/') 
    console.log(response);
    console.log("THIS LINE IS AFTER AXIOS.GET");
}

// Finally works. AJAX even parses the JSON object into regular JS automatically. 
// With XHR we had to parse it manually.

// If you just want the names:
async function getData(){
    const response = await axios.get('https://swapi.co/api/planets/')
    for(let planet of response.data.results){
        console.log(planet.name)
    }
}

// Multiple Requests
async function getData(){
    const response = await axios.get('https://swapi.co/api/planets/')
    const {next, results} = response.data;
    console.log(next); // a url should pop out
    for(let planet of results){
        console.log(planet.name)
    }
    const response2 = await axios.get(next) 
    const results2 = response2.data.results; 
    for(let planet of results2) {
        console.log(planet.name)
    }
}

// SpaceX Launch Data
async function getLaunches(){
    const res = await axios.get('https://api.spacexdata.com/v3/launches/upcoming');
    const ul = document.querySelector("#launches");
    for(let launch of res.data){
        const newLi = document.createElement('li');
        newLi.inerText = launch.mission_name;
        ul.append(newLi)
        // console.log(launch.mission_name)
        // console.log(launch.rocket.rocket_name)
    }
}

// For manipulating the DOM 
// <button id="getLaunches">Get Upcoming Launches</button>
// <ul id="launches"></ul>

// run getLaunches() 
// You get a neat lsit of the launches.

// Mission name in bold, as well as the rocket:
async function getLaunches(){
    const res = await axios.get('https://api.spacexdata.com/v3/launches/upcoming');
    const ul = document.querySelector("#launches");
    for(let launch of res.data){
        const newLi = document.createElement('li');
        const mission = document.createElement('B');
        mission.innerText = launch.mission_name;
        newLi.append(mission); 
        newLi.innerHTML += `- ${launch.rocket.rocket_name}`;
        ul.append(newLi)
    }
}

// So there is a button to show the launches:
async function getLaunches(){
    const res = await axios.get('https://api.spacexdata.com/v3/launches/upcoming');
    renderLaunches(res.data);
}
function renderLaunches(launches){
    const ul = document.querySelector("#launches");
    for(let launch of launches){
        ul.append(makeLaunchLi(launch))
    }
}

function makeLaunchLi(launch){
    const newLi = document.createElement('li');
    const mission = document.createElement('B');
    mission.innerText = launch.mission_name;
    newLi.append(mission); 
    newLi.innerHTML += `- ${launch.rocket.rocket_name}`;
    return newLi;
}

const btn = document.querySelector('#getLaunches')
btn.addEventListener('click', getLaunches);

// Error handling:
// Everytime you call this function, you get a random dog image:
async function getRandomDog() {
    const res = await axios.get('https://dog.ceo/api/breeds/image/random')
    const img = document.querySelector("#dog")
    img.src = res.data.message;
}
async function getDogByBreed(breed){ // Calling this function calls a specific breed.
    const url = `https://dog.ceo/api/breed/${breed}/images/random`;
    const res = await axios.get(url)
    const img = document.querySelector("#dog")
    img.src = res.data.message;
    }
// HTML:
// <form action="" id="searchform">
// <input type="text" id="search">
// <button>Search</button>
// </form>
// <img src="" alt="" id="dog">

// If you call getDogByBreed('lab'), it won't work. You'll get an error because you hae to be specific.
// How do we handle errors? Try and catch.

async function getDogByBreed(breed){
    try {
    const url = `https://dog.ceo/api/breed/${breed}/images/random`;
    const res = await axios.get(url)
    const img = document.querySelector("#dog")
    img.src = res.data.message;  
    } catch(e){
        alert("BREED NOT FOUND!")
        getRandomDog(); // This will still run even after there is an error. 
    }
}

const form = document.querySelector('#searchform')
const input = document.querySelector('#search')
form.addEventListener("submit", function(e){
    e.preventDefault();
    getDogByBreed(input.value);
    input.value = ""; // Automatically makes the input blank.
})

// Axios get params
// .get 
// axios.get(url, [config])
// config is an optional object many Axios methods use. It holds a specific configuration for what you needs.
// .get with Query Params
// To make request for /resource?a=1&b=2, can either use:
// axios.get("/resource?a=1&b=2s")
// or 
// axios.get("/resource", {params: {a: 1, b: 2}})

async function getJoke(first, last){
  let res = await axios.get(`http://api.icndb.com/jokes/random?firstName=${first}&lastName=${last}`)
  console.log(res.data.value.joke)
}

getJoke("Butters", "Steele")

// The other way:
async function getJoke(firstName, lastName){

    let res = await axios.get(`http://api.icndb.com/jokes/random`, {params: {firstName, lastName}})
    console.log(res.data.value.joke)
  }
  
  getJoke("Butters", "Steele")

// Axios Post
// .post
// Similar to axios.post(url, [data,] [config])

async function getUsers(){
    const res = await axios.get('https://regres.in/api/users');
    console.log(res);
}
async function createUser(){
    const res = await axios.post('https://regres.in/api/users', {username: 
    "Butters The Chicken", email:"butters@gmail.com", age: 1});
    console.log(res)
}
createUser();

// Hacker snooze axios

// You don't have the right credentials, comes with an error message:
// Before, you didn't have a token, but now you do.
async function getUsers(token) {
    const res = await axios.get('https://hack-or-snooze-v3.herokuapp.com/users', {params:
{token}});
    console.log(res);
}
getUsers();

// On the website, you need to send a post request a url/signup. 

async function signUp(username, password, name){
    const res = await axios.post('https://hack-or-snooze-v3.herokuapp.com/signup', {user: { name,
username, password}})
console.log(res);
}
// signUp('butterschicken', "12324134kdnfvjnx", 'butters the chicken')

async function login(username, password){
    const res = await axios.post('https://hack-or-snooze-v3.herokuapp.com/login', {user: { name,
username, password}})
console.log(res);
return res.data.token;
}
login('butterschicken', "12324134kdnfvjnx")

async function getUsersWithAuth(){
    const token = await login('butterschicken', '12324134kdnfvjnx')
    getUsers(token);
}

async function createStory(){
    const token = await login('butterschicken', '12324134kdnfvjnx')
    const newStory = {
        token, 
        story: {
            author: 'Butters',
            title: 'BOCK BOCK BOCK',
            url: 'http://chickens4lyfe.com'
        }
    }
    const res = await axios.post('https://hack-or-snooze-v3.herokuapp.com/stories', newStory)
    console.log(res);
}
createStory()