// =========================
// FOR ANAM ❤️
// Made By Saad
// =========================

// Loader
document.addEventListener("DOMContentLoaded", function () {

    const loader = document.getElementById("loader");

    setTimeout(() => {

        if(loader){
            loader.style.opacity = "0";
            loader.style.transition = "1s";

            setTimeout(() => {
                loader.style.display = "none";
            },1000);
        }

    },2500);

});

// Open My Heart Button
const start = document.getElementById("start");

if(start){

    start.addEventListener("click",()=>{

        document.querySelector(".letter").scrollIntoView({

            behavior:"smooth"

        });

    });

}

// Floating Hearts
function createHeart(){

    const heart=document.createElement("div");

    heart.innerHTML="❤️";

    heart.style.position="fixed";
    heart.style.left=Math.random()*100+"vw";
    heart.style.top="-30px";
    heart.style.fontSize=(20+Math.random()*20)+"px";
    heart.style.zIndex="999";
    heart.style.pointerEvents="none";

    document.body.appendChild(heart);

    let y=-30;

    const fall=setInterval(()=>{

        y+=3;

        heart.style.top=y+"px";

        if(y>window.innerHeight){

            clearInterval(fall);

            heart.remove();

        }

    },20);

}

setInterval(createHeart,700);

// YES Button
const yes=document.getElementById("yes");

if(yes){

yes.onclick=()=>{

confetti({

particleCount:250,

spread:180,

origin:{y:.6}

});

alert("❤️ Thank You Anam ❤️");

}

}

// NO Button
const no=document.getElementById("no");

if(no){

no.addEventListener("mouseover",()=>{

const x=Math.random()*80;

const y=Math.random()*80;

no.style.position="fixed";

no.style.left=x+"vw";

no.style.top=y+"vh";

});

}

// Change Tab Title
const title=document.title;

document.addEventListener("visibilitychange",()=>{

if(document.hidden){

document.title="🥺 Please Come Back Anam...";

}else{

document.title=title;

}

});
const music = document.getElementById("bgMusic");
const startBtn = document.getElementById("start");

if (startBtn && music) {
    startBtn.addEventListener("click", () => {
        music.play().catch(err => {
            console.log("Music couldn't autoplay:", err);
        });
    });
}

