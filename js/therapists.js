function filterBy(region, button) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const cards = document.querySelectorAll('.therapist-card');
    let count = 0;

    cards.forEach(card => {
        const cardRegion = card.getAttribute('data-region');
        if (region === 'all' || cardRegion === region) {
            card.style.display = 'block'; 
            count++;
        } else {
            card.style.display = 'none';  
        }
    });

    // 3. Update counter teks jumlah therapist
    document.getElementById('count').textContent = count;
}
