const media_query_for_mobile = window.matchMedia("(max-width: 499px)");

// Song Index
let playlist_indexing = 0;
let isPlaylist_song = false;
let random_index = 0;

// search data start
let search_results = document.getElementsByClassName("search_results")[0];

// Load the JSON file
let all_songs = [];
fetch('detail.json')
    .then(res => res.json())
    .then(data => {
        all_songs = data;

        all_songs.forEach(element => {
            const {name, cover, song, artist} = element;
            let card = document.createElement('div');
            card.classList.add('card');

            card.setAttribute("onclick", `activate_song_popup('${cover}', '${name}', '${song}', '${artist}')`);

            card.innerHTML = `
                            <img src=${cover} alt="">
                            <div class="content">
                                ${name}
                                <div class="subtitel">${artist}</div>
                            </div>
            `;
            search_results.appendChild(card);
        });
    });

let search_input = document.querySelector(".search #pc-search") || document.querySelector(".search-mobile #mo-input");

search_input.addEventListener("keyup", () => {
    let input_value = search_input.value.trim().toLowerCase(); // lower-case for English
    let search_results = document.getElementsByClassName("search_results")[0];
    let items = search_results.getElementsByClassName("card");

    for (let index = 0; index < items.length; index++) {
        let as = items[index].querySelector(".content");
        let text_value = as.textContent || as.innerHTML;

        // normalize and compare
        let text_normalized = text_value.trim().toLowerCase();

        if (text_normalized.includes(input_value)) {
            items[index].style.display = "flex";
        } else {
            items[index].style.display = "none";
        }
    }

    // Hide list if empty input
    if (search_input.value.length === 0) {
        search_results.style.display = "none";
    } else {
        search_results.style.display = "";
    }
});


let audio_elemant = new Audio("songs/1.mp3");
let wave = document.getElementsByClassName("wave")[0];
let play_icon = document.getElementById("play_icon");
let palyed_song_ka_pic = document.getElementById("poster_master_play");
let played_song_ka_naam = document.querySelector("#title marquee");
let played_song_ke_artist_ka_naam = document.querySelector("#title div");
let dowload_music = document.getElementById("dowload_music");
let progres_bar = document.getElementById("seek");

function play_audio(song_ki_pic, song_ka_naam, artist_ka_naam) {
    wave.classList.add("active");
    palyed_song_ka_pic.src = song_ki_pic;
    played_song_ka_naam.innerText = song_ka_naam;
    played_song_ke_artist_ka_naam.innerHTML = artist_ka_naam;
    play_icon.classList.remove("bi-play-circle");
    play_icon.classList.add("bi-pause-circle");

    audio_elemant.play();
}
function play_next_song() {
    if (isPlaylist_song) {
        audio_elemant.src =  playlist_song[playlist_indexing].song;
        dowload_music.setAttribute(`download`, playlist_song[playlist_indexing].name);
        dowload_music.href = playlist_song[playlist_indexing].song;
        makeAllBackground();
        Array.from(document.getElementsByClassName("song_item"))[playlist_indexing].style.background ='rgb(105, 105, 105, 0.1)';
        makeAllPlays();
        playlist_play_icon = document.getElementById(`${playlist_indexing+1}`);
        playlist_play_icon.classList.remove("bi-play-circle-fill");
        playlist_play_icon.classList.add("bi-pause-circle-fill");
        play_audio(playlist_song[playlist_indexing].cover, playlist_song[playlist_indexing].name, playlist_song[playlist_indexing].artist);
    } else{
        audio_elemant.src =  all_songs[random_index].song;
        dowload_music.setAttribute(`download`, all_songs[random_index].name);
        dowload_music.href = all_songs[random_index].song;
        play_audio(all_songs[random_index].cover, all_songs[random_index].name, all_songs[random_index].artist);
    }
}
function togglePlayPause() {
    if (play_icon.classList.contains("bi-play-circle")) {
        // play_next_song();
        audio_elemant.play();
    } else {
        play_icon.classList.remove("bi-pause-circle");
        play_icon.classList.add("bi-play-circle");
        wave.classList.remove("active");
        makeAllBackground();
        makeAllPlays();
        audio_elemant.pause();
    }  
}
const call_play_next_song = () => {
    if(isPlaylist_song){
        if (playlist_indexing >= playlist_song.length) {
            playlist_indexing = 0;
        } else{
            playlist_indexing++;
        }
    } else{
        if (random_index >= all_songs.length) {
            random_index = 0;
        } else{
            random_index++;
        }
    }
    play_next_song();
}
const play_previous_song = () =>{
    if(isPlaylist_song){
        if (playlist_indexing <= 0) {
            playlist_indexing = playlist_song.length -1;
        }else{
            playlist_indexing--;
        }
    } else{
        if (random_index <= 0) {
            random_index = all_songs.length -1;
        }else{
            random_index-=2;
        }
    }
    play_next_song();
}
// listen to Events 
// Musiq Duration
let current_time = document.getElementById("current_time");
let current_end = document.getElementById("current_end");

