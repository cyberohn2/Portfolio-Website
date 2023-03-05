//SELECTING USER PREFERENCE ON LOAD/RELOAD
window.addEventListener('load', ()=>{
    let selectedTheme = window.localStorage.getItem("theme")
    changeTheme(selectedTheme)
    window.localStorage.clear('theme')
})
//SWITCHING SECTIONS
const sections = Array.from(document.querySelectorAll('article'))
const navItems = document.querySelectorAll('.navbar-item')
navItems.forEach((item,index) =>{
    item.addEventListener('click', () =>{
        closeSEction()
        remActive()
        item.classList.add('active')
        sections[index].classList.add('active')
        sections[index].style.animation = 'showSection cubic-bezier(.04,.68,.64,.88) 200ms'
    })
})
function closeSEction() {
    sections.forEach( section =>{
        section.classList.remove('active')
    })
}
function remActive() {
    navItems.forEach( item =>{
        item.classList.remove('active')
    })
}
//OPEN SERVICE LIGHTBOX
const services = document.querySelectorAll('.service-item')
const lightbox = document.querySelector('.lightbox')
const lightboxContent = document.querySelector('.lightbox-content')
services.forEach(service =>{
    // let visibility = lightbox.getAttribute('aria-expanded')
    service.addEventListener('click', ()=>{
        lightbox.setAttribute('aria-expanded', 'true')
        lightboxContent.innerHTML = service.innerHTML
    })
})
lightbox.addEventListener('click', ()=>{
    lightbox.setAttribute('aria-expanded', 'false')
})

//TOGGLING SIDEBAR
const sidebarbg = document.querySelector('.sidebarbg')
const sidebar = document.querySelector('.sidebar')
const sidebarSwitch = document.querySelector('.show-btn')
sidebarSwitch.addEventListener('click', showsidebarbg)
function showsidebarbg() {
    let visibllity = sidebarbg.getAttribute('aria-expanded')
    if (visibllity == 'true') {
        sidebarbg.setAttribute('aria-expanded', 'false')
    } else {
        sidebarbg.setAttribute('aria-expanded', 'true')
    }
    showsidebar()
    
}
function showsidebar() {
    let visibility = sidebar.getAttribute('aria-expanded')
    if (visibility == 'true') {
        //SHOW ANIMATION FIRST BEFORE REMOVING ITEM
        sidebar.style.animation = 'closeSidebar cubic-bezier(.04,.68,.64,.88) 400ms'
        sidebar.addEventListener('animationend', ()=>{
            sidebar.setAttribute('aria-expanded', 'false')
        })
    } else {
        sidebar.setAttribute('aria-expanded', 'true')
        sidebar.style.animation = 'openSidebar cubic-bezier(.04,.68,.64,.88) 400ms'
        sidebar.addEventListener('animationend', ()=>{
            sidebar.setAttribute('aria-expanded', 'true')
        })
    }
    
}

//SWITCHING BETWEEN LIGHT AND DARK THEME 
const themeContainer = document.querySelector('.themes-container')
const themeBtn = document.querySelector('.theme-color ion-icon')
themeBtn.addEventListener('click', ()=>{
    themeBtn.style.animation = 'rollicon cubic-bezier(.04,.68,.64,.88) 500ms'
})
themeBtn.addEventListener('animationend', ()=>{
    let icontype = themeBtn.getAttribute('name')
    if (icontype == 'sunny') {
        themeBtn.style.animation = 'unset'
        themeBtn.setAttribute('name', 'moon')
        themeBtn.setAttribute('data-theme', 'light')
    } else {
        themeBtn.style.animation = 'unset'
        themeBtn.setAttribute('name', 'sunny')
        themeBtn.setAttribute('data-theme', '')
    }
    let themetype = themeBtn.getAttribute('data-theme')
    window.localStorage.setItem("theme", themetype)
    changeTheme(themetype)
})
function changeTheme(themetype) {
    const themeElements = [
        document.body,
        document.querySelector('.main-content'),
        document.querySelector('.sidebar'),
        document.querySelector('.avatar-img'),
        document.querySelector('.title'),
        document.querySelector('.navbar-list'),
        ...Array.from(document.querySelectorAll('.icon')),
        ...Array.from(document.querySelectorAll('.divider')),
        ...Array.from(document.querySelectorAll('.service-item')),
        document.querySelector('.lightbox-content'),
        ...Array.from(document.querySelectorAll('.timeline li')),
        ...Array.from(document.querySelectorAll('.project-type'))
    ]
    themeElements.forEach(element =>{
        if (themetype !== '') {
            element.classList.add(themetype)
        }else{
            element.classList.remove('light')
        }
    })
}



