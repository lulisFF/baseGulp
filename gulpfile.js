const {src, dest, watch, parallel} = require('gulp');
// src источник dest вывод watch проверка пересохранений файлов parallel паралельный запуск функции для browserSync и вотчера
const scss = require('gulp-sass')(require('sass'));// подключаем плагинны необходимые для препроцессоров(конветртация scss/sass в css)
const concat = require('gulp-concat');// плагин для одъединение файлов, а также переименование css фаила в формат min.css
const uglify = require('gulp-uglify-es').default; // плагин для объединение и сжатия js фаилов
const browserSync = require('browser-sync').create(); //плагин для обновление в браузере
const autoprefixer = require('gulp-autoprefixer'); //плагин для поддержи старых браузеров, автомотическое добавление префиксов в css
function scripts(){ // Главная функция по скриптам, заведует скриптами
    return src('app/js/main.js')//Хватаем наш js фаил
        .pipe(concat('main.min.js'))//Делаем rename js file
        .pipe(uglify())//объединяем
        .pipe(dest('app/js'))//посылаем готовый uglify в папочку js
        .pipe(browserSync.stream())// совершает обновление на странице в браузере
}
function styles(){ //функция(таск для галпа) выполняет конвертацию scss объединение, переименнование scss
    return src('app/scss/style.scss')//обращаемся к фаилу scss
        .pipe(autoprefixer({ overrideBrowserslist: ['last 10 version'] }))//поддержка старых браузеров, css, последние 10 версий
        .pipe(concat('style.min.css'))// делаем rename будущего css
        .pipe(scss({ outputStyle: 'compressed' }))//выполняем конвертацию в css и делаем сжатие(min) выходного фаила
        .pipe(dest('app/css'))//определяем папку в которую запишет новый фаил галп
        .pipe(browserSync.stream())// совершает обновление на странице в браузере
}

function watching(){//проверяем обновление файла. Главный наблюдатель
    watch(['app/scss/style.scss'], styles)//наблюдаем за фаилом, при пересохранение файла запускаем скрипт (таск)
    watch(['app/js/main.js'], scripts)//наблюдаем за файлом, при пересохранение запускаем скрипт (таск)
    watch(['app/*.html']).on('change', browserSync.reload)//наблюдаем за html, при пересохранение обновляет браузер
}

function browsersync(){//обновление браузера после отработки скрипта в вотчере
    browserSync.init({
        server: {
            baseDir: "app/"
        }
    });
}

exports.styles = styles;// делаем экспорт таска, для локального доступа
exports.scripts = scripts;// делаем экспорт таска, для локального доступа
exports.browsersync = browsersync;// делаем экспорт таска, для локального доступа
exports.watching = watching;// делаем экспорт таска, для локального доступа

// поскольку одновременно незя запустить вотчин и браузер синк, все запускаем парралельно
exports.default = parallel(styles,scripts,browsersync,watching)