const home = {
    selectbox: document.getElementById('selectbox'),
    selectboxList: document.querySelector('.selectbox__list'),
    rooms: document.getElementById('rooms'),
    settings: document.getElementById('settings'),
    settingsTabs: document.getElementById('settings-tabs'),
    settingsPanel: document.getElementById('settings-panel'),
    temperatureLine: document.getElementById('temperature-line'),
    temperatureRound: document.getElementById('temperature-round'),
    temperature: document.getElementById('temperature'),
    temperatureBtn: document.getElementById('temperature-btn'),
    temperatureSaveBtn: document.getElementById('save-temperature'),
    temperaturePowerBtn: document.getElementById('power'),
    powerLabel: document.getElementById('power-label'),
    sliders: {
        lights: document.getElementById('lights-slider'),
        humidity: document.getElementById('humidity-slider'),
    },
    switch: {
        lights: document.getElementById('lights-power'),
        humidity: document.getElementById('humidity-power'),
    }
    
}
const rooms = {
    all : 'All Rooms',
    livingroom : 'Living Room',
    bedroom : 'Bedroom',
    kitchen : 'Kitchen',
    bathroom : 'Bathroom',
    studio : 'Studio',
    washingroom : 'Washing Room'
}
let activeRoom = 'all';
let activeTab = 'temperature'
const roomsData = {
    livingroom : {
        temperature: 23,
        temperatureOff: false,
        lights: 100,
        humidity: 70,
        humidityOff: false
    },
    bedroom : {
        temperature: 23,
        temperatureOff: false,
        lights: 100,
        humidity: 70,
        humidityOff: false
    },
    kitchen : {
        temperature: 23,
        temperatureOff: false,
        lights: 100,
        humidity: 70,
        humidityOff: false
    },
    bathroom : {
        temperature: 23,
        temperatureOff: false,
        lights: 100,
        humidity: 70,
        humidityOff: false
    },
    studio : {
        temperature: 23,
        temperatureOff: false,
        lights: 100,
        humidity: 70,
        humidityOff: false
    },
    washingroom : {
        temperature: 23,
        temperatureOff: false,
        lights: 100,
        humidity: 70,
        humidityOff: false
    }
}

// выпадающий список

home.selectbox.querySelector('.selectbox__selected').onclick = (e) => {
    home.selectbox.classList.toggle('open');
}

// выпадающий список закрывался по клику на пустое окно

document.body.onclick = (e) => {
    const { target } = e
    if (
        !target.matches('.selectbox')
        && !target.parentElement.matches('.selectbox')
        && !target.parentElement.parentElement.matches('.selectbox')
    ) {
        home.selectbox.classList.remove('open')
    }
}


// привязываем каждому списку свое окно

home.selectboxList.onclick = (e) => {
    const { target } = event
    if (target.matches('.selectbox__item')) {
        const { room } = target.dataset
        const selectedItem = home.selectboxList.querySelector('.selected')
        selectedItem.classList.remove('selected')
        target.classList.add('selected')
        home.selectbox.classList.remove('open')
        selectRoom(room)
    }
}

// выбор комнаты

function selectRoom(room) {
    const selectedRoom = home.rooms.querySelector('.selected');
    if (selectedRoom) {
        selectedRoom.classList.remove('selected');
    }  
    if (room !== 'all') {
        const newSelectedRoom = home.rooms.querySelector(`[data-room=${room}]`);
        const {
            temperature,
            lights,
            humidity,
            lightsOff,
            humidityOff
        } = roomsData[room]
        activeRoom = room;
        newSelectedRoom.classList.add('selected');
        renderScreen(false)
        home.temperature.innerText = temperature
        renderTemperature(temperature);
        setTemperaturePower();
        changeSettingsType(activeTab);
        changeSlider(lights, home.sliders.lights);
        changeSlider(humidity, home.sliders.humidity);
        changeSwitch('lights', lightsOff);
        changeSwitch('humidity', humidityOff);
    } else {
        renderScreen(true)
    }
   
    const selectedSelectBoxRoom = home.selectbox.querySelector('.selectbox__item.selected');
    selectedSelectBoxRoom.classList.remove('selected')
    const newSelectedItem =  home.selectbox.querySelector(`[data-room=${room}]`)
    newSelectedItem.classList.add('selected');
    const selectboxSelected = home.selectbox.querySelector('.selectbox__selected span')
    selectboxSelected.innerText = rooms[room]
}

// клик по элементу комнаты

home.rooms.querySelectorAll('.room').forEach(room => {
    room.onclick = (event) => {
        const value = room.dataset.room
        selectRoom(value);
    }
})

// Отображение нужного экрана

function renderScreen (isRooms) {
    setTimeout(() => {
    if (isRooms) {
        home.rooms.style.display = 'grid'
        home.settings.style.display = 'none'
    } else {
        home.rooms.style.display = 'none'
        home.settings.style.display = 'block'
    }
}, 300)
}

// панель настроек комнаты


