**Архітектура програмного забезпечення**

**Лабораторна робота №3**

**Тема:** Асинхронне програмування

**Мета:** Закріплення навичок роботи з примітивами асинхронного програмування та паралелізації обробки даних 

_**Варіант 7.**_ Порахувати кількість слів у вхідному файлі. Між словами у текстовому файлі має бути принаймні один пропуск.

Оскільки для виконання кожного файлу використовується оперативна пам'ять машини, то для обчислення максимальної кількості файлів потрібно відповідно відштовхуватись від кількості доступної оперативної пам'яті. На використовуваній машині наявно 8 Гб оперативної пам'яті. Однак приблизно 3 Гб (а може і більше) відводиться під оптимальну роботу ОС. Тому візьмемо **5 Гб = 5242880 байт**. Враховуючи, що Event loop накладає обмеження на розмір пам'яті, яка виділяється для файлу (до 4000 байт), можна зробити обчислення:
_**5242880 / 4000 ≈ 1310 (файлів)**_.  Для мови Go це значення трохи більше, тому що на виконання рутини виділяється менше пам'яті. Але це лише приблизне значення і на практиці зазвичай відрізняється від теоретичного.