audio_elemant.addEventListener('timeupdate', () => {
    let musiq_curr = audio_elemant.currentTime;
    let musiq_dur = audio_elemant.duration;
    let mint1 = Math.floor(musiq_dur/60);
    let sec1 = Math.floor(musiq_dur%60);
    if (sec1 < 10) {
        sec1 = `0${sec1}`;
    }
    current_end.innerText = `${mint1}:${sec1}`;

    let mint2 = Math.floor(musiq_curr / 60);
    let sec2 = Math.floor(musiq_curr % 60);
    if (sec2 < 10) {
        sec2 = `0${sec2}`;
    }
    current_time.innerText = `${mint2}:${sec2}`;

    progress = parseInt((audio_elemant.currentTime/audio_elemant.duration) * 100);
    progres_bar.value = progress;
});

progres_bar.addEventListener('change', ()=>{
    audio_elemant.currentTime = (progres_bar.value  * audio_elemant.duration)/100;
});

// Audio System
let vol_icon = document.getElementById("vol_icon");
let vol_input = document.getElementById("vol_input");

vol_input.addEventListener('change',()=>{
    if (vol_input.value == 0) {
        vol_icon.classList.remove("bi-volume-up-fill");
        vol_icon.classList.remove("bi-volume-down-fill");
        vol_icon.classList.add("bi-volume-mute-fill");
    } else if(vol_input.value <= 50 && vol_input.value > 0){
        vol_icon.classList.remove("bi-volume-up-fill");
        vol_icon.classList.remove("bi-volume-mute-fill");
        vol_icon.classList.add("bi-volume-down-fill");
    }else if(vol_input.value > 50 && vol_input.value <= 100){
        vol_icon.classList.remove("bi-volume-down-fill");
        vol_icon.classList.remove("bi-volume-mute-fill");
        vol_icon.classList.add("bi-volume-up-fill");
    }
    let vol = vol_input.value;
    audio_elemant.volume = vol / 100;
});
// PlayList
let playlist_song = [
    {"name": "Rang Jo Lagyo-Ramaiya Vastavaiya रंग जो लाग्यो - रमैया वस्तावैया رنگ جو لگیو-رمائیا وسٹاویہ", "cover": "pics/rang.jpg", "song": "songs/21.mp3", "artist": "Atif Aslam & Shreya Ghoshal"},
    {"name": "Khayaal ख़याल", "cover": "pics/khayal.jpg", "song": "songs/20.mp3", "artist": "Talwiinder"},
    {"name": "Ahwarun Ahwarun Islamic Arabic Song أهواون أهواون أغنية عربية إسلامية-أنا ثائر", "cover": "pics/ahwarun.jpg", "song": "songs/1.mp3", "artist": "Hadi Faaour"},
    {"name": "Aashiqui-2 Mashup आशिकी-२ माशअप", "cover": "pics/a2.jpg", "song": "songs/4.mp3", "artist": "DJ Kiran Kamath"},
    {"name": "Gulabi Aankhen गुलाबी आँखें", "cover": "pics/tu_hi_hai_ashiqi.jpg", "song": "songs/10.mp3", "artist": "Sanam"},
    {"name": "Dagabaaz Re दगाबाज़ रे", "cover": "pics/dagabaaz.jpg", "song": "songs/8.mp3", "artist": "Rahat Fateh Ali Khan & Shreya Gh"},
    {"name": "Dhun-Saiyaara  धुन-सैयाारा", "cover": "pics/dhun.jpg", "song": "songs/9.mp3", "artist": "Arijit Singh & Mithoon"},
    {"name": "Kya - 'Crook' क्या - 'क्रूक'", "cover": "pics/kay.jpg", "song": "songs/24.mp3", "artist": "Pritam & Neeraj Shridhar"},
    {"name": "Beqarar Karke Hamen Yun Na Jaiye बेकरार करके हमें यूं न जाइए", "cover": "pics/beqarar.jpg", "song": "songs/7.mp3", "artist": "Hemant Kumar"},
    {"name": "Main Hoon Saath Tere - 'Shaadi Mein Zaroor Aana' मैं हूँ साथ तेरे - 'शादी में जरूर आना'", "cover": "pics/main_hoon_sath_tere.jpg", "song": "songs/23.mp3", "artist": "Arijit Singh"}
];
const makeAllBackground = ()=>{
    Array.from(document.getElementsByClassName("song_item")).forEach((el)=>{
        el.style.background ='rgb(105, 105, 105, 0)'
    })
}
const makeAllPlays = ()=>{
    Array.from(document.getElementsByClassName("playListPlay")).forEach((el)=>{
        el.classList.remove("bi-pause-circle-fill");
        el.classList.add("bi-play-circle-fill");
    })
}
let index = 0;
Array.from(document.getElementsByClassName("playListPlay")).forEach((e)=>{
    e.addEventListener('click', (el)=>{
        index = el.target.id;
        playlist_indexing = index-1;
        isPlaylist_song = true;
        if (el.target.classList.contains('bi-pause-circle-fill')) {
            el.target.classList.remove("bi-pause-circle-fill");
            el.target.classList.add("bi-play-circle-fill");
            togglePlayPause();
        } else {
            makeAllPlays();
            makeAllBackground();
            Array.from(document.getElementsByClassName("song_item"))[index-1].style.background ='rgba(58, 58, 91, 0.5)';
            el.target.classList.remove("bi-play-circle-fill");
            el.target.classList.add("bi-pause-circle-fill");
            audio_elemant.src = playlist_song[index-1].song;
            dowload_music.setAttribute(`download`, playlist_song[index-1].name);
            dowload_music.href = playlist_song[index-1].song;
            play_audio(playlist_song[index-1].cover, playlist_song[index-1].name, playlist_song[index-1].artist);
        }  
    })
})

