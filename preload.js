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

    // day7
    assets.day7Font = loadFont("./assets/day7/Austie.ttf");
    assets.day7myTexture = loadImage("./assets/day7/paper.png");
    assets.day7santaStamp = loadImage("./assets/day7/stamp2.png");
    assets.day7stamp = loadImage("./assets/day7/ministamp.png");
    assets.day7satanStamp = loadImage("./assets/day7/satanstamp.png");


    // day9
    assets.day9Model = loadJSON("./assets/day9/model.json");
    assets.day9Carols = loadStrings("./assets/day9/carols.txt");


    // day24
    assets.day0GrammarSource = loadJSON("./assets/day0/grammar-source.json");
    assets.day0Font = loadFont("./assets/day0/Pangolin-Regular.ttf");

    // day25
    assets.day0SnowmanFace = loadImage("./assets/day0/snowman-face.png");
}