// отрисовка изменения температуры
function renderTemperature(temperature) {
    const min = 16;
    const max = 40;
    const range = max - min;
    const percent = range / 100;
    const lineMin = 54;
    const lineMax = 276;
    const lineRange = lineMax - lineMin;
    const linePercent = lineRange / 100;
    const roundMin = -240;
    const roundMax = 48;
    const roundRange = roundMax - roundMin;
    const roundPercent = roundRange / 100;
    
    
    if (temperature >= min && temperature <= max) {
        const finishPercent = Math.round((temperature - min) / percent);
        const lineFinishPercent = lineMin + linePercent * finishPercent;
        const roundFinishPercent = roundMin + roundPercent * finishPercent;
        home.temperatureLine.style.strokeDasharray = `${lineFinishPercent} 276`;
        home.temperatureRound.style.transform = `rotate(${roundFinishPercent}deg)`;
        home.temperature.innerText = temperature;
    }
}


// изменение температуры мышью

function changeTemperature() {
    let mouseOver = false;
    let mouseDown = false;
    let position = 0;
    let range = 0;
    let change = 0;

    home.temperatureBtn.onmouseover = () => {
        mouseOver = true;
        mouseDown = false;
    }
    home.temperatureBtn.onmouseout = () => mouseOver = false;
    home.temperatureBtn.onmouseup = () => mouseDown = false;
    home.temperatureBtn.onmousedown = (e) => {
        mouseDown = true;
        position = e.offsetY;
        range = 0;
    }
    // home.temperatureBtn.onmouseup = () => mouseDown = false;
    home.temperatureBtn.onmousemove = (e) => {
        if (mouseOver && mouseDown) {
            range = e.offsetY - position
            const newChange = Math.round(range / -5);
            if (newChange !== change) {
                let temperature = +home.temperature.innerText
                if (newChange < change) {
                    temperature = temperature - 1
                } else {
                    temperature = temperature + 1
                }
                change = newChange;
                // roomsData[activeRoom].temperature = temperature;
                renderTemperature(temperature)
            }
        }
    }    
}
changeTemperature()

// сохранение температуры

home.temperatureSaveBtn.onclick = () => {
    const temperature = +home.temperature.innerText;
    roomsData[activeRoom].temperature = temperature
    alert('Temperature saved');
}

// отключение обогрева

home.temperaturePowerBtn.onclick = () => {
    const power = home.temperaturePowerBtn
    power.classList.toggle('off');
    if (power.matches('.off')) {
        roomsData[activeRoom].temperatureOff = true
    } else {
        roomsData[activeRoom].temperatureOff = false
    }
}


// Установка значения температуры

function setTemperaturePower() {
    if (roomsData[activeRoom].temperatureOff) {
        home.temperaturePowerBtn.classList.add('off');
    } else {
        home.temperaturePowerBtn.classList.remove('off');
    }
}

/* Переключение настроек */

home.settingsTabs.querySelectorAll('.tab').forEach((tab) => {
    tab.onclick = () => {
        const optionType = tab.dataset.type
        activeTab = optionType
        changeSettingsType(optionType)
    }
})

// Смена панели настроек

function changeSettingsType(type) {
    const tabSelected = home.settingsTabs.querySelector('.tab.selected');
    const panelSelected = home.settingsPanel.querySelector('.selected');
    const tab = home.settingsTabs.querySelector(`[data-type=${type}]`);
    const panel = home.settingsPanel.querySelector(`[data-type=${type}]`);
    tabSelected.classList.remove('selected');
    panelSelected.classList.remove('selected');
    tab.classList.add('selected');
    panel.classList.add('selected');
}

// Функция изменения слайдера

function changeSlider(percent, slider) {
    if (percent >= 0 && percent <= 100) {
        const {type} = slider.parentElement.parentElement.dataset
        slider.querySelector('span').innerText = percent;
        slider.style.height = `${percent}%`;
        roomsData[activeRoom][type] = percent;
    }
}

// Отслеживание изменений слайдера

function watchSlider(slider) {
    let mouseOver = false;
    let mouseDown = false;
    let position = 0;
    let range = 0;
    let change = 0;
    const parent = slider.parentElement;

    parent.onmouseover = () => {
        mouseOver = true;
        mouseDown = false;
    }
    parent.onmouseout = () => mouseOver = false;
    parent.onmouseup = () => mouseDown = false;
    parent.onmousedown = (e) => {
        mouseDown = true;
        position = e.offsetY;
        range = 0;
    }
    parent.onmousemove = (e) => {
        if (mouseOver && mouseDown) {
            range = e.offsetY - position
            const newChange = Math.round(range / -0.1);
            if (newChange !== change) {
                let percent = +slider.querySelector('span').innerText
                if (newChange < change) {
                    percent = percent - 1
                } else {
                    percent = percent + 1
                }
                change = newChange;
                changeSlider(percent, slider)
            }
        }
    }    
}

watchSlider(home.sliders.lights);
watchSlider(home.sliders.humidity);

// Включение/Выключение света, влажности

function changeSwitch(activeTab, isOff) {
    if (isOff) {
        home.switch[activeTab].classList.add('off');
    } else {
        home.switch[activeTab].classList.remove('off');
    }
    roomsData[activeRoom][`${activeTab}Off`] = isOff;
}


// Переключение по switchu

home.switch.humidity.onclick = () => {
    const isOff = !home.switch.humidity.matches('.off');
    changeSwitch(activeTab, isOff)
}

home.switch.lights.onclick = () => {
    const isOff = !home.switch.lights.matches('.off');
    changeSwitch(activeTab, isOff)
}