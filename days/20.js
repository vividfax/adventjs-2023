// Made by Struan Fraser

class Day20 extends Day {
    constructor() {
      super();
      this.loop = true; // Set to true or false
      this.controls = ''; // Write any controls for interactivity if needed or leave blank
      this.credits = 'Made by Struan Fraser'; // Replace with your name
      // Define variables here. Runs once during the sketch holder setup
      this.eventsJSON = {
        events: [
          {
            from: 'Wilfred, your personal assistant',
            origin:
              'Good morning Santa, the elves have heard that the #alt# at Amazon are striking, the elves are going to take industrial action!',
            a: "Go full Jeff Bezos, blast yourself into space and tell the elves they're working so Santa can go to Mars",
            b: 'Shut down the machinery, free the elves and cancel Christmas',
            aResponseTitle: "I'm having second thoughts",
            aResponseBody:
              'As you shoot up into the sky in your rocket powered folly, you see armed resistance below preparing for your landing. It might be better to stay on Mars.',
            bResponseTitle: 'This Christmas will be a tough one',
            bResponseBody:
              'The illusion of Santa is broken, you can feel yourself weakening by the minute. But the grotto has never been free-er. A new wave of magic is infusing across the planet, but Santa had to give one last gift.',
            emoji: '🧝‍♀️🧝‍♂️',
            alt: [
              'elves',
              'reindeer',
              'wolves',
              'labourers',
              'geniuses',
              'quacks',
              'engineers',
            ],
          },
          {
            from: 'Mrs Claus',
            origin:
              'Santa, you’ve got to take your boots off before you come in the house. The rug is soaking wet!!! I love you, you big dolt but I wish you’d take more care with the #alt#.',
            a: 'Take your shoes off and put a wee note at the door to remind yourself to be a good santa',
            b: 'Ask the elves to invent some mega-water-repellant-3000 boots',
            aResponseTitle: 'Good Santa',
            aResponseBody:
              "You shouldn't really have been doing that in the first place now Santa, should you?",
            bResponseTitle: 'Grow up',
            bResponseBody:
              "Santa, is it that hard to take your boots off that you're going to try and invent a new technology that will probably not work to avoid taking your boots off when you get in? Come on now.",
            emoji: '👵',
            alt: [
              'carpet',
              'floors',
              'state of your stinky feet',
              'fine silks and linens that adorn the Grotto',
              'clothes that are painstakingly made for you by your staff',
              'spirit of Christmas',
            ],
          },
          {
            from: 'Odin',
            origin:
              "Now Santa, you're an influential rider these days so please don't take this the wrong way but have you been trying to get Sleipnir and Rudolph to interbreed creating an eight-legged breed of #alt# reindeer-horses? Because I'd really rather you didn't.",
            a: 'Change the subject: A happy yuletide to you Odin old friend, how does the hunt go?',
            b: "Yes Odin, I didn't mean anything by it, I just thought it would be cool",
            aResponseTitle:
              'Odin furrows his brow and looks at you with great suspicion',
            aResponseBody:
              "You won't get one round me that easily Santa. I have it on good authority that you're building an army, Asgard will not stand for this!",
            bResponseTitle: 'Odin slowly reveals a wry smile',
            bResponseBody: 'Yes, that would be cool.',
            emoji: '🐎',
            alt: [
              'monstrous',
              'giant',
              'exotic',
              'frankenstein-ish',
              'care-free',
              'violent',
              'liberating',
              'terrifying',
              'glorious',
              'meek',
              'stolid',
            ],
          },
          {
            from: 'Head Elf',
            origin:
              'Our tools are falling to pieces! Please Santa, why are we still working with tools from the 40s? Do you know how hard it is to solder a Playstation when all you have is #alt#',
            a: 'Christmas is about tradition, make gifts that are more personal',
            b: "If we're going to scale Christmas, we need modern tools, invest in a new workshop",
            aResponseTitle: 'A renewed warmth returns to Christmas',
            aResponseBody:
              'The elves read their letters more closely and try and see what the children are really asking for',
            bResponseTitle: "This year's codblops has really sharp, hi-def guns",
            bResponseBody:
              "Everyone's thrilled about the new gifts but somehow Christmas feels denigrated and hollow",
            emoji: '🔨',
            alt: [
              'a chisel, a saw and some matches',
              'a toothpick, some dental floss and a head-torch',
              'sixteen screws, an old swiss-army knife and some scotch tape',
              'a baloon full of plaster, a confused clown and a plunger',
              'safety scissors, sticky-back plastic and a bell',
              'a rusty knife, some coloured card and wood for the stove',
            ],
          },
          {
            from: 'A young environmentalist',
            origin:
              "Santa, I love all you've done for me but times are changing, Christmas puts so much pressure on the planet's #alt# and we need to re-evaluate what's important at a time that's really about family. Can you help us figure this out?",
            a: 'Spit on the floor and call the mega-elves',
            b: "You're right, it's time to re-design Christmas",
            aResponseTitle:
              "We won't tolerate anti-Christmas talk in this house!!!",
            aResponseBody:
              "Christmas must continue no matter what. It's the only time we can make sure children live in joy and happiness. The anxiety for the rest of the year is not our responsibility.",
            bResponseTitle: 'Invite the activists in',
            bResponseBody:
              "Santa and the young environmentalists work together to develop a way of bringing cheer to different places at different times to help ease strain on the planet's resources. A new wave of care, tradition and a legacy of hope spreads throughout the planet.",
            emoji: '🌏',
            alt: [
              'supply chains',
              'resources',
              'environment',
              'ecosystems',
              'endangered species',
              'atmosphere',
              'people',
              'oceans',
            ],
          },
          {
            from: 'Krampus',
            origin:
              "I'm sick of your do-gooder attitude Santa, making out like I'm the bad one. You're just as much a part of disciplining children as I am yet I take all of the #alt#! We're two sides of the same coin and I'm here to change that, this year the bad children get gifts too, I'm sick of giving birch sticks!",
            a: 'We have to get ahead of this, call the spin-doctor elf',
            b: 'Talk with Krampus, maybe they can be reasoned with',
            aResponseTitle: 'An attempt at rebranding',
            aResponseBody:
              "We tried to make 'Playstations for bad children' but it didn't really fly and just made the bad children cooler and more gallus. Ah well, maybe we can fix it next year.",
            bResponseTitle: 'Krampus is struggling',
            bResponseBody:
              "Krampus looks sad and says 'I just think this whole good kid, bad kid paradigm is a really toxic thing to teach children. Can't we figure out something that doesn't tell children there's something wrong with them?",
            emoji: '🐐',
            alt: [
              'flack',
              'blame',
              'pelters',
              'anger',
              'ire',
              'fury',
              'fire',
              'attacks',
            ],
          },
          {
            from: 'Big Cola',
            origin:
              'Look Santa, for some reason we love lorries and we need you to be on the lorries or otherwise it makes everyone sad. What are your rates for #alt# lorry faces? Is this something you can quote us for?',
            a: "It's big Cola, build a new Christmas empire on the rights to your face on lorries",
            b: 'Start again, this is ludicrous',
            aResponseTitle: "Santa's rich!!!",
            aResponseBody:
              "We'll never run out of money at this rate. Turn up the heating, it's freezing living on these ice-caps!",
            bResponseTitle: 'Why am I on a lorry?',
            bResponseBody:
              "Are they trying to hide something in that lorry? What's even in there? Are they being honest about the big santa face lorries? I'm not sure about any of this.",
            emoji: '🧉',
            alt: [
              'big',
              'strange',
              'gaudy',
              "mingin'",
              'ornate',
              'rosy',
              'terrifying',
              'one of those drunk',
            ],
          },
        ],
      };
      this.currentEvent;
      this.choice;
      this.eventsLeft = this.eventsJSON.events;
      this.askQuestion = true;
      this.buttonHeight = 75;
      this.modalWidth = 408;
      this.intro;
    }

