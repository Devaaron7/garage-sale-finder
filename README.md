# Garage Sale Finder

A React application that helps users find garage sales in their area by aggregating listings from multiple sources.

## Note
Due to the lack of public apis with garage sale data - this app uses mock data with the foucs being to demonstrate frontend, backend, test creation, and creativity of the developer's skill

## Features

- Search for garage sales by zip code
- Filter results by date and distance
- View detailed information about each sale
- Responsive design that works on mobile and desktop
- Easy to add new data sources

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/garage-sale-finder.git
   cd garage-sale-finder
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Available Scripts

In the project directory, you can run:

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## Project Structure

```
src/
  components/     # Reusable UI components
  services/       # API and data services
  types/          # TypeScript type definitions
  utils/          # Utility functions
  App.tsx         # Main application component
  index.tsx       # Application entry point
  App.css         # Global styles
```

## Adding New Data Sources

1. Create a new service file in `src/services/` (e.g., `newSourceService.ts`)
2. Implement the necessary API calls to fetch data from the source
3. Transform the data to match the `GarageSale` interface
4. Update the `dataSourceManager.ts` to include the new source

## Built With

- [React](https://reactjs.org/) - JavaScript library for building user interfaces
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Styled Components](https://styled-components.com/) - CSS-in-JS styling
- [React Icons](https://react-icons.github.io/react-icons/) - Popular icons for React

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to all the garage sale listing platforms that make this possible
- Inspired by the need to find great deals in the local community

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
