import { Component } from '@angular/core';
import { IonicPage, ModalController, Platform } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
import { DataProvider } from '../../providers/data/data';
import { RedditProvider } from '../../providers/reddit/reddit';
import { FormControl } from '@angular/forms';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

    subredditValue: string;  
    subredditControl: FormControl;

    constructor(public dataService: DataProvider, public redditService: RedditProvider, 
		public modalCtrl: ModalController, public platform: Platform, 
		public keyboard: Keyboard, public iab: InAppBrowser) {

	this.subredditControl = new FormControl();

    }

    ionViewDidLoad(){

	this.subredditControl.valueChanges.debounceTime(1500)
	    .distinctUntilChanged().subscribe(subreddit => {

		if(subreddit != '' && subreddit){
		    this.redditService.subreddit = subreddit;
		    this.changeSubreddit();
		    this.keyboard.close();
		}
		
	    });


	this.platform.ready().then(() => {

	    this.loadSettings();
	    
	});
	
    }

    loadSettings(): void {
	this.dataService.getData().then((settings) => {

	    if(settings && typeof(settings) != "undefined"){

		let newSettings = JSON.parse(settings);
		this.redditService.settings = newSettings;

		if(newSettings.length != 0){
		    this.redditService.sort = newSettings.sort;
		    this.redditService.perPage = newSettings.perPage;
		    this.redditService.subreddit = newSettings.subreddit;
		}   

	    }

	    this.changeSubreddit();

	});

    }

    showComments(post): void {
	console.log("TODO:  showComments()");
	let browser = this.iab.create('http://reddit.com' + post.data.permalink, '_system');
    }

    openSettings(): void {

	let settingsModal = this.modalCtrl.create('SettingsPage', {
	    perPage: this.redditService.perPage,
	    sort: this.redditService.sort,
	    subreddit: this.redditService.subreddit
	});
	
	settingsModal.onDidDismiss(settings => {

	    if(settings){
		this.redditService.perPage = settings.perPage;
		this.redditService.sort = settings.sort;
		this.redditService.subreddit = settings.subreddit;

		this.dataService.save(settings); 
		this.changeSubreddit();      
	    }

	});

	settingsModal.present();

    }

    playVideo(e, post): void {
	console.log("TODO: playVideo()");

	//Create a reference to the video
	let video = e.target;

	if(!post.alreadyLoaded){
	    post.showLoader = true;     
	}

	//Toggle the video playing
	if(video.paused){

	    //Show the loader gif
	    video.play();

	    //Once the video starts playing, remove the loader gif
	    video.addEventListener("playing", (e) => {
		post.showLoader = false;
		post.alreadyLoaded = true;
	    });

	} else {
	    video.pause();
	}
	


    }

    shuffleSubreddit(): void {

	var favorites = ["mechanical_gifs", "HorrorGifs", "gifextra", "TrippyGIFs"];
	var subreddit = favorites[Math.floor(Math.random() * favorites.length)];
	var msg = "Subreddit is " + subreddit;
	console.log(msg);
	this.redditService.subreddit = subreddit;
	this.changeSubreddit();
    }

    changeSubreddit(): void {
	console.log("TODO: changeSubreddit()");
	this.redditService.resetPosts();
    }

    loadMore(): void {
	console.log("TODO: loadMore()");
	this.redditService.nextPage();
    }

}

