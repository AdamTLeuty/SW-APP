import { Svg, Path, ClipPath, G, Rect, Defs } from "react-native-svg";
import { useThemeColor } from "./Themed";

export function TrayIcon(props: { iconName: string; color?: string; width?: string; height?: string }) {
  const defaultColor = useThemeColor({}, "text"); //Use the default text colour for the colour scheme

  const icon = props.iconName;
  const color = props.color ? props.color : defaultColor;

  const width = props.width ? props.width : "50";
  const height = props.height ? props.height : width;

  if (icon == "home") {
    return (
      <Svg width={width} height={height} viewBox="0 0 32 32" fill="none">
        <Path
          d="M26.6461 17.2603C26.1245 17.2603 25.7019 17.683 25.7019 18.2045V27.9064H20.4933V18.2045C20.4933 17.683 20.0706 17.2603 19.5491 17.2603H12.4513C11.9297 17.2603 11.5071 17.683 11.5071 18.2045V27.9064H6.29796V18.2045C6.29796 17.683 5.87533 17.2603 5.35375 17.2603C4.83217 17.2603 4.40955 17.683 4.40955 18.2045V28.8506C4.40955 29.372 4.83217 29.7948 5.35375 29.7948H12.4513H19.5491H26.6461C27.1677 29.7948 27.5903 29.372 27.5903 28.8506V18.2045C27.5903 17.683 27.1675 17.2603 26.6461 17.2603ZM13.3955 27.9064V19.1487H18.6049V27.9064H13.3955Z"
          fill={color}
        />
        <Path
          d="M31.7234 17.5368L16.667 2.48159C16.2983 2.11285 15.7005 2.11297 15.3316 2.48159L0.276558 17.5368C-0.0921859 17.9055 -0.0921859 18.5034 0.276558 18.872C0.645427 19.2407 1.24317 19.2407 1.61192 18.872L15.9993 4.48456L30.3881 18.8721C30.5725 19.0564 30.8142 19.1486 31.0558 19.1486C31.2974 19.1486 31.5391 19.0564 31.7235 18.872C32.0921 18.5034 32.0921 17.9055 31.7234 17.5368Z"
          fill={color}
        />
      </Svg>
    );
  } else if (props.iconName == "calendar") {
    return (
      <Svg width={width} height={height} viewBox="0 0 31 28" fill="none">
        <Path
          d="M28.2517 3.4162H26.7546V2.33645C26.7546 1.39842 25.9915 0.635254 25.0534 0.635254C24.1154 0.635254 23.3522 1.39842 23.3522 2.33645V3.4162H20.5168V2.33645C20.5168 1.39842 19.7537 0.635254 18.8156 0.635254C17.8776 0.635254 17.1144 1.39842 17.1144 2.33645V3.4162H14.2791V2.33645C14.2791 1.39842 13.5159 0.635254 12.5779 0.635254C11.6399 0.635254 10.8767 1.39842 10.8767 2.33645V3.4162H8.04137V2.33645C8.04137 1.39842 7.27821 0.635254 6.34017 0.635254C5.40213 0.635254 4.63897 1.39842 4.63897 2.33645V3.4162H3.14185C1.71945 3.4162 0.562378 4.57333 0.562378 5.99573V24.2596C0.562378 25.9588 1.94469 27.341 3.64382 27.341H5.38694C5.66882 27.341 5.89731 27.1126 5.89731 26.8306C5.89731 26.5487 5.66882 26.3203 5.38694 26.3203H3.64382C2.50756 26.3202 1.58312 25.3958 1.58312 24.2595V11.8488H24.5674C24.8492 11.8488 25.0777 11.6204 25.0777 11.3385C25.0777 11.0565 24.8492 10.8281 24.5674 10.8281H1.58312V5.99561C1.58312 5.13608 2.28232 4.43688 3.14185 4.43688H4.63891V5.61571C4.63891 5.87956 4.69927 6.12957 4.80692 6.35268C5.08206 6.92271 5.66592 7.31697 6.34011 7.31697C7.27815 7.31697 8.04131 6.55381 8.04131 5.61577V4.43694H10.8766V5.61577C10.8766 6.55381 11.6398 7.31703 12.5778 7.31703C13.5159 7.31703 14.279 6.55386 14.279 5.61583V4.43694H17.1144V5.61577C17.1144 6.55381 17.8775 7.31703 18.8156 7.31703C19.7536 7.31703 20.5168 6.55386 20.5168 5.61583V4.43694H23.3522V5.61577C23.3522 6.55381 24.1153 7.31703 25.0534 7.31703C25.9914 7.31703 26.7546 6.55386 26.7546 5.61583V4.43694H28.2516C29.1111 4.43694 29.8104 5.13614 29.8104 5.99567V10.8281H26.6087C26.3268 10.8281 26.0984 11.0566 26.0984 11.3385C26.0984 11.6205 26.3268 11.8489 26.6087 11.8489H29.8104V24.2596C29.8104 25.3958 28.8859 26.3203 27.7497 26.3203H7.42843C7.14655 26.3203 6.91805 26.5487 6.91805 26.8306C6.91805 27.1126 7.14655 27.341 7.42843 27.341H27.7497C29.4487 27.341 30.8311 25.9588 30.8311 24.2596V5.99573C30.8312 4.57333 29.674 3.4162 28.2517 3.4162ZM7.02063 5.61565C7.02063 5.99088 6.71534 6.29611 6.34017 6.29611C6.08217 6.29611 5.85729 6.1518 5.74195 5.93974C5.68957 5.84332 5.65977 5.73294 5.65977 5.61571V2.33645C5.65977 1.96123 5.965 1.656 6.34017 1.656C6.7154 1.656 7.02063 1.96129 7.02063 2.33645V5.61565ZM13.2584 5.61571C13.2584 5.99094 12.9531 6.29617 12.578 6.29617C12.2027 6.29617 11.8975 5.99088 11.8975 5.61571V2.33645C11.8975 1.96123 12.2028 1.656 12.578 1.656C12.9532 1.656 13.2584 1.96129 13.2584 2.33645V5.61571ZM19.4961 5.61571C19.4961 5.99094 19.1908 6.29617 18.8156 6.29617C18.4404 6.29617 18.1352 5.99088 18.1352 5.61571V2.33645C18.1352 1.96123 18.4405 1.656 18.8156 1.656C19.1909 1.656 19.4961 1.96129 19.4961 2.33645V5.61571ZM25.7338 5.61571C25.7338 5.99094 25.4285 6.29617 25.0534 6.29617C24.6781 6.29617 24.3729 5.99088 24.3729 5.61571V2.33645C24.3729 1.96123 24.6782 1.656 25.0534 1.656C25.4286 1.656 25.7338 1.96129 25.7338 2.33645V5.61571Z"
          fill={color}
          stroke={color}
          stroke-width="0.25"
        />
      </Svg>
    );
  } else if (props.iconName == "photo") {
    return (
      <Svg width={width} height={height} viewBox="0 0 35 27" fill="none">
        <Path
          d="M29.631 2.11272H12.4161C12.4161 1.05807 11.558 0.199951 10.5033 0.199951H7.95294C6.89829 0.199951 6.04017 1.05807 6.04017 2.11272H5.40258C2.94156 2.11272 0.939453 4.11491 0.939453 6.57585V21.878C0.939453 24.3389 2.94156 26.3411 5.40258 26.3411H29.631C32.092 26.3411 34.0941 24.3389 34.0941 21.878V6.57585C34.0941 4.11491 32.092 2.11272 29.631 2.11272ZM7.95294 1.47513H10.5033C10.8548 1.47513 11.1409 1.76117 11.1409 2.11272H7.31535C7.31535 1.76117 7.60139 1.47513 7.95294 1.47513ZM29.631 25.0659H5.40258C3.64475 25.0659 2.21463 23.6358 2.21463 21.878V9.76379H7.31535C7.66746 9.76379 7.95294 9.47831 7.95294 9.12621C7.95294 8.7741 7.66746 8.48862 7.31535 8.48862H2.21463V6.57585C2.21463 4.81801 3.64475 3.3879 5.40258 3.3879H29.631C31.3888 3.3879 32.8189 4.81801 32.8189 6.57585V8.48862H27.7182C27.3661 8.48862 27.0806 8.7741 27.0806 9.12621C27.0806 9.47831 27.3661 9.76379 27.7182 9.76379H32.8189V21.878C32.8189 23.6358 31.3888 25.0659 29.631 25.0659Z"
          fill={color}
        />
        <Path
          d="M17.5167 4.66309C12.2432 4.66309 7.95288 8.95343 7.95288 14.2269C7.95288 19.5004 12.2432 23.7908 17.5167 23.7908C22.7902 23.7908 27.0806 19.5004 27.0806 14.2269C27.0806 8.95343 22.7902 4.66309 17.5167 4.66309ZM17.5167 22.5156C12.9463 22.5156 9.22806 18.7973 9.22806 14.2269C9.22806 9.65653 12.9463 5.93827 17.5167 5.93827C22.0871 5.93827 25.8054 9.65653 25.8054 14.2269C25.8054 18.7973 22.0871 22.5156 17.5167 22.5156Z"
          fill={color}
        />
        <Path
          d="M17.5168 7.2135C13.6496 7.2135 10.5033 10.3598 10.5033 14.227C10.5033 18.0942 13.6496 21.2405 17.5168 21.2405C21.384 21.2405 24.5303 18.0942 24.5303 14.227C24.5303 10.3598 21.384 7.2135 17.5168 7.2135ZM17.5168 19.9653C14.3527 19.9653 11.7785 17.3911 11.7785 14.227C11.7785 11.0629 14.3527 8.48868 17.5168 8.48868C20.6809 8.48868 23.2551 11.0629 23.2551 14.227C23.2551 17.3911 20.6809 19.9653 17.5168 19.9653Z"
          fill={color}
        />
        <Path
          d="M17.5169 9.76392C17.1648 9.76392 16.8793 10.0494 16.8793 10.4015C16.8793 10.7536 17.1648 11.0391 17.5169 11.0391C19.2747 11.0391 20.7048 12.4692 20.7048 14.227C20.7048 14.5792 20.9903 14.8646 21.3424 14.8646C21.6945 14.8646 21.98 14.5792 21.98 14.227C21.98 11.7661 19.9779 9.76392 17.5169 9.76392Z"
          fill={color}
        />
        <Path
          d="M28.9935 7.85117C30.0481 7.85117 30.9062 6.99314 30.9062 5.9384C30.9062 4.88367 30.0481 4.02563 28.9935 4.02563C27.9388 4.02563 27.0807 4.88367 27.0807 5.9384C27.0807 6.99314 27.9388 7.85117 28.9935 7.85117ZM28.9935 5.30081C29.345 5.30081 29.631 5.58685 29.631 5.9384C29.631 6.28995 29.345 6.57599 28.9935 6.57599C28.6419 6.57599 28.3559 6.28995 28.3559 5.9384C28.3559 5.58685 28.6419 5.30081 28.9935 5.30081Z"
          fill={color}
        />
      </Svg>
    );
  } else if (props.iconName == "play") {
    return (
      <Svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <G clip-path="url(#clip0_168_1081)">
          <Path
            d="m10.6321 19.329l10.6321 19.329c10.6705 19.3511 10.7682 19.3933 10.8798 19.3291l10.6321 19.329zm10.6321 19.329c10.5937 19.3069 10.5083 19.2434 10.5083 19.1146v8.88551c10.5083 8.75676 10.5938 8.69321 10.6321 8.67106l10.6322 8.67105c10.6551 8.6578 10.7007 8.63681 10.7575 8.63681c10.7936 8.63681 10.8351 8.64528 10.8798 8.67103l19.7384 13.7855c19.8499 13.8499 19.8622 13.9557 19.8622 14c19.8622 14.0444 19.8499 14.1501 19.7383 14.2145l10.8798 19.3291l10.6321 19.329zm10.145 7.82737l10.145 7.82737c9.76265 8.04816 9.53398 8.44408 9.53398 8.88556v19.1146c9.53398 19.5561 9.76254 19.952 10.145 20.1728c10.336 20.2831 10.5458 20.3384 10.756 20.3384c10.9661 20.3384 11.1759 20.2831 11.367 20.1728l11.342 20.1295l11.367 20.1728l20.2256 15.0583l20.2006 15.015l20.2256 15.0583c20.6079 14.8376 20.8366 14.4416 20.8366 14.0001c20.8366 13.5586 20.6078 13.1626 20.2255 12.9418l20.2005 12.9851l20.2255 12.9418l11.3669 7.82732c10.9845 7.60658 10.5273 7.60664 10.145 7.82737z"
            fill="#5700ff"
            stroke="#5700ff"
            stroke-width="0.1"
          />
          <Path
            d="m13.9999 3.31523c8.10828 3.31523 3.31523 8.10834 3.31523 13.9999c3.31523 19.8915 8.10834 24.6846 13.9999 24.6846c19.8915 24.6846 24.6847 19.8916 24.6847 13.9999c24.6847 8.10828 19.8916 3.31523 13.9999 3.31523zm13.9999 23.7104c8.64564 23.7104 4.28952 19.3543 4.28952 14c4.28952 8.64564 8.64564 4.28958 13.9999 4.28958c19.3542 4.28958 23.7103 8.64564 23.7103 14c23.7103 19.3543 19.3543 23.7104 13.9999 23.7104z"
            fill="#5700ff"
            stroke="#5700ff"
            stroke-width="0.1"
          />
          <Path
            d="m23.9348 4.06517c21.2812 1.41149 17.7528 -0.05 13.9999 -0.05c10.247 -0.05 6.71874 1.41149 4.06517 4.06517c1.41149 6.71874 -0.05 10.2472 -0.05 13.9999c-0.05 17.7527 1.41149 21.2813 4.06517 23.9348c6.71874 26.5885 10.2472 28.05 13.9999 28.05c17.7527 28.05 21.2812 26.5885 23.9348 23.9348c26.5885 21.2813 28.05 17.7528 28.05 13.9999c28.05 10.2471 26.5885 6.71874 23.9348 4.06517zm23.2459 23.2459c20.7762 25.7157 17.4928 27.0757 13.9999 27.0757c10.5072 27.0757 7.22373 25.7156 4.75401 23.2459c2.2843 20.7763 0.924289 17.4928 0.924289 13.9999c0.924289 10.5071 2.28435 7.22378 4.75412 4.75407c7.22389 2.28435 10.5072 0.924289 13.9999 0.924289c17.4927 0.924289 20.7762 2.28429 23.2459 4.75401c25.7156 7.22373 27.0757 10.5072 27.0757 13.9999c27.0757 17.4926 25.7156 20.7762 23.2459 23.2459z"
            fill="#5700ff"
            stroke="#5700ff"
            stroke-width="0.1"
          />
        </G>
        <Defs>
          <ClipPath id="clip0_168_1081">
            <Rect width="28" height="28" fill="white" />
          </ClipPath>
        </Defs>
      </Svg>
    );
  } else if (props.iconName == "support") {
    return (
      <Svg width={width} height={height} viewBox="0 0 32 32" fill="none">
        <Path
          d="M30.6414 16.7207H30.5638C30.2934 15.5082 29.3359 14.5519 28.1218 14.2819V12.6583C28.1218 5.925 22.6365 0.447021 15.8942 0.447021C9.15192 0.447021 3.66665 5.925 3.66665 12.6583V14.2819C2.45248 14.5519 1.49488 15.5082 1.22458 16.7207H1.14704C0.760486 16.7207 0.447144 17.0337 0.447144 17.4197C0.447144 17.8057 0.760486 18.1187 1.14704 18.1187H1.22458C1.50188 19.3625 2.50238 20.3368 3.76114 20.5771C4.05222 21.8106 5.16281 22.7318 6.48554 22.7318C8.02922 22.7318 9.28511 21.4776 9.28511 19.936V14.9034C9.28511 13.3618 8.02922 12.1077 6.48554 12.1077C5.96874 12.1077 5.48448 12.2488 5.06854 12.4937C5.15707 6.60683 9.97885 1.84495 15.8942 1.84495C21.8058 1.84495 26.6253 6.60082 26.7197 12.4825C26.3081 12.2446 25.831 12.1077 25.3222 12.1077C23.7785 12.1077 22.5226 13.3618 22.5226 14.9034V19.936C22.5226 21.4776 23.7785 22.7318 25.3222 22.7318C26.6462 22.7318 27.7577 21.8088 28.0474 20.5735C28.4834 20.4874 28.8878 20.3132 29.2416 20.0702V23.1573C29.2416 24.4703 28.6023 25.7176 27.4415 26.6691C26.2405 27.6536 24.6428 28.1958 22.9425 28.1958H18.3997C18.254 27.1021 17.7527 26.4484 17.0191 26.4484H14.3945C13.0438 26.4484 11.9449 27.5458 11.9449 28.8948C11.9449 30.2437 13.0438 31.3411 14.3945 31.3411H17.0191C17.7528 31.3411 18.2541 30.6875 18.3997 29.5937H22.9425C27.1877 29.5937 30.6414 26.7063 30.6414 23.1573V18.1187C31.0279 18.1187 31.3413 17.8057 31.3413 17.4197C31.3413 17.0337 31.0279 16.7207 30.6414 16.7207ZM5.08575 14.9034C5.08575 14.1327 5.7137 13.5056 6.48554 13.5056C7.25738 13.5056 7.88533 14.1327 7.88533 14.9034V19.936C7.88533 20.7068 7.25738 21.3339 6.48554 21.3339C5.7137 21.3339 5.08575 20.7068 5.08575 19.936C5.08575 19.55 4.77241 19.237 4.38586 19.237C4.38257 19.237 4.37942 19.2374 4.3762 19.2375C4.37291 19.2375 4.36976 19.237 4.36654 19.237C3.36318 19.237 2.54682 18.4218 2.54682 17.4197C2.54682 16.6578 3.01883 16.0044 3.68597 15.7348V17.5518C3.68597 17.9378 3.99931 18.2508 4.38586 18.2508C4.77241 18.2508 5.08575 17.9378 5.08575 17.5518V14.9034ZM16.8697 29.9432H14.3945C13.8156 29.9432 13.3446 29.4729 13.3446 28.8948C13.3446 28.3167 13.8156 27.8463 14.3945 27.8463H16.8697C16.9431 27.9975 17.0439 28.3545 17.0439 28.8948C17.0439 29.435 16.9431 29.792 16.8697 29.9432ZM27.4219 19.237C27.0353 19.237 26.722 19.55 26.722 19.936C26.722 20.7068 26.094 21.3339 25.3222 21.3339C24.5503 21.3339 23.9224 20.7068 23.9224 19.936V14.9034C23.9224 14.1327 24.5503 13.5056 25.3222 13.5056C26.094 13.5056 26.722 14.1327 26.722 14.9034V17.5518C26.722 17.9378 27.0353 18.2508 27.4219 18.2508C27.8084 18.2508 28.1218 17.9378 28.1218 17.5518V15.7424C28.7787 16.0168 29.2416 16.6652 29.2416 17.4197C29.2416 18.4218 28.4252 19.237 27.4219 19.237Z"
          fill={color}
        />
      </Svg>
    );
  } else {
    return;
  }
}