//TOGGLING PORTFOLIO NAVBAR
const pNavlist = document.querySelector('.p-navlist')
const pNav = document.querySelector('.portfolio-nav')
const navImg = document.querySelector('.nav-img')
const placeholder = document.querySelector('.placeholder')
placeholder.addEventListener('click', ()=>{
    
    let visibility = pNavlist.getAttribute('aria-expanded')
    if (visibility == 'true') {
        pNavlist.style.animation = 'closeP-nav cubic-bezier(.04,.68,.64,.88) 400ms'
        pNavlist.addEventListener('animationend', ()=>{
            pNavlist.setAttribute('aria-expanded', 'false')
        })
        navImg.style.animation = 'unrollimg cubic-bezier(.04,.68,.64,.88) 400ms forwards'
    } else {
        pNavlist.setAttribute('aria-expanded', 'true')
        pNavlist.style.animation = 'openP-nav cubic-bezier(.04,.68,.64,.88) 400ms'
        pNavlist.addEventListener('animationend', ()=>{
            pNavlist.setAttribute('aria-expanded', 'true')
        })
        navImg.style.animation = 'rollimg cubic-bezier(.04,.68,.64,.88) 400ms forwards'
    }
})

//FETCHING PROJECTS
const projectContainer = document.querySelector('.projects-container')
const pFetcher = document.querySelector('.p-btn')
let projectsResponse;
pFetcher.addEventListener('click', ()=>{
    let request = new XMLHttpRequest()
    request.addEventListener('readystatechange',()=>{
        if (request.readyState == 4 && request.status == 200) {
             projectsResponse = JSON.parse(request.responseText) 
             projectsResponse.forEach( project =>{
                const projectDiv = document.createElement('div')
                projectDiv.className = 'project'
                projectDiv.innerHTML = `<div class="project-img">
                <div class="action flexbox">
                    <a href="${project.view}"><ion-icon name="eye" class="view"></ion-icon></a>
                    <a href="${project.repo}"> <ion-icon name="git-pull-request" class="repo"></ion-icon>
                    </a>
                </div>
                <img src="${project.img}" alt="" >
            </div>
            <h2 class="project-title">${project.title}</h2>
            <p class="project-type">${project.type}</p>`
            projectDiv.setAttribute('data-type', project.dataType)
            projectContainer.appendChild(projectDiv)

             })
             filterProject()
        } else if(request.status !== 200 && request.readyState == 4){
            let errorMessage = document.createElement('h1')
            if (window.navigator.onLine == false) {
                errorMessage.innerHTML = `couldn't fetch projects, cos you're offline`
            } else {
                errorMessage.innerHTML = `couldn't fetch projects`
            }
            projectContainer.appendChild(errorMessage)
        }
    })
    request.open('GET', './projects.json')
    request.send()
})

//FILTERING PRJECTS
function filterProject() {
    const pNavItems = document.querySelectorAll('.navlist-item')
const projects = Array.from(document.querySelectorAll('.project'))
pNavItems.forEach(item =>{
    item.addEventListener('click',()=>{
        
        let query = item.getAttribute('data-query')
        projects.forEach((project) =>{
            if (query == '') {
                project.style.display = 'block'
            } else {
                let projectType = project.getAttribute('data-type')
                if (projectType !== query) {
                    project.style.display = 'none'
                    // console.log('done');
                } else {
                    project.style.display = 'block'
                }
            }

        })
    })
})
}
