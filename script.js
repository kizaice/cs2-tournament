// ============================================================
// НАСТРОЙКИ — ЗАМЕНИ НА СВОИ
// ============================================================
const BOT_TOKEN = '8978459873:AAFVDHBVIAmv29wHI_2sbaHZCobuXIFK7VE';
const CHAT_ID = '6174458255';

// ============================================================
// ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
// ============================================================
let currentTab = 'solo';

// ============================================================
// ТЕКСТ РЕГЛАМЕНТА (BO1/BO3 только здесь)
// ============================================================
const REGLAMENT_HTML = `
<h3>1. ОБЩИЕ ПОЛОЖЕНИЯ</h3>
<p>1.1. Настоящий Регламент определяет порядок организации, проведения и судейства турнира по Counter-Strike 2.</p>
<p>1.2. Турнир проводится в формате 5×5.</p>
<p>1.3. Участие подразумевает безоговорочное согласие со всеми пунктами Регламента.</p>
<p>1.4. Ознакомление с Регламентом обязательно для подачи заявки.</p>
<p>1.5. Решения Главного судьи окончательны.</p>

<h3>2. ТРЕБОВАНИЯ К УЧАСТНИКАМ</h3>
<p>2.1. Возраст: от 14 до 18 лет включительно.</p>
<p>2.2. Минимум 100 часов в CS2.</p>
<p>2.3. Steam-аккаунт должен быть публичным.</p>
<p>2.4. Эло Faceit: от 1000 до 2000 (при наличии).</p>
<p>2.5. VAC/Game Ban — не допускается.</p>

<h3>3. РЕГИСТРАЦИЯ</h3>
<p>3.1. Заявки через сайт до 15 июля включительно.</p>
<p>3.2. Ложные данные — дисквалификация.</p>
<p>3.3. Одна заявка на человека.</p>

<h3>4. ПРОВЕРКА ПРОФИЛЕЙ (16 ИЮЛЯ)</h3>
<p>4.1. Верификация всех заявок 16 июля.</p>
<p>4.2. Отказ — уведомление в Discord.</p>

<h3>5. ЖЕРЕБЬЁВКА (17 ИЮЛЯ)</h3>
<p>5.1. 8 команд, случайное распределение.</p>

<h3>6. ФОРМАТ МАТЧЕЙ</h3>
<p>6.1. Все матчи турнира до финала проводятся в формате BO1 (Best of 1 — до одной победы).</p>
<p>6.2. Финал турнира проводится в формате BO3 (Best of 3 — до двух побед).</p>
<p>6.3. Карты: Active Duty Map Pool.</p>
<p>6.4. Вето карт перед каждым матчем.</p>
<p>6.5. Опоздание >15 минут — техническое поражение.</p>
<p>6.6. Паузы: не более 10 минут на команду за матч.</p>

<h3>7. ПРАВИЛА ПОВЕДЕНИЯ</h3>
<p>7.1. Запрещена токсичность.</p>
<p>7.2. Запрещены читы.</p>
<p>7.3. Запрещены договорные матчи.</p>

<h3>8. СУДЕЙСТВО</h3>
<p>8.1. Протест в течение 10 минут после матча.</p>
<p>8.2. Решения судей окончательны.</p>

<h3>9. РАСПИСАНИЕ</h3>
<p>9.1. Заявки: до 15 июля.</p>
<p>9.2. Проверка: 16 июля.</p>
<p>9.3. Жеребьёвка: 17 июля.</p>
<p>9.4. 1/4 финала: 19 июля.</p>
<p>9.5. 1/2 финала: 20 июля.</p>
<p>9.6. Финал: 21 июля.</p>

<h3>10. ВРЕМЯ МАТЧЕЙ</h3>
<p>10.1. Согласование 18 июля.</p>
<p>10.2. Слоты: утро (10:00–13:00) или вечер (17:00–21:00).</p>
<h3>11. ОСТАЛЬНЫЕ ПРАВИЛА ТУРНИРА БУДУТ В НАШЕМ DISCORD-СЕРВЕРЕ</h3>
`;

// ============================================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('rules-text').innerHTML = REGLAMENT_HTML;
    renderPlayers();
    document.getElementById('reg-form').addEventListener('submit', handleSubmit);
});

