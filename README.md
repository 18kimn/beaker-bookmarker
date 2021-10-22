# beaker-bookmarker

[Beaker](https://beakerbrowser.com/) is amazing. Good politics, feels smooth,
and completely brings that magical feel of
user-edited-live-updating-immediately-sharing interface that we kinda need.
However bookmarks support is a little funky :')

- [You aren't able to import bookmarks](https://github.com/beakerbrowser/beaker/issues/691)
  from Chrome or Firefox, which is a pain if you have a lot of bookmarks
- You aren't able to organize bookmarks into folders or even tags
  [as suggested here](https://github.com/beakerbrowser/beaker/issues/691#issuecomment-338975184).

But to be honest, this Beaker problem seems to have a perfect Beaker solution: a
personalized, self-hosted web app that is (or at least should be) easy to
install and super modifiable/extednable. In other words, to address this and get
myself started with Beaker and
[Beaker Homebase](https://github.com/beakerbrowser/homebase) I decided to make a
tiny app that can import the HTML bookmarks export from Chrome/Moz, and act as a
sort of personal bookmarks manager.

The idea is that you can have a personal hyperdrive that you can bookmark, but
all of your 1000+ bookmarks don't have to be kept as bookmarks in Beaker's
interface. They're instead kept on your local computer, organized internally as
a JSON object by Beaker.

Feel free to copy, clone, edit, extend, etc. This project is licensed under the
Hippocratic-2.1 license because I like the license and I think it should be used
more, but I don't know if the restrictions it poses are really applicable for
this tiny project. In other words you can probably just do whatever you want
with this :)

### dev notes

Frontend/UI:

- scaffolded by Vite, built in Vue
