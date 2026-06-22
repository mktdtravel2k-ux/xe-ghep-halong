/* ==========================================
   INTERACTIVE LOGIC - HALONG CONNECT
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. STICKY HEADER
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. MOBILE MENU TOGGLE
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavMenu = document.querySelector('.mobile-nav-menu');
    const mobileNavClose = document.querySelector('.mobile-nav-close');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    const openMenu = () => mobileNavMenu.classList.add('open');
    const closeMenu = () => mobileNavMenu.classList.remove('open');

    if (mobileNavToggle) mobileNavToggle.addEventListener('click', openMenu);
    if (mobileNavClose) mobileNavClose.addEventListener('click', closeMenu);
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // 3. ROUTE SWAP LOGIC
    const pickupSelect = document.getElementById('pickup');
    const dropoffSelect = document.getElementById('dropoff');
    const swapRouteBtn = document.getElementById('swap-route');

    if (swapRouteBtn && pickupSelect && dropoffSelect) {
        swapRouteBtn.addEventListener('click', () => {
            const tempVal = pickupSelect.value;
            pickupSelect.value = dropoffSelect.value;
            dropoffSelect.value = tempVal;
            
            // Highlight effect on swap
            pickupSelect.style.borderColor = 'var(--secondary)';
            dropoffSelect.style.borderColor = 'var(--secondary)';
            setTimeout(() => {
                pickupSelect.style.borderColor = '';
                dropoffSelect.style.borderColor = '';
            }, 300);
        });
    }

    // 4. PRICE ESTIMATION & SERVICE CONTROLS
    const serviceType = document.getElementById('service-type');
    const seatsCount = document.getElementById('seats-count');
    const seatsLabel = document.getElementById('seats-label');
    const estimatedPriceEl = document.getElementById('estimated-price');

    const PRICING = {
        ghep: 450000,
        'bao-5': 1100000,
        'bao-7': 1200000
    };

    function formatCurrency(amount) {
        return amount.toLocaleString('vi-VN') + 'đ';
    }

    function updatePrice() {
        if (!serviceType || !seatsCount || !estimatedPriceEl) return;
        
        const type = serviceType.value;
        let price = 0;

        if (type === 'ghep') {
            // Enable seat count select
            seatsCount.disabled = false;
            seatsCount.style.opacity = '1';
            seatsLabel.style.opacity = '1';
            
            const numSeats = parseInt(seatsCount.value) || 1;
            price = PRICING.ghep * numSeats;
        } else {
            // Disable seat count select (flat rate for private vehicle)
            seatsCount.disabled = true;
            seatsCount.style.opacity = '0.5';
            seatsLabel.style.opacity = '0.5';
            
            price = PRICING[type] || 0;
        }

        estimatedPriceEl.textContent = formatCurrency(price);
    }

    if (serviceType) serviceType.addEventListener('change', updatePrice);
    if (seatsCount) seatsCount.addEventListener('change', updatePrice);

    // Set default date to today or tomorrow
    const travelDateInput = document.getElementById('travel-date');
    if (travelDateInput) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        // Format YYYY-MM-DD
        const yyyy = tomorrow.getFullYear();
        const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const dd = String(tomorrow.getDate()).padStart(2, '0');
        
        travelDateInput.value = `${yyyy}-${mm}-${dd}`;
        travelDateInput.min = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    }

    // Set default time to current hour + 2
    const travelTimeInput = document.getElementById('travel-time');
    if (travelTimeInput) {
        const today = new Date();
        today.setHours(today.getHours() + 2);
        const hours = String(today.getHours()).padStart(2, '0');
        const minutes = '00';
        travelTimeInput.value = `${hours}:${minutes}`;
    }

    // Initialize default price estimation
    updatePrice();

    // 5. PRICING CARDS - CHOOSE GOTO BOOKING FORM
    const pricingSelectBtns = document.querySelectorAll('.btn-pricing-select');
    pricingSelectBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const type = btn.getAttribute('data-type');
            if (serviceType && type) {
                serviceType.value = type;
                updatePrice();
            }
        });
    });

    // 6. BOOKING SUBMISSION & MODAL
    const bookingForm = document.getElementById('booking-form');
    const confirmModal = document.getElementById('confirm-modal');
    const modalClose = document.getElementById('modal-close');
    const btnModalDone = document.getElementById('btn-modal-done');

    // Modal details element references
    const detailRoute = document.getElementById('modal-detail-route');
    const detailType = document.getElementById('modal-detail-type');
    const detailTime = document.getElementById('modal-detail-time');
    const detailName = document.getElementById('modal-detail-name');
    const detailPrice = document.getElementById('modal-detail-price');

    if (bookingForm && confirmModal) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Extract values
            const pickup = pickupSelect.value;
            const dropoff = dropoffSelect.value;
            const typeVal = serviceType.value;
            const dateVal = travelDateInput ? travelDateInput.value : '';
            const timeVal = travelTimeInput ? travelTimeInput.value : '';
            const nameVal = document.getElementById('passenger-name').value;
            const phoneVal = document.getElementById('passenger-phone').value;

            // Format Type Text
            let typeText = 'Xe Ghép';
            if (typeVal === 'bao-5') typeText = 'Bao Xe 5 Chỗ (Xe Riêng)';
            if (typeVal === 'bao-7') typeText = 'Bao Xe 7 Chỗ (Xe Riêng)';
            if (typeVal === 'ghep') {
                typeText = `Xe Ghép (${seatsCount.value} Ghế)`;
            }

            // Format date: DD/MM/YYYY
            let formattedDate = dateVal;
            if (dateVal) {
                const parts = dateVal.split('-');
                if (parts.length === 3) {
                    formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
                }
            }

            // Set modal values
            if (detailRoute) detailRoute.textContent = `${pickup} ➔ ${dropoff}`;
            if (detailType) detailType.textContent = typeText;
            if (detailTime) detailTime.textContent = `${formattedDate} lúc ${timeVal}`;
            if (detailName) detailName.textContent = `${nameVal} (${phoneVal})`;
            
            // Final price
            let price = 0;
            if (typeVal === 'ghep') {
                price = PRICING.ghep * (parseInt(seatsCount.value) || 1);
            } else {
                price = PRICING[typeVal] || 0;
            }
            if (detailPrice) detailPrice.textContent = formatCurrency(price);

            // Send data to Google Sheet if configured
            const GOOGLE_SHEET_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyRr01m0RpgLXwIavEqUe0z9z8BmZ0DlZDvWMJzabIjzX9Du0xnF6jOegHC3_40NGOj6w/exec"; // DÁN URL WEB APP CỦA GOOGLE APPS SCRIPT VÀO ĐÂY (VD: https://script.google.com/macros/s/.../exec)

            if (GOOGLE_SHEET_WEB_APP_URL) {
                const urlEncodedData = new URLSearchParams();
                urlEncodedData.append('date', formattedDate);
                urlEncodedData.append('time', timeVal);
                urlEncodedData.append('pickup', pickup);
                urlEncodedData.append('dropoff', dropoff);
                urlEncodedData.append('type', typeText);
                urlEncodedData.append('name', nameVal);
                urlEncodedData.append('phone', phoneVal);
                urlEncodedData.append('price', formatCurrency(price));

                fetch(GOOGLE_SHEET_WEB_APP_URL, {
                    method: 'POST',
                    mode: 'no-cors', // Tránh lỗi CORS từ Google Script
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: urlEncodedData.toString()
                })
                .then(() => console.log('Đã gửi thông tin đặt xe lên Google Sheets thành công.'))
                .catch(err => console.error('Lỗi khi gửi lên Google Sheets:', err));
            }

            // Open Modal
            confirmModal.classList.add('open');
        });
    }

    // Modal Close triggers
    const closeModalFunc = () => {
        if (confirmModal) {
            confirmModal.classList.remove('open');
            // Optionally reset form
            if (bookingForm) bookingForm.reset();
            updatePrice();
        }
    };

    if (modalClose) modalClose.addEventListener('click', closeModalFunc);
    if (btnModalDone) btnModalDone.addEventListener('click', closeModalFunc);

    // Close on overlay click
    if (confirmModal) {
        confirmModal.addEventListener('click', (e) => {
            if (e.target === confirmModal) {
                closeModalFunc();
            }
        });
    }

    // 7. ACTIVE NAV LINK ON SCROLL
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

});
