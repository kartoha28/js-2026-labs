function task1() {
    let sum = 0;
    let i = 1;
    while (i <= 50) {
        sum += i;
        i++;
    }
    console.log("Сума перших 50 натуральних чисел = " + sum);
}

function task2() {
    let num = parseInt(prompt("Введіть число для обчислення факторіалу:"));
    if (isNaN(num) || num < 0) {
        console.log("Введіть коректне додатне число.");
        return;
    }
    let factorial = 1;
    for (let i = 1; i <= num; i++) {
        factorial *= i;
    }
    console.log(`Факторіал числа ${num} = ${factorial}`);
}

function task3() {
    let monthNumber = parseInt(prompt("Введіть номер місяця (1-12):"));
    let monthName;

    switch (monthNumber) {
        case 1: monthName = "Січень"; break;
        case 2: monthName = "Лютий"; break;
        case 3: monthName = "Березень"; break;
        case 4: monthName = "Квітень"; break;
        case 5: monthName = "Травень"; break;
        case 6: monthName = "Червень"; break;
        case 7: monthName = "Липень"; break;
        case 8: monthName = "Серпень"; break;
        case 9: monthName = "Вересень"; break;
        case 10: monthName = "Жовтень"; break;
        case 11: monthName = "Листопад"; break;
        case 12: monthName = "Грудень"; break;
        default: monthName = "Некоректний номер місяця";
    }
    console.log("Результат: " + monthName);
}

function task4(arr) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] % 2 === 0) {
            sum += arr[i];
        }
    }
    return sum;
}

const task5 = (str) => {
    const vowels = "aeiouyAEIOUYаеєиіїоуюяАЕЄИІЇОУЮЯ";
    let count = 0;
    for (let char of str) {
        if (vowels.includes(char)) {
            count++;
        }
    }
    return count;
};

function task6(base, exponent) {
    return Math.pow(base, exponent);
}


console.log("--- Виконання лабораторної роботи ---");
task1();
task2();
task3();

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log("Завдання 4: Сума парних у [1..10] = " + task4(numbers));

const testString = "Web Programming Lab";
console.log(`Завдання 5: Кількість голосних у "${testString}" = ` + task5(testString));

console.log("Завдання 6: 2^10 = " + task6(2, 10));