let playlist = document.getElementById("playlist");
let sudjesion = document.getElementById("sudjesion");

function handleHashChange() {
  if (media_query_for_mobile.matches) {
    if (location.hash === "#search") {
      sudjesion.style.display = "none";
      playlist.style.display = "block";
    } else {
      sudjesion.style.display = "block";
      playlist.style.display = "none";
    }
  } else {
    // For desktop view, show both
    sudjesion.style.display = "block";
    playlist.style.display = "block";
  }
}

window.addEventListener("load", () => {
  if (!media_query_for_mobile.matches) {
    sudjesion.style.display = "block";
    playlist.style.display = "block";
  }
  handleHashChange(); // Call this here instead of a separate listener
});

function display_playlist_page() {
    if (media_query_for_mobile.matches == true) {
        location.hash = "search";
        sudjesion.style.display = "none";
        playlist.style.display = "block";
    }
}
function displa_home_page() {
    if (media_query_for_mobile.matches == true) {
        sudjesion.style.display = "block";
        playlist.style.display = "none";

    }
}
function display_search_page() {
   if (media_query_for_mobile.matches == true) {
        window.location.href = "mobile_search.html";
    } 
}
media_query_for_mobile.addEventListener("change", handleHashChange);
window.addEventListener("load", handleHashChange);

// song Info System
const SongPopup = document.getElementById("SongPopup");
const closeBtn = document.getElementById("closeBtn");
let pic = document.querySelector(".popup-box img");
let naam = document.querySelector(".popup-box #popup_details marquee");
let playButton = document.querySelector(".popup-box #popup_details button");

const activate_song_popup = (img_src, name, song_src, artist_ka_naam) => {
    pic.src = img_src;
    naam.innerText = name;
    playButton.setAttribute(`onclick`, `play_music("${song_src}", "${img_src}", "${name}", "${artist_ka_naam}")`);
    SongPopup.style.display = "flex";
};

closeBtn.onclick = () =>{
  SongPopup.style.display = "none";
};

window.onclick = (e) =>{
  if(e.target === SongPopup) {
    SongPopup.style.display = "none";
  }
};
function play_music(song_src, song_ki_pic, song_ka_naam, artist_ka_naam) {
    isPlaylist_song = false;
    closeBtn.click();
    audio_elemant.src = song_src;
    dowload_music.setAttribute(`download`, song_ka_naam);
    dowload_music.href = song_src;
    play_audio(song_ki_pic, song_ka_naam, artist_ka_naam);
}
// Dowload


// Shuffle
let shuffle = document.getElementsByClassName("shuffle")[0];

shuffle.addEventListener('click', ()=>{
    let a = shuffle.innerHTML;
    switch (a) {
        case 'next':
            shuffle.classList.add('bi-arrow-repeat');
            shuffle.classList.remove('bi-file-earmark-music');
            shuffle.classList.remove('bi-shuffle');
            shuffle.innerHTML = 'repeat';
            break;
        case 'repeat':
            shuffle.classList.add('bi-shuffle');
            shuffle.classList.remove('bi-file-earmark-music');
            shuffle.classList.remove('bi-arrow-repeat');
            shuffle.innerHTML = 'random';
            break;
        case 'random':
            shuffle.classList.add('bi-file-earmark-music');
            shuffle.classList.remove('bi-arrow-repeat');
            shuffle.classList.remove('bi-shuffle');
            shuffle.innerHTML = 'next';
            break;
    }
});

