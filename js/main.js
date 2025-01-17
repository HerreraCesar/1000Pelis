$( document ).ready( function() {
    // MULTILANGUAGE (switch)
    $('.check').click( function() {
        if ($('.check').prop('checked') == true) {
            location.href='./pages/en/index.html';
        }
        else {
            location.href='../../index.html';
        }
    });

    // TRAILER ALEATORIO (portada)
    $('#trailer').html(`<video src="https://herreracesar.github.io/movies-website/media/trailers/${random(10)}.mp4" autoplay muted loop></video>`);

    // AUTOPLAY (portada)
    if (window.location.pathname == "/index.html" || window.location.pathname == "/pages/en/index.html") {
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
    }

    // SCROLLSPY (menú navegación)
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

    // FUNCION ALEATORIEDAD
    function random(max) {
        return Math.floor((Math.random()*max)+1);
    }

    // OBTENGO ARRAY DE PELICULAS
    let movies = $.getJSON("https://herreracesar.github.io/movies-website/json/movies.json").done(function(movies) {
        console.log(movies);
        // PELICULA SEGÚN DÍA (recomendaciones)
        let hoy = new Date();
        let diaCero = new Date("06/01/2023");
        let contador = Math.floor((hoy.getTime() - diaCero.getTime())/86400000)+1;
        if (contador > 200) {
            let ahora = Date.now();
            diaCero = new Date(ahora);
            contador = Math.floor((hoy.getTime() - diaCero.getTime())/86400000)+1;
            cargarDatos(contador)
        }
        else {
            cargarDatos(contador)
        }

        function cargarDatos(origen) {
            $('#poster').attr('src',`https://herreracesar.github.io/movies-website/media/posters/${origen}.jpg`);
            $('#id').hide().html(`#${movies[origen-1].id}`).fadeIn("slow");
            $('#nombre').hide().html(movies[origen-1].title).slideDown("slow");
            $('#director').hide().html(movies[origen-1].direction.map((director) => `${director} - `)).fadeIn("slow");
            $('#año').hide().html(movies[origen-1].year).fadeIn("slow");
            $('#imdb').hide().html(movies[origen-1].imdb_score).fadeIn("slow");
            $('#filmaffinity').hide().html(movies[origen-1].filmaffinity_score).fadeIn("slow");
            $('#rottentomatoes').hide().html(movies[origen-1].rottentomatoes_score).fadeIn("slow");
            $('#link1').attr('href', movies[origen-1].imdb_link).attr('target','_blank');
            $('#link2').attr('href', movies[origen-1].filmaffinity_link).attr('target','_blank');
            $('#link3').attr('href', movies[origen-1].rottentomatoes_link).attr('target','_blank')
        }

        // PELICULA AL AZAR (recomendaciones)
        $('#suerte').click(function() {
            let luck = random(movies.length);
            cargarDatos(luck)
        });
        
        // ARMADO DE ARRAYS PARA FILTROS
        let generos = [];
        movies.forEach(movie => {
            movie.genre_es.forEach(genero => {
                if (!generos.includes(genero)) {
                    generos.push(genero)
                }
            });
        });
        let genres = [
            {
            "en":"Action",
            "es":"Acción",
            },
            {
            "en":"Animation",
            "es":"Animadas",
            },
            {
            "en":"War",
            "es":"Bélico",
            },
            {
            "en":"Sci-Fi",
            "es":"Ciencia ficción",
            },
            {
            "en":"Comedy",
            "es":"Comedia",
            },
            {
            "en":"Drama",
            "es":"Drama",
            },
            {
            "en":"Fantasy",
            "es":"Fantasía",
            },
            {
            "en":"Terror",
            "es":"Terror",
            },
            {
            "en":"Thriller",
            "es":"Thriller",
            }
        ]
        let años = [];
        movies.forEach(movie => {
            if (!años.includes(movie.year)) {
                años.push(movie.year)
            }
        });
        let directores = [];
        movies.forEach(movie => {
            movie.direction.forEach(director => {
                if (!directores.includes(director)) {
                    directores.push(director)
                }
            });
        });
        
        // ORDENO OPCIONES DE FILTRO
        function ordenar (a, b) {
            return b - a;
        }
        años.sort(ordenar);
        generos.sort();
        directores.sort();
        genres.sort();

        // MUESTRO OPCIONES DE FILTRO
        if ($('.check').prop('checked') == true) {
            genres.forEach(function (genre) {
                $('#generosFiltrados').append(`<option value="${genre.es}">${genre.en}</option>`);
                
            });
        }
        else {
            generos.forEach(genero => {
                $('#generosFiltrados').append(`<option value="${genero}">${genero}</option>`)
            });
        }
        
        directores.forEach(director => {
            $('#directoresFiltrados').append(`<option value="${director}">${director}</option>`)
        });
        años.forEach(año => {
            $('#añosFiltrados').append(`<option value="${año}">${año}</option>`)
        });
        
        // FUNCIONAMIENTO DE FILTROS CON EVENTOS
        filtros = {
            generos: undefined,
            directores: undefined,
            años: undefined,
        };
        let resultado = [];
        $('#generosFiltrados').change(function (seleccion) {
            filtros.generos = seleccion.target.value;
            filtrarPeliculas();
        });
        $('#añosFiltrados').change(function (seleccion) {
            filtros.años = seleccion.target.value;
            filtrarPeliculas();
        });
        $('#directoresFiltrados').change(function (seleccion) {
            filtros.directores = seleccion.target.value;
            filtrarPeliculas();
        });
        function filtrarPeliculas() {
            if (filtros.generos == undefined && filtros.directores == undefined && filtros.años == undefined ) {
                $('.posters').html('');
                resultado = movies;
                contar = 0;
                pintarPeliculas(0)
            }
            else if (filtros.directores == undefined && filtros.años == undefined) {
                $('.posters').html('');
                resultado = movies.filter( (movie) => {
                    return movie.genre_es.includes(filtros.generos)
                });
                contar = 0;
                pintarPeliculas(0)
            }
            else if (filtros.generos == undefined && filtros.directores == undefined) {
                $('.posters').html('');
                resultado = movies.filter( (movie) => {
                    return movie.year == filtros.años;
                });
                contar = 0;
                pintarPeliculas(0)
            }
            else if (filtros.generos == undefined && filtros.años == undefined) {
                $('.posters').html('');
                resultado = movies.filter( (movie) => {
                    return movie.direction.includes(filtros.directores)
                });
                contar = 0;
                pintarPeliculas(0)
            }
            else if (filtros.generos == undefined ) {
                $('.posters').html('');
                resultado = movies.filter( (movie) => {
                    return movie.direction.includes(filtros.directores) && movie.year == filtros.años;
                });
                contar = 0;
                pintarPeliculas(0)
            }
            else if (filtros.años == undefined ) {
                $('.posters').html('');
                resultado = movies.filter( (movie) => {
                    return movie.direction.includes(filtros.directores) && movie.genre_es.includes(filtros.generos);
                });
                contar = 0;
                pintarPeliculas(0)
            }
            else if (filtros.directores == undefined ) {
                $('.posters').html('');
                resultado = movies.filter( (movie) => {
                    return movie.genre_es.includes(filtros.generos) && movie.year == filtros.años;
                });
                contar = 0;
                pintarPeliculas(0)
            }
            else {
                $('.posters').html('');
                resultado = movies.filter( (movie) => {
                    return movie.direction.includes(filtros.directores) && movie.year == filtros.años && movie.genre_es.includes(filtros.generos);
                });
                contar = 0;
                pintarPeliculas(0)
            }
        }
        $('#reset').click( function () {
            filtros.generos = undefined;
            filtros.directores = undefined;
            filtros.años = undefined;
            filtrarPeliculas();
        });
        
        // AGREGAR PELICULAS A LA VISTA (las primeras 18)
        let contar = 0;
        let longitud = 0;
        function pintarPeliculas(contar) {
            if (contar + 18 > resultado.length) {
                longitud = resultado.length
            }
            else {
                longitud = contar + 18
            }
            for (let i = contar; i < longitud; i++) {
                const movie = resultado[i];
                $('.posters').append(`
                                        <a class="movie" href="#" style="background-image: url(../../${movie.poster})">
                                            <div class="resaltado">
                                                <p><strong>${movie.title}</strong></p>
                                                <p>${movie.year}</p>
                                                <span>#${movie.id}</span>
                                            </div>
                                        </a>
                                    `)
            }
        }
        filtrarPeliculas();

        // AGREGAR MÁS PELICULAS AL HACER CLICK (botón +)
        $('.mas').click( () => {
            contar = contar +18;
            pintarPeliculas(contar)
        })
    });

    // OFF-CANVAS (filtros)
    $('#menuFiltro').click(function(e) {
        e.preventDefault();
        $('#baseFiltro').toggleClass('showMenu');
        $('#completa').toggleClass('showMenu');
        $('#menuFiltro').toggleClass('active')
    });

    // ANIMACIONES CATEGORIAS (géneros)
    let animado = document.querySelectorAll('.animado');
    function mostrarScroll () {
        let scrollTop = document.documentElement.scrollTop;
        for (let i = 0; i < animado.length; i++) {
            let alturaAnimado = animado[i].offsetTop;
            if (alturaAnimado - 300 < scrollTop) {
                animado[i].classList.add("animar");
                animado[i].style.animationDelay = i/5+"s";
            }
        }
    }
    window.addEventListener('scroll', mostrarScroll);

    // POP-UP (contribuciones)
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
})
