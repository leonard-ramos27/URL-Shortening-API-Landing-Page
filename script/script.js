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
        nav.style.transition = "none";
        nav.classList.remove('nav-active');
        burger.classList.remove('toggle');
    }
}

function updateStatisticsSectionHeight(){
    const LinksStatisticsSection = document.querySelector('.links-statistics-section')
    const LinksStatisticWrapper = document.querySelector('.links-statistics-wrapper')
    console.log(LinksStatisticsSection, LinksStatisticWrapper, LinksStatisticWrapper.offsetHeight)
}

updateStatisticsSectionHeight()