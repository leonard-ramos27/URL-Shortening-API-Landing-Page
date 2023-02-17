const burger = document.querySelector('.burger');
const nav = document.getElementById('nav-bar');

burger.addEventListener('click', ()=>{
    /*console.log("Burger clicked")*/
    nav.style.transition = "transform 0.5s ease";
    /*displays the navigation*/
    nav.classList.toggle('nav-active'); 
    /*burger animation */
    burger.classList.toggle('toggle');
});

window.onresize = () => {
    let viewPortWidth = window.innerWidth;
    if(viewPortWidth > 719){
        console.log("Changing nav")
        nav.style.transition = "none";
        nav.classList.remove('nav-active');
        burger.classList.remove('toggle');
    }
}