const next_musiq = ()=>{
    if (isPlaylist_song) {
        if (playlist_indexing >= playlist_song.length) {
            playlist_indexing = 1;
        } else {
            playlist_indexing++;
        }
        audio_elemant.src = playlist_song[playlist_indexing].song;
        dowload_music.setAttribute(`download`, playlist_song[playlist_indexing].name);
        dowload_music.href = playlist_song[playlist_indexing].song;
        makeAllBackground();
        Array.from(document.getElementsByClassName("song_item"))[playlist_indexing+1].style.background ='rgb(105, 105, 105, 0.1)';
        makeAllPlays();
        playlist_play_icon = document.getElementById(`${playlist_indexing+1}`);
        playlist_play_icon.classList.remove("bi-play-circle-fill");
        playlist_play_icon.classList.add("bi-pause-circle-fill");
        play_audio(playlist_song[playlist_indexing].cover, playlist_song[playlist_indexing].name, playlist_song[playlist_indexing].artist);
    } else {
        audio_elemant.src = all_songs[random_index].song;
        dowload_music.setAttribute(`download`, all_songs[random_index].name);
        dowload_music.href = all_songs[random_index].song;
        play_audio(all_songs[random_index].cover, all_songs[random_index].name, all_songs[random_index].artist);
        if (random_index >= all_songs.length) {
            random_index = 1;
        } else {
            random_index++;
        }
    }
}
const repeat_musiq = ()=>{
    //index;
    if (isPlaylist_song) {
        playlist_indexing;
        audio_elemant.src = playlist_song[playlist_indexing].song;
        dowload_music.setAttribute(`download`, playlist_song[playlist_indexing].name);
        dowload_music.href = playlist_song[playlist_indexing].song;
        makeAllBackground();
        Array.from(document.getElementsByClassName("song_item"))[playlist_indexing+1].style.background ='rgb(105, 105, 105, 0.1)';
        makeAllPlays();
        playlist_play_icon = document.getElementById(`${playlist_indexing+1}`);
        playlist_play_icon.classList.remove("bi-play-circle-fill");
        playlist_play_icon.classList.add("bi-pause-circle-fill");
        play_audio(playlist_song[playlist_indexing].cover, playlist_song[playlist_indexing].name, playlist_song[playlist_indexing].artist);
    } else {
        audio_elemant.src = all_songs[random_index].song;
        dowload_music.setAttribute(`download`, all_songs[random_index].name);
        dowload_music.href = all_songs[random_index].song;
        play_audio(all_songs[random_index].cover, all_songs[random_index].name, all_songs[random_index].artist);
        random_index;
    }
}
const random_musiq = ()=>{
    if (isPlaylist_song) {
        if (playlist_indexing >= playlist_song.length) {
            playlist_indexing = 1;
        } else {
            playlist_indexing = Math.floor((Math.random() * playlist_song.length) + 1);
        }
        audio_elemant.src = playlist_song[playlist_indexing].song;
        dowload_music.setAttribute(`download`, playlist_song[playlist_indexing].name);
        dowload_music.href = playlist_song[playlist_indexing].song;
        makeAllBackground();
        Array.from(document.getElementsByClassName("song_item"))[playlist_indexing+1].style.background ='rgb(105, 105, 105, 0.1)';
        makeAllPlays();
        playlist_play_icon = document.getElementById(`${playlist_indexing+1}`);
        playlist_play_icon.classList.remove("bi-play-circle-fill");
        playlist_play_icon.classList.add("bi-pause-circle-fill");
        play_audio(playlist_song[playlist_indexing].cover, playlist_song[playlist_indexing].name, playlist_song[playlist_indexing].artist);
    } else {
        audio_elemant.src = all_songs[random_index].song;
        dowload_music.setAttribute(`download`, all_songs[random_index].name);
        dowload_music.href = all_songs[random_index].song;
        play_audio(all_songs[random_index].cover, all_songs[random_index].name, all_songs[random_index].artist);
        if (random_index >= all_songs.length) {
            random_index = 1;
        } else {
            random_index = Math.floor((Math.random() * all_songs.length) + 1);
        }
    }
}
audio_elemant.addEventListener('ended', ()=>{
    let b = shuffle.innerHTML;
    switch (b) {
        case 'repeat':
            repeat_musiq();
            break;
        case 'next':
            next_musiq();
            break;
        case 'random':
            random_musiq();
            break;
    }

});

