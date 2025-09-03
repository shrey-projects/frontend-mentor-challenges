// Switching between themes
const themeBtn = document.querySelector('.btn-theme')
const currentTheme = localStorage.getItem('theme')

if(currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme)
}

themeBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme')

    if(currentTheme === 'dark') {
        document.documentElement.removeAttribute('data-theme')
        themeBtn.innerHTML = '<img src="assets/images/icon-moon.svg" />'
        localStorage.setItem('theme', 'light')
    } else {
        document.documentElement.setAttribute('data-theme', 'dark')
        themeBtn.innerHTML = '<img src="assets/images/icon-sun.svg" />'
        localStorage.setItem('theme', 'dark')
    }
})

// Grid for extensions
const extensionsGrid = document.querySelector('.extensions-grid')
const filterBtnsContainer = document.querySelector('.btns-filter')
const filterBtns = document.querySelectorAll('.btn-filter')
let extensionsData = []
let currentFilter = 'all'

async function fetchExtensions() {
    const res = await fetch('data.json')
    extensionsData = await res.json()
    applyFilter(currentFilter)
}

function displayExtensions(extensions) {
    extensionsGrid.innerHTML = ''

    extensions.forEach(extension => {
        const item = document.createElement('div')
        item.classList.add('item')
        item.dataset.name = extension.name

        item.innerHTML = `
            <div class="top">
                <img src=${extension.logo} alt="${extension.name}/>
                <div class="extension-info">
                    <div class="name">${extension.name}</div>
                    <div class="description">${extension.description}</div>
                </div>
            </div>
            <div class="bottom">
                <button class="btn-remove">Remove</button>
                <div class="toggle-switch">
                    <input class="toggle-input"
                            id="toggle-${extension.name}"
                            type="checkbox"
                            ${extension.isActive ? 'checked' : ''}/>
                    <label class="toggle-label" for="toggle-${extension.name}></label>
                </div>
            </div>
        `

        extensionsGrid.appendChild(item)
    })

}

function applyFilter(filter) {
    currentFilter = filter

    filterBtns.forEach(btn => {
        btn.classList.toggle('active', btn.id === filter)
    })

    let filteredData
    switch(filter) {
        case 'all':
            filteredData = extensionsData
            break
        case 'active':
            filteredData = extensionsData.filter(ext => ext.isActive)
            break
        case 'inactive':
            filteredData = extensionsData.filter(ext => !ext.isActive)
            break
    }

    displayExtensions(filteredData)
}

// Event handlers
filterBtnsContainer.addEventListener('click', handleFilterClick)

extensionsGrid.addEventListener('click', handleGridClick)
extensionsGrid.addEventListener('change', handleToggle)

function handleFilterClick(e) {
    if(e.target.classList.contains('btn-filter')) {
        applyFilter(e.target.id)
    }
}

function handleGridClick(e) {
    if(e.target.classList.contains('btn-remove')) {
        const item = e.target.closest('.item')
        const name = item.dataset.name
        extensionsData = extensionsData.filter(ext => ext.name !== name)
        applyFilter(currentFilter)
    }
}

function handleToggle(e) {
    if(e.target.classList.contains('toggle-input')) {
        const item = e.target.closest('.item')
        const name = item.dataset.name

        const extension = extensionsData.find(ext => ext.name === name)
        if (extension) {
            extension.isActive = e.target.checked
        }
    }
}

fetchExtensions()