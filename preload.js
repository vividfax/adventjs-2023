function preload() {

    // homepage
    fonts.redressed = loadFont("./assets/homepage/Redressed-Regular.ttf");
    assets.homepageReindeer = loadImage("./assets/homepage/reindeer.png");
    assets.homepageStar = loadImage("./assets/homepage/star.png");

    // day2
    assets.day2Banners = [loadImage('./assets/day2/Banners/1.png'),
        loadImage('./assets/day2/Banners/2.png'),
        loadImage('./assets/day2/Banners/3.png'),
        loadImage('./assets/day2/Banners/4.png'),
        loadImage('./assets/day2/Banners/5.png'),
        loadImage('./assets/day2/Banners/6.png'),
        loadImage('./assets/day2/Banners/7.png'),
        loadImage('./assets/day2/Banners/8.png'),
        loadImage('./assets/day2/Banners/9.png'),
        loadImage('./assets/day2/Banners/10.png'),
        loadImage('./assets/day2/Banners/11.png'),
        loadImage('./assets/day2/Banners/12.png'),
        loadImage('./assets/day2/Banners/13.png'),
        loadImage('./assets/day2/Banners/14.png'),
        loadImage('./assets/day2/Banners/15.png'),
        loadImage('./assets/day2/Banners/16.png')];
    assets.day2Tiles = [loadImage('./assets/day2/Tiles/1.png'),
        loadImage('./assets/day2/Tiles/2.png'),
        loadImage('./assets/day2/Tiles/3.png'),
        loadImage('./assets/day2/Tiles/4.png'),
        loadImage('./assets/day2/Tiles/5.png'),
        loadImage('./assets/day2/Tiles/6.png'),
        loadImage('./assets/day2/Tiles/7.png'),
        loadImage('./assets/day2/Tiles/8.png'),
        loadImage('./assets/day2/Tiles/9.png')];

    // day4
    assets.day4Font = loadFont("./assets/day4/Cabin-Regular.ttf");

    // day6
    assets.day6Font = loadFont("./assets/day6/Austie.ttf");
    assets.day6myTexture = loadImage("./assets/day6/paper.png");
    assets.day6santaStamp = loadImage("./assets/day6/stamp2.png");
    assets.day6stamp = loadImage("./assets/day6/ministamp.png");
    assets.day6satanStamp = loadImage("./assets/day6/satanstamp.png");

    // day8
    assets.day8Shader = loadShader('./assets/day8/shader.vert', './assets/day8/shader.frag');

    // day9
    assets.day9Model = loadJSON("./assets/day9/model.json");
    assets.day9Carols = loadStrings("./assets/day9/carols.txt");

    // day10
    assets.day10constellationGrammar = loadJSON("./assets/day10/grammar-source.json");
    assets.day10boldFont = loadFont("./assets/day10/JosefinSlab-SemiBold.ttf");

    // day11
    assets.day11hiddenImages = [];
    for (let i = 0; i < 11; i++) assets.day11hiddenImages.push(loadImage("./assets/day11/skyline" + str(i) + ".png"));
    assets.day11clockFont = loadFont("./assets/day11/DOTMATRI.TTF");

    // day12
    assets.day12 = new Day12Assets();

    // day13
    assets.day13GrammarSource = loadJSON("./assets/day13/sentence.json");

    // day16
    assets.day16Shader = loadShader("./assets/day16/shader.vert", "./assets/day16/shader.frag");
    assets.day16World = loadShader("./assets/day16/shader.vert", "./assets/day16/world.frag");
    assets.day16Background = loadImage("./assets/day16/bg.jpg");

    // day18
    assets.day18GrammarSource = loadJSON("./assets/day18/grammar-source.json");
    assets.day18Font = loadFont("./assets/day18/comicsans.ttf");
    assets.day18Letter = loadImage("./assets/day18/letter-wide.png");

    // day22
    assets.day22titleFont = loadFont("./assets/day22/font.ttf")
    assets.day22testImage = loadImage("./assets/day22/sprite_aliased.png")
    assets.day22bg = loadImage("./assets/day22/bg.jpg")
    assets.day22sixpence_head = loadImage("./assets/day22/sixpencehead-trans.png")
    assets.day22sixpence_tail = loadImage("./assets/day22/sixpencetail-trans.png")
    assets.day22GrammarSource = loadJSON("./assets/day22/grammar-source.json");

    // day23
    assets.day23Song = new Audio("./assets/day23/dark_snowy_night.mp3");

    // day26
    assets.day26SnowmanFace = loadImage("./assets/day26/face.png");
    assets.day26SnowmanArms = [];
    for (let i = 0; i < 5; i++) assets.day26SnowmanArms.push(loadImage("./assets/day26/arm"+i+".png"));

    // day27
    assets.day27carol1 = loadSound("./assets/day27/deck-the-halls.mp3");
    assets.day27carol2 = loadSound("./assets/day27/ding-dong-merrily-on-high.mp3");
    assets.day27carol3 = loadSound("./assets/day27/god-rest-you-merry-gentlemen.mp3");
    assets.day27knock = loadSound("./assets/day27/knock.mp3");
    assets.day27slam = loadSound("./assets/day27/slam.mp3");

    // day29
    assets.day29bowImage = loadImage('./assets/day29/bow.png');
    assets.day29elfImage = loadImage('./assets/day29/elf.png');
    assets.day29bgImage = loadImage('./assets/day29/background.png');

    // day30
    assets.day30Font = loadFont("./assets/day30/norwester.otf");
}

