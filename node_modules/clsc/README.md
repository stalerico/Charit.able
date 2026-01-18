# clsc : Classed-Components (for React)

React Helper library for class based css frameworks like tailwindcss. Highly inspired by styled-components.

## Installation

```bash
# npm
npm install clsc
# yarn
yarn add clsc
```

## Configuration

You can include or/and exclude html tags to use by adding the property accordingly in a js file which should be named as `clsc.config.js` and placed in the root of your project.

Configuration Interface
```ts
interface Config {
  // HTML tags to include. If defined, exclude property will be ignored
  include?: string[];
  // HTML tags to exclude.
  exclude?: string[];
}
```

## Usage

Like `styled` in styled-components, template tag is attached after `classed` and HTML tag (or custom function/functional component).

One thing to note is that unlike styled-components, it does not support "interpolations". But it does support "adapting based on props", and you can use it by passing a function that takes props as argument, and returns class names as a result.

Example :
```tsx
// 'image.tsx'
import React from "react";

export interface ImageProps {
  src: string;
  alt?: string;
  className?: string;
}

const Image: React.FC<ImageProps> = ({ src, alt, className }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={clsx([
        "flex justify-center align-center rounded shadow-md",
        className,
      ])}
    />
  );
};

export default Image;

// 'app.tsx'
import React from "react";
import clsx from "clsx";
import classed, { tw } from "clsc";
import Image, { ImageProps } from "./image";

// Function style component declaration
const Wrapper = classed.div("h-full flex flex-col");
// Template tag style component declaration (Recommended)
const Title = classed.div`text-gray-500 text-center text-xs py-2 border-b`;
const CarList = classed.div`flex flex-col flex-1 overflow-scroll`;
const CarCaption = classed.span`text-gray-500 text-xs py-2 text-center`;
// tw stands for "TailWindcss". The function just returns what you pass into template tag.
// The function is specific to Tailwindcss, and the purpose of it is to use tailwindcss intellisense VScode extension.
const carItemStyle = tw`border-2 flex p-3 m-2 items-center`;
// Conditionally classed component example
const CarItem = classed.div<{ selected?: boolean }>(({ selected }) =>
  clsx([
    carItemStyle,
    selected ? tw`border-black` : tw`border-white`,
  ])
);
// Custom classed component example
const CarImage = classed<ImageProps>(Image)`h-14`;

const App: React.FC = () => (
  <Wrapper>
    <Title>Choose a ride, or swipe up for more</Title>
    <CarList>
      <CarItem selected={true}>
        <CarImage src="https://via.placeholder.com/100" />
        <CarCaption>Car 1</CarCaption>
      </CarItem>
      <CarItem>
        <CarImage src="https://via.placeholder.com/100" />
        <CarCaption>Car 2</CarCaption>
      </CarItem>
    </CarList>
  </Wrapper>
);

export default App;
```

The rendered component tree looks like this:
```tsx
<div className="h-full flex flex-col">
  <div className="text-gray-500 text-center text-xs py-2 border-b">
    Choose a ride, or swipe up for more
  </div>
  <div className="flex flex-col flex-1 overflow-scroll">
    <div className="border-2 flex p-3 m-2 items-center border-black" selected={true}>
      <img
        className="flex justify-center align-center rounded shadow-md h-14"
        src="https://via.placeholder.com/100"
      />
      <span className="text-gray-500 text-xs py-2 text-center">
        Car 1
      </span>
    </div>
    <div className="border-2 flex p-3 m-2 items-center border-white">
      <img
        className="flex justify-center align-center rounded shadow-md h-14"
        src="https://via.placeholder.com/100"
      />
      <span className="text-gray-500 text-xs py-2 text-center">
        Car 2
      </span>
    </div>
  </div>
</div>
```

## TailwindCSS Intellisense Tip

To use TailwindCSS intellisense VScode extension, add the following to your vscode settings (`.vscode/settings.json`):

```json
{
  /* Your settings */
  /* ... */
  "tailwindCSS.experimental.classRegex": [
    "(?:tw|classed\\.[a-z]{1,15})\\(*[`'\"](.*[`'\"])\\)*"
  ]
}
```

The regex above matches the following code and fires tailwindcss intellisense extension in vscode.

```ts
classed.div("h-full flex flex-col")
classed.span`text-gray-500 text-xs py-2 text-center`
tw`border-2 flex p-3 m-2 items-center`
```
