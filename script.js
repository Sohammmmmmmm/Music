console.log('Lets write JavaScript')
let currentSong = new Audio();
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "Invalid input";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}



async function getSongs() {
    let a = await fetch("http://127.0.0.1:5500/songs/")
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }

    }
    return songs
}

const playMusic = (track,pause=false) => {
    // let audio = new Audio("/songs/" + track)
    currentSong.src = "/songs/" + track
    if(!pause){
        currentSong.play()      
        play.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

}
async function main() {

    // let currentSong;



    // Get the list of all the songs
    let songs = await getSongs()
    playMusic(songs[0],true)
    // console.log(songs)

    // Show all the songs in the playlist

    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li> <img class="invert" width = "34" src="music.svg" alt="">
                            <div class="info">
                                <div> ${song.replaceAll("%20", " ")}</div>
                                <div>Soham</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="play.svg" alt="">
                            </div> </li>`;

    }
    // Attach an event listener to each song


    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

    // Attach an event listener to play next and previous

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "pause.svg";
        }
        else {
            currentSong.pause();
            play.src = "play.svg";
        }
    });

    // Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}:${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime/ currentSong.duration) * 100 + "%"
    })

    // Add an eventListener to seek bar

    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width ) * 100
        document.querySelector(".circle").style.left = percent + "%"
        currentSong.currentTime = ((currentSong.duration) * percent)/100
    })

    // Add an event listener for hamburger

    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "0"
    })

     // Add an event listener for close button

     document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "-120%"
    })

   


    // ...Play the first song
    // var audio = new Audio(songs[0]);
    //  audio.play(); 
    //
    // audio.addEventListener("loadeddata", () => {
    //     let duration = audio.duration;
    //     console.log(audio.duration,audio.currentSrc,audio.currentTime)
    //     ...The duration variable now holds the duration (in seconds) if the audio clip
    // });

}

main()