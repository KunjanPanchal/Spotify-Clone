console.log("lets start java script")
let currentSong = new Audio();
let songs;
let currFolder;

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:53288/${folder}/`);
    let responce = await a.text();
    // console.log(responce);
    let div = document.createElement("div");
    div.innerHTML = responce;
    let as = div.getElementsByTagName("a")
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }

    let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUl.innerHTML = ""
    for (const song of songs) {
        let songDecode=decodeURI(song);
        songUl.innerHTML = songUl.innerHTML + `<li>
        <svg class="invert" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
        <path d="M12.5 3L12.5 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M12.5 17C12.5 19.2091 10.7091 21 8.5 21C6.29086 21 4.5 19.2091 4.5 17C4.5 14.7909 6.29086 13 8.5 13C10.7091 13 12.5 14.7909 12.5 17Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M12.5 3C16.366 3 19.5 6.13401 19.5 10C18 8.5 14.0556 6.26667 12.5 8.44444" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <div class="info">
            <div>${songDecode}</div>
            <div>Kunjan</div>
        </div>
        <div class="playnow">
            <span>Play now</span>
            <svg class="invert" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" />
            <path d="M9.5 11.1998V12.8002C9.5 14.3195 9.5 15.0791 9.95576 15.3862C10.4115 15.6932 11.0348 15.3535 12.2815 14.6741L13.7497 13.8738C15.2499 13.0562 16 12.6474 16 12C16 11.3526 15.2499 10.9438 13.7497 10.1262L12.2815 9.32594C11.0348 8.6465 10.4115 8.30678 9.95576 8.61382C9.5 8.92086 9.5 9.6805 9.5 11.1998Z" fill="currentColor" />
             </svg>

        </div>  </li>`;

    }
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e) => {
        e.addEventListener("click", element => {
            // console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playSong(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })

    })
    return songs;

}
const playSong = (track, pause = false) => {


    currentSong.src = `/${currFolder}/` + track;


    if (!pause) {
        currentSong.play();
        play.src = "images/pause.svg";

    }
    document.querySelector(".songname").innerHTML = decodeURI(track);
    document.querySelector(".duration").innerHTML = "00:00 / 00:00";

}
function formatTime(seconds) {
    // Calculate minutes and remaining seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Format minutes and seconds to be two digits
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    // Return the formatted time string
    return `${formattedMinutes}:${formattedSeconds}`;
}

async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:53288/songs/`);
    let responce = await a.text();
    
    let div = document.createElement("div");
    div.innerHTML = responce;
    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer");

    let array = Array.from(anchors);
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        
        


        if (e.href.includes("/songs/") && !e.href.includes(".htaccess")) {
            let folder = (e.href.split("/").slice(-1)[0]);
            console.log(folder)

            let a = await fetch(`http://127.0.0.1:53288/songs/${folder}/info.json`);
            let responce = await a.json();
            console.log(responce)
            
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card radius ">
            <div class="playBtn">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"
                    color="#000000" fill="black">
                    <path
                        d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                        stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                </svg>
            </div>
            <img class="radius" src=/songs/${folder}/cover.jpg alt="">
            <h4>${responce.title}</h4>
            <p>${responce.description}</p>
            </div>`
        }
    }

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log(item.currentTarget, item.currentTarget.dataset)
            await getSongs(`songs/${item.currentTarget.dataset.folder}`);
        })
    })

}
async function main() {


    await getSongs("songs/cs");
    playSong(songs[0], true);
    // console.log(songs);

    displayAlbums();



    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "images/pause.svg";
        }
        else {
            currentSong.pause();
            play.src = "images/play.svg"
        }

    })
    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration)

        document.querySelector(".duration").innerHTML = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percente = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percente + "%";
        currentSong.currentTime = (currentSong.duration * percente) / 100;

    })
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
        document.querySelector(".left").style.width = "360px"


    })
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-110%";
        document.querySelector(".left").style.width = "23vw"


    })

    previous.addEventListener("click", () => {

        currentSong.pause();
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if ((index - 1) >= 0) {
            playSong(songs[index - 1]);
        }
        else {
            playSong(songs[songs.length - 1])
        }
    })
    next.addEventListener("click", () => {

        currentSong.pause();
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if ((index + 1) < songs.length) {
            playSong(songs[index + 1]);
        }
        else {
            playSong(songs[0])
        }
    })
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log(e.target.value)
        currentSong.volume = parseInt(e.target.value) / 100;
    })

    document.querySelector(".volume>img").addEventListener("click",e=>{
        console.log(e.target)
        if(e.target.src.includes("images/volume.svg")){
            e.target.src=e.target.src.replace("images/volume.svg","images/mute.svg") 
            currentSong.volume=0;
            document.querySelector(".range").getElementsByTagName("input")[0].value=0
            
        }
        else{
            e.target.src=e.target.src.replace("images/mute.svg","images/volume.svg") 
            currentSong.volume=.20;
            document.querySelector(".range").getElementsByTagName("input")[0].value=20;
            
        }
    })

    

}
main();