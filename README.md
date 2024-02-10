# Coverboard

_Coverboard is a frontend canvas app where you can create a board to rate and relate your favorite media to each other._
_Try_ https://condward.github.io/coverboard/

# Technologies

- Vite (bundler)
- React Konva
- Typescript
- State management: Zustand + persistence using LocalStorage
- UI: MUI
- Schemas: ZOD

## Features

- Tablet support and keyboard accessibility
- Fetch album covers, book covers, movie posters, tv show poster or game posters and place them on a board
- Rate with star system from 0 to 5, in steps of 0.5
- Everything is draggable and you can connect the covers by arrows by clicking on the direction points when clicking on a cover
- Drag and drop and edit the texts to 4 different positions around the cover
- You can use resizable groups to join multiple covers together and also connect them using arrows
- You can configure the themes, like colors, resize, text positions in a menu
- You can create multiple pages by URL or via share popup and download the JSON code to be used later
- You can undo up to 10 actions

## Backend

- The app uses a small backend to protect the private API keys and redirect to the respective APIs
- The backend also uses CORS and rate limiting