// ============================================================
// ПЛАВНЫЙ СКРОЛЛ
// ============================================================
function scrollToSection(id) {
    const section = document.getElementById(id);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ============================================================
// ПЕРЕКЛЮЧЕНИЕ ТАБОВ
// ============================================================
function switchTab(tab) {
    currentTab = tab;
    
    document.querySelectorAll('.tab-btn').forEach(function(btn) {
        btn.classList.remove('active');
    });
    
    const activeBtn = document.querySelector('.tab-btn[data-tab="' + tab + '"]');
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    updateCheckboxTexts();
    renderPlayers();
    updateSubmitButton();
}

// ============================================================
// ОБНОВЛЕНИЕ ТЕКСТА ЧЕКБОКСОВ
// ============================================================
function updateCheckboxTexts() {
    const rulesText = document.getElementById('rules-check-text');
    const discordText = document.getElementById('discord-check-text');
    
    if (currentTab === 'solo') {
        rulesText.textContent = 'Я ознакомлен и согласен с регламентом турнира';
        discordText.textContent = 'Я подтверждаю, что зашёл на Discord-сервер турнира';
    } else {
        rulesText.textContent = 'Вся моя команда ознакомлена и согласна с регламентом турнира';
        discordText.textContent = 'Вся моя команда присоединилась к Discord-серверу турнира';
    }
}

// ============================================================
// ОТРИСОВКА ПОЛЕЙ
// ============================================================
function renderPlayers() {
    const container = document.getElementById('players-container');
    const counts = { solo: 1, duo: 2, trio: 3, quadro: 4, team: 5 };
    const count = counts[currentTab];
    
    let html = '';
    
    for (let i = 1; i <= count; i++) {
        html += `
        <div class="player-block">
            <h3>УЧАСТНИК ${i}</h3>
            
            <div class="form-group">
                <label>Telegram <span style="color:#ff4444;">*</span></label>
                <input type="text" id="telegram-${i}" placeholder="@username" oninput="validateTelegram(${i}); checkDuplicates();" onblur="validateTelegram(${i}); checkDuplicates();">
                <span class="error-message" id="telegram-error-${i}"></span>
            </div>
            
            <div class="form-group">
                <label>Discord <span style="color:#ff4444;">*</span></label>
                <input type="text" id="discord-${i}" placeholder="username" oninput="validateDiscord(${i}); checkDuplicates();" onblur="validateDiscord(${i}); checkDuplicates();">
                <span class="error-message" id="discord-error-${i}"></span>
            </div>
            
            <div class="form-group">
                <label>Ссылка на Steam <span style="color:#ff4444;">*</span></label>
                <input type="url" id="steam-${i}" placeholder="https://steamcommunity.com/..." oninput="validateSteam(${i}); checkDuplicates();" onblur="validateSteam(${i}); checkDuplicates();">
                <span class="error-message" id="steam-error-${i}"></span>
            </div>
            
            <div class="form-group">
                <label>Ссылка на Faceit</label>
                <input type="url" id="faceit-${i}" placeholder="https://www.faceit.com/..." oninput="validateFaceit(${i}); checkDuplicates();" onblur="validateFaceit(${i}); checkDuplicates();">
                <span class="error-message" id="faceit-error-${i}"></span>
            </div>
            
            <div class="form-group">
                <label>Возраст (14–18) <span style="color:#ff4444;">*</span></label>
                <input type="number" id="age-${i}" min="14" max="18" placeholder="16" oninput="validateAge(${i})" onblur="validateAge(${i})">
                <span class="error-message" id="age-error-${i}"></span>
            </div>
            
            <div class="form-group">
                <label>Эло Faceit (1000–2000)</label>
                <input type="number" id="elo-${i}" min="1000" max="2000" placeholder="1500" oninput="validateElo(${i})" onblur="validateElo(${i})">
                <span class="error-message" id="elo-error-${i}"></span>
            </div>
        </div>
        `;
    }
    
    container.innerHTML = html;
}

// ============================================================
// ПОЛУЧЕНИЕ КОЛИЧЕСТВА УЧАСТНИКОВ
// ============================================================
function getPlayerCount() {
    const counts = { solo: 1, duo: 2, trio: 3, quadro: 4, team: 5 };
    return counts[currentTab];
}

// ============================================================
// ВАЛИДАЦИЯ TELEGRAM
// ============================================================
function validateTelegram(index) {
    const input = document.getElementById('telegram-' + index);
    const error = document.getElementById('telegram-error-' + index);
    let value = input.value.trim();
    
    if (value.length === 0) {
        setFieldStatus(input, error, 'error', 'Обязательное поле');
        return false;
    }
    
    let checkValue = value;
    if (checkValue.startsWith('@')) {
        checkValue = checkValue.slice(1);
    }
    
    if (checkValue.length < 5) {
        setFieldStatus(input, error, 'error', 'Неверный формат. Минимум 5 символов. Вы не сможете принять участие с таким никнеймом.');
        return false;
    }
    
    if (checkValue.length > 32) {
        setFieldStatus(input, error, 'error', 'Неверный формат. Максимум 32 символа.');
        return false;
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(checkValue)) {
        setFieldStatus(input, error, 'error', 'Неверный формат. Только буквы, цифры и _. Вы не сможете принять участие с таким никнеймом.');
        return false;
    }
    
    setFieldStatus(input, error, 'success', '');
    return true;
}

// ============================================================
// ВАЛИДАЦИЯ DISCORD
// ============================================================
function validateDiscord(index) {
    const input = document.getElementById('discord-' + index);
    const error = document.getElementById('discord-error-' + index);
    const value = input.value.trim();
    
    if (value.length === 0) {
        setFieldStatus(input, error, 'error', 'Обязательное поле');
        return false;
    }
    
    if (value.length < 2) {
        setFieldStatus(input, error, 'error', 'Неверный формат. Минимум 2 символа. Вы не сможете принять участие с таким никнеймом.');
        return false;
    }
    
    if (value.length > 32) {
        setFieldStatus(input, error, 'error', 'Неверный формат. Максимум 32 символа.');
        return false;
    }
    
    if (!/^[a-zA-Z0-9._]+$/.test(value)) {
        setFieldStatus(input, error, 'error', 'Неверный формат. Только латиница, цифры, точка и _. Вы не сможете принять участие с таким никнеймом.');
        return false;
    }
    
    if (value.includes('..')) {
        setFieldStatus(input, error, 'error', 'Неверный формат. Две точки подряд нельзя.');
        return false;
    }
    
    setFieldStatus(input, error, 'success', '');
    return true;
}

// ============================================================
// ВАЛИДАЦИЯ STEAM
// ============================================================
function validateSteam(index) {
    const input = document.getElementById('steam-' + index);
    const error = document.getElementById('steam-error-' + index);
    const value = input.value.trim();
    
    if (value.length === 0) {
        setFieldStatus(input, error, 'error', 'Обязательное поле');
        return false;
    }
    
    if (!value.startsWith('https://steamcommunity.com/')) {
        setFieldStatus(input, error, 'error', 'Неверная ссылка на Steam профиль.');
        return false;
    }
    
    setFieldStatus(input, error, 'success', '');
    return true;
}

// ============================================================
// ВАЛИДАЦИЯ FACEIT
// ============================================================
function validateFaceit(index) {
    const input = document.getElementById('faceit-' + index);
    const error = document.getElementById('faceit-error-' + index);
    const value = input.value.trim();
    
    if (value.length === 0) {
        setFieldStatus(input, error, '', '');
        return true;
    }
    
    if (!value.startsWith('https://www.faceit.com/')) {
        setFieldStatus(input, error, 'error', 'Неверная ссылка на Faceit профиль.');
        return false;
    }
    
    setFieldStatus(input, error, 'success', '');
    return true;
}

// ============================================================
// ВАЛИДАЦИЯ ВОЗРАСТА
// ============================================================
function validateAge(index) {
    const input = document.getElementById('age-' + index);
    const error = document.getElementById('age-error-' + index);
    const value = input.value.trim();
    
    if (value.length === 0) {
        setFieldStatus(input, error, 'error', 'Обязательное поле');
        return false;
    }
    
    const age = parseInt(value);
    
    if (isNaN(age)) {
        setFieldStatus(input, error, 'error', 'Введите число');
        return false;
    }
    
    if (age < 14 || age > 18) {
        setFieldStatus(input, error, 'error', 'Возраст должен быть от 14 до 18 лет.');
        return false;
    }
    
    setFieldStatus(input, error, 'success', '');
    return true;
}

// ============================================================
// ВАЛИДАЦИЯ ЭЛО
// ============================================================
function validateElo(index) {
    const input = document.getElementById('elo-' + index);
    const error = document.getElementById('elo-error-' + index);
    const faceitInput = document.getElementById('faceit-' + index);
    const value = input.value.trim();
    const faceitValue = faceitInput ? faceitInput.value.trim() : '';
    
    if (faceitValue.length > 0 && value.length === 0) {
        setFieldStatus(input, error, 'error', 'Укажите Эло (заполнен Faceit)');
        return false;
    }
    
    if (value.length === 0) {
        setFieldStatus(input, error, '', '');
        return true;
    }
    
    const elo = parseInt(value);
    
    if (isNaN(elo)) {
        setFieldStatus(input, error, 'error', 'Введите число');
        return false;
    }
    
    if (elo < 1000 || elo > 2000) {
        setFieldStatus(input, error, 'error', 'Эло должно быть от 1000 до 2000.');
        return false;
    }
    
    setFieldStatus(input, error, 'success', '');
    return true;
}

// ============================================================
// ПРОВЕРКА НА ДУБЛИКАТЫ
// ============================================================
function checkDuplicates() {
    const count = getPlayerCount();
    if (count <= 1) return;
    
    const telegrams = [];
    for (let i = 1; i <= count; i++) {
        const input = document.getElementById('telegram-' + i);
        const error = document.getElementById('telegram-error-' + i);
        if (!input || !error) continue;
        const value = input.value.trim().toLowerCase();
        
        if (value.length > 0) {
            if (telegrams.includes(value)) {
                setFieldStatus(input, error, 'error', 'Этот никнейм уже указан у другого участника.');
            } else {
                telegrams.push(value);
            }
        }
    }
    
    const discords = [];
    for (let i = 1; i <= count; i++) {
        const input = document.getElementById('discord-' + i);
        const error = document.getElementById('discord-error-' + i);
        if (!input || !error) continue;
        const value = input.value.trim().toLowerCase();
        
        if (value.length > 0) {
            if (discords.includes(value)) {
                setFieldStatus(input, error, 'error', 'Этот никнейм уже указан у другого участника.');
            } else {
                discords.push(value);
            }
        }
    }
    
    const steams = [];
    for (let i = 1; i <= count; i++) {
        const input = document.getElementById('steam-' + i);
        const error = document.getElementById('steam-error-' + i);
        if (!input || !error) continue;
        const value = input.value.trim();
        
        if (value.length > 0) {
            if (steams.includes(value)) {
                setFieldStatus(input, error, 'error', 'Эта ссылка уже указана у другого участника.');
            } else {
                steams.push(value);
            }
        }
    }
}

// ============================================================
// УСТАНОВКА СТАТУСА ПОЛЯ
// ============================================================
function setFieldStatus(input, errorElement, status, message) {
    input.classList.remove('error', 'success');
    
    if (status === 'error') {
        input.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('visible');
    } else if (status === 'success') {
        input.classList.add('success');
        errorElement.textContent = '';
        errorElement.classList.remove('visible');
    } else {
        errorElement.textContent = '';
        errorElement.classList.remove('visible');
    }
}

// ============================================================
// МОДАЛЬНОЕ ОКНО
// ============================================================
function openRulesModal() {
    document.getElementById('rules-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeRulesModal() {
    document.getElementById('rules-modal').classList.remove('active');
    document.body.style.overflow = '';
}

function syncRulesCheck() {
    const modalCheck = document.getElementById('modal-rules-check');
    const formCheck = document.getElementById('rules-check');
    formCheck.checked = modalCheck.checked;
    updateSubmitButton();
}

document.addEventListener('click', function(event) {
    const modal = document.getElementById('rules-modal');
    if (event.target === modal) closeRulesModal();
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modal = document.getElementById('rules-modal');
        if (modal.classList.contains('active')) closeRulesModal();
    }
});

// ============================================================
// ОБНОВЛЕНИЕ КНОПКИ ОТПРАВКИ
// ============================================================
function updateSubmitButton() {
    const rulesCheck = document.getElementById('rules-check');
    const discordCheck = document.getElementById('discord-check');
    const submitBtn = document.getElementById('submit-btn');
    const submitHint = document.getElementById('submit-hint');
    
    if (rulesCheck.checked && discordCheck.checked) {
        submitBtn.classList.remove('disabled');
        submitBtn.disabled = false;
        submitBtn.textContent = 'ПОДАТЬ ЗАЯВКУ';
        submitHint.textContent = 'Всё готово! Можно подавать заявку.';
        submitHint.classList.remove('hint-blocked');
        submitHint.classList.add('hint-ready');
    } else {
        submitBtn.classList.add('disabled');
        submitBtn.disabled = true;
        submitBtn.textContent = 'ЗАПОЛНИТЕ ВСЕ ПОЛЯ И ПОДТВЕРДИТЕ УСЛОВИЯ';
        submitHint.textContent = 'Заполните все обязательные поля и подтвердите условия';
        submitHint.classList.remove('hint-ready');
        submitHint.classList.add('hint-blocked');
    }
}

// ============================================================
// СБОР ДАННЫХ
// ============================================================
function getPlayerData(index) {
    return {
        telegram: document.getElementById('telegram-' + index).value.trim() || 'Не указано',
        discord: document.getElementById('discord-' + index).value.trim() || 'Не указано',
        steam: document.getElementById('steam-' + index).value.trim() || 'Не указано',
        faceit: document.getElementById('faceit-' + index).value.trim() || 'Не указано',
        age: document.getElementById('age-' + index).value.trim() || 'Не указано',
        elo: document.getElementById('elo-' + index).value.trim() || 'Не указано'
    };
}

// ============================================================
// ОТПРАВКА В TELEGRAM
// ============================================================
async function sendToTelegram(message) {
    if (BOT_TOKEN === 'ВСТАВИТЬ_ТОКЕН_БОТА') {
        console.log('Тестовый режим. Данные заявки:');
        console.log(message);
        return true;
    }
    
    try {
        const url = 'https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage';
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: 'HTML' })
        });
        const data = await response.json();
        return data.ok;
    } catch (error) {
        console.error('Ошибка отправки:', error);
        return false;
    }
}

