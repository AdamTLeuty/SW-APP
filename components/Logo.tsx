import { Pressable, Image } from "react-native";

import { Svg, Path } from "react-native-svg";

export function LogoTitle(props: { locked: boolean }) {
  if (props.locked) {
    return (
      <Svg width="48" height="63" viewBox="0 0 48 63" fill="none">
        <Path
          d="M31.787 62.6454C29.1918 62.6454 26.5434 61.5039 24.2257 59.3263C23.9676 59.085 23.5651 59.085 23.3078 59.3263C20.1557 62.2868 16.3911 63.3313 12.9825 62.1957C7.21077 60.2712 3.11627 52.6239 0.814651 39.4646C-0.717515 30.7104 0.347239 24.969 4.06797 21.9122C7.55247 19.0504 12.9412 18.9981 20.0882 21.7587C22.4599 22.6741 25.0737 22.6741 27.4462 21.7587C34.5923 18.9981 39.9827 19.0504 43.4664 21.9122C47.1871 24.969 48.251 30.7104 46.7197 39.4646C44.4173 52.6239 40.3236 60.2712 34.551 62.1957C33.6482 62.4969 32.721 62.6445 31.787 62.6445V62.6454ZM10.864 23.9616C9.27531 23.9616 7.83173 24.3033 6.75686 25.1866C4.38858 27.1322 3.77689 31.8165 4.98761 38.7348C7.62756 53.8228 11.9693 57.3925 14.3223 58.1771C16.9058 59.0386 19.2437 57.3317 20.4071 56.2383C22.2911 54.4699 25.2424 54.4691 27.1255 56.2383C28.2899 57.3317 30.6303 59.0377 33.2103 58.1771C35.5634 57.3925 39.9051 53.8236 42.5451 38.7348C43.7558 31.8165 43.1433 27.1322 40.7758 25.1866C38.0152 22.9179 32.8324 24.2206 28.9716 25.7114C25.6145 27.0082 21.9174 27.0082 18.5611 25.7114C16.2038 24.8011 13.3546 23.9616 10.864 23.9616Z"
          fill="#5700FF"
        />
        <Path
          d="M19.2934 45.8768L14.4843 41.0677C13.8262 40.4088 13.5925 39.3862 14.027 38.5628C14.7383 37.2171 16.4426 37.0348 17.4229 38.016L19.8461 40.4392C20.57 41.1631 21.7436 41.1631 22.4675 40.4392L30.0135 32.8922C30.8319 32.0738 32.1844 31.9464 33.0382 32.7286C33.9342 33.5495 33.957 34.9407 33.1074 35.7904L23.0209 45.8777C21.9916 46.907 20.3219 46.907 19.2926 45.8777L19.2934 45.8768Z"
          fill="#5700FF"
        />
        <Path
          d="M13.3884 21.5963V12.7863C13.3884 6.82891 18.2367 2 24.218 2C30.1992 2 35.0475 6.82891 35.0475 12.7863V21.5963"
          stroke="#5700FF"
          strokeWidth={3.5}
          strokeMiterlimit={10}
        />
      </Svg>
    );
  } else {
    return (
      <Svg width="48" height="71" viewBox="0 0 48 71" fill="none">
        <Path
          d="M32.3518 70.7551C29.7553 70.7551 27.1057 69.6117 24.7869 67.4307C24.5286 67.189 24.1259 67.189 23.8685 67.4307C20.7149 70.396 16.9485 71.4421 13.5383 70.3047C7.76373 68.3771 3.66727 60.7176 1.36454 47.5372C-0.168366 38.769 0.8969 33.0184 4.61942 29.9567C8.10559 27.0903 13.4969 27.0379 20.6474 29.8029C23.0202 30.7198 25.6352 30.7198 28.0089 29.8029C35.1585 27.0379 40.5515 27.0903 44.0368 29.9567C47.7593 33.0184 48.8237 38.769 47.2917 47.5372C44.9881 60.7176 40.8925 68.3771 35.1171 70.3047C34.2139 70.6064 33.2862 70.7543 32.3518 70.7543V70.7551ZM11.4187 32.0094C9.82927 32.0094 8.38499 32.3516 7.3096 33.2364C4.94018 35.1851 4.3282 39.8768 5.5395 46.8063C8.18072 61.9184 12.5245 65.4938 14.8787 66.2797C17.4634 67.1425 19.8024 65.433 20.9664 64.3378C22.8513 62.5665 25.804 62.5657 27.6881 64.3378C28.853 65.433 31.1945 67.1417 33.7758 66.2797C36.13 65.4938 40.4738 61.9192 43.115 46.8063C44.3263 39.8768 43.7135 35.1851 41.3449 33.2364C38.583 30.964 33.3976 32.2688 29.535 33.762C26.1763 35.0609 22.4774 35.0609 19.1195 33.762C16.7611 32.8502 13.9105 32.0094 11.4187 32.0094Z"
          fill="#5700FF"
        />
        <Path
          d="M19.8522 53.9597L15.0408 49.1429C14.3824 48.4829 14.1486 47.4587 14.5833 46.6339C15.2949 45.2861 17 45.1035 17.9808 46.0863L20.4051 48.5133C21.1294 49.2384 22.3035 49.2384 23.0278 48.5133L30.5775 40.9543C31.3963 40.1346 32.7494 40.007 33.6036 40.7904C34.5001 41.6126 34.5228 43.0061 33.6728 43.8571L23.5815 53.9605C22.5517 54.9915 20.8812 54.9915 19.8514 53.9605L19.8522 53.9597Z"
          fill="#5700FF"
        />
        <Path
          d="M24.1648 23.8991C30.475 23.8991 35.5904 18.9968 35.5904 12.9496C35.5904 6.90229 30.475 2 24.1648 2C17.8546 2 12.7391 6.90229 12.7391 12.9496C12.7391 18.9968 17.8546 23.8991 24.1648 23.8991Z"
          stroke="#5700FF"
          strokeWidth={3.5}
          strokeMiterlimit={10}
        />
      </Svg>
    );
  }
}
