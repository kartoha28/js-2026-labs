// 1.1
function getMinMax(arr) {
    let max = arr[0];
    let min = arr[0];

    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) max = arr[i];
        if (arr[i] < min) min = arr[i];
    }
    return { min: min, max: max };
}

const numbers = [12, 5, 27, 8, 3];
console.log("1.1 масив: [12, 5, 27, 8, 3]:");
console.log(getMinMax(numbers));


// 1.2
const car1 = { brand: "Audi", year: 2020 };
const car2 = { brand: "Audi", year: 2020 };

const areObjectsEqual = (car1.brand === car2.brand) && (car1.year === car2.year);
console.log("\n1.2 Порівняння об'єктів car1 та car2:");
console.log("Чи однакові вони?", areObjectsEqual);


// 2.1
function isInRange(number, min, max) {
    return number >= min && number <= max;
}

const myNum = 15;
console.log(`\n2.1 Чи входить число ${myNum} у діапазон від 10 до 20?`);
console.log(isInRange(myNum, 10, 20));


// 2.2
let isTaskCompleted = false;
console.log("\n2.2 Початковий стан isTaskCompleted:", isTaskCompleted);

isTaskCompleted = !isTaskCompleted;
console.log("Стан після використання NOT (!):", isTaskCompleted);


// 3.1 (if)
function getGradeIf(score) {
    if (score >= 90) return "відмінно";
    if (score >= 75) return "добре";
    if (score >= 60) return "задовільно";
    return "незадовільно";
}

// 3.2 (if)
function getSeasonIf(month) {
    if (month >= 1 && month <= 12) {
        if (month === 12 || month === 1 || month === 2) {
            return "Зима";
        } else if (month >= 3 && month <= 5) {
            return "Весна";
        } else if (month >= 6 && month <= 8) {
            return "Літо";
        } else {
            return "Осінь";
        }
    }
    return "Некоректний місяць";
}

const studentScore1 = 82;
const currentMonth1 = 11;
console.log(`\n3.1 (IF) Оцінка для ${studentScore1} балів:`, getGradeIf(studentScore1));
console.log(`3.2 (IF) Сезон для ${currentMonth1}-го місяця:`, getSeasonIf(currentMonth1));


// 3.3 (?)
function getGradeTernary(score) {
    return (score >= 90) ? "відмінно" :
        (score >= 75) ? "добре" :
            (score >= 60) ? "задовільно" : "незадовільно";
}

// 3.4 (?)
function getSeasonTernary(month) {
    return (month < 1 || month > 12) ? "Некоректний місяць" :
        (month === 12 || month <= 2) ? "Зима" :
            (month <= 5) ? "Весна" :
                (month <= 8) ? "Літо" : "Осінь";
}

const studentScore2 = 95;
const currentMonth2 = 4;
console.log(`\n3.3 (?) Оцінка для ${studentScore2} балів:`, getGradeTernary(studentScore2));
console.log(`3.4 (?) Сезон для ${currentMonth2}-го місяця:`, getSeasonTernary(currentMonth2));