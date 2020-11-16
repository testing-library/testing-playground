## Contributing with a new feature

If you are thinking about adding a new feature to [Testing Playground](https://testing-playground.com/) and wondering where to start, you are in the right place.

First, make sure that doesn't exist yet as [feature request](https://github.com/testing-library/testing-playground/issues?q=is%3Aissue+is%3Aopen+label%3Afeature). If it doesn't, go ahead and [create it](https://github.com/testing-library/testing-playground/issues/new?labels=feature&template=2.feature.md).

We will advise you to first gather some feedback from the community and then proceed with coding.

The project is divided on two applications:

- [The website](https://testing-playground.com/) (in `src/`)
- [The Extension](https://chrome.google.com/webstore/detail/testing-playground/hejbmebodbijjdhflfknehhcgaklhano?hl=en) (in `devtools/`)

Have a look at the code to get the big picture, and follow the patterns we are currently using (naming conventions, folder structure...etc.).

This is how our component hierarchy looks like right now:

![Component hierarchy](https://user-images.githubusercontent.com/1196524/85944695-17b16e80-b939-11ea-922b-ab00245a364a.png)

## You should also know...

- We use [Taildwind](https://tailwindcss.com/) for CSS.
- We use [ReachUI](https://reach.tech/) for interactive UI elements
- We use [Octicons](https://primer.style/octicons/) icons
- We use [undraw](https://undraw.co/illustrations) for illustrations
  - With color `#EDF2F7` and `.5` opacity.
