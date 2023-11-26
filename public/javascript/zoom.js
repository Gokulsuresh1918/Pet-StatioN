
// P_Detaild View Onclick 


let MainImg = document.getElementById('zoommain');
let smalImg = document.getElementsByClassName('smalImg');

smalImg[0].onclick = () => { 
    MainImg.src = smalImg[0].src; 
}
smalImg[1].onclick = () => {
    MainImg.src = smalImg[1].src;
}
smalImg[2].onclick = () => {
    MainImg.src = smalImg[2].src;
}


