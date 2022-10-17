/* eslint-disable  @typescript-eslint/comma-dangle */
/* eslint-disable  no-console */
/* eslint-disable  max-len */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
function greet() {
  console.log(
    'Приветствую, проверяющий! Если есть какие-то вопросы, свяжитесь со мной в Discord: @Arzhanik-Anastasia#7989.'
  );
}

function start() {
  console.groupCollapsed(
    'Есть все, кроме адаптивной верстки. Доп.функционал реализован в виде сохранения наряженной елки. Обратите внимание, сохранение происходит в момент нажатия кнопки сохранить.'
  );
  console.groupEnd();
}

function description() {
  greet();
  start();
}

export { description };