// ============================================================
// ОБРАБОТКА ОТПРАВКИ ФОРМЫ
// ============================================================
async function handleSubmit(event) {
    event.preventDefault();
    
    const count = getPlayerCount();
    
    const rulesCheck = document.getElementById('rules-check');
    const discordCheck = document.getElementById('discord-check');
    
    if (!rulesCheck.checked || !discordCheck.checked) {
        alert('Необходимо подтвердить ознакомление с регламентом и вход на Discord-сервер!');
        return;
    }
    
    let hasErrors = false;
    let firstError = null;
    
    for (let i = 1; i <= count; i++) {
        if (!validateTelegram(i)) { hasErrors = true; if (!firstError) firstError = document.getElementById('telegram-' + i); }
        if (!validateDiscord(i)) { hasErrors = true; if (!firstError) firstError = document.getElementById('discord-' + i); }
        if (!validateSteam(i)) { hasErrors = true; if (!firstError) firstError = document.getElementById('steam-' + i); }
        if (!validateFaceit(i)) { hasErrors = true; if (!firstError) firstError = document.getElementById('faceit-' + i); }
        if (!validateAge(i)) { hasErrors = true; if (!firstError) firstError = document.getElementById('age-' + i); }
        if (!validateElo(i)) { hasErrors = true; if (!firstError) firstError = document.getElementById('elo-' + i); }
    }
    
    checkDuplicates();
    
    if (hasErrors) {
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
        return;
    }
    
    const now = new Date();
    const dateStr = now.toLocaleDateString('ru-RU') + ' ' + now.toLocaleTimeString('ru-RU');
    const tabNames = { solo: 'Соло', duo: 'Дуо', trio: 'Трио', quadro: 'Кватро', team: 'Команда (5)' };
    
    let message = '🎮 <b>НОВАЯ ЗАЯВКА!</b>\n\n';
    message += '📅 <b>Дата:</b> ' + dateStr + '\n';
    message += '👥 <b>Тип:</b> ' + tabNames[currentTab] + '\n\n';
    message += '══════════════════\n\n';
    
    for (let i = 1; i <= count; i++) {
        const player = getPlayerData(i);
        message += '<b>УЧАСТНИК ' + i + '</b>\n';
        message += '• Telegram: ' + player.telegram + '\n';
        message += '• Discord: ' + player.discord + '\n';
        message += '• Steam: ' + player.steam + '\n';
        message += '• Faceit: ' + player.faceit + '\n';
        message += '• Возраст: ' + player.age + '\n';
        message += '• Эло: ' + player.elo + '\n\n';
    }
    
    const success = await sendToTelegram(message);
    
    if (success) {
        document.getElementById('reg-form').style.display = 'none';
        document.getElementById('success-message').style.display = 'block';
        document.getElementById('success-message').scrollIntoView({ behavior: 'smooth' });
    } else {
        alert('Ошибка при отправке заявки. Попробуйте ещё раз или свяжитесь с нами через Discord/Telegram.');
    }
}