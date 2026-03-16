function task1() {
    console.log("--- Завдання 1 ---");
    let fruits = ["яблуко", "банан", "груша", "апельсин"];
    console.log("Початковий масив:", fruits);

    fruits.pop();
    console.log("1.1. Після видалення останнього:", fruits);

    fruits.unshift("ананас");
    console.log("1.2. Після додавання на початок:", fruits);

    fruits.sort().reverse();
    console.log("1.3. Після сортування (зворотне):", fruits);

    let index = fruits.indexOf("яблуко");
    console.log("1.4. Індекс елемента 'яблуко':", index);
}

function task2() {
    console.log("\n--- Завдання 2 ---");
    let colors = ["червоний", "синій", "зелений", "темно-синій", "білий"];
    console.log("Початковий масив кольорів:", colors);

    let longest = colors.reduce((a, b) => a.length >= b.length ? a : b);
    let shortest = colors.reduce((a, b) => a.length <= b.length ? a : b);
    console.log(`2.2. Найдовший: ${longest}, Найкоротший: ${shortest}`);

    colors = colors.filter(c => c.includes("синій"));
    console.log("2.3. Після фільтрації (тільки сині):", colors);

    let resultString = colors.join(", ");
    console.log("2.5. Результат join():", resultString);
}

function task3() {
    console.log("\n--- Завдання 3 ---");
    let employees = [
        { name: "Олег", age: 22, position: "розробник" },
        { name: "Анна", age: 30, position: "дизайнер" },
        { name: "Іван", age: 25, position: "розробник" }
    ];
    console.log("Початковий список працівників:", employees);

    employees.sort((a, b) => a.name.localeCompare(b.name));
    console.log("3.2. Відсортовано за іменами:", employees);

    let devs = employees.filter(e => e.position === "розробник");
    console.log("3.3. Тільки розробники:", devs);

    employees = employees.filter(e => e.age !== 30);
    console.log("3.4. Після видалення (вік 30):", employees);

    employees.push({ name: "Марія", age: 27, position: "HR" });
    console.log("3.5. Після додавання нового працівника:", employees);
}

function task4() {
    console.log("\n--- Завдання 4 ---");
    let students = [
        { name: "Олексій", age: 19, course: 2 },
        { name: "Олена", age: 21, course: 4 },
        { name: "Наталія", age: 20, course: 3 }
    ];

    students = students.filter(s => s.name !== "Олексій");
    console.log("4.2. Після видалення Олексія:", students);

    students.push({ name: "Дмитро", age: 18, course: 1 });
    console.log("4.3. Після додавання Дмитра:", students);

    students.sort((a, b) => b.age - a.age);
    console.log("4.4. Відсортовано за віком:", students);

    let st3 = students.find(s => s.course === 3);
    console.log("4.5. Студент 3-го курсу:", st3);
}

function task5() {
    console.log("\n--- Завдання 5 ---");
    let nums = [1, 2, 3, 4, 5, 6];
    console.log("Початкові числа:", nums);

    let squared = nums.map(n => n * n);
    console.log("5.1. Квадрати чисел:", squared);

    let evens = nums.filter(n => n % 2 === 0);
    console.log("5.2. Лише парні:", evens);

    let sum = nums.reduce((acc, n) => acc + n, 0);
    console.log("5.3. Сума всіх елементів:", sum);

    let extra = [10, 11, 12, 13, 14];
    let combined = nums.concat(extra);
    console.log("5.4. Після об'єднання з [10..14]:", combined);

    combined.splice(0, 3);
    console.log("5.5. Після видалення перших 3-х елементів (splice):", combined);
}

function libraryManagement() {
    console.log("\n--- Завдання 6 ---");
    let library = [
        { title: "Кобзар", author: "Шевченко", genre: "Поезія", pages: 300, isAvailable: true },
        { title: "1984", author: "Оруелл", genre: "Антиутопія", pages: 328, isAvailable: true }
    ];

    const addBook = (title, author, genre, pages) => {
        library.push({ title, author, genre, pages, isAvailable: true });
        console.log(`6.2. Додано книгу: ${title}`);
    };

    const removeBook = (title) => {
        library = library.filter(b => b.title !== title);
        console.log(`6.3. Видалено книгу: ${title}`);
    };

    const toggleBookAvailability = (title, isBorrowed) => {
        let book = library.find(b => b.title === title);
        if (book) book.isAvailable = !isBorrowed;
        console.log(`6.5. Книга '${title}' тепер ${book.isAvailable ? 'доступна' : 'взята'}`);
    };

    const sortBooksByPages = () => {
        library.sort((a, b) => a.pages - b.pages);
        console.log("6.6. Книги відсортовані за сторінками");
    };

    const getBooksStatistics = () => {
        let total = library.length;
        let available = library.filter(b => b.isAvailable).length;
        let borrowed = total - available;
        let avgPages = library.reduce((acc, b) => acc + b.pages, 0) / total;
        return { total, available, borrowed, avgPages };
    };

    addBook("Тигролови", "Багряний", "Пригоди", 280);
    removeBook("Кобзар");
    toggleBookAvailability("1984", true);
    sortBooksByPages();

    console.log("6.4. Пошук книг Оруелла:", library.filter(b => b.author === "Оруелл"));
    console.log("6.7. Статистика:", getBooksStatistics());
}

function task7() {
    console.log("\n--- Завдання 7 ---");
    let student = { name: "Іван", age: 20, course: 2 };
    console.log("Початковий об'єкт:", student);

    student.subjects = ["Програмування", "Математика"];
    console.log("7.2. Після додавання предметів:", student);

    delete student.age;
    console.log("7.4. Фінальний об'єкт (без віку):", student);
}

task1();
task2();
task3();
task4();
task5();
libraryManagement();
task7();