const listItems = document.querySelectorAll('ul li');

listItems.forEach((item, index) => {
    item.textContent = `Hello world!`;
});

function showStudentName() {
    const button = document.getElementById('actionButton');
    button.innerText = `Іванів В.`;
}