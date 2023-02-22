const burger = document.querySelector('.burger');
const nav = document.getElementById('nav-bar');

burger.addEventListener('click', ()=>{
    nav.style.transition = "transform 0.5s ease";
    /*displays the navigation*/
    nav.classList.toggle('nav-active'); 
    /*burger animation */
    burger.classList.toggle('toggle');
});

window.addEventListener('resize', ()=>{
    let viewPortWidth = window.innerWidth;
    if(viewPortWidth > 719){
        nav.style.transition = "none";
        nav.classList.remove('nav-active');
        burger.classList.remove('toggle');
    }
})



const formShortenLink = document.getElementById('form-shorten-link')
let linksArray = []

formShortenLink.addEventListener('submit', formSubmitted)

function formSubmitted(event){
    event.preventDefault()
    const txtLink = document.getElementById('txt-enter-link')
    const formWarning = document.querySelector('.form-warning')
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
            throw data.error_code
        }
    } catch (error) {
        if(error == 2){
            console.log('Cannot Create Link. Please check that the URL is valid.')
        }else{
            console.log('Cannot Create Link. Please check your network connection or ensure that the URL is valid')
        }
    }
}

function addLink(data){
    linksArray.push(new function(){
        this.code = data.code
        this.short_link = data.short_link
        this.full_short_link = data.full_short_link
        this.original_link = data.original_link
    })
    console.log(linksArray)
    document.getElementById('txt-enter-link').value = ""
    const shortenLinksSection = document.getElementById('shorten-links-section')
    shortenLinksSection.appendChild(createLinkSection(data))
}

function createLinkSection(data){
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


function btnCopyClicked(event){
    const linkCode = event.target.closest('.section-display-link').dataset.linkCode
    linksArray.forEach(item => {
        if(item.code == linkCode){
            copyLink(item.full_short_link, event.target)
        }
    })
    
}

async function copyLink(link, btnToChange){
    try {
        await navigator.clipboard.writeText(link);
        changeBtnCopyColor(btnToChange)
    } catch (error) {
        alert("Cannot Copy Link to Clipboard.")
    }
}

function changeBtnCopyColor(btnToChange){
    const btnCopy = document.querySelectorAll('.btn-copy-link')
    btnCopy.forEach(btn => {
        btn.classList.remove('btn-copy-clicked')
        btn.innerText = "Copy"
    })
    btnToChange.classList.add('btn-copy-clicked')
    btnToChange.innerText = "Copied!"
}


