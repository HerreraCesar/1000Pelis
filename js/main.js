// RECOMENDADOR DE PELICUAS SEGÚN GÉNERO

// Defino object
class pelicula {
    constructor (id, titulo, director, año, genero, duracion, pais, grupo, imdb, filmaffinity, rottentomatoes){
        this.id = id;
        this.titulo = titulo;
        this.director = director;
        this.año = año;
        this.genero = genero;
        this.duracion = duracion;
        this.pais = pais;
        this.grupo = grupo;
        this.imdb = imdb;
        this.filmaffinity = filmaffinity;
        this.rottentomatoes = rottentomatoes;
    }
}


// Defino arrays
const movies = []
const generos = ["Comedia","Thriller","Ciencia ficción","Terror","Bélico","Fantástico","Drama"]


// Agrego objects al array
movies.push (new pelicula ("1","Esperando la carroza","Alejandro Doria",1985,"Comedia",87,"Argentina","",8.1,7.5,9.6));
movies.push (new pelicula ("2","El Clan","Pablo Trapero",2015,"Thriller",110,"Argentina","",7.0,6.7,7.6));
movies.push (new pelicula ("3","Jurassic Park","Steven Spielberg",1993,"Ciencia ficción",121,"Estados Unidos","Jurassic Park Saga",8.1,7.0,9.1));
movies.push (new pelicula ("4","Joker","Todd Phillips",2019,"Thriller",121,"Estados Unidos","DC Extended Universe",8.4,8.0,8.8));
movies.push (new pelicula ("5","Nueve Reinas","Fabián Bielinsky",2000,"Thriller",114,"Argentina","",7.9,7.8,9.4));
movies.push (new pelicula ("6","Star Wars. Episode IV: A New Hope","George Lucas",1977,"Ciencia ficción",121,"Estados Unidos","Star Wars Saga",8.6,7.9,9.6));
movies.push (new pelicula ("7","2001: A Space Odyssey","Stanley Kubrick",1968,"Ciencia ficción",139,"Reino Unido","",8.3,7.8,8.9));
movies.push (new pelicula ("8","Carrie","Brian De Palma",1976,"Terror",97,"Estados Unidos","Stephen King Adaptations",7.4,7.4,7.7));
movies.push (new pelicula ("9","Gisaengchung (Parasite)","Bong Joon-ho",2019,"Thriller",132,"Corea del Sur","",8.6,8.0,9.0));
movies.push (new pelicula ("10","Inglourious Basterds","Quentin Tarantino",2009,"Bélico",146,"Estados Unidos","",8.3,7.8,8.8));
movies.push (new pelicula ("11","Iron Man","Jon Favreau",2008,"Fantástico",126,"Estados Unidos","Marvel Cinematic Universe",7.9,6.6,9.1));
movies.push (new pelicula ("12","The Lord of the Rings: The Fellowship of the Ring","Peter Jackson",2001,"Fantástico",180,"Nueva Zelanda","The Lord of the Rings Trilogy",8.8,8.0,9.5));
movies.push (new pelicula ("13","A Clockwork Orange","Stanley Kubrick",1971,"Drama",137,"Reino Unido","",8.3,8.2,9.3));
movies.push (new pelicula ("14","Full Metal Jacket","Stanley Kubrick",1987,"Bélico",120,"Reino Unido","",8.3,8.2,9.4));
movies.push (new pelicula ("15","Harry Potter and the Sorcerer's Stone","Chris Columbus",2001,"Fantástico",152,"Reino Unido","Harry Potter Saga",7.6,6.8,8.2));
movies.push (new pelicula ("16","Misery","Rob Reiner",1990,"Terror",104,"Estados Unidos","Stephen King Adaptations",7.8,7.5,8.9));
movies.push (new pelicula ("17","Spider-Man","Sam Raimi",2002,"Fantástico",121,"Estados Unidos","Spider-Man Trilogy",7.3,6.4,6.7));
movies.push (new pelicula ("18","The Avengers","Joss Whedon",2012,"Fantástico",135,"Estados Unidos","Marvel Cinematic Universe",8.0,6.9,9.1));


// PELICULA AL AZAR
$('#suerte').click(function() {
    let luck = random(movies.length);
    // Compruebo el idioma de la página para referenciar la imágen
    if ($('.check').prop('checked') == false) {
        $('#poster').attr('src',`media/posters/${luck}.jpg`);
    }
    else {
        $('#poster').attr('src',`../../media/posters/${luck}.jpg`);
    }
    $('#id').html(`#${luck}`);
    $('#nombre').html(movies[luck-1].titulo);
    $('#director').html(movies[luck-1].director);
    $('#año').html(movies[luck-1].año);
    $('#imdb').html(movies[luck-1].imdb);
    $('#filmaffinity').html(movies[luck-1].filmaffinity);
    $('#rottentomatoes').html(movies[luck-1].rottentomatoes);
});


// FUNCION ALEATORIEDAD
function random(max) {
    return Math.floor((Math.random()*max)+1);
}

// SCROLLSPY
let section = document.querySelectorAll('main div section');
window.onscroll = () => {
    section.forEach(i => {
        let top = window.scrollY;
        let offset = i.offsetTop - 150;
        let height = i.offsetHeight;
        let id = i.getAttribute('id');
        if (top >= offset && top < offset + height) {
            $('nav a').removeClass('active');
            $(`nav a[href*=${id}]`).addClass('active');
        }
    })
}


// MULTILANGUAGE
$('.check').click( function() {
    if ($('.check').prop('checked') == true) {
        location.href='pages/en/index.html';
    }
    else {
        location.href="../../index.html";
    }
})

// Guardo el idioma localmente
/* localStorage.setItem("idioma",JSON.stringify(check)); */


// OFF-CANVAS
$('#menuFiltro').click(function() {
    $('#lista').toggleClass('showMenu');
})


// FULL PAGE SCROLL
/* let cuerpoPrincipal = document.querySelector('body');
cuerpoPrincipal.addEventListener('wheel',avanzar);
function avanzar(e) {
    let delta = e.wheelDeltaY;
    if (delta < 0) {
        window.scrollBy(0, window.innerHeight);
    }
    else if (delta > 0) {
        window.scrollBy(0, -window.innerHeight);
    }
} */

// POP-UP
let redes = document.querySelectorAll('.red');
let direcciones = document.querySelectorAll('.direccion');
redes.forEach((red, indice) => {
    red.addEventListener('click', () => {
        direcciones[indice].classList.add('abierto');
        direcciones[indice].addEventListener('click', () => {
            direcciones[indice].classList.remove('abierto');
        })
    })
});

// TRAILER ALEATORIO
$('#trailer').html(`<video src="media/trailers/${random(4)}.mp4" autoplay muted loop></video>`);


// AUTOPLAY
let video = document.querySelector('video');
let isPaused = false;
let observer = new IntersectionObserver((entries) => { 
    entries.forEach(entry => {
        if(entry.intersectionRatio!=0.15  && !video.paused){
            video.pause(); isPaused = true;
        }
        else if(isPaused) {
            video.play(); isPaused=false
        }
    });
}, {threshold: 0.15}
);
observer.observe(video);