    prerun() {
      // Initialise/reset variables here. Runs once, every time your day is viewed
      // this.eventsJSON = loadJSON('../assets/dayX/events.json');
      this.currentEvent = random(this.eventsLeft);
      this.intro = setupGrammar(this.currentEvent);
      this.intro = getText(this.intro);
    }

    update() {
      // Update and draw stuff here. Runs continuously (or only once if this.loop = false), while your day is being viewed
      background('#F4DDDD'); // You can delete this line if you want
      push();
      rectMode(CENTER);
      fill('#FFC1C1');
      rect(width / 2, height / 2, 428, 670, 34);
      pop();
      if (this.askQuestion == true) {
        this.showDilemma();
        this.showOptions(this.currentEvent.a, this.currentEvent.b);
      } else {
        this.showResponse(this.currentEvent);
      }
    }
    useEvent() {
      var filteredEvents = this.eventsLeft;
      var currentEvent = this.currentEvent;
      if (filteredEvents.length > 1) {
        this.eventsLeft = filteredEvents.filter((event) => event != currentEvent);
        this.currentEvent = random(this.eventsLeft);
      } else {
        this.eventsLeft = this.eventsJSON.events;
      }
      this.intro = setupGrammar(this.currentEvent);
      this.intro = getText(this.intro);
    }

