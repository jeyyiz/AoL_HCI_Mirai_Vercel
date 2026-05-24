function filterBy(region, btn) {
    if (!btn) return;
    
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const cards = document.querySelectorAll('.therapist-card');
    let count = 0;

    cards.forEach(card => {
        if (region === 'all' || card.dataset.region === region) {
            card.style.display = 'block';
            count++;
        } else {
            card.style.display = 'none';
        }
    });

    const countEl = document.getElementById('count');
    if (countEl) countEl.innerText = count;
}

window.addEventListener('DOMContentLoaded', () => {
    const total = document.querySelectorAll('.therapist-card').length;
    const countEl = document.getElementById('count');
    if (countEl) countEl.innerText = total;

    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const activeBtn = document.querySelector('.filter-btn.active');
                if (activeBtn) activeBtn.classList.remove('active');
                button.classList.add('active');

                const filterValue = button.getAttribute('data-filter');
                const cards = document.querySelectorAll('.therapist-card');
                let visibleCount = 0;

                cards.forEach(card => {
                    const region = card.getAttribute('data-region');
                    if (filterValue === 'all' || filterValue === region) {
                        card.style.display = 'block';
                        visibleCount++;
                    } else {
                        card.style.display = 'none';
                    }
                });

                if (countEl) countEl.textContent = visibleCount;
            });
        });
    }
});
