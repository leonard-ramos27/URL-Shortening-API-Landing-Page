//  **  MOBILE BURGER MENU  **

const burger = document.querySelector('.burger');
const nav = document.getElementById('nav-bar');

burger.addEventListener('click', ()=>{
    nav.style.transition = "transform 0.5s ease";
    /*displays the navigation*/
    nav.classList.toggle('nav-active'); 
    /*burger animation */
    burger.classList.toggle('toggle');
    if(burger.ariaExpanded == "true"){
        burger.ariaExpanded = "false"
    }else{
        burger.ariaExpanded = "true"
    } 
});

window.addEventListener('resize', ()=>{
    let viewPortWidth = window.innerWidth;
    if(viewPortWidth > 719){
        nav.style.transition = "none";
        nav.classList.remove('nav-active');
        burger.classList.remove('toggle');
        burger.ariaExpanded = "false"
    }
})


//  **  SHORTEN LINK FUNCTIONS  **

const formShortenLink = document.getElementById('form-shorten-link')
let linksArray = []
formShortenLink.addEventListener('submit', formSubmitted)

function formSubmitted(event){
    event.preventDefault()
    const txtLink = document.getElementById('txt-enter-link')
    const formWarning = document.querySelector('.form-warning')
    //Check if link is empty
    if(txtLink.value.trim() !== ""){
        txtLink.classList.remove('invalid-link')
        formWarning.style.display = "none"
        createLink(txtLink.value.trim())
    }else{
        txtLink.classList.add('invalid-link')
        txtLink.focus()
        formWarning.style.display = "block"
    }
}

async function createLink(link){
    try {
        const response = await fetch(`https://api.shrtco.de/v2/shorten?url=${link}`)
        const data = await response.json()
        if(data.ok){
            addLink(data.result)
        }else{
            console.log(data)
            throw data.error_code
        }
    } catch (error) {
        //If Error code is 2, user entered an invalid link 
        if(error == 2){
            alert('Cannot Create Link. Please check that the URL is valid.')
        }else{
            alert('Cannot Create Link. Server might be down or kindly check your network connection.')
        }
    }
}

function addLink(data){
    //Add the response to array
    linksArray.push(new function(){
        this.code = data.code
        this.short_link = data.short_link
        this.full_short_link = data.full_short_link
        this.original_link = data.original_link
    })
    //Clear Textbox and create section with the new link
    document.getElementById('txt-enter-link').value = ""
    const shortenLinksSection = document.getElementById('shorten-links-section')
    shortenLinksSection.appendChild(createLinkSection(data))
    updateLocalData()
}

function createLinkSection(data){
    //Create new section with the full link, short link and button to copy
    const newSection = document.createElement('section')
    newSection.classList.add('section-display-link')
    newSection.dataset.linkCode = data.code
    const originalLink = document.createElement('p')
    originalLink.classList.add('link-original')
    originalLink.innerText = data.original_link
    newSection.appendChild(originalLink)
    const shortenedLink = document.createElement('p')
    shortenedLink.classList.add('link-shortened')
    shortenedLink.innerText = data.short_link
    newSection.appendChild(shortenedLink)
    const btnCopy = document.createElement('button')
    btnCopy.classList.add('green-button')
    btnCopy.classList.add('btn-copy-link')
    btnCopy.innerText = "Copy"
    btnCopy.addEventListener('click', btnCopyClicked)
    newSection.appendChild(btnCopy)
    return newSection
}


//   **  COPY LINK FUNCTIONS  **

function btnCopyClicked(event){
    //Get Code and pass the full short link
    const linkCode = event.target.closest('.section-display-link').dataset.linkCode
    linksArray.forEach(item => {
        if(item.code == linkCode){
            copyLink(item.full_short_link, event.target)
        }
    })
    
}

async function copyLink(link, btnToChange){
    try {
        //Copy the link to clipboard then change the Button color
        await navigator.clipboard.writeText(link);
        changeBtnCopyColor(btnToChange)
    } catch (error) {
        alert("Cannot Copy Link to Clipboard.")
    }
}

function changeBtnCopyColor(btnToChange){
    //Remove copied class from other button
    const btnCopy = document.querySelectorAll('.btn-copy-link')
    btnCopy.forEach(btn => {
        btn.classList.remove('btn-copy-clicked')
        btn.innerText = "Copy"
    })
    //Change Button color and text
    btnToChange.classList.add('btn-copy-clicked')
    btnToChange.innerText = "Copied!"
}


//  **  LOCAL STORAGE FUNCTIONS  **

getLocalData()

function getLocalData(){
    if(localStorage.getItem("shortlyLinks") !== null){
        linksArray = JSON.parse(localStorage.getItem("shortlyLinks"))
        displayLinks()
    }
}

function displayLinks(){
    const shortenLinksSection = document.getElementById('shorten-links-section')
    linksArray.forEach(link => { 
        shortenLinksSection.appendChild(createLinkSection(link))
    })
}

function updateLocalData(){
    if(linksArray !== null){
        localStorage.setItem("shortlyLinks", JSON.stringify(linksArray))
    }
}

