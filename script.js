document.addEventListener('DOMContentLoaded', () => {
    // --- STATE MANAGEMENT ---
    const state = {
        noCount: 0,
        forgiveness: 10,
        yesScale: 1,
        noScale: 1
    };

    // --- DOM ELEMENTS ---
    const pages = {
        apology: document.getElementById('page-apology'),
        celebration: document.getElementById('page-celebration')
    };

    const buttons = {
        yes: document.getElementById('btn-yes'),
        no: document.getElementById('btn-no')
    };

    const elements = {
        noText: document.getElementById('no-text'),
        floatingContainer: document.getElementById('floating-messages')
    };

    // --- FLOATING MESSAGES DATA ---
const apologyMessages = [
         "หายโกรธเถอะนะ 🥺",
         "รักนะจุ๊บๆ 💗",
         "หายโกรดดด 😡",
         "ง้อแล้วน้าาา 🤗",
         "ขอโทษจริงๆ 😭",
         "ยิ้มให้เค้าหน่อย 😊",
         "คิดถึงเธอจัง 💭",
         "อย่าเมินเค้าน่า 🙅‍♀️",
         "กอดนึงได้ไหม 🫂",
         "สัญญาว่าจะไม่ทำอีก ✨"
     ];

    // --- UTILITIES ---
    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    const createParticle = (x, y, type = 'heart') => {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        const icons = ['ri-heart-fill', 'ri-sparkling-2-fill', 'ri-star-fill'];
        const iconClass = type === 'heart' ? icons[0] : icons[getRandomInt(1, 2)];
        
        particle.innerHTML = `<i class="${iconClass}" style="color: ${type === 'heart' ? '#FF6B81' : '#FFD700'}; font-size: ${getRandomInt(10, 20)}px;"></i>`;
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        document.getElementById('particle-container').appendChild(particle);
        setTimeout(() => particle.remove(), 1000);
    };

    const spawnParticles = (count, x, y) => {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                createParticle(x + getRandomInt(-50, 50), y + getRandomInt(-50, 50));
            }, i * 50);
        }
    };

    // --- FLOATING MESSAGE SYSTEM ---
const createFloatingMessage = () => {
    if (!pages.apology.classList.contains('active')) return;
    const msg = document.createElement('div');
    msg.classList.add('floating-msg');
    const randomText = apologyMessages[getRandomInt(0, apologyMessages.length - 1)];
    msg.textContent = randomText;

    
    const xPos = getRandomInt(5, 85);
    const yPos = getRandomInt(5, 85);

    
    const isCenter = (xPos > 30 && xPos < 70) && (yPos > 30 && yPos < 70);
    const finalX = isCenter ? (xPos > 50 ? 10 : 80) : xPos;
    const finalY = isCenter ? (yPos > 50 ? 10 : 80) : yPos;

    msg.style.left = `${finalX}%`;
    msg.style.top = `${finalY}%`;

   
    const duration = getRandomInt(6, 10);
    const delay = getRandomInt(0, 3);
    msg.style.animationDuration = `${duration}s`;
    msg.style.animationDelay = `${delay}s`;

    elements.floatingContainer.appendChild(msg);

   
    setTimeout(() => {
        if (msg.parentNode) msg.remove();
    }, (duration + delay) * 1000);
};

    // Start Floating Messages Loop
    let msgInterval = setInterval(createFloatingMessage, 800);
    createFloatingMessage(); // Create first one immediately

    const updateForgiveness = (value) => {
        state.forgiveness = Math.max(0, Math.min(100, value));
    };

    const changePage = (fromPage, toPage) => {
        fromPage.classList.remove('active');
        setTimeout(() => {
            fromPage.style.display = 'none';
            toPage.style.display = 'flex';
            void toPage.offsetWidth;
            toPage.classList.add('active');
        }, 500);
    };

    // --- EVENT HANDLERS ---

// 1. NO Button Interaction
     buttons.no.addEventListener('click', (e) => {
         state.noCount++;
         updateForgiveness(state.forgiveness - 5);
         
         state.yesScale += 0.2;
         state.noScale -= 0.15;
         
         buttons.yes.style.transform = `scale(${state.yesScale})`;
         
         
         if (state.noScale <= 0.2) {
             buttons.no.style.opacity = '0';
             buttons.no.style.pointerEvents = 'none';
             elements.noText.textContent = "ยอมเถอะน่า...";
         } else {
            
             const margin = 0.1; // ขอบเขต 10% จากขอบจอ
             const randomX = margin + Math.random() * (1 - 2 * margin); // 0.1 ถึง 0.9
             const randomY = margin + Math.random() * (1 - 2 * margin);
             
           
             buttons.no.style.position = 'fixed';
             buttons.no.style.left = `${randomX * 100}%`;
             buttons.no.style.top = `${randomY * 100}%`;
             
            
             buttons.no.style.transform = `translate(-50%, -50%) scale(${state.noScale})`;
             
             if (state.noCount === 1) elements.noText.textContent = "ยังงอนอยู่";
             if (state.noCount === 2) elements.noText.textContent = "จริงๆ นะ";
         }
         
         spawnParticles(5, e.clientX, e.clientY);
         
         document.body.style.background = `linear-gradient(135deg, #FFF0F5 0%, #FFB6C1 50%, #E6E6FA 100%)`;
         setTimeout(() => {
             document.body.style.background = `linear-gradient(135deg, #FFFDF9 0%, #FFE4E1 50%, #E6E6FA 100%)`;
         }, 300);
     });

// 2. YES Button Interaction
     buttons.yes.addEventListener('click', (e) => {
         updateForgiveness(100);
         spawnParticles(30, e.clientX, e.clientY);
         
         // Stop floating messages when forgiven
         clearInterval(msgInterval);
         elements.floatingContainer.innerHTML = ''; 
         
         
         buttons.no.style.position = '';
         buttons.no.style.left = '';
         buttons.no.style.top = '';
         buttons.no.style.transform = `scale(1)`;
         
         pages.apology.classList.add('fade-out');
         setTimeout(() => {
             changePage(pages.apology, pages.celebration);
         }, 500);
     });


});
