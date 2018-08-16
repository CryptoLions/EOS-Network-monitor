import { injectGlobal } from 'styled-components';
import color from './colors';
import CustomWoff from '../fonts/Custom.woff';
import CustomWoff2 from '../fonts/Custom.woff2';
import CustomSvg from '../fonts/Custom.svg';

/* eslint no-unused-expressions: 0 */
injectGlobal`
  [data-icons8]:before { content: attr(data-icons8); }

  .icons8, [data-icons8]:before,
  .icons8-info:before,
  .icons8-ok:before,
  .icons8-received:before {
    display: inline-block;
    font-family: "HintSystemIcons";
    font-style: normal;
    font-weight: normal;
    font-variant: normal;
    line-height: 1;
    text-decoration: inherit;
    text-rendering: optimizeLegibility;
    text-transform: none;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    font-smoothing: antialiased;
  }

  .icons8-info:before { content: "\\f101"; }
  .icons8-ok:before { content: "\\f102"; }
  .icons8-received:before { content: "\\f100"; }

@font-face {
  font-family: "HintSystem";
  src: url(${CustomWoff2}) format("woff2"),
       url(${CustomWoff}) format("woff"),
       url(${CustomSvg}) format("svg");
  font-weight: normal;
  font-style: normal;
}

@media screen and (-webkit-min-device-pixel-ratio:0) {
  @font-face {
    font-family: "HintSystem";
    src: url(${CustomSvg}) format("svg");
  }
}

[data-icons8]:before { content: attr(data-icons8); }

.icons8, [data-icons8]:before,
.icons8-account-settings-variant:before,
.icons8-arrow-pointing-down:before,
.icons8-caret-arrowhead-facing-down:before,
.icons8-check-circle-outline:before,
.icons8-circled-chevron-right:before,
.icons8-circled-question-mark:before,
.icons8-circled-question-mark-2:before,
.icons8-circled-question-mark-3:before,
.icons8-close-button:before,
.icons8-close-button-2:before,
.icons8-close-circle-outline:before,
.icons8-code:before,
.icons8-drag:before,
.icons8-drop-down-arrow:before,
.icons8-exit:before,
.icons8-gear-outline:before,
.icons8-icons8-copy-snippet:before,
.icons8-imac:before,
.icons8-info:before,
.icons8-info-2:before,
.icons8-info-3:before,
.icons8-info-4:before,
.icons8-info-5:before,
.icons8-info-squared:before,
.icons8-info-squared-2:before,
.icons8-laptop-outline:before,
.icons8-left:before,
.icons8-long-arrow-up:before,
.icons8-money:before,
.icons8-note:before,
.icons8-ok:before,
.icons8-overview:before,
.icons8-page:before,
.icons8-plus:before,
.icons8-received:before,
.icons8-resize-corners:before,
.icons8-rounded-arrow:before,
.icons8-settings:before,
.icons8-sheets-of-paper-with-a-question-mark:before,
.icons8-smart-phone-outline:before,
.icons8-tablet-ipad:before,
.icons8-team:before,
.icons8-thumbs-down:before,
.icons8-thumbs-up-hand:before,
.icons8-tooltip-edit:before,
.icons8-trash:before,
.icons8-view:before,
.icons8-wrench-outline:before {
  display: inline-block;
  font-family: "HintSystem";
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  line-height: 1;
  text-decoration: inherit;
  text-rendering: optimizeLegibility;
  text-transform: none;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  font-smoothing: antialiased;
}

.icons8-account-settings-variant:before { content: "\f109"; }
.icons8-arrow-pointing-down:before { content: "\f11f"; }
.icons8-caret-arrowhead-facing-down:before { content: "\f10c"; }
.icons8-check-circle-outline:before { content: "\f13d"; }
.icons8-circled-chevron-right:before { content: "\f126"; }
.icons8-circled-question-mark:before { content: "\f112"; }
.icons8-circled-question-mark-2:before { content: "\f113"; }
.icons8-circled-question-mark-3:before { content: "\f114"; }
.icons8-close-button:before { content: "\f111"; }
.icons8-close-button-2:before { content: "\f128"; }
.icons8-close-circle-outline:before { content: "\f13e"; }
.icons8-code:before { content: "\f123"; }
.icons8-drag:before { content: "\f134"; }
.icons8-drop-down-arrow:before { content: "\f122"; }
.icons8-exit:before { content: "\f132"; }
.icons8-gear-outline:before { content: "\f107"; }
.icons8-icons8-copy-snippet:before { content: "\f120"; }
.icons8-imac:before { content: "\f12a"; }
.icons8-info:before { content: "\f101"; }
.icons8-info-2:before { content: "\f116"; }
.icons8-info-3:before { content: "\f117"; }
.icons8-info-4:before { content: "\f118"; }
.icons8-info-5:before { content: "\f119"; }
.icons8-info-squared:before { content: "\f115"; }
.icons8-info-squared-2:before { content: "\f11c"; }
.icons8-laptop-outline:before { content: "\f12b"; }
.icons8-left:before { content: "\f127"; }
.icons8-long-arrow-up:before { content: "\f11e"; }
.icons8-money:before { content: "\f12f"; }
.icons8-note:before { content: "\f137"; }
.icons8-ok:before { content: "\f102"; }
.icons8-overview:before { content: "\f130"; }
.icons8-page:before { content: "\f131"; }
.icons8-plus:before { content: "\f10e"; }
.icons8-received:before { content: "\f100"; }
.icons8-resize-corners:before { content: "\f106"; }
.icons8-rounded-arrow:before { content: "\f125"; }
.icons8-settings:before { content: "\f10a"; }
.icons8-sheets-of-paper-with-a-question-mark:before { content: "\f13b"; }
.icons8-smart-phone-outline:before { content: "\f12c"; }
.icons8-tablet-ipad:before { content: "\f139"; }
.icons8-team:before { content: "\f12e"; }
.icons8-thumbs-down:before { content: "\f11a"; }
.icons8-thumbs-up-hand:before { content: "\f11b"; }
.icons8-tooltip-edit:before { content: "\f104"; }
.icons8-trash:before { content: "\f110"; }
.icons8-view:before { content: "\f10f"; }
.icons8-wrench-outline:before { content: "\f108"; }

  html,
  body {
    height: 100%;
    width: 100%;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  }

  #app {
    background-color: #fafafa;
    min-height: 100%;
    min-width: 100%;
  }

  p,
  label {
    line-height: 1.5em;
  }

  button {
    cursor: pointer;
    border: none;
  }

  ::placeholder {
    color: ${color.secondarySilver};
    font-size: 1.125rem;
    font-weight: normal;
  }

  .react-datepicker-wrapper,
  .react-datepicker__input-container {
    display: block !important;
  }
`;