    showResponse(event) {
      var responseTitle;
      var responseBody;
      if (this.choice == 0) {
        responseTitle = event.aResponseTitle;
        responseBody = event.aResponseBody;
      } else {
        responseTitle = event.bResponseTitle;
        responseBody = event.bResponseBody;
      }
      translate(146, 150);
      noStroke();
      fill('#FAFAFA');
      rect(0, 0, 408, 375, 10);
      textSize(100);
      fill('black');
      textAlign(CENTER);
      text(this.currentEvent.emoji, 0, -70, 400);
      push();
      translate(10, 40);
      textAlign('center');
      textSize(20);
      fill('black');
      textStyle(BOLD);
      textFont('Comic Sans MS');
      text(responseTitle, 20, 10, 340);
      textStyle(NORMAL);
      textLeading(25);
      textFont('Times New Roman');
      textSize(18);
      text(responseBody, 20, 80, 340);
      pop();
      fill('white');
      translate(0, 400);
      rect(0, 0, 408, this.buttonHeight, 10);
      textStyle(BOLD);
      textAlign('center');
      fill('black');
      textSize(14);
      text('What else is going on in the Grotto?', 20, 30, 370);
    }
    showOptions(optionA, optionB) {
      translate(0, 300);
      noStroke();
      fill('#FAFAFA');
      rect(0, 0, this.modalWidth, this.buttonHeight, 10);
      textStyle(BOLD);
      textAlign('center');
      textSize(14);
      fill('black');
      text(optionA, 20, 20, 370);
      translate(0, 80);
      noStroke();
      fill('#FAFAFA');
      rect(0, 0, this.modalWidth, this.buttonHeight, 10);
      textStyle(BOLD);
      textAlign('center');
      fill('black');
      text(optionB, 20, 20, 370);
    }

    showDilemma() {
      translate(146, 150);
      push();
      noStroke();
      fill('#FAFAFA');
      rect(0, 0, 408, 320, 10);
      pop();
      textSize(100);
      textAlign(CENTER);
      text(this.currentEvent.emoji, 0, -70, 400);
      translate(0, 40);
      push();
      textAlign('center');
      textSize(20);
      fill('black');
      textStyle(BOLD);
      textFont('Comic Sans MS');
      text('From: ' + this.currentEvent.from, 20, 10, 370);
      pop();
      push();
      textStyle(NORMAL);
      textLeading(25);
      textFont('Times New Roman');
      textSize(18);
      textAlign(CENTER);
      text(this.intro, 25, 80, 350);
      pop();
    }
    // Below are optional functions for interactivity. They can be deleted from this file if you want

    mousePressed() {
      if (
        mouseX > 146 &&
        mouseX < 146 + this.modalWidth &&
        mouseY > 490 &&
        mouseY < 490 + this.buttonHeight && //565
        this.askQuestion == true
      ) {
        this.choice = 0;
        this.askQuestion = false;
      } else if (
        mouseX > 146 &&
        mouseX < 146 + this.modalWidth &&
        mouseY > 570 &&
        mouseY < 570 + this.buttonHeight &&
        this.askQuestion == true
      ) {
        this.choice = 1;
        this.askQuestion = false;
      } else if (
        mouseX > 146 &&
        mouseX < 146 + this.modalWidth &&
        mouseY > 540 &&
        mouseY < 540 + this.buttonHeight &&
        this.askQuestion == false
      ) {
        this.useEvent();
        this.askQuestion = true;
      }
    }
  }
