# beaker-bookmarker

[Hyperdrive link](hyper://ae6de4cd35177fdd8555e2c9e7089afd22ee9a2d2db28afedca15965eda9aed4/) (must be accessed by DAT-supporting browser)

### Intro

[Beaker](https://beakerbrowser.com/) is amazing... it completely brings that
magical feel of user-edited-live-updating-immediately-sharing interface that we
kinda need. However bookmarks support is a little funky.

- [You aren't able to import bookmarks](https://github.com/beakerbrowser/beaker/issues/691)
  from Chrome or Firefox, which is a pain if you have a lot of bookmarks
- You aren't able to organize bookmarks into folders or even tags
  [as was suggested here](https://github.com/beakerbrowser/beaker/issues/691#issuecomment-338975184).

But to be honest, this Beaker problem seems to have a perfect Beaker solution: a
personalized, self-hosted web app that is modifiable and extendable. In other
words, to address this and get myself started with Beaker and
[Beaker Homebase](https://github.com/beakerbrowser/homebase) I decided to make a
tiny app that can import the HTML bookmarks export from Chrome/Moz, and act as a
sort of personal bookmarks manager.

The idea is that you can have a personal hyperdrive that you can bookmark, but
all of your 1000+ bookmarks don't have to be kept as bookmarks in Beaker's
interface. They're instead kept on your local computer, organized internally as
a JSON object by Beaker.

### How to

To view, visit
[this link](hyper://ae6de4cd35177fdd8555e2c9e7089afd22ee9a2d2db28afedca15965eda9aed4/)
through a DAT-supporting-browser like Beaker Browser.

These currently have my (Nathan Kim's) bookmarks, but if you want to use your
own bookmarks you can:

1. Clone this repository
2. `cd` into the repository via a terminal and run `yarn` and then
   `yarn server`. This will start up a server on port 3200 of your machine that
   will allow the website to save bookmarks to your computer.

Then, visit the link in your browser. It should still show my bookmarks, but
edits should now be saved upon refresh.

Once you close `yarn server`, editing powers will be lost, since the browser
doesn't have any power to write to the local filesystem without a server set up
to do so. You can keep editing forever (almost) by daemonizing the server, e.g.
making it run whenever your computer is able to. I use
[pm2](https://pm2.keymetrics.io/) for this. You can do this by:

1. Install pm2 with `npm install --global pm2`.
2. `cd` into the beaker-bookmarker directory and run `pm2 start ./pm2-start.sh

If you know anything about servers, Node.js, or Beaker at all, this is obviously
a hacky/jank/fragile/dangerous (?) way to do things. Don't look too closely
please.
