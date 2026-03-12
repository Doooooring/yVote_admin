import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      text: string;
      yvote01: string;
      yvote02: string;
      yvote03: string;
      yvote04: string;
      yvote05: string;
      yvote06: string;
      yvote07: string;
      yvote08: string;
      yvote09: string;
      gray100: string;
      gray200: string;
      gray300: string;
      gray400: string;
      gray500: string;
      gray600: string;
      gray700: string;
      gray800: string;
      gray900: string;
      fallback: string;
      hovergray: string;
    };
    fonts: {
      body: string;
      heading: string;
    };
    fontSizes: {
      small: string;
      medium: string;
      large: string;
    };
    spacing: {
      small: string;
      medium: string;
      large: string;
    };
  }
}
