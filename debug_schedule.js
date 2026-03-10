// Тест для понимания логики определения номеров пар
function debugScheduleLogic() {
  console.log('=== АНАЛИЗ ПРОБЛЕМЫ С НОМЕРАМИ ПАР ===\n');

  // Пример реальных данных из таблицы
  const dayStartRows = {
    Monday: 10,
    Tuesday: 30,
    Wednesday: 50,
    Thursday: 70,
    Friday: 90,
    Saturday: 110
  };

  const maxPairsPerDay = 7;

  console.log('Проблема: первая пара в пятнице получает номер 6 вместо 1\n');

  for (const [dayName, startRow] of Object.entries(dayStartRows)) {
    console.log(`\n--- День: ${dayName} ---`);
    console.log(`Начальная строка: ${startRow}`);
    
    for (let pair = 0; pair < maxPairsPerDay; pair++) {
      const rowIndex1 = startRow + pair * 2;
      const rowIndex2 = startRow + pair * 2 + 1;
      const realPairNumber = pair + 1;
      
      console.log(`  Пара ${realPairNumber}: строки ${rowIndex1}-${rowIndex2}`);
      
      // Симуляция: если в пятнице есть только одна пара в начале
      if (dayName === 'Friday' && pair === 0) {
        console.log(`    ^ ЭТО ПЕРВАЯ ПАРА В ПЯТНИЦЕ, но получает номер ${realPairNumber}`);
      }
      
      if (dayName === 'Friday' && pair === 5) {
        console.log(`    ^ ЭТО ШЕСТАЯ ПАРА В ПЯТНИЦЕ, но может быть первой реальной парой`);
      }
    }
  }

  console.log('\n=== ВОЗМОЖНЫЕ ПРИЧИНЫ ПРОБЛЕМЫ ===');
  console.log('1. В таблице пятницы есть пустые строки в начале');
  console.log('2. Реальная первая пара находится в строках, соответствующих паре №6');
  console.log('3. Неправильно определена начальная строка для пятницы');
  console.log('4. Есть пропуски/окна в расписании, которые не учитываются');

  console.log('\n=== РЕШЕНИЕ ===');
  console.log('Нужно определять номер пары не по индексу, а по реальному положению в таблице');
  console.log('Или нужно правильно определить начальные строки для каждого дня');
}

debugScheduleLogic();
