// Made by Max Kreminski

class Day9 extends Day {
    constructor () {
      super();
      this.loop = true; // Set to true or false
      this.controls = "CLICK to blabwreck this carol / CLICK AGAIN for another";
      this.credits = "Made by Max Kreminski";
      this.label = "blabrecs carols";

      // Define variables
      assets.day9Carols = assets.day9Carols.join("\n").split("###").map(s => s.trim());
      this.carolIndex = 0;
      this.lastN = [];
      this.status = "fresh";
      this.text = assets.day9Carols[this.carolIndex];
    }

    tokenize(str) {
      const toks = [];
      let span = "";
      let alphatok = false;
      let tokstart = 0;
      for (let i = 0; i < str.length; i++) {
        const ch = str[i];
        const alphachar = /[a-zA-Z]/.test(ch);
        if (alphachar && !alphatok) {
          // wrap up nontok, start new alphatok with ch
          if (span !== "") toks.push([span, false, tokstart, i]);
          span = ch;
          alphatok = true;
          tokstart = i;
        }
        else if (!alphachar && alphatok) {
          // wrap up alphatok, start new nontok with ch
          if (span !== "") toks.push([span, true, tokstart, i]);
          span = ch;
          alphatok = false;
          tokstart = i;
        }
        else {
          span += ch;
        }
      }
      if (span !== "") {
        // wrap up any dangling tok
        toks.push([span, alphatok, tokstart, str.length]);
      }
      return toks;
    }

    prob(str) {
      str = `^${str.replace(/[^a-zA-Z]/, "").toLowerCase()}$`;
      let prb = 1;
      for (let i = 0; i < str.length - 2; i++) {
        const fst = str[i];
        const snd = str[i + 1];
        const thd = str[i + 2];
        prb *= (assets.day9Model[fst + snd] || {})[thd] || 0.00001; //0.00004096513866699439 0.00000001;
      }
      return prb;
    }

    setchr(str, pos, chr) {
      return str.substring(0, pos) + chr + str.substring(pos + 1);
    }

    matchcaps(to, from) {
      return /[A-Z]/.test(from) ? to.toUpperCase() : to.toLowerCase();
    }

    mutate(str) {
      if (!str) return edits; // skip empty lines
      const abet = "abcdefghijklmnopqrstuvwxyz";
      const vows = "aeiouy".split("");
      const constraints = [
        w => vows.some(v => w.includes(v)),
      ];
      const edits = [str]; // allow a single null edit, so we can quiesce
      for (let i = 0; i < str.length; i++) {
        for (let j = 0; j < abet.length; j++) {
          if (!/[a-zA-Z]/.test(str[i])) continue; // leave non-alpha chars alone
          if (str[i].toLowerCase() === abet[j]) continue; // prevent excess null edits
          const edit = this.setchr(str, i, this.matchcaps(abet[j], str[i]));
          if (constraints.some(c => !c(edit))) continue; // prevent disallowed edits
          edits.push(edit);
        }
      }
      return edits;
    }

    randnth(xs) {
      return xs[Math.floor(Math.random() * xs.length)];
    }

    mapcat(xs, fn) {
      var res = [];
      for (var i = 0; i < xs.length; i++) {
        var x = fn(xs[i], i);
        if (Array.isArray(x)) res.push.apply(res, x);
        else res.push(x);
      }
      return res;
    }

    wreck(passage) {
      const toks = this.tokenize(passage);
      const wordtoks = toks.filter(tok => tok[1]);
      const words = wordtoks.map(tok => tok[0]);
      const edits = this.mapcat(words, word => {
        const wordprob = this.prob(word);
        return this.mutate(word).map(edit => [word, edit, this.prob(edit) - wordprob]);
      });
      const bestedits = edits.sort((a, b) => b[2] - a[2]).slice(0, 3);
      const bestedit = this.randnth(bestedits);
      const [worstword, wreckedword, _delta] = bestedit;
      const newtexts = toks.map(tok => tok[0] === worstword ? wreckedword : tok[0]);
      const newpassage = newtexts.join("");
      return newpassage;
    }

    prerun() {
      // Initialise/reset variables here. Runs once, every time your day is viewed
    }

    update() {
        // Wreck text further
        if (frameCount % 10 === 0) {
            if (this.status === "wrecking") {
                this.text = this.wreck(this.text);
                if (this.lastN.includes(this.text)) {
                    this.status = "quiescent";
                }
                this.lastN = [this.text, this.lastN[0], this.lastN[1]];
            }
        }

        // Draw background and current text
      background(255);
      textSize(18);
      textFont("Georgia");
      textAlign(TOP, LEFT);
      rectMode(CORNER);
      fill(0);
      text(this.text, width*0.05, width*0.05, width*0.9);

      // Update controls line
      if (this.status === "wrecking") {
          this.controls = "blabwrecking...";
            updateInfo(days[today]);
      }
      else if (this.status === "fresh") {
          this.controls = "CLICK to blabwreck this carol";
          updateInfo(days[today]);
      }
      else if (this.status === "quiescent") {
          this.controls = "CLICK for another";
          updateInfo(days[today]);
      }
    }

    // Below are optional functions for interactivity. They can be deleted from this file if you want
    mousePressed() {
        if (this.status === "quiescent" || this.status === "wrecking") {
            this.carolIndex += 1;
            if (!assets.day9Carols[this.carolIndex]) this.carolIndex = 0;
          this.text = assets.day9Carols[this.carolIndex];
          this.status = "fresh";
        }
        else if (this.status === "fresh") {
            this.status = "wrecking";
        }
    }
    //mouseReleased() {}
    //keyPressed() {}
    //keyReleased() {}
}
