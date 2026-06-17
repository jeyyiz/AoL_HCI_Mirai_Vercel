window.addEventListener('DOMContentLoaded', () => {
    const total = document.querySelectorAll('.therapist-card').length;
    document.getElementById('count').innerText = total;
});

function filterBy(region, btn) {
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

    document.getElementById('count').innerText = count;
}
