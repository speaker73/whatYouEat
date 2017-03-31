const restorans = ['Максимовича', 'Фонтан', 'Винница', 'Арбская кухня', 'Арабская кухня', 'Паб', 'Вареники/Пельмени', 'Пицца'];
function randoms(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;

}
const choiseNumber = randoms(0,restorans.length - 1);
const restoranChoise = restorans[choiseNumber];

console.log(restoranChoise)