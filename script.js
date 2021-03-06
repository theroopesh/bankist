'use strict'

// Modal window Selectors
const modal = document.querySelector('.modal')
const overlay = document.querySelector('.overlay')

// button selectors
const btnCloseModal = document.querySelector('.btn--close-modal')
const btnsOpenModal = document.querySelectorAll('.btn--show-modal')
const btnScrollTo = document.querySelector('.btn--scroll-to')

// section selectors
const allSections = document.querySelectorAll('section')
const section1 = document.querySelector('#section--1')

// tabs selectors
const tabs = document.querySelectorAll('.operations__tab')
const tabsContainer = document.querySelector('.operations__tab--container')
const tabsContent = document.querySelectorAll('.operations__content')

// nav selectors
const nav = document.querySelector('.nav')
const navLinks = document.querySelector('.nav__links')
const navHeight = nav.getBoundingClientRect().height

//header selector
const header = document.querySelector('.header')

// lazy loading image selector
const imgTargets = document.querySelectorAll('img[data-src]')

// slider selectors
const slides = document.querySelectorAll('.slide')
const sliderBtnRight = document.querySelector('.slider__btn--right')
const sliderBtnLeft = document.querySelector('.slider__btn--left')
const slider = document.querySelector('.slider')
const maxSlide = slides.length
let currentSlide = 0

// slider dot selectors
const dotContainer = document.querySelector('.dots')

// scroll to top button selectors
const target = document.querySelector('.footer')
const scrollToTopBtn = document.querySelector('.scroll-to-top-btn')
const rootElement = document.documentElement

function openModal(e) {
  e.preventDefault()
  modal.classList.remove('hidden')
  overlay.classList.remove('hidden')
}

function closeModal() {
  modal.classList.add('hidden')
  overlay.classList.add('hidden')
}

// Event listeners

btnsOpenModal.forEach((btn) => btn.addEventListener('click', openModal))

// for (let i = 0; i < btnsOpenModal.length; i++) btnsOpenModal[i].addEventListener('click', openModal)

btnCloseModal.addEventListener('click', closeModal)
overlay.addEventListener('click', closeModal)

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal()
  }
})

btnScrollTo.addEventListener('click', (e) => {
  section1.scrollIntoView({ behavior: 'smooth' })
})

navLinks.addEventListener('click', (e) => {
  e.preventDefault()

  // Matching Strategy
  const options = {
    behavior: 'smooth',
  }

  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href')
    if (!id) {
      location.href = 'app.html'
    }
    document.querySelector(id).scrollIntoView(options)
  }
})

tabsContainer.addEventListener('click', (e) => {
  e.preventDefault()
  const clicked = e.target.closest('.operations__tab')

  // Guard Clause
  if (!clicked) return

  // Active Tab
  tabs.forEach((tab) => tab.classList.remove('operations__tab--active'))
  clicked.classList.add('operations__tab--active')

  // Show Content Area
  const currentTabContent = document.querySelector(`.operations__content--${clicked.dataset.tab}`)
  tabsContent.forEach((t) => t.classList.remove('operations__content--active'))
  currentTabContent.classList.add('operations__content--active')
})

// Menu fade

function handleNavHover(e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target
    const siblings = link.closest('.nav').querySelectorAll('.nav__link')
    const logo = link.closest('.nav').querySelector('img')
    siblings.forEach((el) => {
      if (el !== link) el.style.opacity = this
    })
    logo.style.opacity = this
  }
}

//Passing argument into handler function

nav.addEventListener('mouseover', handleNavHover.bind(0.5))
nav.addEventListener('mouseout', handleNavHover.bind(1))

// Sticky navigation for nav bar using Intersection Observer API

function stickyNav(entries) {
  const [entry] = entries
  if (!entry.isIntersecting) {
    nav.classList.add('sticky')
  } else {
    nav.classList.remove('sticky')
  }
}

const headerObserverOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
}

const headerObserver = new IntersectionObserver(stickyNav, headerObserverOptions)
headerObserver.observe(header)

// Reveal sections

function revealSection(entries, observer) {
  const [entry] = entries
  if (!entry.isIntersecting) return
  entry.target.classList.remove('section--hidden')
  observer.unobserve(entry.target)
}

const sectionObserverOptions = {
  root: null,
  threshold: 0.15,
}

const sectionObserver = new IntersectionObserver(revealSection, sectionObserverOptions)
allSections.forEach((section) => {
  sectionObserver.observe(section)
  section.classList.add('section--hidden')
})

// Lazy loading images

function loadImg(entries, observer) {
  const [entry] = entries
  if (!entry.isIntersecting) return
  entry.target.src = entry.target.dataset.src
  entry.target.addEventListener('load', () => {
    entry.target.classList.remove('lazy-img')
  })
}

const loadImgOptions = {
  root: null,
  threshold: 0,
  rootMargin: '200px',
}

const imgObserver = new IntersectionObserver(loadImg, loadImgOptions)
imgTargets.forEach((img) => imgObserver.observe(img))

// Working on slides
// Aligning all the slides horizontally using transform property in css

sliderInit()

slides.forEach((slide, index) => {
  slide.style.transform = `translateX(${100 * index}%)`
})

function goToSlide(slide) {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - slide)}%)`
  })
}

// Next Slide

function nextSlide() {
  if (currentSlide === maxSlide - 1) {
    currentSlide = 0
  } else {
    currentSlide++
  }
  goToSlide(currentSlide)
  activateDot(currentSlide)
}

// Previous slide

function previousSlide() {
  if (currentSlide == 0) {
    currentSlide = maxSlide - 1
  } else {
    currentSlide--
  }
  goToSlide(currentSlide)
  activateDot(currentSlide)
}

function sliderInit() {
  goToSlide(0)
  createDots()
  activateDot(0)
}

sliderBtnRight.addEventListener('click', nextSlide)
sliderBtnLeft.addEventListener('click', previousSlide)

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') previousSlide()
  e.key === 'ArrowRight' && nextSlide()
})

// Creating dots for slides

function createDots() {
  slides.forEach((_, i) => {
    const dotContainerHtml = `<button class="dots__dot" data-slide="${i}"></button>`
    dotContainer.insertAdjacentHTML('beforeend', dotContainerHtml)
  })
}

function activateDot(slide) {
  const allDots = document.querySelectorAll('.dots__dot')
  allDots.forEach((dot) => dot.classList.remove('dots__dot--active'))
  const currentDot = document.querySelector(`.dots__dot[data-slide='${slide}']`)
  currentDot.classList.add('dots__dot--active')
}

dotContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('dots__dot')) {
    const { slide } = e.target.dataset
    goToSlide(slide)
    activateDot(slide)
  }
})

// Scroll to top implementation

function scrollToTopCallback(entries, observer) {
  // The callback will return an array of entries, even if you are only observing a single item
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Show button
      scrollToTopBtn.classList.add('show-btn')
    } else {
      // Hide button
      scrollToTopBtn.classList.remove('show-btn')
    }
  })
}

function scrollToTop() {
  rootElement.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}
scrollToTopBtn.addEventListener('click', scrollToTop)

const observer = new IntersectionObserver(scrollToTopCallback)
observer.observe(target)