class Day12Assets {
    constructor() {
        this.font = loadFont(this.assetFilename("Assiduous-9m35.ttf"));
        this.loadingScreen = loadImage(this.imageFilename('loadingscreen.png'));

        this.music = new Audio(this.assetFilename('simcity2000_bells.mp3'));
        this.music.loop = true;
        this.musicOn = false;

        var sprites = [];
        // Empty grid square
        sprites[0] = loadImage(this.imageFilename('empty.png'));
        // Trees
        this.trees = [1000,1001,1002,1003];
        sprites[1000] = loadImage(this.imageFilename('tree1.png'));
        sprites[1001] = loadImage(this.imageFilename('tree2.png'));
        sprites[1002] = loadImage(this.imageFilename('tree3.png'));
        sprites[1003] = loadImage(this.imageFilename('tree4.png'));

        // Structures
        this.houses = [1,2,3,4];
        sprites[1] = loadImage(this.imageFilename('house1.png'));
        sprites[2] = loadImage(this.imageFilename('house2.png'));
        sprites[3] = loadImage(this.imageFilename('house3.png'));
        sprites[4] = loadImage(this.imageFilename('house4.png'));
        this.church = 10;
        this.hospital = 11;
        this.bar = 12;
        this.decoratedtree = 13;
        this.park = 14;
        this.snowperson = 15;
        sprites[this.church] = loadImage(this.imageFilename('church.png'));
        sprites[this.hospital] = loadImage(this.imageFilename('hospital.png'));
        sprites[this.bar] = loadImage(this.imageFilename('bar.png'));
        sprites[this.decoratedtree] = loadImage(this.imageFilename('decoratedtree.png'));
        sprites[this.park] = loadImage(this.imageFilename('park.png'));
        sprites[this.snowperson] = loadImage(this.imageFilename('snowperson.png'));
        this.monuments = [this.church,this.hospital,this.bar,this.decoratedtree,this.park,this.snowperson]

        // Roads
        // To simplify checks later, make road tiles -ve
        this.leftroad = -1;
        this.uproad = -2;
        this.crossroad = -3;
        sprites[this.leftroad] = loadImage(this.imageFilename('road_leftright.png'));
        sprites[this.uproad] = loadImage(this.imageFilename('road_updown.png'));
        sprites[this.crossroad] = loadImage(this.imageFilename('road_cross.png'));

        // Mobs
        this.mobs = [2000,2001,2002,2003,2004];
        sprites[2000] = loadImage(this.imageFilename('mob1.png'));
        sprites[2001] = loadImage(this.imageFilename('mob2.png'));
        sprites[2002] = loadImage(this.imageFilename('mob3.png'));
        sprites[2003] = loadImage(this.imageFilename('mob4.png'));
        sprites[2004] = loadImage(this.imageFilename('mob5.png'));

        // Alien robot
        this.alien = 3000;
        this.teleport = 3001;
        this.present = 3002;
        sprites[this.alien] = loadImage(this.imageFilename('alienrobot.png'));
        sprites[this.teleport] = loadImage(this.imageFilename('teleport.png'));
        sprites[this.present] = loadImage(this.imageFilename('present.png'));

        this.sprites = sprites;
    }

    assetFilename(filename) {
        return "./assets/day12/"+filename;
    }

    imageFilename(filename) {
        return "./assets/day12/images/"+filename;
    }

    sprite(spriteID) {
        return this.sprites[spriteID];
    }

    playmusic() {
        if (this.musicOn) this.music.play();
    }

    stopmusic() {
        this.music.pause();
        // this.music.fastSeek(0);
        this.music.currentTime = 0;
    }
}